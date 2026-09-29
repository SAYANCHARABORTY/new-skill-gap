# SKILLBRIDGE // PRODUCT PROTOTYPE DOCUMENTATION
**"LEARN × PRACTICE × GET PLACED"**
*Design Thinking College Presentation Edition*

---

## 1. Executive Summary & Vision

**SkillBridge** is a futuristic product platform engineered to bridge the canyon between academic institutions and active corporate hiring realities. 

### Core Differentiator: Strict Zero-Data Integrity
Conventional edtech platforms suffer from "simulation fallacy"—displaying pre-baked mock profiles, synthetic job offers, and artificial skill scores that deceive learners. 
SkillBridge starts in a **100% empty state**:
- **0 Mock Users**
- **0 Demo Students**
- **0 Fake Recruiters**
- **0 Fake Mentors**
- **0 Fake Jobs / Internships**
- **0 Artificial Statistics**

Every data point rendered inside SkillBridge is generated through authentic user registration, real skill attestation, and genuine recruiter requisition postings.

---

## 2. MotionSites Cinematic HUD Design System

| Element | Specification | Visual Purpose |
| :--- | :--- | :--- |
| **Primary Accent** | Neon Green (`#00FF66`) | High-tech clarity, interactive focus, telemetry indicators |
| **Deep Underglow** | Dark Chocolate (`#120905`, `#22120b`) | Warm futuristic atmosphere balancing harsh cyber tones |
| **Base Surface** | Obsidian Black (`#050505`, `#000000`) | Deep contrast, cinema-grade presentation clarity |
| **Secondary Accent** | Bronze / Gold (`#c48746`, `#dfa260`) | Academic governance, executive institutional telemetry |
| **Highlights** | Metallic White (`#E0E7FF`) | Crisp legibility across high-density data displays |
| **Typography** | `Orbitron`, `Rajdhani`, `Inter`, `JetBrains Mono` | HUD coordinates, headers, metrics, and dense data tables |
| **Hero Artwork Asset** | `/assets/skillbridge-hero.png` | Responsively cropped via `object-fit: cover` across 16:9, Ultrawide, & Mobile |
| **Viewport System** | `100vw × 100vh` (`min-height: 100dvh`) | Full viewport composition (Webpage Ratio ≠ Image Ratio) |


---

## 3. Architecture & Modular Services

```
src/
├── types/
│   └── index.ts                 # Type-safe models: User, Student, Mentor, Recruiter, AcademicAdmin, Opportunity, Application
├── services/
│   ├── storage.ts               # LocalStorage repository (Swappable for PostgreSQL/Firebase backend)
│   ├── auth.ts                  # Local session auth manager with role gateways
│   └── groq.ts                  # Isolated NIRVANA AI Guide engine (Groq Llama-3.3-70b)
├── context/
│   └── AuthContext.tsx          # Global reactive session provider
├── components/
│   ├── common/
│   │   ├── Navbar.tsx           # Telemetry header, role badge, session status, reset switch
│   │   ├── EmptyState.tsx       # Cyberpunk HUD empty states with dynamic action triggers
│   │   ├── RoleSelectorModal.tsx# "WHAT BRINGS YOU TO SKILLBRIDGE?" 5-Card Modal
│   │   └── CyberBackground.tsx  # Dynamic interactive particle-mesh canvas
│   ├── auth/
│   │   └── AuthModals.tsx       # Role-specific registration & login forms
│   ├── landing/
│   │   └── LandingPage.tsx      # 4:3 Hero, live 0-mock registry counters, 7-stage talent pipeline
│   ├── nirvana/
│   │   └── NirvanaTerminal.tsx  # AI Guide terminal with Groq API integration
│   └── roles/
│       ├── student/StudentDashboard.tsx    # My Skills, Dynamic Skill Gap, Mentors, Jobs, Learn, Practice
│       ├── mentor/MentorDashboard.tsx      # Teaching Subjects, WhatsApp/Telegram/IG connections, Requests
│       ├── recruiter/RecruiterDashboard.tsx# Post Requisitions, Track Applicants, Manage Statuses
│       └── academic/AcademicDashboard.tsx  # Curriculum Deficit Analysis, Student Roster, Alignment Insights
```

---

## 4. Role Portals & Telemetry

### 1. Student Portal
- **My Skills**: Self-attest genuine technical capabilities with proficiency rankings (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
- **Dynamic Skill Gap**: Calculates real mathematical overlap: 
  $$\text{Gap} = \text{Student Skills} \cap \text{Active Recruiter Demands}$$
  If no skills are entered or no jobs exist, gracefully renders: *"Skill gap analysis will appear after you add your skills and an industry requirement becomes available."*
- **Find a Mentor**: Real-time filtering by Subject, Industry, and Experience. Directly links to mentor's provided WhatsApp, Telegram, Instagram, and Portfolio channels.
- **Jobs & Internships**: View and apply to openings published by verified recruiters.

### 2. Industry Recruiter Portal
- **Create Opportunity**: Post Job or Internship with required skill tags, location, stipend, and description.
- **Candidate Applications**: Inspect applicants, reviewing their exact registered skill stack, degree, college, and attached resume.
- **Hiring Pipeline**: Update application states (`Applied` $\rightarrow$ `Under Review` $\rightarrow$ `Schedule Interview` $\rightarrow$ `Accepted` / `Rejected`).

### 3. Mentor Portal
- **Self-Registration**: Publish real industry credentials, availability, and teaching preferences.
- **Subject Management**: Dynamically add or remove subjects taught.
- **Student Requests**: Accept or decline incoming 1-on-1 mentorship requests.

### 4. Academic Admin Portal
- **Institutional Oversight**: View all registered students enrolled in the college.
- **Curriculum Gap Analysis**: Cross-references batch capabilities against industry demands to identify curriculum deficits before placement cycles.
- **Institutional Insights**: Telemetry generated strictly when authentic data is present, rendering *"Not enough data available yet"* if data is insufficient.

---

## 5. NIRVANA — The AI Guide & Groq Skill Analysis Engine
- **Isolated Service**: `src/services/groq.ts`
- **Groq AI-Powered Skill Analysis**: Evaluates student profile, target role, and active industry requisitions to dynamically generate an authentic **0–100 Skill Readiness Score** along with strong skills, moderate skills, weak skills, missing industry skills, AI explanation, project recommendations, and roadmap.
- **Resilient AI Pipeline**: Features automatic multi-model fallback across high-performance Groq models (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`, `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`).
- **Grounded Responses**: Feeds the currently logged-in student's real skills, target career, and active skill gaps into the system context.
- **Anti-Hallucination & Ethical AI**: Explicitly refuses to fabricate nonexistent skills, and never makes false promises of guaranteed employment.

---

## 6. Getting Started & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Groq API Key
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and set your Groq API key:
```env
VITE_GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```
*(You can also configure or override your key directly within the app via the NIRVANA AI settings modal).*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build Production Bundle
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory.

---

## 7. Deployment Guide (GitHub + Vercel)

### Deploying to GitHub
1. Initialize Git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: complete SkillBridge with Groq AI analysis & MotionSites design"
   ```
2. Link your remote repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/skillbridge.git
   git push -u origin main
   ```
*(Note: `.env` and `dist/` are safely ignored by `.gitignore` so your secrets and local files remain private).*

### Deploying to Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set the Framework Preset to **Vite**.
3. Under **Environment Variables**, add:
   - Key: `VITE_GROQ_API_KEY`
   - Value: `your_actual_groq_api_key`
4. Click **Deploy**. Vercel will build and deploy the production bundle automatically.
