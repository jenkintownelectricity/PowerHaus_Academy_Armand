import express from 'express';
import session from 'express-session';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import Stripe from 'stripe';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema.js';

const app = express();

// Database connection with error handling
const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
}

let db;
let client;
try {
  client = postgres(connectionString, {
    max: 1, // Limit connections for serverless
    idle_timeout: 20,
    connect_timeout: 10,
  });
  db = drizzle(client, { schema });
} catch (error) {
  console.error('Database connection error:', error);
}

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'spu-lms-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// CORS for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

// Import all routes from main server
// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const { users } = schema;

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
    const { users } = schema;

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
    const { users } = schema;

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

// Admin endpoints - Feature Toggles
app.get('/api/admin/features', async (req, res) => {
  try {
    const { featureToggles } = schema;
    const features = await db.select().from(featureToggles).orderBy(
      asc(featureToggles.category),
      asc(featureToggles.id)
    );
    res.json(features);
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

app.patch('/api/admin/features/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;
    const { featureToggles } = schema;

    const [updated] = await db
      .update(featureToggles)
      .set({ enabled })
      .where(eq(featureToggles.id, parseInt(id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

// Admin endpoints - Subscription Tiers
app.get('/api/admin/tiers', async (req, res) => {
  try {
    const { subscriptionTiers } = schema;
    const tiers = await db.select().from(subscriptionTiers).orderBy(subscriptionTiers.price);
    res.json(tiers);
  } catch (error) {
    console.error('Get tiers error:', error);
    res.status(500).json({ error: 'Failed to fetch tiers' });
  }
});

// Student endpoints
app.get('/api/stats', async (req, res) => {
  try {
    // Return basic stats for dashboard
    res.json({
      totalClasses: 0,
      enrolledClasses: 0,
      completedTests: 0,
      totalStudents: 0,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/student-progress/current/me', async (req, res) => {
  try {
    // Return empty progress array for now
    res.json([]);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.get('/api/materials', async (req, res) => {
  try {
    const { materials } = schema;
    const allMaterials = await db.select().from(materials);
    res.json(allMaterials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

app.get('/api/stations', async (req, res) => {
  try {
    const { handsOnStations } = schema;
    const stations = await db.select().from(handsOnStations);
    res.json(stations);
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

app.get('/api/classes', async (req, res) => {
  try {
    const { classes } = schema;
    const allClasses = await db.select().from(classes);
    res.json(allClasses);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.get('/api/online-classes', async (req, res) => {
  try {
    const { classes } = schema;
    const onlineClasses = await db.select().from(classes).where(eq(classes.type, 'online'));
    res.json(onlineClasses);
  } catch (error) {
    console.error('Get online classes error:', error);
    res.status(500).json({ error: 'Failed to fetch online classes' });
  }
});

app.get('/api/discussions', async (req, res) => {
  try {
    const { discussions } = schema;
    const allDiscussions = await db.select().from(discussions).orderBy(desc(discussions.createdAt));
    res.json(allDiscussions);
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

app.get('/api/blog-posts', async (req, res) => {
  try {
    const { blogPosts } = schema;
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Health check with database connectivity
app.get('/api/health', async (req, res) => {
  try {
    // Check if database is connected
    if (!db) {
      return res.status(500).json({
        status: 'error',
        message: 'Database not initialized',
        database: 'disconnected',
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasSessionSecret: !!process.env.SESSION_SECRET,
        }
      });
    }

    // Try a simple query
    await db.select().from(schema.users).limit(1);

    res.json({
      status: 'ok',
      message: 'SPU LMS API is running',
      database: 'connected',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasSessionSecret: !!process.env.SESSION_SECRET,
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'error',
      error: error.message,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasSessionSecret: !!process.env.SESSION_SECRET,
      }
    });
  }
});

// Global error handler - ensures all errors return JSON
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Always return JSON for API routes
  if (req.path.startsWith('/api')) {
    return res.status(500).json({
      error: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  next(err);
});

export default app;
