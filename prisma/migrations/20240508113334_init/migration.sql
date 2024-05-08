-- CreateTable
CREATE TABLE "Article" (
    "articleId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "articleUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("articleId")
);
