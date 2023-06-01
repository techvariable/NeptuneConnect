-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Permission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserRole" ("id", "roleId", "userId") SELECT "id", "roleId", "userId" FROM "UserRole";
DROP TABLE "UserRole";
ALTER TABLE "new_UserRole" RENAME TO "UserRole";
CREATE TABLE "new_QueryLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "queryText" TEXT NOT NULL,
    "queryParameter" TEXT NOT NULL DEFAULT '',
    "queryResult" TEXT NOT NULL,
    "queryStatus" INTEGER NOT NULL,
    "isCustomQuery" BOOLEAN NOT NULL DEFAULT false,
    "timeOfExecution" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeTaken" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "QueryLog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QueryLog" ("id", "isCustomQuery", "ownerId", "queryParameter", "queryResult", "queryStatus", "queryText", "timeOfExecution", "timeTaken") SELECT "id", "isCustomQuery", "ownerId", "queryParameter", "queryResult", "queryStatus", "queryText", "timeOfExecution", "timeTaken" FROM "QueryLog";
DROP TABLE "QueryLog";
ALTER TABLE "new_QueryLog" RENAME TO "QueryLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
