/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Article";

-- CreateTable
CREATE TABLE "article" (
    "article_id" TEXT NOT NULL,
    "published_at" INTEGER NOT NULL,
    "article_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("article_id")
);
