import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrhezbxqfhfvsjokigzd.supabase.co';
const supabaseKey = 'sb_publishable_as9bg_N6nrPBaohy8BnCuA_ayOipJWN';

export const supabase = createClient(supabaseUrl, supabaseKey);
