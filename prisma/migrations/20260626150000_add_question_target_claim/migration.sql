-- AddColumn: the resume claim each question pressure-tests (shown as target claim).
ALTER TABLE "InterviewQuestion" ADD COLUMN "targetClaim" TEXT NOT NULL DEFAULT '';
