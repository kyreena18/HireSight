/*
  # Update Profile Trigger to Handle Role from Metadata
  
  Updates the handle_new_user function to extract role from user metadata
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'candidate')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;