-- Create RPC function to append to JSONB array
CREATE OR REPLACE FUNCTION append_to_jsonb_array(input_array JSONB, new_element JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN COALESCE(input_array, '[]'::jsonb) || jsonb_build_array(new_element);
END;
$$;

-- Create TutorProfile table if not exists
CREATE TABLE IF NOT EXISTS public."TutorProfile" (
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  "firstName" TEXT,
  "lastName" TEXT,
  "phone" TEXT,
  "nationality" TEXT,
  "highestQualification" TEXT,
  "modeOfTeaching" TEXT DEFAULT 'Online',
  "expectedFeePerHour" INTEGER,
  "hasPrivateTutorLicense" BOOLEAN DEFAULT false,
  "emirateId" TEXT,
  "subjects" TEXT[] DEFAULT '{}',
  "areas" TEXT[] DEFAULT '{}',
  "bio" TEXT,
  "availability" JSONB DEFAULT '[]',
  "location" JSONB DEFAULT '{"currentLocationURL": "", "mapLocation": []}',
  "licenseDocumentUrl" TEXT,
  "applicationStatus" TEXT DEFAULT 'DRAFT',
  "applicationHistory" JSONB DEFAULT '[]',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."TutorProfile" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all inserts on TutorProfile" ON public."TutorProfile";
DROP POLICY IF EXISTS "Allow users to manage own profile" ON public."TutorProfile";

-- Create policy: users can insert/update their own profile
CREATE POLICY "Users can manage own TutorProfile"
  ON public."TutorProfile"
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- Allow service role full access
CREATE POLICY "Service role can manage TutorProfile"
  ON public."TutorProfile"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);