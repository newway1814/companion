-- CreateTable
CREATE TABLE "FeedbackReport" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "readinessBand" TEXT NOT NULL,
    "readinessScore" INTEGER NOT NULL,
    "reportJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackReport_sessionId_key" ON "FeedbackReport"("sessionId");

-- AddForeignKey
ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS deny-by-default (not readable via Supabase public REST API).
ALTER TABLE "FeedbackReport" ENABLE ROW LEVEL SECURITY;
