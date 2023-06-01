-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "QueryLog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QueryLog" ("id", "ownerId", "queryParameter", "queryResult", "queryStatus", "queryText", "timeOfExecution", "timeTaken") SELECT "id", "ownerId", "queryParameter", "queryResult", "queryStatus", "queryText", "timeOfExecution", "timeTaken" FROM "QueryLog";
DROP TABLE "QueryLog";
ALTER TABLE "new_QueryLog" RENAME TO "QueryLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
