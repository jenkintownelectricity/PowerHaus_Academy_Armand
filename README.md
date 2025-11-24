# PowerHaus Academy

**Elite Digital Media & Content Creation Learning Platform**

Transform your creative power with PowerHaus Academy - a cutting-edge learning management system built for the next generation of digital creators, content producers, and creative entrepreneurs.

![Build Status](https://img.shields.io/badge/build-ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

## 🎬 The 6 Pillars of Digital Mastery

PowerHaus Academy is built around **6 core pillars** that every successful digital creator must master:

### 1. 🌟 Digital Confidence & Mindset
- Identity building & self-belief
- Discipline & creative habits
- Creative courage & emotional control

### 2. 📸 Media & Content Skills
- Camera basics & smartphone mastery
- Video editing fundamentals
- Storytelling & scriptwriting
- Short-form content creation

### 3. 👥 Creative Leadership
- Turning ideas into action
- Speaking confidently on camera
- Group collaboration
- Leadership in creative environments

### 4. 🌐 Digital Literacy
- Online safety & security
- Media professionalism
- Personal branding online
- Audience understanding & trend analysis

### 5. 💼 Entrepreneurship Basics
- Creator economy fundamentals
- How digital jobs work
- Business mindset development
- Project ownership & management

### 6. 📁 Portfolio Building
- Creating professional projects
- Building a digital portfolio
- Resume-style content pieces
- Showcasing your best work

---

## ✨ Key Features

- **🎨 Award-Winning OLED Black UI** - Cutting-edge minimalist design optimized for OLED screens (60% battery savings)
- **📊 Student Dashboard** - Track progress across all 6 pillars with XP, levels, and milestones
- **🎥 Video Library** - Access premium tutorials, workshops, and educational content
- **📚 Structured Programs** - Learning paths for different skill levels and time commitments
- **👨‍🏫 Admin Dashboard** - Manage student submissions, approve work, provide feedback
- **💬 Community Forums** - Discussion boards for collaboration and peer support
- **🏆 Badges & Achievements** - Gamified learning with 5 badge tiers (Bronze → Diamond)
- **📁 Portfolio System** - Students build and showcase their creative work
- **💳 Payment Integration** - Stripe payments with discount code support
- **🎨 Logo Upload** - Customizable branding for white-label deployment

---

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling with custom OLED theme
- **Radix UI + shadcn/ui** - Accessible component library
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Node.js + Express** - RESTful API server
- **PostgreSQL** (Neon Serverless) - Production database
- **Drizzle ORM** - Type-safe database queries
- **Multer** - File upload handling (supports up to 100MB)
- **Stripe** - Payment processing
- **Express Session** - Secure authentication

### Deployment
- **Vercel** - Serverless hosting (**FREE** tier available)
- **Neon PostgreSQL** - Serverless database (**FREE** tier available)

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database OR Neon account (recommended)
- Stripe account (for payment features)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/jenkintownelectricity/PowerHaus_Academy_Armand.git
cd PowerHaus_Academy_Armand

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and Stripe keys

# Push database schema to your database
npm run db:push

# (Optional) Seed with test data
npx ts-node db/powerhaus-seed.ts

# Run development server
npm run dev
```

The app will be available at `http://localhost:5000`

---

## 🗄️ Database Schema

PowerHaus Academy uses a comprehensive schema optimized for digital media education:

**Core Tables:**
- `users` - Students, instructors, admins with portfolio URLs
- `programs` - Multi-week learning programs covering the 6 pillars
- `classes` - Live sessions, workshops, one-on-one coaching
- `materials` - Video tutorials, project templates, resource guides
- `pillar_progress` - Individual progress tracking for each of the 6 pillars
- `user_badges` - Achievement and gamification system
- `media_submissions` - Student work (photos, videos, portfolio pieces, projects)
- `discount_codes` - Promotional pricing codes
- `platform_branding` - Custom logo and brand colors

**See `/db/schema.ts` for complete schema**

---

## 🎨 Design System

### OLED Black Theme
Our award-winning design is optimized for modern OLED displays:

- **Background:** Pure Black (#000000) - Saves 60% battery on OLED screens
- **Primary:** Electric Purple (#B266FF) - PowerHaus brand color
- **Secondary:** Electric Cyan (#00FFA3) - Accent color
- **Text:** Silver (#E5E5E5) - Reduces eye strain (never pure white)

### Design Principles
- **Minimalist Maximalism** - Clean layouts with strategic visual impact
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Smooth Micro-interactions** - Hover effects, transitions, animations
- **Full Accessibility** - WCAG 2.1 AAA compliant

### Key CSS Classes
- `.glass-card` - Frosted glass card effect
- `.powerhaus-glow` - Purple/cyan glow effect
- `.powerhaus-card` - Gradient card with hover lift
- `.hover-lift` - Elevates on hover

---

## 🧪 Test Accounts

After running the seed script, you can log in with:

```
Admin:      admin@powerhaus.com / admin123
Instructor: coach@powerhaus.com / coach123
Student:    user@powerhaus.com / user123
```

---

## 📱 Application Routes

### Student Routes
- `/` - Personal dashboard with 6 Pillars progress
- `/programs` - Browse and enroll in learning programs
- `/videos` - Video tutorial library
- `/community` - Discussion forums
- `/blog` - Educational articles and student success stories

### Admin Routes
- `/powerhaus-admin` - Manage submissions, users, analytics
- `/branding` - Upload logo and customize brand colors

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL recommended)
DATABASE_URL=postgresql://user:password@host:5432/powerhaus_academy

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Session Security
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
```

### Brand Customization

1. Log in as admin
2. Navigate to `/branding`
3. Upload your logo (PNG recommended, 500x200px)
4. Upload favicon (32x32px)
5. Set custom brand colors
6. Configure company name and tagline

---

## 🚢 Deployment to Vercel (FREE)

### Step 1: Prepare Your Database

1. Create a free [Neon](https://neon.tech) PostgreSQL database
2. Copy the connection string
3. Run `npm run db:push` to create tables

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, SESSION_SECRET
```

### Step 3: Done!

Your PowerHaus Academy is now live at your Vercel URL! 🎉

---

## 📊 Project Structure

```
PowerHaus_Academy_Armand/
├── client/              # React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── lib/         # Utilities
│       └── index.css    # OLED black theme styles
├── server/              # Express backend
│   └── index.ts         # API routes
├── db/                  # Database layer
│   ├── schema.ts        # Database schema (Drizzle ORM)
│   ├── index.ts         # DB connection
│   └── powerhaus-seed.ts # Seed data script
├── api/                 # Vercel serverless functions
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎯 Core Philosophy

PowerHaus Academy is built on the principle that **every student can become a successful digital creator** by mastering these 6 foundational pillars. Our platform provides:

1. **Structured Learning** - Clear progression paths
2. **Practical Skills** - Real-world projects and portfolio building
3. **Community Support** - Peer learning and collaboration
4. **Expert Guidance** - Professional instructors and feedback
5. **Measurable Progress** - XP, levels, badges, and achievements
6. **Career Preparation** - Portfolio showcase and entrepreneurship training

---

## 🤝 Support & Contact

For questions, support, or custom development:

- **Email:** support@powerhaus.academy
- **Website:** [PowerHaus Academy](https://powerhaus.academy)
- **GitHub Issues:** [Report bugs or request features](https://github.com/jenkintownelectricity/PowerHaus_Academy_Armand/issues)

---

## 📄 License

Copyright © 2025 PowerHaus Academy. All rights reserved.

---

**Built with 💜 by PowerHaus Academy**

*Transform Your Creative Power*
