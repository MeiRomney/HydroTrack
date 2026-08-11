-- CreateTable
CREATE TABLE "Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'empty'
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cropType" TEXT NOT NULL,
    "plantedDate" DATETIME NOT NULL,
    "expectedHarvestDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'germinating',
    "channelId" INTEGER NOT NULL,
    CONSTRAINT "Batch_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pH" REAL NOT NULL,
    "ec" REAL NOT NULL,
    "waterTemp" REAL NOT NULL,
    "notes" TEXT,
    "batchId" INTEGER NOT NULL,
    CONSTRAINT "Reading_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Harvest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "harvestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yieldKg" REAL NOT NULL,
    "notes" TEXT,
    "batchId" INTEGER NOT NULL,
    CONSTRAINT "Harvest_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
