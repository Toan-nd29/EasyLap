const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

// Client for general operations (using anon key)
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Client for admin operations (using service role key)
// Warning: Never expose service role key to frontend!
const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = {
  supabase,
  supabaseAdmin
};
