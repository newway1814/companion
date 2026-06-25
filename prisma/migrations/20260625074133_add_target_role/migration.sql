-- CreateTable
CREATE TABLE "TargetRole" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "status" TEXT,
    "rawText" TEXT NOT NULL,
    "parsedRequirements" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "TargetRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TargetRole_userId_idx" ON "TargetRole"("userId");

-- AddForeignKey
ALTER TABLE "TargetRole" ADD CONSTRAINT "TargetRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS deny-by-default (not readable via Supabase public REST API).
ALTER TABLE "TargetRole" ENABLE ROW LEVEL SECURITY;
