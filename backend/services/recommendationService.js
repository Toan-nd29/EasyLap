const { supabaseAdmin } = require('../config/supabaseClient');
const { calculateScore } = require('../utils/scoreCalculator');
const { generateMatchReasons, generateTradeOffs } = require('../utils/generateReasons');
const { generateRecommendedConfig, generateSummary } = require('../utils/generateConfig');
const { parseBudgetRange } = require('../utils/budget');

class RecommendationService {
  async processRecommendation(userId, data) {
    const { commonAnswers, specificAnswers } = data;
    const { userGroup, budget } = commonAnswers;

    // 1. Lấy tất cả laptop active
    const budgetRange = parseBudgetRange(budget);
    let laptopQuery = supabaseAdmin.from('laptops').select('*');

    if (budgetRange) {
      laptopQuery = laptopQuery.gte('price', budgetRange.minVnd);
      if (budgetRange.maxVnd !== null) {
        laptopQuery = laptopQuery.lte('price', budgetRange.maxVnd);
      }
    }

    const { data: laptops, error: laptopError } = await laptopQuery;

    if (laptopError) throw laptopError;

    // 2. Tính điểm cho từng laptop
    const scoredLaptops = laptops.map(laptop => {
      const finalScore = calculateScore(laptop, commonAnswers, specificAnswers);
      return {
        ...laptop,
        finalScore
      };
    });

    // 3. Sắp xếp theo điểm giảm dần và lấy top 5
    scoredLaptops.sort((a, b) => b.finalScore - a.finalScore);
    const topLaptops = scoredLaptops.slice(0, 5);

    // 4. Tạo recommended config và summary
    const config = generateRecommendedConfig(userGroup, { commonAnswers, specificAnswers });
    const summary = generateSummary(userGroup, { commonAnswers, specificAnswers }, config);

    // 5. Lưu vào bảng quiz_attempts
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('quiz_attempts')
      .insert([{
        user_id: userId,
        user_group: userGroup,
        common_answers: commonAnswers,
        specific_answers: specificAnswers || {},
        summary,
        recommended_config: config
      }])
      .select()
      .single();

    if (attemptError) throw attemptError;

    // 6. Lưu vào bảng recommendations và tạo reasons
    const results = [];
    const recommendationsData = topLaptops.map(laptop => {
      const matchReasons = generateMatchReasons(laptop, { commonAnswers, specificAnswers }, laptop.finalScore);
      const tradeOffs = generateTradeOffs(laptop, { commonAnswers, specificAnswers });

      results.push({
        id: laptop.id,
        name: laptop.name,
        brand: laptop.brand,
        price: laptop.price,
        finalScore: laptop.finalScore,
        matchReasons,
        tradeOffs,
        laptop
      });

      return {
        quiz_attempt_id: attempt.id,
        user_id: userId,
        laptop_id: laptop.id,
        final_score: laptop.finalScore,
        match_reasons: matchReasons,
        trade_offs: tradeOffs
      };
    });

    if (recommendationsData.length > 0) {
      const { error: recsError } = await supabaseAdmin
        .from('recommendations')
        .insert(recommendationsData);

      if (recsError) throw recsError;
    }

    return {
      quizAttemptId: attempt.id,
      userGroup,
      summary,
      recommendedConfig: config,
      recommendations: results
    };
  }
}

module.exports = new RecommendationService();
