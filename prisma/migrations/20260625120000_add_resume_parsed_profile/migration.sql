-- AddColumn: extracted resume profile (ResumeProfilerAgent output), JSONB.
ALTER TABLE "Resume" ADD COLUMN "parsedProfile" JSONB;
