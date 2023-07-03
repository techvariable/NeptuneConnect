-- CreateTable
CREATE TABLE "DemoVisitEmail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "timeOfVisit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoVisitEmail_email_key" ON "DemoVisitEmail"("email");
