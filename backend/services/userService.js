const { supabaseAdmin } = require('../config/supabaseClient');

class UserService {
  async updateProfile(userId, profileData) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getHistory(userId) {
    const { data, error } = await supabaseAdmin
      .from('quiz_attempts')
      .select(`
        *,
        recommendations (
          *,
          laptops (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFavorites(userId) {
    const { data, error } = await supabaseAdmin
      .from('favorite_laptops')
      .select(`
        id,
        laptop_id,
        created_at,
        laptops (
          id,
          name,
          brand,
          price,
          cpu,
          ram,
          ssd,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFavoriteIds(userId) {
    const { data, error } = await supabaseAdmin
      .from('favorite_laptops')
      .select('laptop_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async addFavorite(userId, laptopId) {
    const { data, error } = await supabaseAdmin
      .from('favorite_laptops')
      .insert([{ user_id: userId, laptop_id: laptopId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async removeFavorite(userId, laptopId) {
    const { error } = await supabaseAdmin
      .from('favorite_laptops')
      .delete()
      .eq('user_id', userId)
      .eq('laptop_id', laptopId);
    if (error) throw error;
    return true;
  }
}

module.exports = new UserService();
