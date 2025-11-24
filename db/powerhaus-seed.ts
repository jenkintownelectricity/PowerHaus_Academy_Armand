import { db } from './index';
import {
  users,
  programs,
  classes,
  materials,
  pillarProgress,
  userBadges,
  mediaSubmissions,
  discountCodes,
  platformBranding,
  enrollments,
  payments,
  discussions,
  discussionReplies,
  blogPosts,
} from './schema';

async function seedPowerHausAcademy() {
  console.log('🏋️ Seeding PowerHaus Academy database...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(pillarProgress);
    await db.delete(userBadges);
    await db.delete(mediaSubmissions);
    await db.delete(discountCodes);
    await db.delete(platformBranding);
    await db.delete(enrollments);
    await db.delete(payments);
    await db.delete(discussionReplies);
    await db.delete(discussions);
    await db.delete(blogPosts);
    await db.delete(programs);
    await db.delete(classes);
    await db.delete(materials);
    await db.delete(users);

    // ==============================
    // USERS
    // ==============================
    console.log('Creating users...');
    const [admin, coach1, coach2, user1, user2, user3, user4] = await db.insert(users).values([
      {
        email: 'admin@powerhaus.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'PowerHaus',
        role: 'admin',
        bio: 'PowerHaus Academy Administrator',
        pointsEarned: 0,
      },
      {
        email: 'coach@powerhaus.com',
        password: 'coach123',
        firstName: 'Marcus',
        lastName: 'Steel',
        role: 'coach',
        bio: 'Strength & Conditioning Coach | 15+ years experience',
        pointsEarned: 0,
      },
      {
        email: 'coach2@powerhaus.com',
        password: 'coach123',
        firstName: 'Sarah',
        lastName: 'Wellness',
        role: 'coach',
        bio: 'Nutrition & Mindset Specialist',
        pointsEarned: 0,
      },
      {
        email: 'user@powerhaus.com',
        password: 'user123',
        firstName: 'John',
        lastName: 'Athlete',
        role: 'user',
        bio: 'On a journey to transform my power 💪',
        pointsEarned: 1250,
      },
      {
        email: 'user2@powerhaus.com',
        password: 'user123',
        firstName: 'Emily',
        lastName: 'Warrior',
        role: 'user',
        bio: 'Fitness enthusiast | Marathon runner',
        pointsEarned: 850,
      },
      {
        email: 'user3@powerhaus.com',
        password: 'user123',
        firstName: 'Mike',
        lastName: 'Strongman',
        role: 'user',
        bio: 'Powerlifting competitor | Chasing PRs',
        pointsEarned: 2100,
      },
      {
        email: 'user4@powerhaus.com',
        password: 'user123',
        firstName: 'Lisa',
        lastName: 'Zen',
        role: 'user',
        bio: 'Yoga instructor exploring strength training',
        pointsEarned: 620,
      },
    ]).returning();

    console.log(`✅ Created ${7} users`);

    // ==============================
    // PROGRAMS (6 Pillars)
    // ==============================
    console.log('Creating programs...');
    const [program1, program2, program3, program4] = await db.insert(programs).values([
      {
        title: 'The Foundation Program',
        description: 'Master all 6 pillars with our comprehensive 12-week program designed for beginners to intermediate athletes.',
        duration: 12,
        difficulty: 'intermediate',
        price: 29900, // $299
        pillarsIncluded: ['strength', 'conditioning', 'mobility', 'nutrition', 'mindset', 'recovery'],
        isActive: true,
      },
      {
        title: 'Elite Strength Builder',
        description: 'Advanced 8-week program focused on building raw strength and power through progressive overload.',
        duration: 8,
        difficulty: 'advanced',
        price: 19900, // $199
        pillarsIncluded: ['strength', 'recovery'],
        isActive: true,
      },
      {
        title: 'Athlete Conditioning Protocol',
        description: '6-week high-intensity conditioning program to enhance endurance and cardiovascular performance.',
        duration: 6,
        difficulty: 'intermediate',
        price: 14900, // $149
        pillarsIncluded: ['conditioning', 'recovery'],
        isActive: true,
      },
      {
        title: 'Free Mobility Fundamentals',
        description: 'Free 4-week introduction to mobility training and flexibility work. Perfect for beginners!',
        duration: 4,
        difficulty: 'beginner',
        price: 0, // Free
        pillarsIncluded: ['mobility'],
        isActive: true,
      },
    ]).returning();

    console.log(`✅ Created ${4} programs`);

    // ==============================
    // CLASSES
    // ==============================
    console.log('Creating classes...');
    await db.insert(classes).values([
      {
        title: 'Strength Training Fundamentals',
        description: 'Learn proper form and technique for compound lifts including squat, deadlift, and bench press.',
        type: 'group',
        coachId: coach1.id,
        capacity: 20,
        enrolled: 12,
        scheduleDate: new Date('2025-12-01'),
        scheduleTime: '18:00',
        duration: 90,
        price: 4900,
        isLive: false,
        videoUrl: 'https://example.com/videos/strength-fundamentals.mp4',
        difficulty: 'beginner',
        targetedPillars: ['strength'],
      },
      {
        title: 'HIIT Conditioning Bootcamp',
        description: 'High-intensity interval training to boost your cardiovascular fitness and burn fat.',
        type: 'group',
        coachId: coach1.id,
        capacity: 15,
        enrolled: 15,
        scheduleDate: new Date('2025-12-02'),
        scheduleTime: '06:00',
        duration: 60,
        price: 3900,
        isLive: false,
        videoUrl: 'https://example.com/videos/hiit-bootcamp.mp4',
        difficulty: 'intermediate',
        targetedPillars: ['conditioning'],
      },
      {
        title: 'Yoga for Athletes',
        description: 'Improve flexibility, balance, and recovery with yoga tailored for strength athletes.',
        type: 'online',
        coachId: coach2.id,
        capacity: 30,
        enrolled: 18,
        scheduleDate: new Date('2025-12-03'),
        scheduleTime: '19:00',
        duration: 75,
        price: 2900,
        isLive: true,
        videoUrl: 'https://example.com/videos/yoga-athletes.mp4',
        difficulty: 'beginner',
        targetedPillars: ['mobility', 'recovery'],
      },
      {
        title: 'Nutrition Essentials Workshop',
        description: 'Learn how to fuel your body for optimal performance with our comprehensive nutrition guide.',
        type: 'workshop',
        coachId: coach2.id,
        capacity: 50,
        enrolled: 32,
        scheduleDate: new Date('2025-12-05'),
        scheduleTime: '10:00',
        duration: 120,
        price: 5900,
        isLive: false,
        videoUrl: 'https://example.com/videos/nutrition-workshop.mp4',
        difficulty: 'beginner',
        targetedPillars: ['nutrition'],
      },
      {
        title: 'Mindset Mastery Seminar',
        description: 'Develop mental toughness and focus to achieve your fitness goals.',
        type: 'online',
        coachId: coach2.id,
        capacity: 100,
        enrolled: 45,
        scheduleDate: new Date('2025-12-06'),
        scheduleTime: '20:00',
        duration: 90,
        price: 4900,
        isLive: true,
        videoUrl: 'https://example.com/videos/mindset-mastery.mp4',
        difficulty: 'beginner',
        targetedPillars: ['mindset'],
      },
      {
        title: 'Advanced Powerlifting Techniques',
        description: 'Take your lifts to the next level with advanced training methods and periodization.',
        type: 'personal',
        coachId: coach1.id,
        capacity: 5,
        enrolled: 3,
        scheduleDate: new Date('2025-12-08'),
        scheduleTime: '17:00',
        duration: 60,
        price: 12900,
        isLive: false,
        difficulty: 'advanced',
        targetedPillars: ['strength'],
      },
    ]);

    console.log(`✅ Created 6 classes`);

    // ==============================
    // MATERIALS (Videos)
    // ==============================
    console.log('Creating video materials...');
    await db.insert(materials).values([
      {
        title: 'Squat Form Guide',
        description: 'Complete guide to proper squat technique and common mistakes to avoid.',
        category: 'video',
        tags: ['strength', 'technique', 'squats'],
        fileType: 'video',
        filePath: '/videos/squat-form.mp4',
        fileSize: 52428800, // 50MB
        uploadedById: coach1.id,
      },
      {
        title: 'Deadlift Progression',
        description: 'Progress from beginner to advanced deadlifts safely and effectively.',
        category: 'video',
        tags: ['strength', 'deadlift', 'progression'],
        fileType: 'video',
        filePath: '/videos/deadlift-progression.mp4',
        fileSize: 67108864, // 64MB
        uploadedById: coach1.id,
      },
      {
        title: '30-Minute Full Body Workout',
        description: 'Efficient full-body workout you can do anywhere with minimal equipment.',
        category: 'workout_plan',
        tags: ['conditioning', 'full-body', 'home-workout'],
        fileType: 'video',
        filePath: '/videos/30min-fullbody.mp4',
        fileSize: 45678900,
        uploadedById: coach1.id,
      },
      {
        title: 'Meal Prep Sunday Guide',
        description: 'Step-by-step guide to meal prepping for the entire week.',
        category: 'nutrition_guide',
        tags: ['nutrition', 'meal-prep', 'cooking'],
        fileType: 'video',
        filePath: '/videos/meal-prep.mp4',
        fileSize: 38765432,
        uploadedById: coach2.id,
      },
      {
        title: 'Mobility Flow Routine',
        description: '15-minute daily mobility routine to improve flexibility and reduce injury risk.',
        category: 'workout_plan',
        tags: ['mobility', 'flexibility', 'warmup'],
        fileType: 'video',
        filePath: '/videos/mobility-flow.mp4',
        fileSize: 28901234,
        uploadedById: coach2.id,
      },
      {
        title: 'Breathing Techniques for Performance',
        description: 'Learn breathing methods to enhance performance and reduce stress.',
        category: 'educational',
        tags: ['mindset', 'breathing', 'recovery'],
        fileType: 'video',
        filePath: '/videos/breathing-techniques.mp4',
        fileSize: 21098765,
        uploadedById: coach2.id,
      },
    ]);

    console.log(`✅ Created 6 video materials`);

    // ==============================
    // PILLAR PROGRESS
    // ==============================
    console.log('Creating pillar progress for users...');
    await db.insert(pillarProgress).values([
      // User 1 progress (John)
      { userId: user1.id, pillar: 'strength', level: 3, xp: 450, completedMilestones: 7, totalMilestones: 10 },
      { userId: user1.id, pillar: 'conditioning', level: 2, xp: 280, completedMilestones: 5, totalMilestones: 10 },
      { userId: user1.id, pillar: 'mobility', level: 1, xp: 120, completedMilestones: 3, totalMilestones: 10 },
      { userId: user1.id, pillar: 'nutrition', level: 2, xp: 310, completedMilestones: 6, totalMilestones: 10 },
      { userId: user1.id, pillar: 'mindset', level: 1, xp: 90, completedMilestones: 2, totalMilestones: 10 },
      { userId: user1.id, pillar: 'recovery', level: 2, xp: 200, completedMilestones: 4, totalMilestones: 10 },

      // User 2 progress (Emily)
      { userId: user2.id, pillar: 'strength', level: 2, xp: 230, completedMilestones: 4, totalMilestones: 10 },
      { userId: user2.id, pillar: 'conditioning', level: 4, xp: 620, completedMilestones: 9, totalMilestones: 10 },
      { userId: user2.id, pillar: 'mobility', level: 3, xp: 380, completedMilestones: 7, totalMilestones: 10 },
      { userId: user2.id, pillar: 'nutrition', level: 3, xp: 410, completedMilestones: 8, totalMilestones: 10 },
      { userId: user2.id, pillar: 'mindset', level: 2, xp: 250, completedMilestones: 5, totalMilestones: 10 },
      { userId: user2.id, pillar: 'recovery', level: 3, xp: 340, completedMilestones: 6, totalMilestones: 10 },

      // User 3 progress (Mike - high strength)
      { userId: user3.id, pillar: 'strength', level: 5, xp: 890, completedMilestones: 10, totalMilestones: 10 },
      { userId: user3.id, pillar: 'conditioning', level: 2, xp: 190, completedMilestones: 3, totalMilestones: 10 },
      { userId: user3.id, pillar: 'mobility', level: 1, xp: 80, completedMilestones: 2, totalMilestones: 10 },
      { userId: user3.id, pillar: 'nutrition', level: 4, xp: 720, completedMilestones: 9, totalMilestones: 10 },
      { userId: user3.id, pillar: 'mindset', level: 3, xp: 430, completedMilestones: 7, totalMilestones: 10 },
      { userId: user3.id, pillar: 'recovery', level: 2, xp: 180, completedMilestones: 4, totalMilestones: 10 },
    ]);

    console.log(`✅ Created pillar progress entries`);

    // ==============================
    // USER BADGES
    // ==============================
    console.log('Creating badges...');
    await db.insert(userBadges).values([
      // User 1 badges
      {
        userId: user1.id,
        badgeName: 'First Steps',
        badgeDescription: 'Complete your first workout',
        badgeIcon: '🎯',
        tier: 'bronze',
        pillar: 'strength',
      },
      {
        userId: user1.id,
        badgeName: '7-Day Streak',
        badgeDescription: 'Train for 7 consecutive days',
        badgeIcon: '🔥',
        tier: 'silver',
      },
      {
        userId: user1.id,
        badgeName: 'Nutrition Novice',
        badgeDescription: 'Complete nutrition fundamentals course',
        badgeIcon: '🍎',
        tier: 'bronze',
        pillar: 'nutrition',
      },

      // User 2 badges
      {
        userId: user2.id,
        badgeName: 'Cardio King',
        badgeDescription: 'Complete 50 conditioning workouts',
        badgeIcon: '⚡',
        tier: 'gold',
        pillar: 'conditioning',
      },
      {
        userId: user2.id,
        badgeName: 'Mobility Master',
        badgeDescription: 'Achieve full splits and advanced flexibility',
        badgeIcon: '🤸',
        tier: 'platinum',
        pillar: 'mobility',
      },

      // User 3 badges
      {
        userId: user3.id,
        badgeName: 'Strength Titan',
        badgeDescription: 'Squat 2x bodyweight, deadlift 2.5x bodyweight',
        badgeIcon: '💪',
        tier: 'diamond',
        pillar: 'strength',
      },
      {
        userId: user3.id,
        badgeName: '30-Day Streak',
        badgeDescription: 'Train for 30 consecutive days',
        badgeIcon: '🔥',
        tier: 'gold',
      },
      {
        userId: user3.id,
        badgeName: 'Nutrition Expert',
        badgeDescription: 'Master macro tracking and meal planning',
        badgeIcon: '🥗',
        tier: 'platinum',
        pillar: 'nutrition',
      },
    ]);

    console.log(`✅ Created ${8} badges`);

    // ==============================
    // MEDIA SUBMISSIONS
    // ==============================
    console.log('Creating media submissions...');
    await db.insert(mediaSubmissions).values([
      // Pending submissions
      {
        userId: user1.id,
        submissionType: 'video',
        fileUrl: '/uploads/user-videos/squat-form-check.mp4',
        title: 'Squat Form Check - 315lbs',
        description: 'Working set of 5 reps at 315lbs. Please review my depth and bar path.',
        pillar: 'strength',
        isApproved: false,
        isPublic: false,
      },
      {
        userId: user2.id,
        submissionType: 'photo',
        fileUrl: '/uploads/user-photos/meal-prep.jpg',
        title: 'Weekly Meal Prep',
        description: 'This week\'s meal prep: chicken, rice, and veggies for 5 days!',
        pillar: 'nutrition',
        isApproved: false,
        isPublic: false,
      },
      {
        userId: user3.id,
        submissionType: 'photo',
        fileUrl: '/uploads/user-photos/pr-deadlift.jpg',
        title: 'New PR: 600lb Deadlift!',
        description: 'Finally hit my goal of a 600lb deadlift! 3 years in the making.',
        pillar: 'strength',
        isApproved: true,
        isPublic: true,
        viewCount: 234,
        likeCount: 67,
      },
      {
        userId: user2.id,
        submissionType: 'video',
        fileUrl: '/uploads/user-videos/marathon-finish.mp4',
        title: 'First Marathon Finish',
        description: 'Completed my first marathon in 3:45! PowerHaus training got me here.',
        pillar: 'conditioning',
        isApproved: true,
        isPublic: true,
        viewCount: 156,
        likeCount: 42,
      },
    ]);

    console.log(`✅ Created media submissions`);

    // ==============================
    // DISCOUNT CODES
    // ==============================
    console.log('Creating discount codes...');
    await db.insert(discountCodes).values([
      {
        code: 'POWERHAUS50',
        description: '50% off your first program',
        discountType: 'percentage',
        discountValue: 50,
        maxUses: 100,
        usesCount: 23,
        validFrom: new Date('2025-11-01'),
        validUntil: new Date('2025-12-31'),
        applicableTo: ['all'],
        isActive: true,
      },
      {
        code: 'BLACKFRIDAY',
        description: 'Black Friday - 75% off all programs',
        discountType: 'percentage',
        discountValue: 75,
        maxUses: 500,
        usesCount: 187,
        validFrom: new Date('2025-11-25'),
        validUntil: new Date('2025-11-30'),
        applicableTo: ['all'],
        isActive: true,
      },
      {
        code: 'FREEMOBILITY',
        description: 'Free access to mobility fundamentals',
        discountType: 'percentage',
        discountValue: 100,
        usesCount: 456,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        applicableTo: [program4.id.toString()],
        isActive: true,
      },
      {
        code: 'VIP100',
        description: '$100 off elite strength builder',
        discountType: 'fixed',
        discountValue: 10000, // $100 in cents
        maxUses: 20,
        usesCount: 8,
        validFrom: new Date('2025-11-01'),
        validUntil: new Date('2025-12-31'),
        applicableTo: [program2.id.toString()],
        isActive: true,
      },
      {
        code: 'EXPIRED2024',
        description: 'Expired test code',
        discountType: 'percentage',
        discountValue: 30,
        maxUses: 50,
        usesCount: 50,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        applicableTo: ['all'],
        isActive: false,
      },
    ]);

    console.log(`✅ Created ${5} discount codes`);

    // ==============================
    // PLATFORM BRANDING
    // ==============================
    console.log('Creating platform branding...');
    await db.insert(platformBranding).values([
      {
        logoUrl: '/branding/powerhaus-logo.png',
        faviconUrl: '/branding/favicon.ico',
        primaryColor: '#B266FF',
        secondaryColor: '#00FFA3',
        companyName: 'PowerHaus Academy',
        tagline: 'Transform Your Power',
      },
    ]);

    console.log(`✅ Created platform branding`);

    // ==============================
    // COMMUNITY DISCUSSIONS
    // ==============================
    console.log('Creating community discussions...');
    const [discussion1, discussion2, discussion3] = await db.insert(discussions).values([
      {
        title: 'Best pre-workout meal for early morning training?',
        content: 'I train at 5 AM and struggle with what to eat beforehand. Any suggestions?',
        category: 'nutrition',
        tags: ['nutrition', 'meal-timing', 'pre-workout'],
        authorId: user1.id,
        hasHelpfulAnswer: true,
      },
      {
        title: 'Form check: Low bar vs high bar squat',
        content: 'What are the pros and cons of each? Which do you prefer and why?',
        category: 'training',
        tags: ['squat', 'technique', 'strength'],
        authorId: user3.id,
        hasHelpfulAnswer: false,
      },
      {
        title: 'Staying motivated during plateaus',
        content: 'My lifts have been stuck for 3 weeks. How do you guys stay motivated?',
        category: 'mindset',
        tags: ['motivation', 'plateau', 'mindset'],
        authorId: user2.id,
        hasHelpfulAnswer: true,
      },
    ]).returning();

    // Add discussion replies
    await db.insert(discussionReplies).values([
      {
        discussionId: discussion1.id,
        content: 'I usually have a banana and a scoop of protein 30 mins before. Works great!',
        authorId: user2.id,
        isHelpful: false,
      },
      {
        discussionId: discussion1.id,
        content: 'Oatmeal with peanut butter is my go-to. Gives sustained energy without feeling too full.',
        authorId: user3.id,
        isHelpful: true,
      },
      {
        discussionId: discussion3.id,
        content: 'Deload for a week, focus on technique, then come back stronger. Plateaus are normal!',
        authorId: coach1.id,
        isHelpful: true,
      },
    ]);

    console.log(`✅ Created community discussions and replies`);

    // ==============================
    // BLOG POSTS
    // ==============================
    console.log('Creating blog posts...');
    await db.insert(blogPosts).values([
      {
        title: '10 Tips for Building Sustainable Strength',
        content: `Building strength isn't just about lifting heavy—it's about consistency, recovery, and smart programming.\n\nHere are 10 tips that have helped thousands of athletes:\n\n1. Progressive Overload: Gradually increase weight, reps, or volume\n2. Prioritize compound movements: Squat, deadlift, bench, overhead press\n3. Focus on form: Quality over quantity always\n4. Sleep 7-9 hours: Recovery happens during sleep\n5. Eat in a slight surplus: You can't build muscle in a deficit\n6. Track your workouts: What gets measured gets managed\n7. Deload every 4-6 weeks: Prevent burnout and injury\n8. Stay consistent: Show up even when motivation is low\n9. Work on mobility: Prevent injuries and improve range of motion\n10. Be patient: Strength takes years, not months\n\nRemember: The journey is just as important as the destination!`,
        category: 'fitness_tips',
        authorId: coach1.id,
        isApproved: true,
        publishedAt: new Date('2025-11-20'),
      },
      {
        title: 'Why Mobility Work is Non-Negotiable',
        content: `Many athletes skip mobility work, thinking it's only for yoga practitioners. Wrong!\n\nMobility is crucial for:\n- Injury prevention\n- Better movement patterns\n- Increased strength potential\n- Faster recovery\n\nSpend 15 minutes daily on mobility, and watch your performance soar.`,
        category: 'wellness',
        authorId: coach2.id,
        isApproved: true,
        publishedAt: new Date('2025-11-22'),
      },
      {
        title: 'My Transformation: From Couch to Competition',
        content: `A year ago, I couldn't squat the bar. Today, I competed in my first powerlifting meet.\n\nThe PowerHaus 6 Pillars approach transformed not just my body, but my entire life. Here's my story...`,
        category: 'success_stories',
        authorId: user3.id,
        isApproved: true,
        extraCreditAwarded: 100,
        publishedAt: new Date('2025-11-23'),
      },
    ]);

    console.log(`✅ Created blog posts`);

    console.log('\n🎉 PowerHaus Academy database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('  - 7 users (1 admin, 2 coaches, 4 users)');
    console.log('  - 4 programs');
    console.log('  - 6 classes');
    console.log('  - 6 video materials');
    console.log('  - 18 pillar progress entries');
    console.log('  - 8 badges');
    console.log('  - 4 media submissions');
    console.log('  - 5 discount codes');
    console.log('  - 1 platform branding');
    console.log('  - 3 community discussions');
    console.log('  - 3 blog posts');
    console.log('\n📝 Test Accounts:');
    console.log('  Admin: admin@powerhaus.com / admin123');
    console.log('  Coach: coach@powerhaus.com / coach123');
    console.log('  User: user@powerhaus.com / user123');
    console.log('\n🚀 Ready to transform some power!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedPowerHausAcademy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
