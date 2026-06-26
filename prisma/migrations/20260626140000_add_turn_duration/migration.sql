-- AddColumn: answer length in seconds (candidate answer turns); null otherwise.
ALTER TABLE "InterviewTurn" ADD COLUMN "durationSeconds" INTEGER;
