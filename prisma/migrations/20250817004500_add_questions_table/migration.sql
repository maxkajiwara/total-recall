-- CreateTable
CREATE TABLE "public"."Question" (
    "id" SERIAL NOT NULL,
    "contextId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_contextId_idx" ON "public"."Question"("contextId");

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "public"."Context"("id") ON DELETE CASCADE ON UPDATE CASCADE;
