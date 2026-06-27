-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,
    "codeId" TEXT NOT NULL,
    CONSTRAINT "Guest_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("codeId", "firstName", "id", "lastName", "submittedAt") SELECT "codeId", "firstName", "id", "lastName", "submittedAt" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_codeId_key" ON "Guest"("codeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
