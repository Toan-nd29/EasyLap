const { supabaseAdmin } = require('../config/supabaseClient');
const { parseBudgetRange } = require('../utils/budget');

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

const BRAND_ALIASES = {
  mac: 'Apple',
  apple: 'Apple',
  asus: 'ASUS',
  dell: 'Dell',
  hp: 'HP',
  lenovo: 'Lenovo',
  acer: 'Acer',
  lg: 'LG',
  msi: 'MSI',
  gigabyte: 'Gigabyte',
  microsoft: 'Microsoft Surface',
  'microsoft surface': 'Microsoft Surface',
  masstel: 'Masstel',
  samsung: 'Samsung'
};

const USAGE_TAGS = {
  office: ['office', 'excel', 'keyboard_good', 'webcam_good'],
  study_office: ['office', 'excel', 'student_friendly'],
  premium: ['durable', 'battery_good', 'screen_good'],
  gaming: ['gaming', 'gpu_dedicated', 'high_refresh_rate', 'cooling_good'],
  lightweight: ['lightweight', 'portable'],
  design_technical: ['design', 'color_screen', 'screen_good', 'gpu_dedicated'],
  student: ['student_friendly', 'office', 'coding'],
  touch: ['touch_screen'],
  laptop_ai: ['cpu_strong'],
  content_creator: ['content_creator', 'screen_good', 'color_screen']
};

const CPU_FILTERS = {
  core_i3: ['cpu.ilike.%Core i3%', 'cpu.ilike.%i3-%'],
  core_i5: ['cpu.ilike.%Core i5%', 'cpu.ilike.%i5-%'],
  core_i7: ['cpu.ilike.%Core i7%', 'cpu.ilike.%i7-%'],
  core_i9: ['cpu.ilike.%Core i9%', 'cpu.ilike.%i9-%'],
  core_u5: ['cpu.ilike.%Core Ultra 5%', 'cpu.ilike.%Core U5%', 'cpu.ilike.%Core 5%'],
  core_u7: ['cpu.ilike.%Core Ultra 7%', 'cpu.ilike.%Core U7%', 'cpu.ilike.%Core 7%'],
  core_u9: ['cpu.ilike.%Core Ultra 9%', 'cpu.ilike.%Core U9%', 'cpu.ilike.%Core 9%'],
  intel_core_ultra: ['cpu.ilike.%Core Ultra%', 'cpu.ilike.%Core U%'],
  celeron_pentium: ['cpu.ilike.%Celeron%', 'cpu.ilike.%Pentium%'],
  amd_ryzen: ['cpu.ilike.%Ryzen%'],
  amd_ryzen_5: ['cpu.ilike.%Ryzen 5%'],
  amd_ryzen_7: ['cpu.ilike.%Ryzen 7%', 'cpu.ilike.%Ryzen AI 7%'],
  amd_ryzen_9: ['cpu.ilike.%Ryzen 9%', 'cpu.ilike.%Ryzen AI 9%'],
  apple_m2: ['cpu.ilike.%Apple M2%', 'cpu.ilike.%M2%'],
  apple_m3: ['cpu.ilike.%Apple M3%', 'cpu.ilike.%M3%'],
  apple_m4: ['cpu.ilike.%Apple M4%', 'cpu.ilike.%M4%'],
  apple_m5: ['cpu.ilike.%Apple M5%', 'cpu.ilike.%M5%'],
  a18_pro: ['cpu.ilike.%A18 Pro%'],
  qualcomm_snapdragon: ['cpu.ilike.%Qualcomm%', 'cpu.ilike.%Snapdragon%'],
  snapdragon_x_plus: ['cpu.ilike.%Snapdragon X Plus%']
};

const STORAGE_VALUES = {
  32: [32],
  256: [256],
  512: [512],
  1000: [1000, 1024],
  2000: [2000, 2048],
  8000: [8000, 8192]
};

const GPU_FILTERS = {
  onboard: ['gpu_type.eq.integrated'],
  nvidia_geforce: ['gpu.ilike.%NVIDIA%', 'gpu.ilike.%GeForce%', 'gpu.ilike.%RTX%', 'gpu.ilike.%GTX%'],
  amd_radeon: ['gpu.ilike.%AMD Radeon%', 'gpu.ilike.%Radeon%']
};

const SCREEN_SIZE_FILTERS = {
  '13': ['and(inches.gte.12.5,inches.lt.13.8)'],
  '14': ['and(inches.gte.13.8,inches.lt.14.8)'],
  '15_6': ['and(inches.gte.15,inches.lt.16)'],
  '16': ['and(inches.gte.15.9,inches.lt.17)'],
  over_15: ['inches.gte.15']
};

const RESOLUTION_FILTERS = {
  hd: ['x_res.lt.1600'],
  full_hd: [
    'screen.ilike.%Full HD%',
    'screen.ilike.%FHD%',
    'and(x_res.gte.1900,x_res.lt.2000,y_res.gte.1000,y_res.lt.1300)'
  ],
  qhd_2k: ['screen.ilike.%2K%', 'screen.ilike.%QHD%', 'and(x_res.gte.2500,x_res.lt.2900)'],
  wuxga: ['screen.ilike.%WUXGA%', 'and(x_res.eq.1920,y_res.eq.1200)'],
  '2_8k': ['screen.ilike.%2.8K%', 'and(x_res.gte.2800,x_res.lt.3000)'],
  '3k': ['screen.ilike.%3K%', 'and(x_res.gte.2880,x_res.lt.3100)'],
  '3_2k': ['screen.ilike.%3.2K%', 'and(x_res.gte.3100,x_res.lt.3300)'],
  '4k': ['screen.ilike.%4K%', 'screen.ilike.%Ultra HD%', 'x_res.gte.3800'],
  wqxga: ['screen.ilike.%WQXGA%', 'and(x_res.gte.2500,x_res.lt.2700,y_res.gte.1500)'],
  retina: ['screen.ilike.%Retina%'],
  '5k': ['screen.ilike.%5K%', 'x_res.gte.5000']
};

const FEATURE_TAGS = {
  intel_evo: ['battery_good', 'lightweight'],
  intel_gaming: ['gaming', 'high_refresh_rate'],
  battery_good: ['battery_good'],
  lightweight: ['lightweight'],
  upgradeable: ['upgradeable']
};

function toList(value) {
  if (value === undefined || value === null || value === '') return [];
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap(item => String(item).split(','))
    .map(item => item.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeBrand(value) {
  const key = String(value).trim().toLowerCase();
  return BRAND_ALIASES[key] || value;
}

function numericList(values) {
  return unique(values.map(value => Number(value)).filter(value => Number.isFinite(value)));
}

function applyOrFilters(queryBuilder, filters) {
  const safeFilters = unique(filters);
  return safeFilters.length > 0 ? queryBuilder.or(safeFilters.join(',')) : queryBuilder;
}

function option(label, value, meta = {}) {
  return { label, value, ...meta };
}

class LaptopService {
  async getAll(query) {
    const {
      search,
      brand,
      brands,
      priceRange,
      priceRanges,
      minPrice,
      maxPrice,
      minRam,
      minSsd,
      gpuType,
      dedicatedGpu,
      userGroup,
      tag,
      usageNeeds,
      cpuFamilies,
      ramOptions,
      storageOptions,
      gpuFamilies,
      screenSizes,
      resolutionTypes,
      features,
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

    const selectedBrands = unique(toList(brands || brand).map(normalizeBrand));
    if (selectedBrands.length > 0) {
      queryBuilder = queryBuilder.in('brand', selectedBrands);
    }

    const selectedPriceRanges = toList(priceRanges || priceRange);
    if (selectedPriceRanges.length > 0) {
      const ranges = selectedPriceRanges.map(parseBudgetRange).filter(Boolean);
      if (ranges.length > 0) {
        const minVnd = Math.min(...ranges.map(range => range.minVnd));
        const finiteMaxValues = ranges.map(range => range.maxVnd).filter(value => value !== null);
        const maxVnd = finiteMaxValues.length === ranges.length ? Math.max(...finiteMaxValues) : null;

        queryBuilder = queryBuilder.gte('price', minVnd);
        if (maxVnd !== null) {
          queryBuilder = queryBuilder.lte('price', maxVnd);
        }
      }
    } else {
      if (minPrice) {
        queryBuilder = queryBuilder.gte('price', parseInt(minPrice, 10));
      }
      if (maxPrice) {
        queryBuilder = queryBuilder.lte('price', parseInt(maxPrice, 10));
      }
    }

    const selectedRam = numericList(toList(ramOptions));
    if (selectedRam.length > 0) {
      queryBuilder = queryBuilder.in('ram', selectedRam);
    } else if (minRam) {
      queryBuilder = queryBuilder.gte('ram', parseInt(minRam, 10));
    }

    const selectedStorage = unique(toList(storageOptions).flatMap(value => STORAGE_VALUES[value] || [Number(value)]))
      .filter(value => Number.isFinite(value));
    if (selectedStorage.length > 0) {
      queryBuilder = queryBuilder.in('ssd', selectedStorage);
    } else if (minSsd) {
      queryBuilder = queryBuilder.gte('ssd', parseInt(minSsd, 10));
    }

    const selectedGpuFamilies = toList(gpuFamilies);
    if (selectedGpuFamilies.length > 0) {
      queryBuilder = applyOrFilters(queryBuilder, selectedGpuFamilies.flatMap(value => GPU_FILTERS[value] || []));
    } else if (gpuType) {
      queryBuilder = queryBuilder.eq('gpu_type', gpuType);
    }

    if (dedicatedGpu !== undefined) {
      queryBuilder = queryBuilder.eq('dedicated_gpu', dedicatedGpu === 'true');
    }

    if (userGroup) {
      queryBuilder = queryBuilder.contains('suitable_for', [userGroup]);
    }

    const selectedUsageNeeds = toList(usageNeeds);
    const selectedFeatures = toList(features);
    if (selectedUsageNeeds.includes('mac_cto')) {
      queryBuilder = queryBuilder.eq('brand', 'Apple');
    }

    const selectedTags = unique([
      ...toList(tag),
      ...selectedUsageNeeds.flatMap(value => USAGE_TAGS[value] || []),
      ...selectedFeatures.flatMap(value => FEATURE_TAGS[value] || [])
    ]);
    if (selectedTags.length > 0) {
      queryBuilder = queryBuilder.overlaps('tags', selectedTags);
    }

    if (selectedFeatures.includes('touch_screen') || selectedFeatures.includes('two_in_one')) {
      queryBuilder = queryBuilder.eq('touch_screen', true);
    }
    if (selectedFeatures.includes('ips')) {
      queryBuilder = queryBuilder.eq('ips', true);
    }
    if (selectedFeatures.includes('oled')) {
      queryBuilder = queryBuilder.ilike('screen', '%OLED%');
    }
    if (selectedFeatures.includes('upgradeable')) {
      queryBuilder = queryBuilder.eq('upgradeable', true);
    }

    const selectedCpuFamilies = toList(cpuFamilies);
    let cpuFilters = selectedCpuFamilies.flatMap(value => CPU_FILTERS[value] || []);
    if (selectedFeatures.includes('intel_evo') || selectedFeatures.includes('intel_gaming')) {
      cpuFilters = [...cpuFilters, 'cpu.ilike.%Intel%'];
    }
    queryBuilder = applyOrFilters(queryBuilder, cpuFilters);

    queryBuilder = applyOrFilters(
      queryBuilder,
      toList(screenSizes).flatMap(value => SCREEN_SIZE_FILTERS[value] || [])
    );

    queryBuilder = applyOrFilters(
      queryBuilder,
      toList(resolutionTypes).flatMap(value => RESOLUTION_FILTERS[value] || [])
    );

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
      brands: [
        option('Mac', 'Apple'),
        option('ASUS', 'ASUS'),
        option('Lenovo', 'Lenovo'),
        option('Dell', 'Dell'),
        option('HP', 'HP'),
        option('Acer', 'Acer'),
        option('LG', 'LG'),
        option('MSI', 'MSI'),
        option('Gigabyte', 'Gigabyte'),
        option('Microsoft Surface', 'Microsoft Surface'),
        option('Masstel', 'Masstel'),
        option('Samsung', 'Samsung')
      ],
      priceRanges: [
        option('Dưới 10 triệu', 'under-10'),
        option('Từ 10 - 15 triệu', '10-15'),
        option('Từ 15 - 20 triệu', '15-20'),
        option('Từ 20 - 25 triệu', '20-25'),
        option('Từ 25 - 30 triệu', '25-30'),
        option('Trên 30 triệu', 'over-30')
      ],
      usageNeeds: [
        option('Học tập - Văn phòng', 'study_office'),
        option('Cao cấp - Sang trọng', 'premium'),
        option('Mỏng nhẹ', 'lightweight'),
        option('Gaming', 'gaming'),
        option('Đồ họa - Kỹ thuật', 'design_technical'),
        option('Laptop sáng tạo nội dung', 'content_creator'),
        option('Văn phòng', 'office'),
        option('Sinh viên', 'student'),
        option('Cảm ứng', 'touch'),
        option('Laptop AI', 'laptop_ai', { badge: 'HOT' }),
        option('Mac CTO - Nâng cấp theo cách của bạn', 'mac_cto')
      ],
      cpuFamilies: [
        option('Laptop Core i3', 'core_i3'),
        option('Laptop Core i5', 'core_i5'),
        option('Laptop Core i7', 'core_i7'),
        option('Laptop Core i9', 'core_i9'),
        option('Laptop Core U5', 'core_u5'),
        option('Laptop Core U7', 'core_u7'),
        option('Laptop Core U9', 'core_u9'),
        option('Intel Celeron / Pentium', 'celeron_pentium'),
        option('Apple M2', 'apple_m2'),
        option('Apple M3', 'apple_m3'),
        option('Apple M4 Series', 'apple_m4'),
        option('Apple M5 Series', 'apple_m5', { badge: 'MỚI' }),
        option('AMD Ryzen', 'amd_ryzen'),
        option('AMD Ryzen 5', 'amd_ryzen_5'),
        option('AMD Ryzen 7', 'amd_ryzen_7'),
        option('AMD Ryzen 9', 'amd_ryzen_9'),
        option('Intel Core Ultra', 'intel_core_ultra', { badge: 'HOT' }),
        option('Qualcomm Snapdragon', 'qualcomm_snapdragon'),
        option('Snapdragon X Plus', 'snapdragon_x_plus'),
        option('A18 Pro', 'a18_pro', { badge: 'MỚI' })
      ],
      ramOptions: [4, 8, 12, 16, 24, 32, 36, 48, 64, 128].map(value => option(`${value}GB`, value)),
      storageOptions: [
        option('32GB', 32),
        option('256GB', 256),
        option('512GB', 512),
        option('1TB', 1000),
        option('2TB', 2000),
        option('8TB', 8000)
      ],
      gpuFamilies: [
        option('Card Onboard', 'onboard'),
        option('NVIDIA GeForce Series', 'nvidia_geforce'),
        option('AMD Radeon Series', 'amd_radeon')
      ],
      screenSizes: [
        option('Laptop 13 inch', '13'),
        option('Laptop 14 inch', '14'),
        option('Laptop 15.6 inch', '15_6'),
        option('Laptop 16 inch', '16'),
        option('Trên 15 inch', 'over_15')
      ],
      resolutionTypes: [
        option('HD', 'hd'),
        option('Full HD', 'full_hd'),
        option('2K (Quad HD)', 'qhd_2k'),
        option('WUXGA', 'wuxga'),
        option('2.8K', '2_8k'),
        option('3K', '3k'),
        option('3.2K', '3_2k'),
        option('4K (Ultra HD)', '4k'),
        option('WQXGA', 'wqxga'),
        option('Retina', 'retina'),
        option('5K', '5k')
      ],
      features: [
        option('Wi-Fi 6', 'wifi_6'),
        option('Công nghệ Intel Evo', 'intel_evo'),
        option('Bảo mật vân tay', 'fingerprint'),
        option('Công nghệ Intel Gaming', 'intel_gaming'),
        option('Xoay gập 360 độ (2 in 1)', 'two_in_one'),
        option('Cảm ứng', 'touch_screen'),
        option('Màn hình IPS', 'ips'),
        option('Màn hình OLED', 'oled'),
        option('Pin tốt', 'battery_good'),
        option('Dễ nâng cấp', 'upgradeable')
      ],
      tags: [
        'coding',
        'office',
        'excel',
        'design',
        'gaming',
        'content_creator',
        'beginner_friendly',
        'value_for_money',
        'lightweight',
        'battery_good',
        'touch_screen',
        'ips_screen',
        'oled_screen',
        'upgradeable'
      ]
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
