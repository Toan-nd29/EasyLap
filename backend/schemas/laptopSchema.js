const { z } = require('zod');

const laptopSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    brand: z.string().min(1, 'Hãng không được để trống'),
    price: z.number().positive('Giá phải là số dương'),
    cpu: z.string().min(1, 'CPU không được để trống'),
    cpu_score: z.number().min(0).max(10),
    ram: z.number().positive(),
    ssd: z.number().positive(),
    gpu: z.string().min(1),
    gpu_type: z.string().min(1),
    screen: z.string().min(1),
    screen_score: z.number().min(0).max(10),
    battery_score: z.number().min(0).max(10),
    weight: z.number().positive(),
    warranty: z.string().optional(),
    upgradeable: z.boolean().optional(),
    suitable_for: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    image_url: z.string().optional(),
    shop_url: z.string().optional()
  })
});

module.exports = {
  laptopSchema
};
