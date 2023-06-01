/*
  Warnings:

  - You are about to drop the column `status` on the `Invitation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invitation" (
    "invitationId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipientEmail" TEXT NOT NULL,
    "hashedPassKey" TEXT NOT NULL
);
INSERT INTO "new_Invitation" ("hashedPassKey", "invitationId", "recipientEmail") SELECT "hashedPassKey", "invitationId", "recipientEmail" FROM "Invitation";
DROP TABLE "Invitation";
ALTER TABLE "new_Invitation" RENAME TO "Invitation";
CREATE UNIQUE INDEX "Invitation_recipientEmail_key" ON "Invitation"("recipientEmail");
CREATE UNIQUE INDEX "Invitation_hashedPassKey_key" ON "Invitation"("hashedPassKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
