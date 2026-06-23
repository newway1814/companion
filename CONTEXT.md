# Companion

Companion is an AI interview sparring partner that helps candidates practice realistic interviews, receive structured feedback, and improve before real interviews.

## Language

**Companion**:
The product being built in this repo. Companion is a private practice partner for interview preparation, not an automated hiring or candidate-ranking tool.
_Avoid_: InterviewArena

**Practice session**:
A simulated interview between a user and Companion, grounded in the user's resume, target role, selected interview mode, and difficulty.
_Avoid_: Interview, assessment, screening

**User**:
The account holder using Companion to prepare for interviews.
_Avoid_: Candidate record, applicant

**Resume**:
The user's uploaded or entered career document used to identify experience, skills, projects, and claims.
_Avoid_: CV, profile

**Target role**:
The job, internship, or role description the user is preparing for in a practice session.
_Avoid_: Job description, posting

**Saved history**:
The user's stored resumes, target roles, practice sessions, performance reports, and practice drills for reuse and progress review.
_Avoid_: Archive, profile history

**Private-by-default data**:
The product promise that resumes, target roles, transcripts, reports, and saved history are visible only to the user unless they explicitly choose otherwise.
_Avoid_: Shareable profile, public report

**Deletion control**:
The user's ability to delete sensitive career artifacts such as resumes, practice sessions, transcripts, and reports.
_Avoid_: Cleanup, archive

**Interview turn**:
One question, answer, follow-up, or interviewer response inside a practice session transcript.
_Avoid_: Message, chat item

**Answer evaluation**:
The structured assessment of one answer against the selected mode-specific rubric.
_Avoid_: Score, judgment

**Evaluation quality**:
The trustworthiness of Companion's answer evaluation, especially whether feedback is specific, fair, grounded in the transcript, and useful rather than generic.
_Avoid_: AI quality, scoring quality

**University candidate**:
The initial user for Companion: a university student preparing for a job or internship interview.
_Avoid_: Applicant, candidate, interviewee

**Virtual interviewer**:
The AI-led interviewer experience inside a practice session, including spoken questions, follow-ups, pacing, and interviewer-like presence.
_Avoid_: Chatbot, tutor

**Speech-first interview room**:
The MVP live interview experience: an interviewer-style interface where the user answers by speaking, Companion transcribes the answer, and the session keeps interviewer presence without requiring an animated avatar.
_Avoid_: Typed-only interview, chat screen

**Desktop-first MVP**:
The initial product surface optimized for laptop and desktop use, where users can manage resumes, job descriptions, longer answers, and visual reports comfortably.
_Avoid_: Mobile-first app

**Interview workspace**:
Companion's primary UI feel: calm, polished, focused, and slightly high-pressure, with dedicated areas for the interviewer, evidence, transcript, and coaching report.
_Avoid_: Study app, SaaS dashboard, playful app

**Evidence panel**:
A subtle interview-room panel showing the current probing focus and the resume or target-role snippet being tested, without exposing full internal reasoning.
_Avoid_: Sidebar, context panel

**Transcript timeline**:
The chronological record of questions, answers, follow-ups, and notable moments during a practice session.
_Avoid_: Chat log, message list

**Interviewer personality**:
The consistent voice, tone, pacing, and presence that makes Companion feel like a one-on-one interviewer rather than a form or generic assistant.
_Avoid_: Persona, character

**Evidence-seeking question**:
A direct follow-up that asks for concrete support, such as personal contribution, implementation detail, tradeoff, baseline, or measured result.
_Avoid_: Identity judgment, character judgment

**Interviewer avatar**:
The visual representation of the virtual interviewer. It can make the session feel more realistic, but the interview behavior is the core product.
_Avoid_: Character, mascot

**Adaptive follow-up pressure**:
Companion's core differentiator: follow-up questions that challenge vague, unsupported, or shallow answers using the user's resume and target role as evidence.
_Avoid_: Generic feedback, scripted follow-up

**Live challenge moment**:
The in-session moment when Companion detects a weak answer, references a specific resume claim or job requirement, and asks a sharper follow-up while the user is still in interview mode.
_Avoid_: Post-session insight, report highlight

**Vague resume claim**:
A resume statement that sounds impressive but lacks enough detail to explain scope, personal contribution, method, or evidence.
_Avoid_: Weak bullet, generic claim

**Claim defense**:
The user's ability to explain and support a resume or project claim with personal contribution, implementation details, tradeoffs, and measured results.
_Avoid_: Verification, proof

**Claim quality**:
How well a resume or project claim can be supported during a practice session. Companion evaluates claim quality through conversation; it does not prove the student actually did the work.
_Avoid_: Claim verification, authenticity check

**Preparation alternative**:
Any current way a university candidate prepares without Companion, such as friends, career centers, LeetCode, YouTube, ChatGPT roleplay, or generic interview platforms.
_Avoid_: Competitor, replacement

**Personalized adaptive pushback**:
Companion's contrast with preparation alternatives: it challenges the user's actual resume and target role in real time, instead of giving generic questions or passive advice.
_Avoid_: Personalization, adaptive AI

**Guided setup**:
The pre-session flow that turns a resume, target role, interview mode, and difficulty into a focused practice session without requiring the user to write their own prompt.
_Avoid_: Onboarding, configuration

**Start practice**:
The dominant dashboard action that begins the guided setup for a new practice session.
_Avoid_: New session, create interview

**Test preview**:
The short pre-session summary of what Companion plans to test, based on the user's resume, target role, interview mode, and difficulty.
_Avoid_: Interview plan, syllabus

**Extraction review**:
The pre-session confirmation step where the user reviews extracted resume claims and target-role requirements when Companion is uncertain or before building the practice session.
_Avoid_: Parsing error, extracted summary

**Interview preparation state**:
The setup loading experience where Companion explains that it is extracting project claims, matching target-role requirements, and preparing a follow-up strategy.
_Avoid_: Loading spinner, processing state

**Mode-specific rubric**:
The scoring criteria for a practice session based on the chosen interview mode, such as HR, coding, technical deep-dive, or system design.
_Avoid_: Generic rubric, score template

**Missing metric**:
An absent baseline, result, scale, or measurement that prevents a claim from being evaluated concretely.
_Avoid_: Missing number, unquantified impact

**Interview mode**:
The type of interview the university candidate wants to practice, such as HR, technical, coding, or system design.
_Avoid_: Category, template

**Technical project deep-dive**:
The flagship MVP interview mode for software internship preparation, focused on whether the user can defend project claims with ownership, implementation detail, tradeoffs, and measured results.
_Avoid_: General technical interview, coding round

**Five-question session**:
The MVP practice session rhythm: five primary questions designed to finish in roughly 10-12 minutes, with each question allowing one or two adaptive follow-ups.
_Avoid_: Open-ended interview, long-form session

**Pressure Mode**:
A difficulty style that changes Companion's interview pacing and directness while remaining professional, respectful, and safe.
_Avoid_: Stress test, interrogation

**Performance report**:
The post-session feedback artifact that explains answer quality, patterns, strengths, weaknesses, and recommended practice.
_Avoid_: Candidate report, hiring scorecard

**Overall readiness**:
The report's high-level signal for how prepared the user appears for the chosen interview mode and target role, without making hiring predictions.
_Avoid_: Hireability, pass/fail

**Improved answer rewrite**:
A rewritten version of a weak answer that shows how the user could add structure, evidence, ownership, or measured results.
_Avoid_: Perfect answer, model answer

**Practice drill**:
A concrete follow-up exercise recommended after a practice session to improve a specific weakness.
_Avoid_: Homework, next step

**Free MVP**:
The initial version of Companion, offered without payments or subscriptions while the product proves usefulness and retention.
_Avoid_: Paid plan, subscription tier

**Useful challenge**:
A live challenge moment that exposes a concrete weakness the user recognizes as valuable for future interview preparation.
_Avoid_: Engagement, interaction

**Repeat practice**:
A user returning for another practice session after receiving a performance report or practice drill.
_Avoid_: Retention, reactivation
