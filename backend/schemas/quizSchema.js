const { z } = require('zod');

const quizSchema = z.object({
  body: z.object({
    question_key: z.string().min(1),
    question: z.string().min(1),
    question_group: z.string().min(1),
    type: z.enum(['single', 'multiple']),
    options: z.array(z.any()).min(1),
    display_order: z.number().optional(),
    is_active: z.boolean().optional()
  })
});

module.exports = {
  quizSchema
};
