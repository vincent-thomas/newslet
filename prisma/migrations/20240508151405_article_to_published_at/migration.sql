/*
  Warnings:

  - Changed the type of `published_at` on the `article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "published_at",
ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL;
