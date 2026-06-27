const { supabaseAdmin } = require('../config/supabaseClient');

const LAPTOP_LIST_COLUMNS = [
  'id',
  'name',
  'brand',
  'price',
  'cpu',
  'ram',
  'ssd',
  'gpu',
  'gpu_type',
  'screen',
  'weight',
  'warranty',
  'upgradeable',
  'image_url',
  'created_at'
].join(', ');

class LaptopService {
  async getAll(query) {
    const {
      search,
      brand,
      minPrice,
      maxPrice,
      minRam,
      minSsd,
      gpuType,
      dedicatedGpu,
      userGroup,
      tag,
      sort,
      page = 1,
      limit = 20
    } = query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 20);

    let queryBuilder = supabaseAdmin.from('laptops').select(LAPTOP_LIST_COLUMNS, { count: 'exact' });

    if (search) {
      queryBuilder = queryBuilder.ilike('name', `%${search}%`);
    }
    if (brand) {
      queryBuilder = queryBuilder.ilike('brand', `%${brand}%`);
    }
    if (minPrice) {
      queryBuilder = queryBuilder.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.lte('price', parseInt(maxPrice));
    }
    if (minRam) {
      queryBuilder = queryBuilder.gte('ram', parseInt(minRam));
    }
    if (minSsd) {
      queryBuilder = queryBuilder.gte('ssd', parseInt(minSsd));
    }
    if (gpuType) {
      queryBuilder = queryBuilder.eq('gpu_type', gpuType);
    }
    if (dedicatedGpu !== undefined) {
      queryBuilder = queryBuilder.eq('dedicated_gpu', dedicatedGpu === 'true');
    }
    if (userGroup) {
      queryBuilder = queryBuilder.contains('suitable_for', [userGroup]);
    }
    if (tag) {
      queryBuilder = queryBuilder.contains('tags', [tag]);
    }

    // Sort
    if (sort) {
      switch (sort) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('price', { ascending: true });
          break;
        case 'price_desc':
          queryBuilder = queryBuilder.order('price', { ascending: false });
          break;
        case 'ram_desc':
          queryBuilder = queryBuilder.order('ram', { ascending: false });
          break;
        case 'ssd_desc':
          queryBuilder = queryBuilder.order('ssd', { ascending: false });
          break;
        case 'cpu_score_desc':
          queryBuilder = queryBuilder.order('cpu_score', { ascending: false });
          break;
        default:
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (pageNumber - 1) * limitNumber;
    const to = from + limitNumber - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, count, error } = await queryBuilder;
    if (error) throw error;

    return {
      data,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: count || 0,
        totalPages: Math.max(Math.ceil((count || 0) / limitNumber), 1)
      }
    };
  }

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('laptops').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  getFilterOptions() {
    return {
      brands: ["Acer", "ASUS", "Dell", "HP", "Lenovo", "MSI", "Apple", "Samsung", "LG", "Gigabyte"],
      ramOptions: [8, 12, 16, 24, 32, 64],
      ssdOptions: [256, 512, 1000, 1024, 2000, 2048],
      gpuTypes: ["integrated", "dedicated"],
      tags: ["coding", "office", "excel", "design", "gaming", "content_creator", "beginner_friendly", "value_for_money", "lightweight", "battery_good", "touch_screen", "ips_screen", "oled_screen", "upgradeable"]
    };
  }

  async create(laptopData) {
    const { data, error } = await supabaseAdmin.from('laptops').insert([laptopData]).select().single();
    if (error) throw error;
    return data;
  }

  async update(id, laptopData) {
    const { data, error } = await supabaseAdmin.from('laptops').update(laptopData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabaseAdmin.from('laptops').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = new LaptopService();
