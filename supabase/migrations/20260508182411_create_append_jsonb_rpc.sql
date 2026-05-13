-- Create RPC function to append to JSONB array
CREATE OR REPLACE FUNCTION append_to_jsonb_array(input_array JSONB, new_element JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN COALESCE(input_array, '[]'::jsonb) || jsonb_build_array(new_element);
END;
$$;