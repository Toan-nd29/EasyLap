const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(1, 'Họ tên không được để trống').optional()
  })
});

const favoriteSchema = z.object({
  body: z.object({
    laptop_id: z.string().uuid('ID Laptop không hợp lệ')
  })
});

module.exports = {
  updateProfileSchema,
  favoriteSchema
};
