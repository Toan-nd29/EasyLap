const { z } = require('zod');

const recommendSchema = z.object({
  body: z.object({
    commonAnswers: z.object({
      userGroup: z.string(),
      budget: z.string(),
      mobility: z.string().optional(),
      priorities: z.array(z.string()).optional()
    }).passthrough(),
    specificAnswers: z.record(z.any()).optional()
  })
});

module.exports = {
  recommendSchema
};
