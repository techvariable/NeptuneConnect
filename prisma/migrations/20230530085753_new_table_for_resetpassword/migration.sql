-- CreateTable
CREATE TABLE "ResetPassword" (
    "resetPasswordId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipientEmail" TEXT NOT NULL,
    "hashedPassKey" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_recipientEmail_key" ON "ResetPassword"("recipientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_hashedPassKey_key" ON "ResetPassword"("hashedPassKey");
