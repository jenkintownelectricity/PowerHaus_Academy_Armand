# Button-to-Data Mapping: Complete Testing Guide

**Purpose**: This document maps every button, link, and interaction to the database data it requires for testing.

---

## 📊 Dashboard Page (`/`)

### API Endpoints Called
- `GET /api/stats` → Returns dashboard statistics
- `GET /api/student-progress/current/me` → Returns student's test attempts

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Practice Stations** | Navigate to `/stations` | None (navigation only) | N/A |
| **Study Materials** | Navigate to `/materials` | None (navigation only) | N/A |
| **Ask Community** | Navigate to `/community` | None (navigation only) | N/A |
| **Tab: Overview** | Show weekly activity chart | `student_progress` entries | Lines 6-9 in seed_data.sql |
| **Tab: Achievements** | Display earned/locked achievements | `student_progress` entries | Lines 6-9 (calculates from progress) |
| **Tab: Certifications** | Show certification cards | Mock data (hardcoded) | None (future: certifications table) |
| **Tab: Analytics** | Performance trends & AI insights | `student_progress` entries | Lines 6-9 |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Success Rate % | Calculated from `student_progress` | At least 1 test attempt |
| Average Score % | Calculated from `student_progress` | At least 1 test attempt |
| Tests Completed | Count of `student_progress` | Any number of attempts |
| Time Invested | Sum of `time_spent` in `student_progress` | At least 1 test attempt |
| Achievement Badges | Calculated from progress data | Varies by achievement |
| Recent Achievements | Last 3 earned achievements | At least 1 passed test |
| Weekly Activity Chart | Last 7 test attempts | Ideally 7+ test attempts |

---

## 🧪 Hands-On Stations Page (`/stations`)

### API Endpoints Called
- `GET /api/stations` → Returns all hands-on stations
- `GET /api/student-progress/current/me` → Returns student's test attempts

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Start Station** (×5) | Navigate to `/stations/:id` | `hands_on_stations` entry | Lines 1-5 in seed_data.sql |
| **Continue Practice** | Navigate to `/stations/:id` | Station + existing progress | Lines 1-5 + progress data |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Station Name | `hands_on_stations.name` | 5 stations created |
| Station Description | `hands_on_stations.description` | 5 stations created |
| Target Time | `hands_on_stations.target_time` | 5 stations created |
| Passing Score | `hands_on_stations.passing_score` | 5 stations created |
| Active Badge | `hands_on_stations.is_active` | Station with `is_active = true` |
| Best Score | Max score from `student_progress` for station | At least 1 attempt for that station |
| Attempt Count | Count of progress entries | At least 1 attempt for that station |
| Passed Badge | Any progress entry with `passed = true` | At least 1 passed attempt |

---

## 📝 Station Test Page (`/stations/:id`)

### API Endpoints Called
- `GET /api/stations/:id` → Returns single station details
- `POST /api/student-progress` → Submits test answers

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Back to Stations** | Navigate to `/stations` | None | N/A |
| **Start Test** | Begin timer and show questions | `hands_on_stations.questions` (JSONB) | Lines 1-5 (questions field) |
| **Answer Option** (×20+) | Select answer for question | Questions with 4+ options each | Lines 1-5 (questions.options) |
| **Submit Test** | Calculate score and save progress | All questions answered | Creates `student_progress` entry |
| **Try Again** | Reset test state | Station data | Lines 1-5 |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Instructions List | `hands_on_stations.instructions` (JSONB array) | Station with instructions |
| Question Text | `questions[i].question` | Station with questions |
| Answer Options | `questions[i].options` array | Station with options |
| Timer Display | Client-side counter | None (local state) |
| Score Percentage | Calculated on submit | Correct answers in JSONB |
| Time Taken | Client-side elapsed seconds | None (local state) |
| Pass/Fail Status | Compare score to `passing_score` | Station + calculated score |

---

## 📚 Materials Page (`/materials`)

### API Endpoints Called
- `GET /api/materials` → Returns all learning materials

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Tab: Book Materials** | Filter materials by category | `materials` with `category='book_materials'` | Lines 1-4 in materials section |
| **Tab: Hands-On Station Guides** | Filter by category | `materials` with `category='hands_on_station'` | Lines 5-8 in materials section |
| **Download** (per material) | Download file | `materials.file_path` | Each material entry |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Material Title | `materials.title` | At least 1 material |
| Material Description | `materials.description` | At least 1 material |
| File Type Icon | `materials.file_type` | Materials with various types |
| File Size | `materials.file_size` | All materials |
| Tags | `materials.tags` (array) | Materials with tags |

---

## 📅 Classes Page (`/classes`)

### API Endpoints Called
- `GET /api/classes` → Returns all scheduled classes

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Enroll Now** (per class) | Enroll in class (future: POST enrollment) | Class data | Lines 1-7 in classes section |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Class Title | `classes.title` | At least 1 class |
| Class Description | `classes.description` | At least 1 class |
| Type Badge | `classes.type` (hybrid/online/hands_on) | Classes of different types |
| Schedule Date | `classes.schedule_date` | All classes |
| Schedule Time | `classes.schedule_time` | All classes |
| Enrollment Count | `classes.enrolled / classes.capacity` | All classes |
| Price | `classes.price` | All classes |

---

## 💻 Online Classes Page (`/online-classes`)

### API Endpoints Called
- `GET /api/online-classes` → Returns classes where `type='online'`

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Join Live Class** | Open Zoom URL | Class with `is_live=true` and `video_url` | Line 4 in classes (LIVE exam prep) |
| **View Recording** | Open Zoom URL | Class with `is_live=false` and `video_url` | Lines 3,5 in classes |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Live Badge (animated) | `classes.is_live = true` | At least 1 live class |
| Student Count | `classes.student_count` | All online classes |
| Video URL | `classes.video_url` | Online classes with Zoom links |

---

## 💬 Community Page (`/community`)

### API Endpoints Called
- `GET /api/discussions` → Returns all discussion threads

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Discussion Card** (×6+) | Navigate to `/community/:id` | Discussion entry | Lines 1-6 in discussions |
| **Tab: All Discussions** | Show all | All discussions | Lines 1-6 |
| **Tab: Questions** | Filter by category | `discussions` where `category='questions'` | Lines 1-2 |
| **Tab: Tips & Tricks** | Filter by category | `discussions` where `category='tips'` | Line 3 |
| **Tab: Alumni Network** | Filter by category | `discussions` where `category='alumni'` | Line 5 |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Category Badge | `discussions.category` | Discussions in all 4 categories |
| Answered Badge | `discussions.has_helpful_answer = true` | At least 1 answered discussion |
| Discussion Title | `discussions.title` | All discussions |
| Content Preview | `discussions.content` (truncated) | All discussions |
| Created Date | `discussions.created_at` | All discussions |
| Tags | `discussions.tags` (array) | Discussions with tags |

---

## 📰 Blog Page (`/blog`)

### API Endpoints Called
- `GET /api/blog-posts` → Returns all blog posts

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Blog Post Card** (×6+) | Navigate to `/blog/:id` | Blog post entry | Lines 1-6 in blog_posts |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Category Badge | `blog_posts.category` | Posts in all 4 categories |
| Post Title | `blog_posts.title` | All posts |
| Content Preview | `blog_posts.content` (truncated) | All posts |
| Published Date | `blog_posts.published_at` or `created_at` | All posts |

---

## 🔧 Developer Dashboard (`/admin`, `/developer`)

### API Endpoints Called
- `GET /api/admin/features` → Returns all feature toggles
- `PATCH /api/admin/features/:id` → Updates feature enabled status
- `GET /api/admin/tiers` → Returns subscription tiers

### Buttons & Links

| Button/Link | Action | Data Required | SQL Reference |
|-------------|--------|---------------|---------------|
| **Toggle Switch** (×12) | Update feature enabled state | `feature_toggles` entry | Lines 1-12 in feature_toggles |
| **Tab: Features** | Show feature toggles grouped by category | All 12 features | Lines 1-12 |
| **Tab: Subscription Tiers** | Show pricing tiers | 3 subscription tiers | Lines 1-3 in tiers |
| **Tab: Analytics** | Show platform metrics | Platform data (future) | Not yet implemented |

### Data Display Elements

| Element | Data Source | Requires |
|---------|-------------|----------|
| Feature Name | `feature_toggles.name` | All features |
| Feature Description | `feature_toggles.description` | All features |
| Category Grouping | `feature_toggles.category` | Features in multiple categories |
| Tier Badge | `feature_toggles.tier` | Features in different tiers |
| Impact Text | `feature_toggles.impact` | All features |
| Enabled Toggle | `feature_toggles.enabled` | All features |
| Tier Name | `subscription_tiers.name` | 3 tiers |
| Tier Price | `subscription_tiers.price` | 3 tiers |
| Tier Features | `subscription_tiers.features` (JSONB array) | 3 tiers |

---

## 🗂️ Complete Data Requirements Summary

To test **ALL buttons** in the application, you need:

### ✅ Must Run These SQL Files in Order:

1. **`db/migrations/001_add_permission_system.sql`**
   - Creates: institutions, user_roles, permissions, institution_features, class_features, data_items
   - Adds: 20 default permissions, 1 default institution

2. **`db/migrations/002_create_all_tables.sql`**
   - Creates: classes, materials, enrollments, payments, hands_on_stations, student_progress
   - Creates: discussions, discussion_replies, blog_posts, blog_comments, platform_settings
   - Creates: All necessary indexes

3. **`db/seed_data.sql`** (THE BIG ONE - Run this to test everything!)
   - Inserts: 5 hands-on stations with questions
   - Inserts: 8 learning materials (4 books + 4 guides)
   - Inserts: 7 classes (2 hybrid + 3 online + 2 hands-on)
   - Inserts: 6 discussion threads across all categories
   - Inserts: 6 blog posts across all categories
   - Inserts: 9 student progress entries (test attempts)
   - Inserts: 6 class enrollments
   - Inserts: 5 discussion replies
   - Inserts: 4 blog comments
   - Inserts: 12 advanced feature toggles
   - Inserts: 3 subscription tiers (Free, Pro, Enterprise)
   - Inserts: 6 platform settings

---

## 🧪 Testing Checklist by Page

### Dashboard (/)
- [ ] All 4 KPI cards show correct data
- [ ] Overview tab shows weekly activity chart
- [ ] Achievements tab shows 6 achievements (some earned, some locked)
- [ ] Certifications tab shows 2 certification cards
- [ ] Analytics tab shows performance trend chart
- [ ] All 3 "Continue Learning" buttons navigate correctly

### Hands-On Stations (/stations)
- [ ] 5 station cards display
- [ ] Each shows target time and passing score
- [ ] Active badge shows on active stations
- [ ] Progress section shows for students with attempts
- [ ] "Start Station" / "Continue Practice" buttons work

### Station Test (/stations/:id)
- [ ] Instructions display (6 steps per station)
- [ ] Questions display (5 per station)
- [ ] Answer selection works (4 options per question)
- [ ] Timer counts up during test
- [ ] Submit button disabled until all answered
- [ ] Results page shows score, time, pass/fail
- [ ] "Try Again" resets the test

### Materials (/materials)
- [ ] Book Materials tab shows 4 items
- [ ] Hands-On Station Guides tab shows 4 items
- [ ] Each material shows file type icon
- [ ] Tags display correctly
- [ ] File size shows in MB
- [ ] Download buttons present

### Classes (/classes)
- [ ] 7 class cards display
- [ ] Type badges show different colors (hybrid, online, hands_on)
- [ ] Schedule date and time display
- [ ] Enrollment count shows (e.g., "22/30 enrolled")
- [ ] Price displays correctly
- [ ] "Enroll Now" buttons present

### Online Classes (/online-classes)
- [ ] Only 3 online classes show
- [ ] 1 shows "LIVE Now" animated badge
- [ ] Student count displays
- [ ] Video URL buttons work

### Community (/community)
- [ ] 6 discussion cards display
- [ ] All Discussions tab shows all 6
- [ ] Questions tab shows 2 items
- [ ] Tips tab shows 1 item
- [ ] Alumni tab shows 1 item
- [ ] "Answered" badge shows on appropriate discussions
- [ ] Tags display for each discussion

### Blog (/blog)
- [ ] 6 blog post cards display
- [ ] Category badges show (industry_news, tips, case_studies, student_work)
- [ ] Published dates display
- [ ] Content previews truncate correctly
- [ ] Cards link to individual post pages

### Developer Dashboard (/admin or /developer)
- [ ] Features tab shows 12 feature toggles
- [ ] Features grouped by category (learning, collaboration, immersive, enterprise)
- [ ] Each toggle switch works without jumping
- [ ] Tier badges display (free, pro, enterprise)
- [ ] Impact text shows
- [ ] Subscription Tiers tab shows 3 tiers
- [ ] Tier pricing displays correctly
- [ ] Feature lists in tiers show

---

## 🎯 Quick Test Data Verification

Run these queries in Neon to verify data loaded correctly:

```sql
-- Should return 5
SELECT COUNT(*) FROM hands_on_stations;

-- Should return 8
SELECT COUNT(*) FROM materials;

-- Should return 7
SELECT COUNT(*) FROM classes;

-- Should return 6
SELECT COUNT(*) FROM discussions;

-- Should return 6
SELECT COUNT(*) FROM blog_posts;

-- Should return 9
SELECT COUNT(*) FROM student_progress;

-- Should return 12
SELECT COUNT(*) FROM feature_toggles;

-- Should return 3
SELECT COUNT(*) FROM subscription_tiers;
```

---

## ✅ All Data Created!

You now have complete seed data to test **every single button, link, tab, and interaction** in the SPU LMS application across all 4 role dashboards!

**Next Steps:**
1. Run the 3 SQL files in your Neon database in order
2. Deploy the latest code to Vercel
3. Test systematically using this guide
4. Check off each item as you verify it works

**Every button now has data to display! 🎉**
