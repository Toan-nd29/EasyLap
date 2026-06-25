const { supabaseAdmin, supabase } = require('../config/supabaseClient');

class AuthService {
  async register(email, password, fullName) {
    // Note: Supabase will automatically create profile via trigger
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      throw profileError;
    }

    return {
      session: data.session,
      user: profile
    };
  }

  async logout(token) {
    // the user token is used by supabase client if we set it, or we can just signOut
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  }
}

module.exports = new AuthService();
