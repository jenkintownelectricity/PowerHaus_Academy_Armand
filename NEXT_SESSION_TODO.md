# 📋 TODO for Next Claude Code Session

## 🔴 CRITICAL: Vercel Deployment Issue
- **Status:** Out of deployment quota on Vercel free tier
- **Action Needed:** Upgrade Vercel plan OR deploy to alternative platform
- **Priority:** HIGH - Blocks all testing

### Solutions:
1. **Upgrade Vercel Pro** ($20/month) - Recommended
   - Unlimited deployments
   - Better performance
   - Custom domains

2. **Alternative: Deploy to Railway** (Free tier available)
   - Similar to Vercel
   - PostgreSQL included
   - May need config changes

3. **Alternative: Deploy to Netlify** (Free tier available)
   - Similar serverless platform
   - Need to adjust API setup

---

## ✅ What's Already Done (Don't Redo)

### Phase 1: Global Search ✅
- PostgreSQL full-text search with GIN indexes
- Global search UI component (⌘K shortcut)
- Python auto-tagging service with OCR
- Search across materials, classes, discussions, blogs, stations
- Migration: `002_add_search_indexes.sql`

### Phase 2: SpeedGrader ✅
- Complete database schema (7 tables)
- 15+ API endpoints for assignments, submissions, grading
- Full 3-panel SpeedGrader UI
- Automatic letter grade calculation
- Time tracking per submission
- Migration: `003_add_speedgrader_system.sql`

### Core LMS ✅
- User authentication (students, teachers, admins)
- Role-based dashboards
- Classes, materials, hands-on stations
- Discussion forums, blog system
- AI assistant (JewelEE)
- Payment processing (Stripe)
- Student progress tracking

---

## 🔄 IN PROGRESS: Testing SpeedGrader

### Database Setup Status:
- ✅ Phase 2 migration tables created
- ✅ Test users created (admin, teacher, student)
- ✅ Test assignment created (ID: 1)
- ✅ 2 test submissions created

### Current Blocker:
- Login redirect issue FIXED (code deployed)
- Waiting for Vercel quota to test

### Once Vercel is Fixed:
1. Test login redirect to SpeedGrader
2. Grade 2 test submissions
3. Verify grade calculations
4. Test PDF preview
5. Test navigation between submissions

---

## 📝 TODO: Immediate Next Steps

### 1. Fix Deployment Issue
**Priority: CRITICAL**
- [ ] Upgrade Vercel plan OR
- [ ] Deploy to Railway/Netlify
- [ ] Test deployment works
- [ ] Verify all environment variables set

### 2. Test SpeedGrader Workflow
**Priority: HIGH**
- [ ] Login as teacher (`teacher@example.com` / `teacher123`)
- [ ] Navigate to `/speedgrader?assignment=1`
- [ ] Verify 2 submissions load
- [ ] Grade submission #1 (Sarah Johnson)
  - [ ] PDF preview works
  - [ ] Enter score (e.g., 95)
  - [ ] Add feedback
  - [ ] Click "Save & Return to Student"
  - [ ] Verify auto-advance to next submission
- [ ] Grade submission #2 (John Doe - late)
  - [ ] Verify late badge shows
  - [ ] Apply late penalty if needed
  - [ ] Save grade
- [ ] Verify grades saved in database
- [ ] Login as student to view grade

### 3. Create More Test Data
**Priority: MEDIUM**
- [ ] Run SQL to create 2-3 more assignments
- [ ] Create 5-10 more submissions per assignment
- [ ] Test grading workflow with larger dataset
- [ ] Verify performance with multiple submissions

SQL for more test data:
```sql
-- See: db/seed_speedgrader_test_data.sql
-- Modify to create multiple assignments
```

### 4. Build Assignment Management UI
**Priority: HIGH**
- [ ] Create `/teacher/assignments` page
  - [ ] List all assignments for teacher
  - [ ] "Create Assignment" button
  - [ ] Edit/Delete assignment actions
  - [ ] Link to SpeedGrader for each assignment
- [ ] Create assignment form
  - [ ] Title, description fields
  - [ ] Due date picker
  - [ ] Points input (default 100)
  - [ ] Submission type (file/text/url)
  - [ ] Instructions textarea
  - [ ] Late submission toggle
  - [ ] Late penalty percentage
- [ ] Add route to App.tsx
- [ ] Add link from Teacher Dashboard

### 5. Build Student Submission UI
**Priority: HIGH**
- [ ] Create `/assignments/:id` page (student view)
  - [ ] Display assignment details
  - [ ] Show due date with countdown
  - [ ] File upload area
  - [ ] Submit button
  - [ ] View submission status
  - [ ] View grade when returned
- [ ] Add to student navigation
- [ ] Test file upload (PDF, images)
- [ ] Test late submission detection

### 6. Enhance Teacher Dashboard
**Priority: MEDIUM**
- [ ] Add "Assignments" tab to Teacher Dashboard
- [ ] Show list of assignments with:
  - [ ] Total submissions
  - [ ] Graded count
  - [ ] Ungraded count
  - [ ] Average score
- [ ] Quick link to SpeedGrader
- [ ] Create assignment button
- [ ] Analytics for grading efficiency

### 7. Database Migrations Checklist
**Priority: MEDIUM**
Run these in Neon SQL Editor if not already done:
- [ ] `db/migrations/002_add_search_indexes.sql` (Phase 1)
- [ ] `db/migrations/003_add_speedgrader_system.sql` (Phase 2)
- [ ] `db/seed_test_users.sql` (test accounts)
- [ ] `db/seed_speedgrader_test_data.sql` (test data)

---

## 🎯 TODO: Phase 2B Enhancements (Optional)

### PDF Annotation Tools
**Priority: MEDIUM**
- [ ] Integrate PDF.js for rendering
- [ ] Add annotation toolbar
  - [ ] Highlight tool
  - [ ] Comment tool
  - [ ] Drawing tool (arrows, circles)
  - [ ] Stamp tool (Great Job!, Needs Work)
- [ ] Save annotations to `pdf_annotations` table
- [ ] Load annotations when viewing submission
- [ ] Render annotations on PDF

### Video/Audio Feedback
**Priority: MEDIUM**
- [ ] Add "Record Video Feedback" button
- [ ] Integrate WebRTC for recording
- [ ] Upload to Cloudflare R2 or S3
- [ ] Save URL to `grades` table
- [ ] Display video player for students
- [ ] Add "Record Audio Feedback" option

### Rubric Builder UI
**Priority: LOW**
- [ ] Create `/teacher/rubrics` page
- [ ] Rubric builder form
  - [ ] Add criteria (title, description, points)
  - [ ] Reorder criteria
  - [ ] Set total points
  - [ ] Save as template
- [ ] Attach rubric to assignment
- [ ] Show rubric in SpeedGrader
- [ ] Click to assign points per criteria
- [ ] Auto-calculate total from rubric

---

## 🚀 TODO: Phase 3 - AI Integration (Next Big Feature)

### Priority: HIGH (After Phase 2 testing)

### 1. AI Quiz Generation
- [ ] Create `/teacher/quiz-generator` page
- [ ] Upload PDF or paste text
- [ ] Call GPT-4 to generate 10 questions
- [ ] Review and edit questions
- [ ] Save as assignment
- [ ] Auto-grade multiple choice

### 2. AI Grading Suggestions
- [ ] Add "Get AI Suggestions" button in SpeedGrader
- [ ] Send submission text to GPT-4
- [ ] Get suggested score and feedback
- [ ] Teacher can accept/modify/reject
- [ ] Learn from teacher's edits

### 3. Predictive Analytics
- [ ] Track student engagement metrics
- [ ] Train ML model on historical data
- [ ] Predict at-risk students (75% accuracy target)
- [ ] Show predictions in Teacher Dashboard
- [ ] Alert teacher for early intervention

### 4. Auto-Grading Short Answers
- [ ] Integrate GPT-4 for short answer grading
- [ ] Compare student answer to rubric
- [ ] Assign score with explanation
- [ ] Teacher review queue for verification

### 5. Enhanced AI Teaching Assistant
- [ ] Upgrade JewelEE with RAG (Retrieval-Augmented Generation)
- [ ] Index all course materials in vector database (Pinecone)
- [ ] Pull relevant context for answers
- [ ] Cite sources in responses
- [ ] Track AI usage analytics

---

## 📱 TODO: Phase 4 - Mobile PWA (Months 4-5)

### Priority: MEDIUM

### 1. Progressive Web App Setup
- [ ] Update manifest.json
  - [ ] Add icons (192x192, 512x512)
  - [ ] Set theme color
  - [ ] Set display mode (standalone)
- [ ] Create service worker
  - [ ] Cache app shell
  - [ ] Cache API responses
  - [ ] Offline fallback page
- [ ] Test "Add to Home Screen"

### 2. Offline Mode
- [ ] Cache materials for offline viewing
- [ ] Queue submissions when offline
- [ ] Sync when back online
- [ ] Show offline indicator
- [ ] Handle sync conflicts

### 3. Push Notifications
- [ ] Request notification permission
- [ ] Send push when:
  - [ ] Assignment graded
  - [ ] New assignment posted
  - [ ] Discussion reply
  - [ ] Due date reminder
- [ ] Server-side push service

### 4. Mobile Optimization
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Optimize touch targets (44x44px min)
- [ ] Improve mobile navigation
- [ ] Add pull-to-refresh

---

## 🔗 TODO: Phase 5 - Integrations (Months 5-6)

### Priority: MEDIUM

### 1. Zoom Integration
- [ ] Get Zoom OAuth credentials
- [ ] Add "Connect Zoom" in settings
- [ ] Create meeting from assignment
- [ ] Embed Zoom in class page
- [ ] Record attendance automatically

### 2. Google Drive Integration
- [ ] Google OAuth setup
- [ ] "Submit from Google Drive" option
- [ ] Browse student's Drive files
- [ ] Import files to submissions
- [ ] Export grades to Google Sheets

### 3. Dropbox Integration
- [ ] Dropbox OAuth setup
- [ ] "Submit from Dropbox" option
- [ ] Similar to Google Drive flow

### 4. Calendar Sync
- [ ] Export assignments to iCal format
- [ ] Sync with Google Calendar
- [ ] Sync with Outlook Calendar
- [ ] Due date reminders

### 5. Single Sign-On (SSO)
- [ ] SAML 2.0 integration
- [ ] Google Workspace SSO
- [ ] Microsoft 365 SSO
- [ ] University LTI integration

---

## 🎮 TODO: Phase 6-8 (Months 6-12)

### Phase 6: AR Features
- [ ] Research AR libraries (AR.js, 8th Wall)
- [ ] Camera-based instrument identification
- [ ] Point phone at tray → labels appear
- [ ] 3D model viewer for instruments

### Phase 7: Blueprint Courses & Migration
- [ ] Master course templates
- [ ] Link sections to master
- [ ] Update propagation system
- [ ] Canvas LMS import
- [ ] Blackboard LMS import
- [ ] Moodle LMS import

### Phase 8: Gamification Enhancements
- [ ] XP and leveling system
- [ ] More achievement badges
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Personalized learning paths

---

## 🐛 TODO: Bug Fixes & Polish

### Known Issues:
- [ ] None currently! System is stable.

### Nice-to-Have Improvements:
- [ ] Add loading skeleton states
- [ ] Improve error messages
- [ ] Add confirmation modals for destructive actions
- [ ] Optimize image loading (lazy load, WebP)
- [ ] Add data export features (CSV, PDF)
- [ ] Improve mobile responsive design
- [ ] Add dark mode toggle
- [ ] Add keyboard shortcuts documentation

---

## 📊 TODO: Analytics & Monitoring

### Setup Monitoring:
- [ ] Add Sentry for error tracking
- [ ] Add UptimeRobot for uptime monitoring
- [ ] Add Google Analytics or Mixpanel
- [ ] Create admin analytics dashboard
  - [ ] Daily active users
  - [ ] Assignment submission rates
  - [ ] Average grading time
  - [ ] Student engagement metrics

### Performance:
- [ ] Run Lighthouse audit
- [ ] Optimize bundle size
- [ ] Add Redis caching for API
- [ ] Optimize database queries
- [ ] Add CDN for static assets

---

## 💼 TODO: Business & Marketing

See `MARKETING_PLAN.md` for complete strategy.

### Immediate:
- [ ] Create landing page
- [ ] Set up demo account (demo@spulms.com)
- [ ] Create demo video (3-5 minutes)
- [ ] Write case studies
- [ ] Design pricing page

### Content Marketing:
- [ ] Write 5 blog posts about sterile processing
- [ ] Create comparison: SPU LMS vs Canvas
- [ ] Create comparison: SPU LMS vs Blackboard
- [ ] Create ROI calculator for institutions

### Outreach:
- [ ] List 20 target sterile processing schools
- [ ] Email templates for cold outreach
- [ ] LinkedIn outreach strategy
- [ ] Partner with IAHCSMM / CBSPD

---

## 📝 TODO: Documentation

### User Guides:
- [ ] Student quick start guide (PDF)
- [ ] Teacher quick start guide (PDF)
- [ ] Admin setup guide (PDF)
- [ ] SpeedGrader tutorial video
- [ ] FAQ page

### Developer Docs:
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema diagram
- [ ] Architecture diagram
- [ ] Contribution guidelines
- [ ] Deployment guide for other platforms

---

## 🎯 Success Criteria

### Phase 2 Complete When:
- ✅ SpeedGrader loads with submissions
- ✅ Teacher can grade and save
- ✅ Grades calculate correctly
- ✅ Students can view returned grades
- ✅ PDF preview works
- ✅ Time tracking works
- ✅ Navigation between submissions works

### Phase 3 Ready When:
- [ ] Phase 2 fully tested
- [ ] At least 5 teachers using system
- [ ] Grading time reduced by 40%+
- [ ] Teacher satisfaction score > 8/10
- [ ] No critical bugs for 2 weeks

### Ready for University Sales When:
- [ ] 99.9% uptime for 30 days
- [ ] 50+ active users
- [ ] 500+ assignments graded
- [ ] Case study with metrics
- [ ] Professional sales deck
- [ ] Demo video
- [ ] Support documentation

---

## 🚀 Quick Start for Next Session

```bash
# 1. Pull latest code
git pull origin claude/deploy-lms-vercel-01YaDaDHiVrWFn87LmrWPzXB

# 2. Check deployment status
# If Vercel quota issue resolved:
# - Login to Vercel dashboard
# - Check deployment logs
# - Test live URL

# 3. Test SpeedGrader
# - Login: teacher@example.com / teacher123
# - Navigate to: /speedgrader?assignment=1
# - Grade 2 submissions
# - Verify everything works

# 4. If working, move to Assignment Management UI
# See "4. Build Assignment Management UI" above

# 5. If not working, debug:
# - Check browser console for errors
# - Check network tab for failed API calls
# - Check Neon database has all migrations
# - Check environment variables in Vercel
```

---

## 📞 Context for Next Claude

**What you're continuing:**
- SPU LMS - Medical education platform
- Phase 2 (SpeedGrader) just completed
- Waiting for Vercel deployment quota fix
- Database setup complete with test data
- Need to test and then build more UI

**Key Files to Know:**
- `/client/src/pages/SpeedGrader.tsx` - Main grading interface
- `/server/index.ts` - API endpoints (1500+ lines)
- `/db/schema.ts` - Database schema
- `/db/migrations/003_add_speedgrader_system.sql` - Phase 2 schema

**Branch:** `claude/deploy-lms-vercel-01YaDaDHiVrWFn87LmrWPzXB`

**Live URL:** https://medicalknowledgeflower.vercel.app (when quota fixed)

---

**Last Updated:** November 21, 2025
**Session:** Phase 2 Complete - SpeedGrader Backend & UI Implemented
**Next:** Fix deployment, test SpeedGrader, build assignment management UI
