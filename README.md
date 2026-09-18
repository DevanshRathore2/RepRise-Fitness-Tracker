# RepRise - Athletic Nutrition & Strength Intelligence

RepRise is an elite, full-stack fitness and nutrition platform inspired by the core utility of MyFitnessPal, elevated with a modern athletic design system adhering to strict anti-slop frontend engineering.

Built with Next.js 15, TypeScript, Tailwind CSS, Recharts, and Prisma ORM.

---

## Features

### 1. High-Conversion Landing Page
- **Hero**: Viewport-contained header with calibrated value proposition and primary CTAs.
- **Interactive Calorie & Macro Intelligence Modal**: Real-time daily calorie and personalized macro target calculation.
- **Rhythmic Bento Grid**: Highlights Food Logging, Gram-Precision Macros, Body Weight Analytics, and Progressive Overload.
- **Athletes & Social Proof**: Testimonials with full attribution and verified athlete ratings.
- **Transparent Pricing**: Basic, Pro Athlete, and Elite Performance subscription tiers with Monthly/Annual billing.
- **Athlete Contact Form**: Lead generation form with client validation and feedback states.

### 2. Nutrition Dashboard
- Daily Calorie Target ring displaying calories consumed, calories remaining, and surplus/deficit metrics.
- Precision Macro Progress meters for Protein, Carbohydrates, and Dietary Fats.
- Categorized meal diary slots: Breakfast, Lunch, Dinner, and Snacks.
- Real-time reactive balance recalculation.

### 3. Food & Calorie Tracker
- Comprehensive food search from verified whole food seed library.
- Serving quantity multiplier with instant macro recalculation.
- Custom Food Creator for personal foods, supplements, and recipes.
- Instant meal assignment (Breakfast, Lunch, Dinner, Snacks).

### 4. Weight & Progress Analytics
- Body weight tracking with timestamps and optional context notes.
- Interactive Recharts line chart with goal target benchmark line.
- Time range filters: 7D, 30D, 90D, 1Y, and All.
- 7-day Calorie Consistency bar chart.

### 5. Workout & Strength Tracker
- Workout session builder with sets, reps, working weight, and target muscles.
- Active streak counter and total sessions logger.
- Personal Record (PR) board celebrating all-time compound lift maximums.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, zero `any`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [@phosphor-icons/react](https://phosphoricons.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Motion**: [Motion](https://motion.dev/)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL schema ready for Supabase / Neon)

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/reprise?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration (Optional for local PostgreSQL)

```bash
npx prisma generate
npx prisma db push
```

### 4. Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore RepRise.

### 5. Production Build

Verify the production build:

```bash
npm run build
npm run start
```
