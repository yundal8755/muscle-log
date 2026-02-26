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

-- Insert default user for existing workout
INSERT INTO "users" ("email", "password", "name", "updatedAt") 
VALUES ('default@example.com', '$2b$10$YourHashedPasswordHere', 'Default User', CURRENT_TIMESTAMP);

-- AlterTable: Add userId column as nullable first
ALTER TABLE "workout" ADD COLUMN "userId" INTEGER;

-- Update existing workout with default user id
UPDATE "workout" SET "userId" = (SELECT id FROM "users" WHERE email = 'default@example.com');

-- Make userId NOT NULL
ALTER TABLE "workout" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

