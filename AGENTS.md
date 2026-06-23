# AGENTS.md

# Companion

Companion is an AI interview sparring partner for students, job seekers, and early-career professionals. It helps users practice realistic interviews by simulating an adaptive interviewer, asking role-specific follow-up questions, and producing visual feedback on answer quality, confidence, structure, and improvement areas.

This file gives guidance to AI coding agents, contributors, and maintainers working on the Companion codebase.

---

## 1. Product Vision

Companion is not an AI hiring tool. It is a private practice partner.

The goal is to help users improve before real interviews by giving them a safe, repeatable, and realistic environment to practice.

Core promise:

> Practice interviews with an AI that listens, challenges, and helps you improve.

The product should feel like a supportive but honest sparring partner, not a judge.

---

## 2. Target Users

Primary users:

- University students applying for internships
- New graduates preparing for full-time roles
- International students practicing English-language interviews
- Candidates preparing for behavioral, technical, consulting, or product interviews

Secondary users:

- Career centers
- Bootcamps
- Student clubs
- Sales trainees
- Early-stage startup founders practicing pitches

---

## 3. Core User Flow

The ideal MVP flow:

1. User creates or opens an interview session.
2. User uploads a resume or enters resume text.
3. User pastes a job description or selects a role type.
4. User chooses interview type and difficulty.
5. Companion runs a voice or text-based mock interview.
6. Companion asks adaptive follow-up questions.
7. The session is transcribed and analyzed.
8. User receives a visual performance report.
9. User gets rewritten answer suggestions and practice drills.

---

## 4. MVP Scope

Build these first:

- Resume upload and parsing
- Job description input and analysis
- Interview session creation
- AI-generated question plan
- Voice or text interview mode
- Adaptive follow-up questions
- Transcript capture
- Answer scoring
- Final feedback report
- Session history

Avoid building these too early:

- Complex avatar animation
- Real hiring workflows
- Employer-facing candidate ranking
- Facial expression scoring
- Body language judgment
- Large admin dashboards
- Social features

---

## 5. Non-Goals

Companion must not be positioned as:

- An automated hiring decision system
- A candidate ranking system for employers
- A tool that claims to detect personality, honesty, emotion, or employability from facial expressions
- A system that makes high-stakes decisions about users

Companion should help users practice and improve. It should not judge whether a person deserves a job.

---

## 6. Core AI Agents

Companion may be implemented as a multi-agent system. The agents below are conceptual roles; they can be implemented as separate services, modules, prompts, or functions.

### 6.1 ResumeProfilerAgent

Purpose:

Extract structured information from the user's resume.

Responsibilities:

- Parse education, experience, projects, skills, achievements, and metrics
- Identify strong resume claims worth asking about
- Detect vague claims that need clarification
- Extract technologies, leadership examples, and measurable results
- Produce a candidate profile used by the interview engine

Inputs:

- Resume PDF, DOCX, or plain text
- Optional LinkedIn/GitHub/project summary text

Outputs:

- Structured candidate profile
- Key claims
- Skill inventory
- Project inventory
- Suggested probing areas

Example output shape:

```json
{
  "candidate_summary": "Computer science student with full-stack and AI project experience.",
  "skills": ["Python", "TypeScript", "React", "LLMs", "PostgreSQL"],
  "projects": [
    {
      "name": "AI interview platform",
      "claimed_impact": "Improved practice feedback quality",
      "technologies": ["Next.js", "OpenAI", "PostgreSQL"],
      "probe_questions": [
        "What part of the system did you personally build?",
        "How did you evaluate feedback quality?"
      ]
    }
  ],
  "weak_spots": ["Limited quantified results", "Some vague ownership claims"]
}
```

---

### 6.2 JobDescriptionAnalyzerAgent

Purpose:

Analyze the target job description and extract what the interview should test.

Responsibilities:

- Extract required skills
- Extract preferred skills
- Identify likely interview themes
- Map resume experience to job requirements
- Generate a role-specific interview rubric

Inputs:

- Job description text
- Role type
- Company name if available

Outputs:

- Required competencies
- Interview topics
- Resume-to-role fit analysis
- Question categories

---

### 6.3 InterviewPlannerAgent

Purpose:

Create an interview plan before the session begins.

Responsibilities:

- Select question sequence
- Balance behavioral, technical, and role-specific questions
- Choose follow-up strategy
- Set difficulty level
- Adapt the plan based on resume and job description

Inputs:

- Candidate profile
- Job analysis
- Selected interview mode
- Difficulty level

Outputs:

- Ordered interview plan
- Question objectives
- Evaluation rubric for each question

Question types:

- Behavioral
- Technical deep-dive
- Resume project deep-dive
- Role motivation
- System design
- Product sense
- Consulting case
- Sales discovery
- Leadership and teamwork

---

### 6.4 InterviewerAgent

Purpose:

Conduct the live mock interview.

Responsibilities:

- Ask interview questions naturally
- Listen to user responses
- Ask adaptive follow-up questions
- Challenge vague or unsupported answers
- Maintain appropriate tone
- Keep the session on track

Behavior rules:

- Be realistic but not cruel
- Do not insult, shame, or belittle the user
- Push for specificity when answers are vague
- Ask for metrics when impact is unclear
- Ask for ownership when teamwork claims are ambiguous
- Ask for tradeoffs when technical answers are shallow
- Avoid making claims about the user's personality or worth

Example follow-up triggers:

- User says "we built" -> ask what they personally owned
- User says "improved performance" -> ask for baseline and measured improvement
- User gives broad claims -> ask for a concrete example
- User rambles -> ask them to summarize in one sentence
- User skips result -> ask what changed because of their work

---

### 6.5 PressureModeAgent

Purpose:

Control the realism and difficulty of the interview.

Pressure levels:

#### Level 1: Friendly Recruiter

- Warm tone
- Basic questions
- Gentle follow-ups
- Encouraging transitions

#### Level 2: Hiring Manager

- More specific questions
- Challenges unclear claims
- Asks about role fit
- Tests ownership and examples

#### Level 3: Bar Raiser

- Direct follow-ups
- Strong pressure for metrics
- Asks why the user is better than alternatives
- Tests depth, tradeoffs, and self-awareness

#### Level 4: Stress Interview

- Fast-paced
- Skeptical but still respectful
- Minimal reassurance
- Requires concise and evidence-backed answers

Important:

Even at the highest pressure level, Companion must remain respectful and safe.

---

### 6.6 ScoringAgent

Purpose:

Score each answer using clear, explainable rubrics.

Responsibilities:

- Score behavioral answers using STAR
- Score technical answers using correctness, depth, and tradeoffs
- Score communication quality
- Identify missing evidence
- Provide concise reasons for each score

Behavioral scoring dimensions:

- Situation clarity
- Task clarity
- Personal ownership
- Action specificity
- Result quality
- Quantified impact
- Relevance to role
- Conciseness

Technical scoring dimensions:

- Correctness
- Depth
- Tradeoff awareness
- Structure
- Edge cases
- Examples
- Honesty about uncertainty

Communication scoring dimensions:

- Clarity
- Conciseness
- Confidence
- Specificity
- Filler words
- Repetition
- Answer structure

Example scoring output:

```json
{
  "question_id": "q_003",
  "overall_score": 7.2,
  "scores": {
    "clarity": 8,
    "specificity": 6,
    "ownership": 7,
    "result": 5,
    "role_relevance": 8
  },
  "strengths": [
    "Clear description of the project context",
    "Good explanation of technical choices"
  ],
  "improvements": [
    "Add a quantified result",
    "Clarify what you personally owned"
  ]
}
```

---

### 6.7 FeedbackCoachAgent

Purpose:

Turn scoring into actionable coaching.

Responsibilities:

- Explain what went well
- Explain what needs improvement
- Rewrite weak answers
- Suggest practice drills
- Produce a session summary
- Recommend next interview mode

Feedback style:

- Direct but encouraging
- Specific, not generic
- Focused on behavior the user can change
- Avoid vague praise
- Avoid exaggerated criticism

Example coaching:

Bad:

> Your answer was not good enough.

Good:

> Your answer had a clear situation and action, but the result was weak. Add one measurable outcome, such as time saved, accuracy improved, users reached, or cost reduced.

---

### 6.8 ReportGeneratorAgent

Purpose:

Generate the final visual interview report.

Responsibilities:

- Summarize the full interview session
- Generate charts and score breakdowns
- Highlight strongest and weakest answers
- Show answer-by-answer feedback
- Generate revised answers
- Recommend next steps

Report sections:

- Overall score
- Role readiness summary
- STAR breakdown
- Technical depth breakdown
- Communication analysis
- Missed opportunities
- Best answer
- Weakest answer
- Improved answer examples
- Practice plan

---

### 6.9 SafetyAndPrivacyAgent

Purpose:

Protect users and reduce misuse.

Responsibilities:

- Prevent Companion from making hiring decisions
- Avoid sensitive attribute inference
- Avoid facial, emotion, personality, or honesty scoring
- Detect harmful or discriminatory interview questions
- Avoid storing unnecessary personal information
- Enforce user consent for resume and session storage
- Provide deletion/export options where possible

Rules:

- Do not infer protected traits.
- Do not rank candidates for employers.
- Do not claim to detect truthfulness.
- Do not evaluate facial expressions for employability.
- Do not use health, race, religion, politics, sexuality, or disability as scoring factors.
- Do not provide discriminatory interview advice.

---

## 7. Recommended Technical Architecture

Suggested architecture:

```text
Frontend
  - Next.js
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Recharts or D3 for visual reports

Backend
  - FastAPI or Node.js
  - REST or tRPC API
  - Interview session orchestration
  - Resume parsing pipeline
  - Scoring pipeline

AI Layer
  - LLM for question generation, follow-ups, scoring, and coaching
  - Speech-to-text for voice mode
  - Text-to-speech or realtime voice for interviewer mode
  - Optional vector database for resume/session retrieval

Database
  - PostgreSQL
  - Prisma or SQLAlchemy

Storage
  - S3, Supabase Storage, or local object storage in development

Deployment
  - Vercel for frontend
  - Railway, Fly.io, Render, or AWS for backend
```

---

## 8. Suggested Repo Structure

```text
companion/
  apps/
    web/
      app/
      components/
      lib/
      styles/
    api/
      src/
      tests/
  packages/
    ai/
      agents/
      prompts/
      rubrics/
      evaluators/
    database/
      prisma/
      migrations/
    shared/
      types/
      utils/
  docs/
    product.md
    architecture.md
    prompts.md
    evaluation.md
  AGENTS.md
  README.md
```

---

## 9. Data Model Guidelines

Core entities:

- User
- Resume
- JobDescription
- InterviewSession
- InterviewQuestion
- InterviewAnswer
- AnswerScore
- FeedbackReport
- PracticeDrill

Example simplified schema:

```text
User
  id
  email
  name
  created_at

Resume
  id
  user_id
  raw_text
  parsed_profile_json
  created_at

JobDescription
  id
  user_id
  title
  company
  raw_text
  parsed_requirements_json
  created_at

InterviewSession
  id
  user_id
  resume_id
  job_description_id
  mode
  difficulty
  status
  started_at
  completed_at

InterviewQuestion
  id
  session_id
  question_text
  question_type
  objective
  order_index

InterviewAnswer
  id
  question_id
  transcript
  duration_seconds
  created_at

AnswerScore
  id
  answer_id
  score_json
  overall_score
  created_at

FeedbackReport
  id
  session_id
  summary
  report_json
  created_at
```

---

## 10. Prompting Guidelines

All prompts should be:

- Specific
- Structured
- Grounded in the user's resume and job description
- Explicit about output format
- Clear about safety constraints
- Designed to avoid generic feedback

Prompt outputs should usually be valid JSON when consumed by code.

Do not rely on free-form text when the frontend needs structured data.

Include these principles in scoring prompts:

- Score only the user's answer, not the user's worth.
- Give evidence for each score.
- Prefer actionable feedback over judgment.
- Do not infer protected or sensitive attributes.
- Do not claim certainty when the transcript is incomplete.

---

## 11. Visual Demo Requirements

Companion should be visually demoable within 60 seconds.

The demo should show:

1. Resume upload
2. Job description input
3. Interview mode selection
4. Live interview question
5. Adaptive follow-up question
6. Live transcript or session timeline
7. Final feedback dashboard
8. Improved answer suggestion

Recommended UI components:

- Interview room screen
- Transcript timeline
- Confidence and clarity meters
- STAR score radar or bar chart
- Question-by-question score cards
- Answer heatmap
- Follow-up chain visualization
- Practice plan checklist

Avoid overcomplicating the first demo. A clean dashboard is better than an unfinished avatar.

---

## 12. Evaluation Strategy

Companion's quality should be evaluated on:

- Question relevance
- Follow-up quality
- Feedback specificity
- Scoring consistency
- Helpfulness of rewritten answers
- User-perceived realism
- User-perceived confidence improvement

Useful test cases:

- Strong answer with metrics
- Vague answer without ownership
- Rambling answer
- Technical answer with shallow tradeoffs
- Resume claim with unclear contribution
- Behavioral answer missing result
- Candidate admits uncertainty appropriately

Example evaluation dimensions:

```json
{
  "question_relevance": 1-5,
  "followup_quality": 1-5,
  "feedback_specificity": 1-5,
  "rubric_consistency": 1-5,
  "user_helpfulness": 1-5
}
```

---

## 13. Privacy and Data Handling

Resume and interview data are sensitive. Treat them accordingly.

Guidelines:

- Store only what is necessary.
- Let users delete sessions.
- Avoid exposing transcripts publicly.
- Avoid training on user data without explicit consent.
- Keep logs free of full resumes where possible.
- Redact sensitive values in debugging logs.
- Use secure file storage for uploaded resumes.
- Use authentication before storing user sessions.

Development rule:

Never commit real resumes, transcripts, or user data to the repository.

---

## 14. Safety Guidelines

Companion can challenge answers, but it must remain respectful.

Allowed:

- Asking for more detail
- Asking for metrics
- Asking for ownership
- Asking for tradeoffs
- Pointing out vague answers
- Suggesting stronger phrasing

Not allowed:

- Insulting the user
- Claiming the user is unemployable
- Inferring sensitive traits
- Scoring facial appearance
- Detecting honesty from voice or face
- Making hiring recommendations for employers
- Providing discriminatory interview practices

---

## 15. Coding Guidelines

General:

- Prefer TypeScript for frontend and shared types.
- Keep AI prompts versioned and testable.
- Use schema validation for AI outputs.
- Keep business logic out of UI components.
- Write small, composable services.
- Add tests for scoring and prompt output parsing.
- Make error states visible in the UI.

Frontend:

- Components should be reusable and accessible.
- Use clear loading states for AI calls.
- Show partial progress during long-running analysis.
- Avoid hiding important feedback behind too many clicks.

Backend:

- Validate all uploaded files.
- Enforce file size limits.
- Do not trust AI output without schema validation.
- Use background jobs for long scoring/report tasks if needed.
- Make session state explicit.

AI:

- Store prompt versions.
- Store model settings with each session.
- Validate JSON outputs.
- Retry safely when outputs fail validation.
- Log enough metadata for debugging without leaking private data.

---

## 16. Suggested API Endpoints

Example REST endpoints:

```text
POST /api/resumes/upload
GET  /api/resumes/:id
POST /api/job-descriptions
POST /api/interview-sessions
GET  /api/interview-sessions/:id
POST /api/interview-sessions/:id/next-question
POST /api/interview-sessions/:id/answers
POST /api/interview-sessions/:id/score
GET  /api/interview-sessions/:id/report
DELETE /api/interview-sessions/:id
```

---

## 17. Example Interview Modes

### Behavioral Mode

Focus:

- STAR answers
- Leadership
- Conflict
- Failure
- Teamwork
- Ownership

### Technical Mode

Focus:

- Project deep-dives
- System design
- Data structures and algorithms
- Debugging
- Technical tradeoffs

### Internship Mode

Focus:

- Motivation
- Projects
- Fundamentals
- Learning ability
- Teamwork

### Consulting Mode

Focus:

- Structured thinking
- Case reasoning
- Assumptions
- Quantitative estimation
- Communication

### Product Mode

Focus:

- User empathy
- Product sense
- Metrics
- Tradeoffs
- Prioritization

---

## 18. Roadmap

### Phase 1: MVP

- Text-based interview
- Resume parsing
- Job description analysis
- Adaptive follow-ups
- Final feedback report

### Phase 2: Voice Demo

- Speech-to-text
- Text-to-speech
- Live transcript
- Timed responses
- Filler word analysis

### Phase 3: Visual Feedback

- Score dashboard
- Answer timeline
- STAR breakdown
- Improved answer comparison
- Practice plan

### Phase 4: Personalization

- User progress history
- Weakness tracking
- Custom drills
- Role-specific practice paths
- Saved target roles

### Phase 5: Startup-Ready Version

- Subscription plans
- Campus ambassador testing
- Career center pilot dashboard
- Anonymous aggregate analytics
- Team/class practice groups

---

## 19. Resume-Worthy Technical Highlights

When building Companion, prioritize features that demonstrate technical depth:

- Real-time voice interview loop
- Multi-agent AI orchestration
- Resume and job description parsing
- Adaptive follow-up generation
- Structured scoring rubrics
- Visual analytics dashboard
- Session replay
- Prompt versioning and evaluation
- Privacy-aware data handling

Potential resume bullet:

> Built Companion, a real-time AI interview sparring partner using LLM agents, resume parsing, adaptive follow-up generation, structured scoring rubrics, and a visual feedback dashboard.

---

## 20. Product Positioning

Use this positioning:

> Companion is an AI interview sparring partner that helps candidates practice realistic interviews, receive structured feedback, and improve their answers before the real interview.

Avoid this positioning:

> Companion is an AI interviewer that evaluates whether candidates should be hired.

The distinction is important for user trust, safety, and go-to-market strategy.

---

## 21. Demo Script

A strong 60-second demo:

1. Open Companion.
2. Upload a resume.
3. Paste a software engineering internship job description.
4. Select "Technical + Behavioral" and "Bar Raiser" difficulty.
5. Companion asks: "Tell me about a project where you solved a difficult technical problem."
6. User gives a vague answer.
7. Companion follows up: "You said the system became faster. What was the baseline, what changed, and what did you personally implement?"
8. The report highlights missing metrics and unclear ownership.
9. Companion rewrites the answer using STAR.
10. The dashboard shows the user's next practice drill.

---

## 22. Contributor Checklist

Before opening a pull request, check:

- Does this improve the interview practice experience?
- Does this keep Companion as a coaching tool, not a hiring decision tool?
- Are AI outputs validated before use?
- Are private user documents protected?
- Is feedback specific and actionable?
- Does the UI remain visually demoable?
- Are failure states handled clearly?
- Are prompts and rubrics updated if behavior changed?

---

## 23. Definition of Done

A feature is done when:

- It works in the main user flow
- It handles loading, error, and empty states
- It has basic tests where appropriate
- It does not leak private user data
- It has clear UX copy
- It preserves Companion's supportive tone
- It is demoable without manual database edits

---

## 24. Guiding Principle

When unsure, choose the implementation that makes Companion more useful as a private practice partner.

Companion should help users build better interview reflexes, not just memorize better answers.

---

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues via the `gh` CLI; external PRs are not treated as a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default Matt Pocock triage label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo using root `CONTEXT.md` plus `docs/adr/` for architectural decisions. See `docs/agents/domain.md`.
