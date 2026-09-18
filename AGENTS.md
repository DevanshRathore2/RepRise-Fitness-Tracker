# RepRise - Project Overview & Agent Guidelines

Build a full-stack fitness and nutrition website called **RepRise**, inspired by the core usefulness of MyFitnessPal. It should help users set health goals, calculate a daily calorie target, log meals, track macros, record weight, and view progress over time.

Do not copy MyFitnessPal’s branding, text, or exact interface. Create an original product and use the design instructions in the provided diff file as the source of truth for all visual decisions.

---

## Tech Stack & Architecture

- **Core**: Next.js with TypeScript
- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes or server actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk or Auth.js
- **Charts**: Recharts
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **Deployment**: Vercel with PostgreSQL hosted through Supabase or Neon

### Directory Structure & Modular Architecture

- `app/` for pages, layouts, and route handlers
- `components/` for reusable UI components (shadcn/ui, layout, domain-specific widgets)
- `lib/` for calculations, helpers, and database utilities (Prisma client, math functions)
- `prisma/` for the database schema and seed data
- `types/` for shared TypeScript types and interfaces
- `assets/` (and `public/assets/`) for custom illustrations, generated 3D assets, and graphics displayed across the landing page and app

---

## Core Features & Pages

### 1. Landing Page
- Clear explanation of calorie tracking and fitness progress
- Primary calls to action: “Start Tracking” and “Calculate My Calories”
- Feature sections for food logging, macros, workout tracking, and progress charts
- Testimonials
- Pricing section with Basic, Pro, and Elite tiers
- Contact / lead-generation form
- Footer with social links and newsletter signup

### 2. Authentication and Onboarding
- Sign up, sign in, and sign out
- Protected user dashboard
- Onboarding flow that collects:
  - Name
  - Age
  - Sex
  - Height
  - Current weight
  - Target weight
  - Activity level
  - Fitness goal: lose weight, maintain weight, or gain muscle
- Use this information to calculate a recommended daily calorie target and macro targets (e.g., Mifflin-St Jeor equation, macro split)

### 3. Nutrition Dashboard
- Display daily calorie goal, calories consumed, and calories remaining
- Show macro progress for protein, carbohydrates, and fats
- Show each meal category: Breakfast, Lunch, Dinner, and Snacks
- Show a daily summary and recent food entries
- Quick actions to add food, log weight, or record a workout

### 4. Food and Calorie Tracker
- Search a food database by name
- Add foods to Breakfast, Lunch, Dinner, or Snacks
- Allow custom food creation with calories, protein, carbohydrates, fats, and serving size
- Adjust serving quantities before adding food to the diary
- Let users edit or delete food entries
- Save frequently used foods and meals
- Show meal totals and daily nutrition totals
- Seed the app with realistic common foods for demonstration

### 5. Weight and Progress Tracking
- Log body weight with date and optional notes
- Display weight history in a chart
- Show target weight, current weight, weight change, and progress toward goal
- Weekly and monthly calorie-consistency charts
- Allow users to view trends over selectable time ranges (7D, 30D, 90D, 1Y, All)

### 6. Workout Tracker
- Create custom workout plans
- Add exercises with sets, reps, weight, rest time, and notes
- Log completed workouts
- Show workout streaks and total sessions
- Track personal records
- Calendar view for completed workout days
- Strength-progress charts for exercises

---

## Development Guidelines & Rules

- **Design Fidelity**: Use the design instructions in the diff file for all UI, colors, typography, layout, animations, and responsiveness.
- **Core Experience**: Make the food diary and nutrition dashboard the main product experience.
- **Type Safety**: Use TypeScript throughout with strict typing; avoid `any`.
- **Component Design**: Create reusable components and avoid duplicated UI.
- **Accessibility & UX**: Use semantic HTML, accessible labels, keyboard-friendly controls, and clear form validation.
- **Security & Authorization**: Protect all user data with proper authorization checks. Ensure tenant data isolation.
- **Validation**: Validate forms and payloads on both client and server (e.g., Zod).
- **State Handling**: Include loading, empty, success, and error states across all asynchronous interactions.
- **Database Seeding**: Seed realistic demo users, food items, meals, weight logs, and workouts.
- **Documentation**: Add a comprehensive `README.md` with setup steps, environment variables, features, schema overview, and screenshots.
- **Quality Assurance**: Run linting, type checks, and relevant tests before marking work complete.
- **Iconography**: Use Phosphor Icons (`@phosphor-icons/react`) consistently across all components, actions, metrics, and navigation. Avoid mixing in other icon sets.
- **Pre-Coding Analysis**: Before coding, read the diff file, summarize the design requirements, and identify any conflicts with this specification.
- **Autonomous Execution**: Whatever action you can do, do yourself. This includes starting apps, running the project, testing features, and verification. Ask for help only when you need information, credentials, or approval that only the user can provide.
