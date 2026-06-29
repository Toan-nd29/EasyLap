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

const FILTER_OPTION_COLUMNS = [
  'name',
  'brand',
  'price',
  'cpu',
  'ram',
  'ssd',
  'gpu',
  'gpu_type',
  'screen',
  'battery_score',
  'weight',
  'upgradeable',
  'suitable_for',
  'tags'
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
  apple_m1: ['cpu.ilike.%Apple M1%', 'cpu.ilike.%M1%'],
  apple_m2: ['cpu.ilike.%Apple M2%', 'cpu.ilike.%M2%'],
  apple_m3: ['cpu.ilike.%Apple M3%', 'cpu.ilike.%M3%'],
  apple_m4: ['cpu.ilike.%Apple M4%', 'cpu.ilike.%M4%'],
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
  '13': ['screen.ilike.%13%'],
  '14': ['screen.ilike.%14%'],
  '15_6': ['screen.ilike.%15.6%'],
  '16': ['screen.ilike.%16%'],
  over_15: ['screen.ilike.%15%', 'screen.ilike.%16%', 'screen.ilike.%17%', 'screen.ilike.%18%']
};

const RESOLUTION_FILTERS = {
  hd: ['screen.ilike.%" HD%'],
  full_hd: [
    'screen.ilike.%Full HD%',
    'screen.ilike.%FHD%',
    'screen.ilike.%1920x1080%',
    'screen.ilike.%1920 x 1080%'
  ],
  qhd_2k: ['screen.ilike.%2K%', 'screen.ilike.%QHD%', 'screen.ilike.%2560%'],
  wuxga: ['screen.ilike.%WUXGA%', 'screen.ilike.%1920x1200%', 'screen.ilike.%1920 x 1200%'],
  '2_8k': ['screen.ilike.%2.8K%', 'screen.ilike.%2880%'],
  '3k': ['screen.ilike.%3K%', 'screen.ilike.%3000%'],
  '3_2k': ['screen.ilike.%3.2K%', 'screen.ilike.%3200%'],
  '4k': ['screen.ilike.%4K%', 'screen.ilike.%Ultra HD%', 'screen.ilike.%3840%'],
  wqxga: ['screen.ilike.%WQXGA%', 'screen.ilike.%2560 x 1600%', 'screen.ilike.%2560x1600%'],
  retina: ['screen.ilike.%Retina%'],
  '5k': ['screen.ilike.%5K%']
};

const FEATURE_TAGS = {
  battery_good: ['battery_good'],
  lightweight: ['lightweight', 'portable'],
  upgradeable: ['upgradeable']
};

const TWO_IN_ONE_FILTERS = [
  'name.ilike.%x360%',
  'name.ilike.%360%',
  'name.ilike.%2-in-1%',
  'name.ilike.%2 in 1%',
  'name.ilike.%Yoga%',
  'screen.ilike.%2-in-1%',
  'screen.ilike.%2 in 1%'
];

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

function getTags(laptop) {
  return Array.isArray(laptop.tags) ? laptop.tags : [];
}

function getSuitableFor(laptop) {
  return Array.isArray(laptop.suitable_for) ? laptop.suitable_for : [];
}

function hasAnyTag(laptop, tags) {
  const laptopTags = getTags(laptop);
  return tags.some(tag => laptopTags.includes(tag));
}

function hasAnySuitableFor(laptop, groups) {
  const suitableFor = getSuitableFor(laptop);
  return groups.some(group => suitableFor.includes(group));
}

function getLaptopInches(laptop) {
  const inches = Number(laptop.inches);
  if (Number.isFinite(inches) && inches > 0) return inches;

  const match = String(laptop.screen || '').match(/(\d+(?:\.\d+)?)\s*(?:"|inch)/i);
  return match ? Number(match[1]) : null;
}

function getResolution(laptop) {
  return {
    x: Number(laptop.x_res) || 0,
    y: Number(laptop.y_res) || 0,
    screen: String(laptop.screen || '').toLowerCase()
  };
}

function isPriceInRange(price, value) {
  const range = parseBudgetRange(value);
  const numericPrice = Number(price);
  if (!range || !Number.isFinite(numericPrice)) return false;
  if (numericPrice < range.minVnd) return false;
  if (range.maxVnd !== null && numericPrice > range.maxVnd) return false;
  return true;
}

function countMatching(laptops, matcher) {
  return laptops.reduce((count, laptop) => count + (matcher(laptop) ? 1 : 0), 0);
}

function optionsWithCounts(definitions, laptops) {
  return definitions
    .map(definition => {
      const count = countMatching(laptops, definition.match);
      const { match, ...rest } = definition;
      return { ...rest, count };
    })
    .filter(item => item.count > 0);
}

function makeDefinition(label, value, match, meta = {}) {
  return { label, value, match, ...meta };
}

function formatStorageLabel(value) {
  if (value >= 1000) return `${value / 1000}TB`;
  return `${value}GB`;
}

const PRICE_RANGE_DEFS = [
  makeDefinition('Dưới 10 triệu', 'under-10', laptop => isPriceInRange(laptop.price, 'under-10')),
  makeDefinition('Từ 10 - 15 triệu', '10-15', laptop => isPriceInRange(laptop.price, '10-15')),
  makeDefinition('Từ 15 - 20 triệu', '15-20', laptop => isPriceInRange(laptop.price, '15-20')),
  makeDefinition('Từ 20 - 25 triệu', '20-25', laptop => isPriceInRange(laptop.price, '20-25')),
  makeDefinition('Từ 25 - 30 triệu', '25-30', laptop => isPriceInRange(laptop.price, '25-30')),
  makeDefinition('Trên 30 triệu', 'over-30', laptop => isPriceInRange(laptop.price, 'over-30'))
];

const USAGE_NEED_DEFS = [
  makeDefinition('Học tập - Văn phòng', 'study_office', laptop => hasAnyTag(laptop, USAGE_TAGS.study_office) || hasAnySuitableFor(laptop, ['finance_student', 'office_worker', 'beginner'])),
  makeDefinition('Cao cấp - Sang trọng', 'premium', laptop => Number(laptop.price) >= 30000000 && hasAnyTag(laptop, USAGE_TAGS.premium)),
  makeDefinition('Mỏng nhẹ', 'lightweight', laptop => hasAnyTag(laptop, USAGE_TAGS.lightweight) || Number(laptop.weight) <= 1.5),
  makeDefinition('Gaming', 'gaming', laptop => hasAnyTag(laptop, USAGE_TAGS.gaming) || laptop.gpu_type === 'dedicated'),
  makeDefinition('Đồ họa - Kỹ thuật', 'design_technical', laptop => hasAnyTag(laptop, USAGE_TAGS.design_technical) || hasAnySuitableFor(laptop, ['design_student'])),
  makeDefinition('Laptop sáng tạo nội dung', 'content_creator', laptop => hasAnyTag(laptop, USAGE_TAGS.content_creator) || hasAnySuitableFor(laptop, ['content_creator'])),
  makeDefinition('Văn phòng', 'office', laptop => hasAnyTag(laptop, USAGE_TAGS.office) || hasAnySuitableFor(laptop, ['office_worker'])),
  makeDefinition('Sinh viên', 'student', laptop => hasAnyTag(laptop, USAGE_TAGS.student) || hasAnySuitableFor(laptop, ['it_student', 'finance_student', 'design_student'])),
  makeDefinition('Cảm ứng', 'touch', laptop => laptop.touch_screen === true || /touch/i.test(String(laptop.screen || ''))),
  makeDefinition('Laptop AI', 'laptop_ai', laptop => /\bai\b/i.test(`${laptop.name || ''} ${laptop.cpu || ''}`), { badge: 'HOT' })
];

const CPU_FAMILY_DEFS = [
  makeDefinition('Laptop Core i3', 'core_i3', laptop => /core\s+i3|i3-/i.test(laptop.cpu || '')),
  makeDefinition('Laptop Core i5', 'core_i5', laptop => /core\s+i5|i5-/i.test(laptop.cpu || '')),
  makeDefinition('Laptop Core i7', 'core_i7', laptop => /core\s+i7|i7-/i.test(laptop.cpu || '')),
  makeDefinition('Laptop Core i9', 'core_i9', laptop => /core\s+i9|i9-/i.test(laptop.cpu || '')),
  makeDefinition('Laptop Core U5', 'core_u5', laptop => /core\s+ultra\s+5|core\s+u5|core\s+5\b/i.test(laptop.cpu || '')),
  makeDefinition('Laptop Core U7', 'core_u7', laptop => /core\s+ultra\s+7|core\s+u7|core\s+7\b/i.test(laptop.cpu || '')),
  makeDefinition('Laptop Core U9', 'core_u9', laptop => /core\s+ultra\s+9|core\s+u9|core\s+9\b/i.test(laptop.cpu || '')),
  makeDefinition('Intel Celeron / Pentium', 'celeron_pentium', laptop => /celeron|pentium/i.test(laptop.cpu || '')),
  makeDefinition('Apple M1', 'apple_m1', laptop => /apple\s*m1|\bm1\b/i.test(laptop.cpu || '')),
  makeDefinition('Apple M2', 'apple_m2', laptop => /apple\s*m2|\bm2\b/i.test(laptop.cpu || '')),
  makeDefinition('Apple M3', 'apple_m3', laptop => /apple\s*m3|\bm3\b/i.test(laptop.cpu || '')),
  makeDefinition('Apple M4 Series', 'apple_m4', laptop => /apple\s*m4|\bm4\b/i.test(laptop.cpu || '')),
  makeDefinition('AMD Ryzen', 'amd_ryzen', laptop => /ryzen/i.test(laptop.cpu || '')),
  makeDefinition('AMD Ryzen 5', 'amd_ryzen_5', laptop => /ryzen(?:\s+ai)?\s+5/i.test(laptop.cpu || '')),
  makeDefinition('AMD Ryzen 7', 'amd_ryzen_7', laptop => /ryzen(?:\s+ai)?\s+7/i.test(laptop.cpu || '')),
  makeDefinition('AMD Ryzen 9', 'amd_ryzen_9', laptop => /ryzen(?:\s+ai)?\s+9/i.test(laptop.cpu || '')),
  makeDefinition('Intel Core Ultra', 'intel_core_ultra', laptop => /core\s+ultra/i.test(laptop.cpu || ''), { badge: 'HOT' }),
  makeDefinition('Qualcomm Snapdragon', 'qualcomm_snapdragon', laptop => /qualcomm|snapdragon/i.test(laptop.cpu || '')),
  makeDefinition('Snapdragon X Plus', 'snapdragon_x_plus', laptop => /snapdragon\s+x\s+plus/i.test(laptop.cpu || ''))
];

const GPU_FAMILY_DEFS = [
  makeDefinition('Card Onboard', 'onboard', laptop => laptop.gpu_type === 'integrated'),
  makeDefinition('NVIDIA GeForce Series', 'nvidia_geforce', laptop => /nvidia|geforce|rtx|gtx/i.test(laptop.gpu || '')),
  makeDefinition('AMD Radeon Series', 'amd_radeon', laptop => /amd\s+radeon|radeon/i.test(laptop.gpu || ''))
];

const SCREEN_SIZE_DEFS = [
  makeDefinition('Laptop 13 inch', '13', laptop => {
    const inches = getLaptopInches(laptop);
    return inches >= 12.5 && inches < 13.8;
  }),
  makeDefinition('Laptop 14 inch', '14', laptop => {
    const inches = getLaptopInches(laptop);
    return inches >= 13.8 && inches < 14.8;
  }),
  makeDefinition('Laptop 15.6 inch', '15_6', laptop => {
    const inches = getLaptopInches(laptop);
    return inches >= 15 && inches < 16;
  }),
  makeDefinition('Laptop 16 inch', '16', laptop => {
    const inches = getLaptopInches(laptop);
    return inches >= 15.9 && inches < 17;
  }),
  makeDefinition('Trên 15 inch', 'over_15', laptop => {
    const inches = getLaptopInches(laptop);
    return inches >= 15;
  })
];

const RESOLUTION_DEFS = [
  makeDefinition('HD', 'hd', laptop => {
    const { x, screen } = getResolution(laptop);
    return (x > 0 && x < 1600) || (/\bhd\b/i.test(screen) && !/fhd|full\s*hd|qhd|wqhd|ultra\s*hd/i.test(screen));
  }),
  makeDefinition('Full HD', 'full_hd', laptop => {
    const { x, y, screen } = getResolution(laptop);
    return /full\s*hd|fhd/i.test(screen) || (x >= 1900 && x < 2000 && y >= 1000 && y < 1300);
  }),
  makeDefinition('2K (Quad HD)', 'qhd_2k', laptop => {
    const { x, screen } = getResolution(laptop);
    return /2k|qhd/i.test(screen) || (x >= 2500 && x < 2900);
  }),
  makeDefinition('WUXGA', 'wuxga', laptop => {
    const { x, y, screen } = getResolution(laptop);
    return /wuxga/i.test(screen) || (x === 1920 && y === 1200);
  }),
  makeDefinition('2.8K', '2_8k', laptop => {
    const { x, screen } = getResolution(laptop);
    return /2\.8k/i.test(screen) || (x >= 2800 && x < 3000);
  }),
  makeDefinition('3K', '3k', laptop => {
    const { x, screen } = getResolution(laptop);
    return /\b3k\b/i.test(screen) || (x >= 2880 && x < 3100);
  }),
  makeDefinition('3.2K', '3_2k', laptop => {
    const { x, screen } = getResolution(laptop);
    return /3\.2k/i.test(screen) || (x >= 3100 && x < 3300);
  }),
  makeDefinition('4K (Ultra HD)', '4k', laptop => {
    const { x, screen } = getResolution(laptop);
    return /4k|ultra\s*hd/i.test(screen) || x >= 3800;
  }),
  makeDefinition('WQXGA', 'wqxga', laptop => {
    const { x, y, screen } = getResolution(laptop);
    return /wqxga/i.test(screen) || (x >= 2500 && x < 2700 && y >= 1500);
  }),
  makeDefinition('Retina', 'retina', laptop => /retina/i.test(laptop.screen || '')),
  makeDefinition('5K', '5k', laptop => {
    const { x, screen } = getResolution(laptop);
    return /5k/i.test(screen) || x >= 5000;
  })
];

const FEATURE_DEFS = [
  makeDefinition('Xoay gập 360 độ (2 in 1)', 'two_in_one', laptop => /x360|360|2-in-1|2 in 1|yoga/i.test(`${laptop.name || ''} ${laptop.screen || ''}`)),
  makeDefinition('Cảm ứng', 'touch_screen', laptop => laptop.touch_screen === true || /touch/i.test(laptop.screen || '')),
  makeDefinition('Màn hình IPS', 'ips', laptop => laptop.ips === true || /ips/i.test(laptop.screen || '')),
  makeDefinition('Màn hình OLED', 'oled', laptop => /oled/i.test(laptop.screen || '')),
  makeDefinition('Pin tốt', 'battery_good', laptop => hasAnyTag(laptop, ['battery_good']) || Number(laptop.battery_score) >= 7),
  makeDefinition('Mỏng nhẹ', 'lightweight', laptop => hasAnyTag(laptop, ['lightweight', 'portable']) || Number(laptop.weight) <= 1.5),
  makeDefinition('Dễ nâng cấp', 'upgradeable', laptop => laptop.upgradeable === true || hasAnyTag(laptop, ['upgradeable']))
];

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
    if (selectedUsageNeeds.includes('laptop_ai')) {
      queryBuilder = applyOrFilters(queryBuilder, ['name.ilike.%AI%', 'cpu.ilike.%AI%']);
    }

    const selectedTags = unique([
      ...toList(tag),
      ...selectedUsageNeeds.flatMap(value => USAGE_TAGS[value] || []),
      ...selectedFeatures.flatMap(value => FEATURE_TAGS[value] || [])
    ]);
    if (selectedTags.length > 0) {
      queryBuilder = queryBuilder.overlaps('tags', selectedTags);
    }

    if (selectedFeatures.includes('two_in_one')) {
      queryBuilder = applyOrFilters(queryBuilder, TWO_IN_ONE_FILTERS);
    }
    if (selectedFeatures.includes('touch_screen')) {
      queryBuilder = queryBuilder.ilike('screen', '%Touch%');
    }
    if (selectedFeatures.includes('ips')) {
      queryBuilder = queryBuilder.ilike('screen', '%IPS%');
    }
    if (selectedFeatures.includes('oled')) {
      queryBuilder = queryBuilder.ilike('screen', '%OLED%');
    }
    if (selectedFeatures.includes('upgradeable')) {
      queryBuilder = queryBuilder.eq('upgradeable', true);
    }

    queryBuilder = applyOrFilters(
      queryBuilder,
      toList(cpuFamilies).flatMap(value => CPU_FILTERS[value] || [])
    );

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

  async getFilterOptions() {
    const { data: laptops, error } = await supabaseAdmin
      .from('laptops')
      .select(FILTER_OPTION_COLUMNS)
      .range(0, 9999);

    if (error) throw error;

    const laptopList = laptops || [];
    const brandCounts = new Map();
    laptopList.forEach(laptop => {
      if (!laptop.brand) return;
      const normalizedBrand = normalizeBrand(laptop.brand);
      brandCounts.set(normalizedBrand, (brandCounts.get(normalizedBrand) || 0) + 1);
    });

    const brands = [...brandCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([brand, count]) => option(brand === 'Apple' ? 'Mac' : brand, brand, { count }));

    const ramOptions = numericList(laptopList.map(laptop => laptop.ram))
      .sort((a, b) => a - b)
      .map(value => option(`${value}GB`, value, {
        count: laptopList.filter(laptop => Number(laptop.ram) === value).length
      }));

    const storageOptions = Object.entries(STORAGE_VALUES)
      .map(([value, acceptedValues]) => {
        const numericValue = Number(value);
        const count = laptopList.filter(laptop => acceptedValues.includes(Number(laptop.ssd))).length;
        return option(formatStorageLabel(numericValue), numericValue, { count });
      })
      .filter(item => item.count > 0);

    return {
      totalLaptops: laptopList.length,
      brands,
      priceRanges: optionsWithCounts(PRICE_RANGE_DEFS, laptopList),
      usageNeeds: optionsWithCounts(USAGE_NEED_DEFS, laptopList),
      cpuFamilies: optionsWithCounts(CPU_FAMILY_DEFS, laptopList),
      ramOptions,
      storageOptions,
      gpuFamilies: optionsWithCounts(GPU_FAMILY_DEFS, laptopList),
      screenSizes: optionsWithCounts(SCREEN_SIZE_DEFS, laptopList),
      resolutionTypes: optionsWithCounts(RESOLUTION_DEFS, laptopList),
      features: optionsWithCounts(FEATURE_DEFS, laptopList),
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
