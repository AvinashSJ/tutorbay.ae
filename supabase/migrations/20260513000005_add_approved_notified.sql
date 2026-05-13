-- Add approvedNotified column to TutorProfile for first-time approval card tracking
ALTER TABLE "TutorProfile" ADD COLUMN "approvedNotified" BOOLEAN DEFAULT FALSE;
