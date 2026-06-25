const { supabaseAdmin, supabase } = require('../config/supabaseClient');

class QuizService {
  async getQuestionsByGroup(group) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('question_group', group)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
      
    if (error) throw error;
    return data;
  }

  async createQuestion(questionData) {
    const { data, error } = await supabaseAdmin
      .from('quiz_questions')
      .insert([questionData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateQuestion(id, questionData) {
    const { data, error } = await supabaseAdmin
      .from('quiz_questions')
      .update(questionData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteQuestion(id) {
    const { error } = await supabaseAdmin
      .from('quiz_questions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = new QuizService();
