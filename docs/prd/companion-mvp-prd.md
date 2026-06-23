# Companion MVP PRD

## 1. Product Summary

Companion is a desktop-first, free MVP for university candidates preparing for software internship interviews. It is a private practice partner, not a hiring tool.

The flagship MVP experience is a technical project deep-dive: a five-question, 10-12 minute speech-first interview room where the user answers by speaking, Companion transcribes the answer, and Companion challenges vague resume claims and missing metrics with resume and target-role-grounded follow-ups. The product's core differentiator is the live challenge moment: Companion catches a weak answer during the practice session, references the exact resume claim or target-role requirement being tested, and asks a sharper evidence-seeking question while the user is still in interview mode.

Companion does not verify whether claims are objectively true; it judges how defensible and well-supported an answer is during the session.

The MVP should feel like a focused interview workspace: calm, polished, slightly high-pressure, and organized around an interviewer panel, subtle evidence panel, transcript timeline, and practical coaching report.

## 2. Target User

The initial target user is a university candidate preparing for a software internship interview.

Primary traits:

- Applying to internships or early-career software roles.
- Has at least one resume project that sounds impressive but may be hard to defend under follow-up.
- Wants realistic practice before speaking to a real interviewer.
- May use ChatGPT, friends, career centers, LeetCode, YouTube, or generic interview platforms today.
- Needs a fast practice loop that exposes vague claims, missing metrics, unclear ownership, and shallow implementation detail.

Secondary users, out of immediate MVP focus:

- New graduates.
- International students practicing English-language interviews.
- Bootcamp students.
- Career centers.
- Candidates preparing for HR, system design, product, consulting, or sales interviews.

## 3. Problem Statement

University candidates often prepare by memorizing answers, practicing with friends, watching videos, doing LeetCode, or asking ChatGPT for a mock interview. These preparation alternatives are useful, but they usually fail at one or both of these jobs:

- They do not challenge the student's actual resume claims and target-role requirements in real time.
- They do not create the pressure of a one-on-one interviewer asking skeptical, evidence-seeking follow-ups.

As a result, students can overestimate answer quality. A resume bullet like "built a scalable backend" feels strong until a real interviewer asks what the student personally built, what tradeoffs they made, what the baseline was, and how they measured improvement.

Companion should help users discover these weaknesses before the real interview.

## 4. MVP Goals

1. Let a university candidate start a technical project deep-dive from a resume and target role.
2. Extract resume claims and target-role requirements well enough to build a relevant practice session.
3. Provide an extraction review when parsing is uncertain or before the session starts.
4. Show a test preview that explains what Companion plans to test.
5. Run a speech-first interview room with interviewer presence, microphone capture, answer transcription, speaking states, transcript timeline, and subtle evidence panel.
6. Trigger live challenge moments for vague resume claims and missing metrics/results.
7. Keep each practice session bounded to five primary questions and at most two follow-ups per primary question.
8. Produce answer evaluations that are specific, fair, transcript-grounded, and actionable, with explicit evidence spans.
9. Produce a performance report that quickly shows overall readiness, claim-defense issues, missing metrics, strongest/weakest answers, transcript highlights, improved answer rewrites, and the next practice drill.
10. Support sign-in, saved resumes, saved target roles, saved practice sessions, saved reports, deletion controls, and private-by-default data.
11. Measure whether users complete sessions, view reports, read improved answers, start drills, and return within 7 days.

## 5. Non-Goals

The MVP will not include:

- Fully realtime two-way voice conversation.
- Animated avatar.
- Coding editor.
- Video analysis.
- Facial or body-language scoring.
- Employer workflows.
- Candidate ranking.
- Hiring recommendations.
- Payments or subscriptions.
- Career-center admin.
- Public sharing by default.
- Social features.
- Multi-user mock interviews.
- Full HR, system design, coding-round, consulting, product, or sales modes as first-class experiences.

### 5.a Clarifying Decisions from Review

- The MVP mode is singular: technical project deep-dive for software internships.
- Input is speech-first by default. Text is recovery-only and only available when audio capture/transcription fails.
- A session is complete only when 5 primary questions are attempted and at most 10 total interviewer turns are emitted.
- A session with ambiguous extraction must not start until user confirms the extraction review.
- The "live challenge moment" is only valid when Companion references the exact claim/requirement from parsed context and asks a single follow-up.
- Reporting output can be generated without claiming truth or employability.
- No voice avatar, no face/body scoring, no coding editor, no employer workflows in MVP.

## 6. Core User Journey

1. User signs in.
2. User lands on a dashboard where "Start practice" is the dominant action.
3. User uploads or enters a resume.
4. User pastes or selects a target role. The empty state may offer a sample target role for demo or testing.
5. Companion enters an interview preparation state with visible progress language:
   - "Extracting project claims"
   - "Matching to role requirements"
   - "Preparing follow-up strategy"
6. If extraction is uncertain (confidence below threshold or contradictions found), Companion shows extraction review where the user must confirm or edit extracted claims and requirements.
7. Companion shows a test preview summarizing what it will test.
8. User starts the five-question technical project deep-dive.
9. Companion asks primary question #1.
10. User answers by speaking into microphone.
11. Companion transcribes answer and displays it in transcript timeline.
12. Companion evaluates whether to emit 0-2 follow-ups based on ambiguity rules.
13. If answer is vague or missing metrics, Companion creates a live challenge moment by referencing the relevant resume claim or target-role requirement.
14. User completes all 5 primaries (and any follow-ups).
15. Companion generates performance report.
16. User reviews overall readiness, claim-defense issues, missing metrics, strongest and weakest answers, transcript highlights, improved answer rewrites, and next practice drill.
17. User can return later to reuse saved resumes and target roles, view saved history, and start repeat practice.

Hard-stop behavior:

- If extraction review is not confirmed, practice does not start.
- If a microphone/transcription attempt fails twice on a single turn, the turn is accepted as typed fallback with a visible degraded quality indicator.
- If the follow-up cap is reached (2), the system must move to the next primary question.

## 7. Main Screens

### Sign-In

- Allows users to access private saved history.
- Sets expectation that resumes, target roles, transcripts, and reports are private by default.

### Dashboard

- Makes "Start practice" the dominant action.
- Shows saved history below once it exists.
- Shows recent practice sessions, reports, resumes, and target roles without competing with the main practice action.

### Guided Setup

- Supports resume upload or resume text entry.
- Supports target-role paste or sample target role.
- Lets the user confirm the flagship interview mode: technical project deep-dive.
- Shows what will be tested before interview starts.

### Interview Preparation State

- Replaces generic loading with meaningful progress states.
- Shows clear explanation: extracting project claims, matching requirements, preparing follow-up strategy.

### Extraction Review

- Shows extracted resume claims, project claims, target-role requirements, and uncertainty areas.
- Lets the user confirm or edit extracted details before starting.
- Prevents silent fallback from uncertain extraction.

### Test Preview

- Shows what Companion plans to test.
- Builds trust by proving Companion understood the resume and target role.
- Keeps wording concise and non-threatening.

### Speech-First Interview Room

- Desktop-first layout.
- Interviewer panel with interviewer presence and speaking states.
- Microphone controls for spoken answers.
- Live or near-live transcription of the spoken answer.
- Manual transcript correction before answer submission when speech recognition is inaccurate.
- Transcript timeline.
- Subtle evidence panel showing current probing focus and relevant resume or target-role snippet.
- No full chain-of-thought or internal reasoning.
- Keeps the session focused and slightly high-pressure without becoming hostile.

### Performance Report

- Shows report summary within 30 seconds.
- Prioritizes coaching intelligence over chart overload.
- Includes answer-level detail for deeper review.
- Provides improved answer rewrites and a next practice drill.

### Saved History

- Lets users revisit resumes, target roles, practice sessions, performance reports, and practice drills.
- Includes deletion controls for sensitive artifacts.

## 8. Data Objects

### User

Represents the account holder using Companion.

Key fields:

- id
- email
- name
- createdAt
- updatedAt

### Resume

Represents a user's uploaded or entered career document.

Key fields:

- id
- userId
- title
- rawText
- fileUrl, if uploaded
- parsedProfileJson
- extractedClaims
- createdAt
- updatedAt
- deletedAt, if soft deletion is used

### TargetRole

Represents the job, internship, or role description the user is preparing for.

Key fields:

- id
- userId
- title
- company
- rawText
- parsedRequirementsJson
- requiredSkills
- responsibilities
- createdAt
- updatedAt
- deletedAt, if soft deletion is used

### PracticeSession

Represents one simulated interview.

Key fields:

- id
- userId
- resumeId
- targetRoleId
- mode
- difficulty
- status
- testPreviewJson
- followUpCapReached (bool)
- startedAt
- completedAt
- createdAt
- updatedAt

### InterviewTurn

Represents one question, answer, follow-up, or interviewer response.

Key fields:

- id
- practiceSessionId
- turnType
- questionText
- answerText
- answerAudioUrl, if stored
- transcriptionStatus
- evidenceFocus
- relatedResumeClaimId
- relatedTargetRequirementId
- followUpIndex
- orderIndex
- qualityState (normal | degradedInput)
- createdAt

### AnswerEvaluation

Represents structured assessment of a user answer.

Key fields:

- id
- practiceSessionId
- interviewTurnId
- rubricVersion
- overallReadinessSignal
- claimDefenseIssues
- missingMetrics
- strengths
- improvements
- evidence
- confidenceScore
- createdAt

### PerformanceReport

Represents the post-session coaching artifact.

Key fields:

- id
- practiceSessionId
- summary
- overallReadiness
- strongestAnswerId
- weakestAnswerId
- transcriptHighlights
- improvedAnswerRewrites
- practicePlan
- createdAt

### PracticeDrill

Represents a concrete recommended exercise after a session.

Key fields:

- id
- userId
- practiceSessionId
- focusArea
- instructions
- status
- createdAt
- completedAt

## 9. AI Behavior Requirements

### Resume and Target-Role Extraction

- Extract project claims, skills, experience, responsibilities, and requirements.
- Identify vague resume claims worth probing.
- Identify missing metrics or weak evidence in resume claims.
- Track extraction confidence per claim and per requirement on 0-1 confidence scale.
- Trigger extraction review when confidence < 0.78, contradictions occur, or required fields are missing.
- Persist extraction uncertainty flags for user-visible review.

### Interview Planning

- Build a five-question technical project deep-dive.
- Ground questions in the user's resume and target role.
- Prioritize vague resume claims, missing metrics, personal ownership, implementation detail, and tradeoffs.
- Produce a concise test preview before the session starts.

### Interviewer Behavior

- Act like a direct, skeptical, professional virtual interviewer.
- Let the user answer by speaking, then use the transcript for follow-ups and evaluation.
- Pressure the answer, not the person.
- Ask evidence-seeking questions.
- Use adaptive follow-up pressure when an answer is vague or unsupported.
- Ask for:
  - personal contribution
  - implementation details
  - tradeoffs
  - baselines
  - measured results
  - role relevance
- Never insult, shame, or belittle the user.
- Never diagnose personality.
- Never infer protected traits.
- Never claim the user is employable or unemployable.
- Never make hiring recommendations.
- Never expose chain-of-thought or internal reasoning.
- Stop follow-up escalation if user gives two failed responses and progress to next primary question.

#### Trigger definitions (must be explicit)

- Vague claim trigger: no ownership verb, no artifact name/version, no concrete implementation reasoning, or an answer without specifics after 12 seconds of response time.
- Missing-metrics trigger: claim includes outcome language without a numeric baseline, period, scale, or validation method.
- Role-fit trigger: answer omits a required capability currently in the parsed role requirements.
- Follow-up necessity threshold: trigger only if evidence relevance confidence is at least 0.72.

### Answer Evaluation

- Evaluate answer quality against a mode-specific rubric.
- Keep evaluation specific, fair, and grounded in transcript evidence.
- Prefer actionable feedback over judgment.
- Identify claim-defense issues and missing metrics.
- Explain the evidence behind feedback.
- Avoid generic advice like "be more confident" unless tied to a concrete behavior.
- Output should include evidence-linked references to the transcript and extracted context.
- Never fabricate achievements, metrics, or project details.

### Report Generation

- Summarize the session in student-facing coaching language.
- Generate improved answer rewrites without fabricating achievements.
- Recommend one or more practice drills tied to observed weaknesses.
- Keep overall readiness framed as preparation quality, not hireability.

## 10. Privacy and Data Handling Requirements

Companion handles sensitive career data. MVP privacy requirements are mandatory:

- Require sign-in for saved history.
- Keep resumes, target roles, transcripts, reports, and practice drills private by default.
- Do not provide public sharing by default.
- Provide deletion controls for resumes and practice sessions.
- Do not train on user data.
- Minimize logging of raw resumes and transcripts.
- Redact sensitive values in debugging logs where possible.
- Store only what is necessary for saved history and product usefulness.
- Never commit real resumes, transcripts, or user data to the repository.
- Do not evaluate protected traits.
- Do not score facial appearance, body language, accent, race, gender, age, disability, religion, health, politics, sexuality, or other sensitive attributes.
- Store raw resume and transcript text encrypted at rest.
- Exclude raw resume, role text, and transcript from analytics/telemetry by default.
- Keep answer audio only when needed for transcription recovery; expire by default within 30 days unless user extends.
- Preserve deletion intent and audit event for user-initiated deletions (soft-delete timestamp is acceptable in MVP).

## 11. UX Requirements

### Overall Feel

- Desktop-first.
- Calm, polished, focused, and slightly high-pressure.
- More like an interview workspace than a playful study app or generic SaaS dashboard.
- Mobile should remain usable for report review and short practice, but not drive MVP design.

### Dashboard

- "Start practice" is dominant.
- Saved history appears below after it exists.
- Empty state invites resume upload and target-role paste.

### Setup

- Use meaningful progress states instead of generic spinners.
- Show extraction review when uncertainty exists.
- Show test preview before entering the session.
- Show explicit reason text for uncertainty instead of a binary pass/fail.

### Interview Room

- Speech-first experience with interviewer presence.
- Include interviewer panel, microphone controls, answer transcription, transcript timeline, and subtle evidence panel.
- Let users correct transcription errors before submitting an answer when needed.
- Evidence panel should show current focus and relevant snippet, not internal reasoning.
- Keep the session bounded and clear.
- On degraded input (retries exhausted), switch to a compact recovery layout that keeps interviewer context visible.

### Error States

- Resume upload failure should explain accepted formats and let users retry or paste text.
- Target-role parsing failure should let users edit or paste a clearer role description.
- Microphone permission failure should explain how to grant access and offer typed fallback for recovery.
- Transcription failure should show confidence score and suggest re-record vs typed correction.
- AI response failure should offer retry without losing the session state.
- Report generation failure should preserve transcript and allow regeneration.
- Auth/session expiry should preserve unsaved setup data where feasible.

### Success States

- Extraction success leads to test preview.
- Session completion leads directly to report generation.
- Report success highlights what the user should do next.

## 12. Report Requirements

The performance report must communicate value within 30 seconds.

Required sections:

1. Overall readiness for the selected technical project deep-dive.
2. Claim-defense issues.
3. Missing metrics/results.
4. Strongest answer.
5. Weakest answer.
6. Transcript highlights.
7. Improved answer rewrites.
8. Next practice drill.

The report should avoid chart overload in the first version. Use charts only when they improve comprehension.

The report must not:

- Predict whether the user will get hired.
- Rank the user against other candidates.
- Claim to verify whether a project was truly completed.
- Fabricate achievements, metrics, or experience.

## 13. Success Metrics

Primary MVP success signals:

- First-session completion rate.
- Report viewed.
- At least one improved answer read.
- Practice drill started.
- Repeat practice session within 7 days.

Supporting quality metrics:

- Extraction review completion rate.
- Percentage of sessions with at least one live challenge moment.
- User rating of feedback usefulness.
- User rating of interview realism.
- Number of sessions abandoned during setup.
- Number of sessions abandoned during the interview room.
- Report regeneration or error rate.
- P95 setup-to-report time <= 20 minutes.

## 14. Risks and Mitigations

### Risk: Poor Evaluation Quality

If answer evaluations are generic, unfair, or poorly grounded, users will not trust Companion.

Mitigations:

- Require structured evaluations tied to transcript evidence.
- Version rubrics and prompts.
- Test against fixture transcripts for strong answers, vague answers, missing metrics, unclear ownership, and shallow technical explanations.
- Prefer specific feedback and improved answer rewrites over broad scores.

### Risk: Poor Extraction Quality

Bad resume or target-role extraction will produce bad questions and bad follow-ups.

Mitigations:

- Use extraction confidence with explicit threshold.
- Show extraction review before sessions.
- Allow users to edit extracted claims and requirements.
- Test extraction with varied student resumes and internship descriptions.

### Risk: Speech-First Room Feels Unreliable

If microphone capture or transcription feels unreliable, users may lose trust before the interview becomes useful.

Mitigations:

- Use clear microphone states, retry controls, transcript correction, interviewer panel, speaking states, transcript timeline, and subtle evidence panel.
- Keep session rhythm bounded and interview-like.
- Use direct interviewer copy and evidence-seeking follow-ups.

### Risk: Scope Creep

Fully realtime two-way voice conversation, avatar, coding editor, and multiple modes could overwhelm MVP.

Mitigations:

- Enforce the technical project deep-dive ADR.
- Keep animated avatar, fully realtime two-way voice conversation, coding editor, and additional modes out of MVP.
- Measure success on the core practice loop first.

### Risk: Privacy Trust

Students may hesitate to upload resumes or transcripts.

Mitigations:

- Make privacy promises visible.
- Require sign-in for saved history.
- Provide deletion controls.
- Avoid public sharing by default.
- Avoid unnecessary raw-data logging.

### Risk: Prompt Drift and Safety Violations

The interviewer may produce prohibited claims or unsafe output due to prompt drift.

Mitigations:

- Enforce strict system-level safety instructions for each model call.
- Schema-validate every AI output; safe-fail invalid outputs.
- Unit tests for forbidden outputs (employability statements, protected trait inferences, insults).

## 15. Testing Strategy

Because there is not yet production code, this PRD proposes testing seams at the highest product boundaries:

### Highest-Seam Tests

- Guided setup from resume and target role to test preview.
- Practice session from first question through final answer.
- Speech capture and transcription through answer submission.
- Report generation from completed transcript and answer evaluations.
- Deletion flow for sensitive artifacts.

### Domain Logic Tests

- Resume extraction identifies vague claims.
- Target-role extraction identifies requirements.
- Interview planner creates five primary questions for technical project deep-dive.
- Follow-up selector triggers adaptive follow-up pressure for vague claims and missing metrics.
- Answer evaluation produces transcript-grounded feedback.
- Report generator includes required sections and avoids hiring claims.
- Follow-up cap prevents >2 follow-ups on one primary question.

### AI Contract Tests

- All AI outputs consumed by code must be schema-validated.
- Invalid AI JSON should trigger safe retry or recoverable error states.
- Prompt fixtures should cover:
  - strong answer with metrics
  - vague answer without ownership
  - missing result
  - shallow technical explanation
  - answer unrelated to target role
  - user admits uncertainty appropriately
  - low-confidence ASR scenarios

### UX Flow Tests

- First empty dashboard shows "Start practice" dominantly.
- Setup loading shows interview preparation states.
- Uncertain extraction shows extraction review.
- Test preview appears before the session.
- Microphone permission, recording, transcription, retry, and transcript correction states work.
- Evidence panel shows focus and snippet without internal reasoning.
- Report communicates core insights quickly and clearly.

### Privacy and Safety Tests

- Users cannot access other users' resumes, target roles, sessions, transcripts, or reports.
- Deletion controls remove or mark sensitive artifacts according to the data retention design.
- Logs do not contain full raw resumes or transcripts in normal operation.
- Evaluation and report copy do not include hiring recommendations, protected-trait inference, insults, or employability claims.

## 16. Acceptance Criteria for MVP

The MVP is accepted when:

1. A user can sign in.
2. A user can create and save multiple resumes.
3. A user can create and save multiple target roles.
4. A user can start a technical project deep-dive from one resume and one target role.
5. The system extracts project claims and target-role requirements.
6. The system shows extraction review when extraction confidence is low or parsing is conflicting.
7. The system shows a test preview before the session.
8. The system runs a five-question speech-first practice session with max 10 turns.
9. Each primary question allows no more than one or two adaptive follow-ups.
10. The system creates at least one live challenge moment for vague resume claims in controlled test cases.
11. The system creates at least one live challenge moment for missing metrics/results in controlled test cases.
12. The interview room includes an interviewer panel, microphone controls, answer transcription, transcript timeline, and subtle evidence panel.
13. The evidence panel shows current probing focus and relevant snippet without exposing internal reasoning.
14. Interview turns and answer evaluations are stored with required traceability IDs.
15. The system generates a performance report after session completion.
16. The report includes required sections and no employability or hiring claims.
17. The user can view and navigate saved history.
18. The user can delete resumes, roles, sessions, and reports.
19. Raw resumes/transcripts are not logged as full payloads in normal app telemetry/logging.
20. The product has defined loading, empty, error, and success states for the main flow.
21. The MVP works on desktop and remains usable on mobile for report reading.
22. No payment or subscription flow exists.
23. MVP feature scope excludes fully realtime two-way voice, animated avatar, coding editor, video analysis, facial/body-language scoring, employer workflow, public sharing, career-center admin, and multi-user mock interviews.
24. Interviewing stays speech-first, with text mode allowed only for recovery and marked to user.

## Open Questions / Assumptions

- Assumption: The MVP will use a web app architecture, likely with TypeScript-first frontend and shared types, but this PRD does not mandate a specific framework.
- Assumption: The first implementation should test at high product seams because there is no existing application code yet.
- Assumption: "Target role" is the canonical term for pasted job descriptions and selected role descriptions.
- Assumption: Difficulty can exist as a field, but MVP should not expose difficulty as a high-friction initial choice.
- Assumption: Saved history requires persistent auth and database storage from MVP.
- Assumption: Users answer by speaking in the MVP; typed answer entry remains only as an accessibility and recovery fallback for microphone or transcription failures.
- Open question: Should deletion be immediate hard delete or soft delete with short retention?
- Open question: Which resume formats are supported first: PDF only, PDF + DOCX, or paste-first?
- Open question: Should extracted claim edits in review be persisted as a permanent user edit or session-only for the current run?
- Open question: What exact rubric scale should answer evaluations use in the UI: numeric score, qualitative labels, or both?
