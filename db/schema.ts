import { pgTable, serial, text, timestamp, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// PowerHaus Academy Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'coach', 'admin']);
export const classTypeEnum = pgEnum('class_type', ['group', 'personal', 'online', 'workshop']);
export const materialCategoryEnum = pgEnum('material_category', ['video', 'workout_plan', 'nutrition_guide', 'educational']);
export const discussionCategoryEnum = pgEnum('discussion_category', ['general', 'nutrition', 'training', 'mindset', 'community']);
export const blogCategoryEnum = pgEnum('blog_category', ['fitness_tips', 'nutrition', 'success_stories', 'wellness', 'mindset']);
export const pillarEnum = pgEnum('pillar', ['strength', 'conditioning', 'mobility', 'nutrition', 'mindset', 'recovery']);
export const submissionTypeEnum = pgEnum('submission_type', ['photo', 'video', 'measurement']);
export const badgeTierEnum = pgEnum('badge_tier', ['bronze', 'silver', 'gold', 'platinum', 'diamond']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  profilePicture: text('profile_picture'), // Profile picture URL
  bio: text('bio'),
  role: userRoleEnum('role').notNull().default('user'),
  stripeCustomerId: text('stripe_customer_id'),
  pointsEarned: integer('points_earned').notNull().default(0),
  currentProgram: integer('current_program'), // References programs table
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Classes Table (Fitness Sessions)
export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: classTypeEnum('type').notNull(),
  coachId: integer('coach_id').references(() => users.id),
  capacity: integer('capacity').notNull(),
  enrolled: integer('enrolled').notNull().default(0),
  scheduleDate: timestamp('schedule_date').notNull(),
  scheduleTime: text('schedule_time').notNull(),
  duration: integer('duration').notNull(), // in minutes
  price: integer('price').notNull().default(0), // in cents
  isLive: boolean('is_live').notNull().default(false),
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  difficulty: text('difficulty').notNull().default('intermediate'), // beginner, intermediate, advanced
  targetedPillars: pillarEnum('targeted_pillars').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Materials Table
export const materials = pgTable('materials', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: materialCategoryEnum('category').notNull(),
  tags: text('tags').array().notNull().default([]),
  fileType: text('file_type').notNull(), // pdf, excel, image, video
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(), // in bytes
  uploadedById: integer('uploaded_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enrollments Table
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  status: text('status').notNull().default('active'), // active, completed, dropped
});

// Payments Table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  classId: integer('class_id').references(() => classes.id),
  amount: integer('amount').notNull(), // in cents
  stripePaymentIntentId: text('stripe_payment_intent_id').notNull(),
  status: text('status').notNull(), // pending, completed, failed, refunded
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Hands-On Stations Table
export const handsOnStations = pgTable('hands_on_stations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: jsonb('instructions').notNull(), // Array of step-by-step instructions
  questions: jsonb('questions').notNull(), // Array of test questions with answers
  targetTime: integer('target_time').notNull().default(15), // in minutes
  passingScore: integer('passing_score').notNull().default(80), // percentage
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student Progress Table
export const studentProgress = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  stationId: integer('station_id').references(() => handsOnStations.id).notNull(),
  score: integer('score').notNull(),
  timeSpent: integer('time_spent').notNull(), // in seconds
  passed: boolean('passed').notNull(),
  answers: jsonb('answers').notNull(), // Student's answers
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

// Discussions Table
export const discussions = pgTable('discussions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: discussionCategoryEnum('category').notNull(),
  tags: text('tags').array().notNull().default([]),
  authorId: integer('author_id').references(() => users.id).notNull(),
  hasHelpfulAnswer: boolean('has_helpful_answer').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Discussion Replies Table
export const discussionReplies = pgTable('discussion_replies', {
  id: serial('id').primaryKey(),
  discussionId: integer('discussion_id').references(() => discussions.id).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  isHelpful: boolean('is_helpful').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: blogCategoryEnum('category').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  isApproved: boolean('is_approved').notNull().default(false),
  extraCreditAwarded: integer('extra_credit_awarded').notNull().default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog Comments Table
export const blogComments = pgTable('blog_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => blogPosts.id).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Feature Toggles Table
export const featureToggles = pgTable('feature_toggles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  enabled: boolean('enabled').notNull().default(false),
  description: text('description'),
  category: text('category').notNull(), // learning, immersive, enterprise, core
  tier: text('tier').notNull(), // free, pro, enterprise
  impact: text('impact'), // e.g., "70% better retention"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Platform Settings Table
export const platformSettings = pgTable('platform_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subscription Tiers Table
export const subscriptionTiers = pgTable('subscription_tiers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // free, pro, enterprise
  displayName: text('display_name').notNull(),
  price: integer('price').notNull().default(0), // in cents per month
  features: text('features').array().notNull().default([]),
  maxUsers: integer('max_users').notNull().default(10),
  maxClasses: integer('max_classes').notNull().default(5),
  supportLevel: text('support_level').notNull().default('community'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =====================================================
// SPEEDGRADER TABLES (Phase 2)
// =====================================================

// Assignments Table
export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  classId: integer('class_id').references(() => classes.id, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').references(() => users.id, { onDelete: 'cascade' }),
  dueDate: timestamp('due_date').notNull(),
  totalPoints: integer('total_points').notNull().default(100),
  rubricId: integer('rubric_id'),
  allowLateSubmission: boolean('allow_late_submission').notNull().default(true),
  latePenaltyPercent: integer('late_penalty_percent').notNull().default(10),
  submissionType: text('submission_type').notNull().default('file'),
  instructions: text('instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Submissions Table
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').notNull().references(() => assignments.id, { onDelete: 'cascade' }),
  studentId: integer('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  submissionType: text('submission_type').notNull().default('file'),
  content: text('content'),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  fileSize: integer('file_size'),
  fileType: text('file_type'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  isLate: boolean('is_late').notNull().default(false),
  status: text('status').notNull().default('submitted'),
  attemptNumber: integer('attempt_number').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Rubrics Table
export const rubrics = pgTable('rubrics', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  teacherId: integer('teacher_id').references(() => users.id, { onDelete: 'cascade' }),
  totalPoints: integer('total_points').notNull().default(100),
  isTemplate: boolean('is_template').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Rubric Criteria Table
export const rubricCriteria = pgTable('rubric_criteria', {
  id: serial('id').primaryKey(),
  rubricId: integer('rubric_id').notNull().references(() => rubrics.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  maxPoints: integer('max_points').notNull().default(10),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Grades Table
export const grades = pgTable('grades', {
  id: serial('id').primaryKey(),
  submissionId: integer('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalScore: text('total_score').notNull(), // Using text for DECIMAL storage
  totalPoints: integer('total_points').notNull(),
  percentage: text('percentage').notNull(), // Using text for DECIMAL storage
  letterGrade: text('letter_grade'),
  rubricScores: jsonb('rubric_scores'),
  feedbackText: text('feedback_text'),
  feedbackAudioUrl: text('feedback_audio_url'),
  feedbackVideoUrl: text('feedback_video_url'),
  gradedAt: timestamp('graded_at').defaultNow().notNull(),
  returnedToStudent: boolean('returned_to_student').notNull().default(false),
  returnedAt: timestamp('returned_at'),
  timeSpentGrading: integer('time_spent_grading'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// PDF Annotations Table
export const pdfAnnotations = pgTable('pdf_annotations', {
  id: serial('id').primaryKey(),
  submissionId: integer('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  pageNumber: integer('page_number').notNull(),
  annotationType: text('annotation_type').notNull(),
  annotationData: jsonb('annotation_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Grading Comments Table
export const gradingComments = pgTable('grading_comments', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  commentText: text('comment_text').notNull(),
  category: text('category').notNull().default('general'),
  isPositive: boolean('is_positive').notNull().default(true),
  useCount: integer('use_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =====================================================
// POWERHAUS ACADEMY SPECIFIC TABLES
// =====================================================

// Programs Table (6 Pillars Programs)
export const programs = pgTable('programs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  duration: integer('duration').notNull(), // in weeks
  difficulty: text('difficulty').notNull().default('intermediate'),
  price: integer('price').notNull().default(0), // in cents
  thumbnailUrl: text('thumbnail_url'),
  pillarsIncluded: pillarEnum('pillars_included').array().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Pillar Progress Table (Track user progress in 6 Pillars)
export const pillarProgress = pgTable('pillar_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  pillar: pillarEnum('pillar').notNull(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  completedMilestones: integer('completed_milestones').notNull().default(0),
  totalMilestones: integer('total_milestones').notNull().default(10),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Badges Table
export const userBadges = pgTable('user_badges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeName: text('badge_name').notNull(),
  badgeDescription: text('badge_description').notNull(),
  badgeIcon: text('badge_icon').notNull(),
  tier: badgeTierEnum('tier').notNull().default('bronze'),
  pillar: pillarEnum('pillar'),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
});

// Media Submissions Table (Photo/Video uploads)
export const mediaSubmissions = pgTable('media_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  submissionType: submissionTypeEnum('submission_type').notNull(),
  fileUrl: text('file_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  title: text('title').notNull(),
  description: text('description'),
  pillar: pillarEnum('pillar'),
  classId: integer('class_id').references(() => classes.id),
  isApproved: boolean('is_approved').notNull().default(false),
  isPublic: boolean('is_public').notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Discount Codes Table
export const discountCodes = pgTable('discount_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  discountType: text('discount_type').notNull(), // percentage, fixed
  discountValue: integer('discount_value').notNull(), // percentage or cents
  maxUses: integer('max_uses'),
  usesCount: integer('uses_count').notNull().default(0),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  applicableTo: text('applicable_to').array(), // class IDs, program IDs, or 'all'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Platform Logo/Branding Table
export const platformBranding = pgTable('platform_branding', {
  id: serial('id').primaryKey(),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  primaryColor: text('primary_color').notNull().default('#B266FF'),
  secondaryColor: text('secondary_color').notNull().default('#00FFA3'),
  companyName: text('company_name').notNull().default('PowerHaus Academy'),
  tagline: text('tagline').notNull().default('Transform Your Power'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Material = typeof materials.$inferSelect;
export type NewMaterial = typeof materials.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type HandsOnStation = typeof handsOnStations.$inferSelect;
export type NewHandsOnStation = typeof handsOnStations.$inferInsert;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type NewStudentProgress = typeof studentProgress.$inferInsert;
export type Discussion = typeof discussions.$inferSelect;
export type NewDiscussion = typeof discussions.$inferInsert;
export type DiscussionReply = typeof discussionReplies.$inferSelect;
export type NewDiscussionReply = typeof discussionReplies.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogComment = typeof blogComments.$inferSelect;
export type NewBlogComment = typeof blogComments.$inferInsert;
export type FeatureToggle = typeof featureToggles.$inferSelect;
export type NewFeatureToggle = typeof featureToggles.$inferInsert;
export type PlatformSetting = typeof platformSettings.$inferSelect;
export type NewPlatformSetting = typeof platformSettings.$inferInsert;
export type SubscriptionTier = typeof subscriptionTiers.$inferSelect;
export type NewSubscriptionTier = typeof subscriptionTiers.$inferInsert;

// SpeedGrader types
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Rubric = typeof rubrics.$inferSelect;
export type NewRubric = typeof rubrics.$inferInsert;
export type RubricCriteria = typeof rubricCriteria.$inferSelect;
export type NewRubricCriteria = typeof rubricCriteria.$inferInsert;
export type Grade = typeof grades.$inferSelect;
export type NewGrade = typeof grades.$inferInsert;
export type PdfAnnotation = typeof pdfAnnotations.$inferSelect;
export type NewPdfAnnotation = typeof pdfAnnotations.$inferInsert;
export type GradingComment = typeof gradingComments.$inferSelect;
export type NewGradingComment = typeof gradingComments.$inferInsert;

// PowerHaus Academy types
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type PillarProgress = typeof pillarProgress.$inferSelect;
export type NewPillarProgress = typeof pillarProgress.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type MediaSubmission = typeof mediaSubmissions.$inferSelect;
export type NewMediaSubmission = typeof mediaSubmissions.$inferInsert;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type NewDiscountCode = typeof discountCodes.$inferInsert;
export type PlatformBranding = typeof platformBranding.$inferSelect;
export type NewPlatformBranding = typeof platformBranding.$inferInsert;
