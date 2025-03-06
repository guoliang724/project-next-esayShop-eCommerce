/*
  Warnings:

  - You are about to drop the column `star` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "star",
ADD COLUMN     "rating" DECIMAL(3,2) NOT NULL DEFAULT 0;
