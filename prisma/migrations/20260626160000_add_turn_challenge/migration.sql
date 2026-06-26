-- AddColumn: challenge metadata for follow-up turns (reason, weak span, claim, chips).
ALTER TABLE "InterviewTurn" ADD COLUMN "challenge" JSONB;
