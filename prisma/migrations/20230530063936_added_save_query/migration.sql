-- CreateTable
CREATE TABLE "SaveQuery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "queryText" TEXT NOT NULL,
    "queryParameter" TEXT NOT NULL DEFAULT '',
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "SaveQuery_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
