import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { LandingViewed, MarketingAction } from "@/components/marketing/marketing-analytics";

const storyBeats = [
  {
    id: "resume-enters",
    marker: "Resume enters",
    title: "Your experience enters the room.",
    body: "Companion grounds every question in a fictional sample resume and the role being practiced.",
    detail: "Project: campus navigation platform",
  },
  {
    id: "claim-scanned",
    marker: "Claim scanned",
    title: "A claim comes under focus.",
    body: "The practice session isolates one statement that sounds strong but still needs evidence.",
    detail: "“Improved route performance significantly.”",
  },
  {
    id: "question-asked",
    marker: "Question asked",
    title: "The follow-up gets specific.",
    body: "What was the baseline, what changed, and what did you personally implement?",
    detail: "Evidence-seeking question",
  },
  {
    id: "gaps-flagged",
    marker: "Gaps flagged",
    title: "The missing evidence becomes visible.",
    body: "Companion flags unclear ownership and a missing measured result without judging the person.",
    detail: "Ownership missing / Result missing",
  },
  {
    id: "answer-resolves",
    marker: "Answer rebuilt",
    title: "You rebuild the answer with proof.",
    body: "I redesigned the caching layer and measured route response time before and after the change.",
    detail: "Clear action / Measurable result",
  },
] as const;

const workflow = [
  {
    title: "Bring context",
    body: "Add a resume and target role.",
  },
  {
    title: "Practice under pressure",
    body: "Answer five focused questions with adaptive follow-ups.",
  },
  {
    title: "Review the evidence",
    body: "Read rewrites, claim gaps, and one focused practice drill.",
  },
] as const;

function BrandMark() {
  return (
    <span className="flex items-center gap-3 font-semibold tracking-[-0.02em] text-[#f1f0ec]">
      <span
        aria-hidden="true"
        className="relative block size-6 rotate-45 border border-[#ff6a32]"
      >
        <span className="absolute inset-[5px] border border-[#ff6a32]/70" />
      </span>
      Companion
    </span>
  );
}

function StaticEvidenceFrame({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/marketing/evidence-chamber.png"
      alt="A fictional resume positioned beneath an evidence scanner with two orange gap markers"
      fill
      priority={priority}
      sizes="(max-width: 767px) 100vw, 58vw"
      className="object-cover object-[68%_center]"
    />
  );
}

export function MarketingLanding({ scene }: { scene?: ReactNode }) {
  return (
    <div className="marketing-page min-h-full overflow-x-clip bg-[#090a0c] text-[#f1f0ec]">
      <LandingViewed />
      <header className="relative z-20 h-[72px] border-b border-white/10 bg-[#090a0c]/90 backdrop-blur-md">
        <nav
          aria-label="Public navigation"
          className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          <Link href="/" aria-label="Companion home" className="marketing-focus">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-5 sm:gap-8">
            <a
              href="#how-it-works"
              className="marketing-focus hidden text-sm text-[#aaa9a4] transition-colors hover:text-[#f1f0ec] sm:block"
            >
              How it works
            </a>
            <MarketingAction
              href="/sign-in"
              intent="primary"
              className="marketing-focus whitespace-nowrap border border-[#ff6a32] bg-[#ff6a32] px-4 py-2 text-sm font-semibold text-[#1b0b05] transition-transform hover:-translate-y-0.5 active:translate-y-px"
            >
              Start practicing
            </MarketingAction>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1440px] items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-12">
          <div className="relative z-10 max-w-[620px]">
            <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#ff8a5e]">
              Interview practice that pushes back
            </p>
            <h1
              aria-label="Defend the work behind your resume."
              className="font-heading text-[clamp(3rem,4.7vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.055em]"
            >
              <span className="block lg:whitespace-nowrap">Defend the work</span>
              <span className="block lg:whitespace-nowrap">behind your resume.</span>
            </h1>
            <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-[#aaa9a4] sm:text-lg">
              Companion turns your resume into evidence-seeking practice for software internships and early-career roles.
            </p>
            <MarketingAction
              href="#evidence-story"
              intent="story"
              className="marketing-focus mt-8 inline-flex items-center gap-3 border-b border-[#ff6a32] pb-2 text-sm font-semibold text-[#f1f0ec] transition-colors hover:text-[#ff8a5e]"
            >
              See how it works
            </MarketingAction>
          </div>

          <div className="relative min-h-[42vh] overflow-hidden border border-white/10 bg-[#111318] shadow-[0_35px_100px_rgba(255,90,31,0.08)] sm:min-h-[52vh] lg:min-h-[68vh]">
            <StaticEvidenceFrame priority />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,10,12,0.36),transparent_42%),linear-gradient(0deg,rgba(9,10,12,0.3),transparent_40%)]"
            />
            <div className="absolute bottom-5 left-5 border-l-2 border-[#ff6a32] bg-[#0c0d10]/88 px-4 py-3 backdrop-blur-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#ff8a5e]">
                Sample claim
              </p>
              <p className="mt-1 max-w-[26ch] text-sm text-[#f1f0ec]">
                “Improved route performance significantly.”
              </p>
            </div>
          </div>
        </section>

        <section
          id="evidence-story"
          aria-label="How Companion challenges an answer"
          className="relative border-t border-white/10"
        >
          <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div
              data-scene-pin
              className="relative min-h-[56vh] overflow-hidden border-b border-white/10 bg-[#0d0f12] lg:sticky lg:top-0 lg:h-[100dvh] lg:border-b-0 lg:border-r"
            >
              <StaticEvidenceFrame />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_68%_48%,transparent_0%,rgba(9,10,12,0.14)_44%,rgba(9,10,12,0.88)_100%)]"
              />
              {scene ? (
                <div aria-hidden="true" className="absolute inset-0">
                  {scene}
                </div>
              ) : null}
              <p className="absolute bottom-6 left-6 max-w-[34ch] border-l-2 border-[#ff6a32] pl-4 text-sm leading-relaxed text-[#c8c6bf]">
                The animation mirrors the interview: context enters, evidence is tested, and a stronger answer takes shape.
              </p>
            </div>

            <div className="px-5 sm:px-8 lg:px-12">
              {storyBeats.map((beat, index) => (
                <article
                  key={beat.id}
                  data-story-beat={beat.id}
                  className="story-beat flex min-h-[72vh] flex-col justify-center border-b border-white/10 py-16 last:border-b-0 lg:min-h-[100dvh]"
                >
                  <div className={index % 2 === 0 ? "max-w-[34rem]" : "ml-auto max-w-[31rem]"}>
                    <p className="font-mono text-xs text-[#ff8a5e]">
                      {beat.marker}
                    </p>
                    <h2 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl">
                      {beat.title}
                    </h2>
                    <p
                      className={`mt-6 leading-relaxed ${
                        beat.id === "question-asked"
                          ? "text-xl text-[#f1f0ec] sm:text-2xl"
                          : "text-base text-[#aaa9a4] sm:text-lg"
                      }`}
                    >
                      {beat.body}
                    </p>
                    <p className="mt-8 border-l-2 border-[#ff6a32] pl-4 font-mono text-sm text-[#c8c6bf]">
                      {beat.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-white/10 bg-[#0d0f12] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-[1280px]">
            <h2 className="max-w-[11ch] font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              From context to useful challenge.
            </h2>
            <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-0">
              {workflow.map((item) => (
                <div
                  key={item.title}
                  className="relative pr-8 md:min-h-44 md:border-l md:border-white/15 md:px-8 first:md:border-l-0 first:md:pl-0"
                >
                  <span aria-hidden="true" className="block h-px w-12 bg-[#ff6a32]" />
                  <h3 className="mt-8 font-heading text-2xl font-semibold tracking-[-0.025em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[30ch] leading-relaxed text-[#aaa9a4]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div
            aria-hidden="true"
            className="absolute -right-32 top-1/2 h-px w-[60vw] rotate-[-14deg] bg-gradient-to-r from-transparent via-[#ff6a32]/60 to-transparent"
          />
          <div className="relative mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#ff8a5e]">
                Private by default
              </p>
              <p className="mt-5 max-w-[32ch] leading-relaxed text-[#aaa9a4]">
                Resumes, transcripts, reports, and saved history stay visible only to you unless you choose otherwise.
              </p>
            </div>
            <div>
              <h2 className="max-w-[16ch] text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Pressure the answer. Never the person.
              </h2>
              <p className="mt-7 max-w-[54ch] text-lg leading-relaxed text-[#aaa9a4]">
                Companion is a private practice partner, not a hiring or ranking tool. Build better interview reflexes with questions grounded in your work.
              </p>
              <MarketingAction
                href="/sign-in"
                intent="primary"
                className="marketing-focus mt-9 inline-flex whitespace-nowrap border border-[#ff6a32] bg-[#ff6a32] px-6 py-3 font-semibold text-[#1b0b05] transition-transform hover:-translate-y-0.5 active:translate-y-px"
              >
                Start practicing
              </MarketingAction>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-sm text-[#85847f] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <p>Private interview practice for early-career candidates.</p>
        </div>
      </footer>
    </div>
  );
}
