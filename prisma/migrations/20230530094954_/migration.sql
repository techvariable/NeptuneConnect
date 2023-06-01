/*
  Warnings:

  - A unique constraint covering the columns `[recipientEmail]` on the table `ResetPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_recipientEmail_key" ON "ResetPassword"("recipientEmail");
