/*
  Warnings:

  - Added the required column `userId` to the `workouts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Insert default user for existing workouts
INSERT INTO "users" ("email", "password", "name", "updatedAt") 
VALUES ('default@example.com', '$2b$10$YourHashedPasswordHere', 'Default User', CURRENT_TIMESTAMP);

-- AlterTable: Add userId column as nullable first
ALTER TABLE "workouts" ADD COLUMN "userId" INTEGER;

-- Update existing workouts with default user id
UPDATE "workouts" SET "userId" = (SELECT id FROM "users" WHERE email = 'default@example.com');

-- Make userId NOT NULL
ALTER TABLE "workouts" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

