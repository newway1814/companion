-- CreateEnum
CREATE TYPE "InterviewTurnSpeaker" AS ENUM ('INTERVIEWER', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "InterviewTurnKind" AS ENUM ('QUESTION', 'ANSWER', 'FOLLOW_UP');

-- CreateTable
CREATE TABLE "InterviewTurn" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "speaker" "InterviewTurnSpeaker" NOT NULL,
    "kind" "InterviewTurnKind" NOT NULL,
    "content" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewTurn_sessionId_idx" ON "InterviewTurn"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewTurn_questionId_idx" ON "InterviewTurn"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewTurn_sessionId_orderIndex_key" ON "InterviewTurn"("sessionId", "orderIndex");

-- AddForeignKey
ALTER TABLE "InterviewTurn" ADD CONSTRAINT "InterviewTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTurn" ADD CONSTRAINT "InterviewTurn_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS deny-by-default (not readable via Supabase public REST API).
ALTER TABLE "InterviewTurn" ENABLE ROW LEVEL SECURITY;
