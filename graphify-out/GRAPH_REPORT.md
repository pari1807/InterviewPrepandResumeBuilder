# Graph Report - .  (2026-07-20)

## Corpus Check
- Corpus is ~31,877 words - fits in a single context window. You may not need a graph.

## Summary
- 264 nodes · 514 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Resume PDF Templates & Formatting Utils
- Backend Resume & AI REST API Layers
- Frontend Redux State & Page Routing
- ESLint & Build Toolchain Configurations
- Resume Builder Dynamic Entry Forms
- Client Third-Party Core Libraries
- Backend Data & Transport Dependencies
- User Profile & OTP Authentication Flow
- Home Landing & Marketing Viewports
- Node Process Task Runner Configurations
- Firebase & OpenAI Mock Dependencies

## God Nodes (most connected - your core abstractions)
1. `formatDate()` - 16 edges
2. `formatRange()` - 16 edges
3. `User` - 13 edges
4. `TemplateContent()` - 12 edges
5. `getProjectEntries()` - 11 edges
6. `getCertificationEntries()` - 11 edges
7. `getAchievementEntries()` - 11 edges
8. `getActivityEntries()` - 11 edges
9. `Otp` - 11 edges
10. `api` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Hero()` --references--> `react`  [EXTRACTED]
  client/src/components/Home/Hero.jsx → client/package.json
- `ResumePreview()` --calls--> `buildPreviewVars()`  [EXTRACTED]
  client/src/components/ResumePreview.jsx → client/src/components/templates/templateUtils.js
- `ClassicTemplate()` --calls--> `formatDate()`  [EXTRACTED]
  client/src/components/templates/ClassicTemplate.jsx → client/src/components/templates/templateUtils.js
- `ClassicTemplate()` --calls--> `formatRange()`  [EXTRACTED]
  client/src/components/templates/ClassicTemplate.jsx → client/src/components/templates/templateUtils.js
- `ClassicTemplate()` --calls--> `getAchievementEntries()`  [EXTRACTED]
  client/src/components/templates/ClassicTemplate.jsx → client/src/components/templates/templateUtils.js

## Import Cycles
- None detected.

## Communities (13 total, 0 thin omitted)

### Community 0 - "Resume PDF Templates & Formatting Utils"
Cohesion: 0.23
Nodes (21): ResumePreview(), ClassicTemplate(), ExecutiveTemplate(), MinimalImageTemplate(), MinimalTemplate(), ModernTemplate(), ProfessionalTemplate(), renderProjectLinks() (+13 more)

### Community 1 - "Backend Resume & AI REST API Layers"
Cohesion: 0.11
Nodes (24): ai, aiOptions, connectDB(), imageKit, storage, upload, enhanceJobDescription(), enhanceProfessionalSummary() (+16 more)

### Community 2 - "Frontend Redux State & Page Routing"
Cohesion: 0.13
Nodes (16): App(), authSlice, store, dummyResumeData, Navbar(), PageLoader(), ProfessionalSummaryForm(), SkillForm() (+8 more)

### Community 3 - "ESLint & Build Toolchain Configurations"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+20 more)

### Community 4 - "Resume Builder Dynamic Entry Forms"
Cohesion: 0.16
Nodes (14): AchievementForm(), ActivityForm(), CertificationForm(), ColorPicker(), EducationForm(), ExperienceForm(), PersonInfo(), ProjectForm() (+6 more)

### Community 5 - "Client Third-Party Core Libraries"
Cohesion: 0.09
Nodes (23): axios, dependencies, axios, lucide-react, react-dom, react-icons, @react-oauth/google, react-pdftotext (+15 more)

### Community 6 - "Backend Data & Transport Dependencies"
Cohesion: 0.09
Nodes (23): bcrypt, cors, dotenv, express, @google/genai, @imagekit/nodejs, jsonwebtoken, mongoose (+15 more)

### Community 7 - "User Profile & OTP Authentication Flow"
Cohesion: 0.26
Nodes (18): forgotPassword(), generateToken(), getOTPEmailTemplate(), loginUser(), registerUser(), resetPassword(), sendMailHelper(), sendOTP() (+10 more)

### Community 8 - "Home Landing & Marketing Viewports"
Cohesion: 0.17
Nodes (9): react, Banner(), CallToAction(), Features(), Footer(), Hero(), Testimonials(), Home() (+1 more)

### Community 9 - "Node Process Task Runner Configurations"
Cohesion: 0.13
Nodes (14): nodemon, author, description, devDependencies, nodemon, keywords, license, main (+6 more)

### Community 10 - "Firebase & OpenAI Mock Dependencies"
Cohesion: 0.25
Nodes (7): firebase, openai, dependencies, firebase, genai, openai, genai

## Knowledge Gaps
- **61 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Client Third-Party Core Libraries` to `Home Landing & Marketing Viewports`, `ESLint & Build Toolchain Configurations`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Why does `react` connect `Home Landing & Marketing Viewports` to `Client Third-Party Core Libraries`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend Resume & AI REST API Layers` be split into smaller, more focused modules?**
  _Cohesion score 0.11260504201680673 - nodes in this community are weakly interconnected._
- **Should `Frontend Redux State & Page Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.12873563218390804 - nodes in this community are weakly interconnected._
- **Should `ESLint & Build Toolchain Configurations` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Client Third-Party Core Libraries` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._