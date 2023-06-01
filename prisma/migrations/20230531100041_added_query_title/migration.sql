-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SaveQuery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "queryTitle" TEXT NOT NULL DEFAULT '',
    "queryText" TEXT NOT NULL,
    "queryParameter" TEXT NOT NULL DEFAULT '',
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "SaveQuery_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SaveQuery" ("id", "ownerId", "queryParameter", "queryText") SELECT "id", "ownerId", "queryParameter", "queryText" FROM "SaveQuery";
DROP TABLE "SaveQuery";
ALTER TABLE "new_SaveQuery" RENAME TO "SaveQuery";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
