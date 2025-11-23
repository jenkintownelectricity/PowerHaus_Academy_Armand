import express from 'express';
import session from 'express-session';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { eq, desc, and, sql } from 'drizzle-orm';
import Stripe from 'stripe';
import { db } from '../db/index.js';
import {
  users, classes, materials, handsOnStations, studentProgress,
  enrollments, payments, discussions, discussionReplies,
  blogPosts, blogComments, assignments, submissions, rubrics,
  rubricCriteria, grades, pdfAnnotations, gradingComments
} from '../db/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'spu-lms-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Serve static files
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// =====================================================
// AUTHENTICATION ENDPOINTS
// =====================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const [newUser] = await db
      .insert(users)
      .values({ email, password, firstName, lastName, role: role || 'student' })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    req.session.userId = newUser.id;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/auth/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, req.session.userId),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// =====================================================
// STATS ENDPOINT
// =====================================================

app.get('/api/stats', async (req, res) => {
  try {
    const [studentsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'student'));

    const [upcomingClassesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .where(sql`schedule_date >= NOW()`);

    const [materialsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(materials);

    res.json({
      activeStudents: Number(studentsCount.count),
      upcomingClasses: Number(upcomingClassesCount.count),
      materials: Number(materialsCount.count),
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// =====================================================
// MATERIALS ENDPOINTS
// =====================================================

app.get('/api/materials', async (req, res) => {
  try {
    const { category, tag } = req.query;
    let query = db.select().from(materials);

    // Note: Drizzle ORM filtering would be more complex here
    // For simplicity, we'll fetch all and filter in memory
    const allMaterials = await query;

    let filtered = allMaterials;
    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }
    if (tag) {
      filtered = filtered.filter(m => m.tags.includes(tag as string));
    }

    res.json(filtered);
  } catch (error) {
    console.error('Materials error:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

app.post('/api/materials', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, category, tags } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];

    const [material] = await db
      .insert(materials)
      .values({
        title,
        description,
        category,
        tags: parsedTags,
        fileType: req.file.mimetype,
        filePath: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        uploadedById: req.session.userId || 1,
      })
      .returning();

    res.json(material);
  } catch (error) {
    console.error('Material upload error:', error);
    res.status(500).json({ error: 'Failed to upload material' });
  }
});

// =====================================================
// CLASSES ENDPOINTS
// =====================================================

app.get('/api/classes', async (req, res) => {
  try {
    const allClasses = await db
      .select()
      .from(classes)
      .orderBy(desc(classes.scheduleDate));

    res.json(allClasses);
  } catch (error) {
    console.error('Classes error:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const [newClass] = await db
      .insert(classes)
      .values(req.body)
      .returning();

    res.json(newClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

app.patch('/api/classes/:id', async (req, res) => {
  try {
    const [updated] = await db
      .update(classes)
      .set(req.body)
      .where(eq(classes.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    await db
      .delete(classes)
      .where(eq(classes.id, parseInt(req.params.id)));

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

// =====================================================
// ONLINE CLASSES ENDPOINTS
// =====================================================

app.get('/api/online-classes', async (req, res) => {
  try {
    const onlineClasses = await db
      .select()
      .from(classes)
      .where(
        sql`type IN ('online', 'hybrid')`
      )
      .orderBy(desc(classes.scheduleDate));

    res.json(onlineClasses);
  } catch (error) {
    console.error('Online classes error:', error);
    res.status(500).json({ error: 'Failed to fetch online classes' });
  }
});

// =====================================================
// HANDS-ON STATIONS ENDPOINTS
// =====================================================

app.get('/api/stations', async (req, res) => {
  try {
    const allStations = await db.select().from(handsOnStations);
    res.json(allStations);
  } catch (error) {
    console.error('Stations error:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

app.get('/api/stations/:id', async (req, res) => {
  try {
    const station = await db.query.handsOnStations.findFirst({
      where: eq(handsOnStations.id, parseInt(req.params.id)),
    });

    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json(station);
  } catch (error) {
    console.error('Station error:', error);
    res.status(500).json({ error: 'Failed to fetch station' });
  }
});

app.get('/api/stations/active/current', async (req, res) => {
  try {
    const activeStation = await db.query.handsOnStations.findFirst({
      where: eq(handsOnStations.isActive, true),
    });

    res.json(activeStation || null);
  } catch (error) {
    console.error('Active station error:', error);
    res.status(500).json({ error: 'Failed to fetch active station' });
  }
});

app.patch('/api/stations/:id', async (req, res) => {
  try {
    const { isActive } = req.body;

    if (isActive) {
      // Deactivate all other stations first
      await db
        .update(handsOnStations)
        .set({ isActive: false });
    }

    const [updated] = await db
      .update(handsOnStations)
      .set({ isActive })
      .where(eq(handsOnStations.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Update station error:', error);
    res.status(500).json({ error: 'Failed to update station' });
  }
});

// =====================================================
// STUDENT PROGRESS ENDPOINTS
// =====================================================

app.get('/api/student-progress/:studentId', async (req, res) => {
  try {
    const progress = await db
      .select()
      .from(studentProgress)
      .where(eq(studentProgress.studentId, parseInt(req.params.studentId)))
      .orderBy(desc(studentProgress.completedAt));

    res.json(progress);
  } catch (error) {
    console.error('Student progress error:', error);
    res.status(500).json({ error: 'Failed to fetch student progress' });
  }
});

app.get('/api/student-progress/current/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const progress = await db
      .select()
      .from(studentProgress)
      .where(eq(studentProgress.studentId, req.session.userId))
      .orderBy(desc(studentProgress.completedAt));

    res.json(progress);
  } catch (error) {
    console.error('Current student progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/student-progress', async (req, res) => {
  try {
    const { stationId, score, timeSpent, passed, answers } = req.body;

    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [progress] = await db
      .insert(studentProgress)
      .values({
        studentId: req.session.userId,
        stationId,
        score,
        timeSpent,
        passed,
        answers,
      })
      .returning();

    res.json(progress);
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// =====================================================
// PAYMENTS ENDPOINTS
// =====================================================

app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, classId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId, classId, amount } = req.body;

    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [payment] = await db
      .insert(payments)
      .values({
        studentId: req.session.userId,
        classId,
        amount,
        stripePaymentIntentId: paymentIntentId,
        status: 'completed',
      })
      .returning();

    // Create enrollment
    await db.insert(enrollments).values({
      studentId: req.session.userId,
      classId,
    });

    // Update class enrolled count
    await db
      .update(classes)
      .set({ enrolled: sql`enrolled + 1` })
      .where(eq(classes.id, classId));

    res.json(payment);
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, req.session.userId))
      .orderBy(desc(payments.createdAt));

    res.json(userPayments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// =====================================================
// DISCUSSIONS ENDPOINTS
// =====================================================

app.get('/api/discussions', async (req, res) => {
  try {
    const { category } = req.query;
    let allDiscussions;

    if (category) {
      allDiscussions = await db
        .select()
        .from(discussions)
        .where(eq(discussions.category, category as any))
        .orderBy(desc(discussions.createdAt));
    } else {
      allDiscussions = await db
        .select()
        .from(discussions)
        .orderBy(desc(discussions.createdAt));
    }

    res.json(allDiscussions);
  } catch (error) {
    console.error('Discussions error:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

app.post('/api/discussions', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [discussion] = await db
      .insert(discussions)
      .values({
        ...req.body,
        authorId: req.session.userId,
      })
      .returning();

    res.json(discussion);
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
});

app.get('/api/discussions/:id', async (req, res) => {
  try {
    const discussion = await db.query.discussions.findFirst({
      where: eq(discussions.id, parseInt(req.params.id)),
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const replies = await db
      .select()
      .from(discussionReplies)
      .where(eq(discussionReplies.discussionId, parseInt(req.params.id)))
      .orderBy(discussionReplies.createdAt);

    res.json({ ...discussion, replies });
  } catch (error) {
    console.error('Discussion error:', error);
    res.status(500).json({ error: 'Failed to fetch discussion' });
  }
});

app.post('/api/discussions/:id/replies', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [reply] = await db
      .insert(discussionReplies)
      .values({
        discussionId: parseInt(req.params.id),
        content: req.body.content,
        authorId: req.session.userId,
      })
      .returning();

    res.json(reply);
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

app.patch('/api/discussions/:discussionId/replies/:replyId/helpful', async (req, res) => {
  try {
    const [updated] = await db
      .update(discussionReplies)
      .set({ isHelpful: true })
      .where(eq(discussionReplies.id, parseInt(req.params.replyId)))
      .returning();

    // Update discussion to mark it has helpful answer
    await db
      .update(discussions)
      .set({ hasHelpfulAnswer: true })
      .where(eq(discussions.id, parseInt(req.params.discussionId)));

    res.json(updated);
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ error: 'Failed to mark as helpful' });
  }
});

// =====================================================
// BLOG ENDPOINTS
// =====================================================

app.get('/api/blog-posts', async (req, res) => {
  try {
    const { category } = req.query;
    let posts;

    if (category) {
      posts = await db
        .select()
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.category, category as any),
            eq(blogPosts.isApproved, true)
          )
        )
        .orderBy(desc(blogPosts.publishedAt));
    } else {
      posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.isApproved, true))
        .orderBy(desc(blogPosts.publishedAt));
    }

    res.json(posts);
  } catch (error) {
    console.error('Blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.post('/api/blog-posts', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [post] = await db
      .insert(blogPosts)
      .values({
        ...req.body,
        authorId: req.session.userId,
        isApproved: false, // Requires approval
      })
      .returning();

    res.json(post);
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, parseInt(req.params.id)),
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = await db
      .select()
      .from(blogComments)
      .where(
        and(
          eq(blogComments.postId, parseInt(req.params.id)),
          eq(blogComments.isApproved, true)
        )
      )
      .orderBy(blogComments.createdAt);

    res.json({ ...post, comments });
  } catch (error) {
    console.error('Blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

app.post('/api/blog-posts/:id/comments', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [comment] = await db
      .insert(blogComments)
      .values({
        postId: parseInt(req.params.id),
        content: req.body.content,
        authorId: req.session.userId,
        isApproved: false,
      })
      .returning();

    res.json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// =====================================================
// AI ASSISTANT (JEWELEE) ENDPOINTS
// =====================================================

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get Anthropic API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Build conversation history
    const messages = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }
    messages.push({
      role: 'user',
      content: message
    });

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are JewelEE (pronounced "Jewel-EE"), a certified medical professional and expert AI assistant specializing in sterile processing education. You have extensive knowledge in:

- Decontamination procedures and protocols
- Sterilization methods (steam, ETO, hydrogen peroxide, etc.)
- Instrument identification, handling, and care
- Quality control and quality assurance
- Infection prevention and control
- Medical device reprocessing
- Healthcare regulations (HIPAA, OSHA, FDA guidelines)
- Anatomy and physiology relevant to sterile processing
- Surgical instrument sets and tray assembly
- Packaging and wrapping techniques
- Biological, chemical, and physical indicators
- Documentation and record keeping

Your communication style:
- Professional yet approachable and encouraging
- Clear, concise explanations suitable for students
- Use medical terminology but explain it when needed
- Provide step-by-step guidance for procedures
- Reference industry standards and best practices
- Encourage critical thinking and safety-first mindset
- Supportive and patient with learners

When answering questions:
1. Prioritize patient safety and infection control
2. Reference CDC, WHO, AAMI, and other authoritative sources when relevant
3. Explain the "why" behind procedures, not just the "how"
4. Provide practical tips from your medical expertise
5. Encourage students to verify with their instructors and facility protocols
6. Use examples to illustrate concepts when helpful

Remember: You're a mentor helping students master sterile processing. Be thorough, accurate, and supportive.`,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    res.json({ response: assistantMessage });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: 'Failed to process your request',
      response: "I apologize, but I'm having trouble processing your request right now. Please try again or contact your instructor for assistance."
    });
  }
});

// =====================================================
// GLOBAL SEARCH ENDPOINT
// =====================================================

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.json({
        materials: [],
        classes: [],
        discussions: [],
        blogPosts: [],
        stations: [],
      });
    }

    const searchTerm = q.trim();
    const tsQuery = searchTerm.split(' ').join(' & ');

    // Search materials
    const materialsResults = await db.execute(sql`
      SELECT id, title, description, category, tags, file_type, created_at,
             ts_rank(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || array_to_string(tags, ' ')),
                     to_tsquery('english', ${tsQuery})) as rank
      FROM materials
      WHERE to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || array_to_string(tags, ' '))
            @@ to_tsquery('english', ${tsQuery})
      ORDER BY rank DESC
      LIMIT 5
    `);

    // Search classes
    const classesResults = await db.execute(sql`
      SELECT id, title, description, type, schedule_date, schedule_time, price, enrolled, capacity,
             ts_rank(to_tsvector('english', title || ' ' || description),
                     to_tsquery('english', ${tsQuery})) as rank
      FROM classes
      WHERE to_tsvector('english', title || ' ' || description)
            @@ to_tsquery('english', ${tsQuery})
      ORDER BY rank DESC
      LIMIT 5
    `);

    // Search discussions
    const discussionsResults = await db.execute(sql`
      SELECT id, title, content, category, tags, author_id, has_helpful_answer, created_at,
             ts_rank(to_tsvector('english', title || ' ' || content || ' ' || array_to_string(tags, ' ')),
                     to_tsquery('english', ${tsQuery})) as rank
      FROM discussions
      WHERE to_tsvector('english', title || ' ' || content || ' ' || array_to_string(tags, ' '))
            @@ to_tsquery('english', ${tsQuery})
      ORDER BY rank DESC
      LIMIT 5
    `);

    // Search blog posts (only approved)
    const blogPostsResults = await db.execute(sql`
      SELECT id, title, content, category, author_id, published_at, created_at,
             ts_rank(to_tsvector('english', title || ' ' || content),
                     to_tsquery('english', ${tsQuery})) as rank
      FROM blog_posts
      WHERE is_approved = true
        AND to_tsvector('english', title || ' ' || content)
            @@ to_tsquery('english', ${tsQuery})
      ORDER BY rank DESC
      LIMIT 5
    `);

    // Search hands-on stations
    const stationsResults = await db.execute(sql`
      SELECT id, name, description, target_time, passing_score, is_active, created_at,
             ts_rank(to_tsvector('english', name || ' ' || description),
                     to_tsquery('english', ${tsQuery})) as rank
      FROM hands_on_stations
      WHERE to_tsvector('english', name || ' ' || description)
            @@ to_tsquery('english', ${tsQuery})
      ORDER BY rank DESC
      LIMIT 5
    `);

    res.json({
      materials: materialsResults.rows,
      classes: classesResults.rows,
      discussions: discussionsResults.rows,
      blogPosts: blogPostsResults.rows,
      stations: stationsResults.rows,
      totalResults:
        materialsResults.rows.length +
        classesResults.rows.length +
        discussionsResults.rows.length +
        blogPostsResults.rows.length +
        stationsResults.rows.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// =====================================================
// SPEEDGRADER: ASSIGNMENTS ENDPOINTS
// =====================================================

// Get all assignments for a class
app.get('/api/classes/:classId/assignments', async (req, res) => {
  try {
    const classAssignments = await db
      .select()
      .from(assignments)
      .where(eq(assignments.classId, parseInt(req.params.classId)))
      .orderBy(desc(assignments.dueDate));

    res.json(classAssignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get single assignment with details
app.get('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await db.query.assignments.findFirst({
      where: eq(assignments.id, parseInt(req.params.id)),
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Get rubric if attached
    let rubric = null;
    if (assignment.rubricId) {
      rubric = await db.query.rubrics.findFirst({
        where: eq(rubrics.id, assignment.rubricId),
      });

      if (rubric) {
        const criteria = await db
          .select()
          .from(rubricCriteria)
          .where(eq(rubricCriteria.rubricId, rubric.id))
          .orderBy(rubricCriteria.orderIndex);
        rubric.criteria = criteria;
      }
    }

    res.json({ ...assignment, rubric });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Create assignment
app.post('/api/assignments', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [assignment] = await db
      .insert(assignments)
      .values({
        ...req.body,
        teacherId: req.session.userId,
      })
      .returning();

    res.json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment
app.patch('/api/assignments/:id', async (req, res) => {
  try {
    const [updated] = await db
      .update(assignments)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(assignments.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete assignment
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    await db
      .delete(assignments)
      .where(eq(assignments.id, parseInt(req.params.id)));

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// =====================================================
// SPEEDGRADER: SUBMISSIONS ENDPOINTS
// =====================================================

// Get all submissions for an assignment
app.get('/api/assignments/:assignmentId/submissions', async (req, res) => {
  try {
    const assignmentSubmissions = await db
      .select()
      .from(submissions)
      .where(eq(submissions.assignmentId, parseInt(req.params.assignmentId)))
      .orderBy(submissions.submittedAt);

    // Get student info for each submission
    const submissionsWithStudents = await Promise.all(
      assignmentSubmissions.map(async (submission) => {
        const student = await db.query.users.findFirst({
          where: eq(users.id, submission.studentId),
        });

        const grade = await db.query.grades.findFirst({
          where: eq(grades.submissionId, submission.id),
        });

        return {
          ...submission,
          student: student ? {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
          } : null,
          grade,
        };
      })
    );

    res.json(submissionsWithStudents);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get single submission with grade and annotations
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const submission = await db.query.submissions.findFirst({
      where: eq(submissions.id, parseInt(req.params.id)),
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Get student info
    const student = await db.query.users.findFirst({
      where: eq(users.id, submission.studentId),
    });

    // Get grade
    const grade = await db.query.grades.findFirst({
      where: eq(grades.submissionId, submission.id),
    });

    // Get annotations
    const annotations = await db
      .select()
      .from(pdfAnnotations)
      .where(eq(pdfAnnotations.submissionId, submission.id))
      .orderBy(pdfAnnotations.pageNumber);

    res.json({
      ...submission,
      student: student ? {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      } : null,
      grade,
      annotations,
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Submit assignment (student)
app.post('/api/submissions', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { assignmentId, content } = req.body;

    // Check due date
    const assignment = await db.query.assignments.findFirst({
      where: eq(assignments.id, parseInt(assignmentId)),
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);

    if (isLate && !assignment.allowLateSubmission) {
      return res.status(400).json({ error: 'Late submissions not allowed' });
    }

    // Get attempt number
    const previousSubmissions = await db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.assignmentId, parseInt(assignmentId)),
          eq(submissions.studentId, req.session.userId)
        )
      );

    const attemptNumber = previousSubmissions.length + 1;

    // Create submission
    const submissionData: any = {
      assignmentId: parseInt(assignmentId),
      studentId: req.session.userId,
      isLate,
      attemptNumber,
      status: 'submitted',
    };

    if (req.file) {
      submissionData.submissionType = 'file';
      submissionData.fileUrl = `/uploads/${req.file.filename}`;
      submissionData.fileName = req.file.originalname;
      submissionData.fileSize = req.file.size;
      submissionData.fileType = req.file.mimetype;
    } else if (content) {
      submissionData.submissionType = 'text';
      submissionData.content = content;
    }

    const [submission] = await db
      .insert(submissions)
      .values(submissionData)
      .returning();

    res.json(submission);
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// =====================================================
// SPEEDGRADER: GRADING ENDPOINTS
// =====================================================

// Submit grade for submission
app.post('/api/grades', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      submissionId,
      totalScore,
      totalPoints,
      rubricScores,
      feedbackText,
      returnToStudent,
      timeSpentGrading,
    } = req.body;

    // Calculate percentage and letter grade
    const percentage = (parseFloat(totalScore) / totalPoints) * 100;
    const letterGrade = calculateLetterGrade(percentage);

    const gradeData: any = {
      submissionId: parseInt(submissionId),
      teacherId: req.session.userId,
      totalScore: totalScore.toString(),
      totalPoints,
      percentage: percentage.toFixed(2),
      letterGrade,
      rubricScores,
      feedbackText,
      returnedToStudent: returnToStudent || false,
      returnedAt: returnToStudent ? new Date() : null,
      timeSpentGrading,
    };

    // Check if grade exists
    const existingGrade = await db.query.grades.findFirst({
      where: eq(grades.submissionId, parseInt(submissionId)),
    });

    let grade;
    if (existingGrade) {
      // Update existing grade
      [grade] = await db
        .update(grades)
        .set({ ...gradeData, updatedAt: new Date() })
        .where(eq(grades.id, existingGrade.id))
        .returning();
    } else {
      // Create new grade
      [grade] = await db
        .insert(grades)
        .values(gradeData)
        .returning();
    }

    // Update submission status
    await db
      .update(submissions)
      .set({ status: returnToStudent ? 'returned' : 'graded' })
      .where(eq(submissions.id, parseInt(submissionId)));

    res.json(grade);
  } catch (error) {
    console.error('Submit grade error:', error);
    res.status(500).json({ error: 'Failed to submit grade' });
  }
});

// Helper function for letter grade calculation
function calculateLetterGrade(percentage: number): string {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

// Return grade to student
app.patch('/api/grades/:id/return', async (req, res) => {
  try {
    const [updated] = await db
      .update(grades)
      .set({
        returnedToStudent: true,
        returnedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(grades.id, parseInt(req.params.id)))
      .returning();

    // Update submission status
    await db
      .update(submissions)
      .set({ status: 'returned' })
      .where(eq(submissions.id, updated.submissionId));

    res.json(updated);
  } catch (error) {
    console.error('Return grade error:', error);
    res.status(500).json({ error: 'Failed to return grade' });
  }
});

// =====================================================
// SPEEDGRADER: PDF ANNOTATIONS ENDPOINTS
// =====================================================

// Save PDF annotation
app.post('/api/annotations', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [annotation] = await db
      .insert(pdfAnnotations)
      .values({
        ...req.body,
        teacherId: req.session.userId,
      })
      .returning();

    res.json(annotation);
  } catch (error) {
    console.error('Save annotation error:', error);
    res.status(500).json({ error: 'Failed to save annotation' });
  }
});

// Delete annotation
app.delete('/api/annotations/:id', async (req, res) => {
  try {
    await db
      .delete(pdfAnnotations)
      .where(eq(pdfAnnotations.id, parseInt(req.params.id)));

    res.json({ message: 'Annotation deleted successfully' });
  } catch (error) {
    console.error('Delete annotation error:', error);
    res.status(500).json({ error: 'Failed to delete annotation' });
  }
});

// =====================================================
// SPEEDGRADER: RUBRICS ENDPOINTS
// =====================================================

// Get all rubrics for teacher
app.get('/api/rubrics', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const teacherRubrics = await db
      .select()
      .from(rubrics)
      .where(eq(rubrics.teacherId, req.session.userId))
      .orderBy(desc(rubrics.createdAt));

    // Get criteria for each rubric
    const rubricsWithCriteria = await Promise.all(
      teacherRubrics.map(async (rubric) => {
        const criteria = await db
          .select()
          .from(rubricCriteria)
          .where(eq(rubricCriteria.rubricId, rubric.id))
          .orderBy(rubricCriteria.orderIndex);

        return { ...rubric, criteria };
      })
    );

    res.json(rubricsWithCriteria);
  } catch (error) {
    console.error('Get rubrics error:', error);
    res.status(500).json({ error: 'Failed to fetch rubrics' });
  }
});

// Create rubric
app.post('/api/rubrics', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { title, description, totalPoints, isTemplate, criteria } = req.body;

    // Create rubric
    const [rubric] = await db
      .insert(rubrics)
      .values({
        title,
        description,
        totalPoints,
        isTemplate,
        teacherId: req.session.userId,
      })
      .returning();

    // Create criteria
    if (criteria && criteria.length > 0) {
      const criteriaData = criteria.map((c: any, index: number) => ({
        rubricId: rubric.id,
        title: c.title,
        description: c.description,
        maxPoints: c.maxPoints,
        orderIndex: index,
      }));

      const insertedCriteria = await db
        .insert(rubricCriteria)
        .values(criteriaData)
        .returning();

      rubric.criteria = insertedCriteria;
    }

    res.json(rubric);
  } catch (error) {
    console.error('Create rubric error:', error);
    res.status(500).json({ error: 'Failed to create rubric' });
  }
});

// =====================================================
// SPEEDGRADER: GRADING COMMENTS (Quick Feedback)
// =====================================================

// Get teacher's saved comments
app.get('/api/grading-comments', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const comments = await db
      .select()
      .from(gradingComments)
      .where(eq(gradingComments.teacherId, req.session.userId))
      .orderBy(desc(gradingComments.useCount));

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Save quick comment
app.post('/api/grading-comments', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [comment] = await db
      .insert(gradingComments)
      .values({
        ...req.body,
        teacherId: req.session.userId,
      })
      .returning();

    res.json(comment);
  } catch (error) {
    console.error('Save comment error:', error);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Increment comment use count
app.patch('/api/grading-comments/:id/use', async (req, res) => {
  try {
    await db
      .update(gradingComments)
      .set({ useCount: sql`use_count + 1` })
      .where(eq(gradingComments.id, parseInt(req.params.id)));

    res.json({ message: 'Use count updated' });
  } catch (error) {
    console.error('Update use count error:', error);
    res.status(500).json({ error: 'Failed to update use count' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💎 JewelEE AI Assistant: ${process.env.ANTHROPIC_API_KEY ? 'Enabled' : 'Disabled (add ANTHROPIC_API_KEY)'}`);
});
