require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function calculateCpuScore(cpu) {
  if (!cpu) return 5;
  const c = cpu.toLowerCase();
  
  let baseScore = 5;
  if (c.includes('i9') || c.includes('ryzen 9') || c.includes('m3 pro') || c.includes('m3 max')) baseScore = 9.5;
  else if (c.includes('i7') || c.includes('ryzen 7') || c.includes('ultra 7') || c.includes('m3') || c.includes('m2 pro')) baseScore = 8.5;
  else if (c.includes('i5') || c.includes('ryzen 5') || c.includes('ultra 5') || c.includes('m2') || c.includes('m1 pro')) baseScore = 7.5;
  else if (c.includes('i3') || c.includes('ryzen 3') || c.includes('m1')) baseScore = 6;
  else if (c.includes('celeron') || c.includes('pentium') || c.includes('athlon')) baseScore = 4;
  
  if (c.includes(' h') || c.includes(' hs') || c.includes(' hx') || c.includes('-h')) baseScore += 0.5;
  else if (c.includes(' u') || c.includes(' p') || c.includes('-u') || c.includes('-p')) baseScore += 0.2;
  
  return Math.min(10, Math.max(0, baseScore));
}

function detectGpuType(gpu, dedicatedGpuStr) {
  if (dedicatedGpuStr === '1' || dedicatedGpuStr === 'true' || dedicatedGpuStr === true) return 'dedicated';
  if (!gpu) return 'integrated';
  const g = gpu.toLowerCase();
  if (g.includes('nvidia') || g.includes('rtx') || g.includes('gtx') || g.includes('quadro') || g.includes('radeon rx')) {
    return 'dedicated';
  }
  return 'integrated';
}

function calculateScreenScore(laptop) {
  const { screen = '', ips, touch_screen } = laptop;
  const s = screen.toLowerCase();
  let score = 5;
  
  if (s.includes('oled')) score = 9.5;
  else if (s.includes('retina')) score = 9;
  else if (s.includes('4k') || s.includes('3k') || s.includes('2.8k') || s.includes('2k') || s.includes('2560') || s.includes('2880') || s.includes('3840')) score = 8.5;
  else if (s.includes('1920') || s.includes('full hd') || s.includes('fhd') || s.includes('1080p')) {
    score = (ips === '1' || ips === 'true' || ips === true) ? 7.5 : 6.5;
  } else {
    score = 4.5;
  }
  
  if (s.includes('144hz') || s.includes('165hz') || s.includes('120hz') || s.includes('240hz')) score += 0.5;
  if (touch_screen === '1' || touch_screen === 'true' || touch_screen === true) score += 0.2;
  
  return Math.min(10, Math.max(0, score));
}

function calculateBatteryScore(laptop) {
  const weight = parseFloat(laptop.weight);
  const gpuType = laptop.gpu_type;
  
  if (weight < 1.4 && gpuType === 'integrated') return 8.5;
  if (weight < 1.7 && gpuType === 'integrated') return 7.5;
  if (weight <= 2.0 && gpuType === 'integrated') return 6.5;
  if (weight > 2.0 && gpuType === 'dedicated') return 5;
  if (weight > 2.3) return 4.5;
  return 5;
}

function detectUpgradeable(laptop) {
  const { ram, ssd, weight, gpu_type, brand } = laptop;
  const b = (brand || '').toLowerCase();
  if (b.includes('apple')) return false;
  if (gpu_type === 'dedicated') return true;
  if (weight > 1.8) return true;
  if (parseFloat(weight) < 1.3) return false;
  if (ram == 8 && ssd <= 512) return true;
  return false;
}

function generateSuitableFor(laptop) {
  const suitable = [];
  const ram = parseInt(laptop.ram) || 0;
  const ssd = parseInt(laptop.ssd) || 0;
  const cpuScore = laptop.cpu_score;
  const gpuType = laptop.gpu_type;
  const weight = parseFloat(laptop.weight) || 2;
  const price = parseFloat(laptop.price_vnd_million) || 0;
  
  if (ram >= 16 && ssd >= 512 && cpuScore >= 7) suitable.push('it_student');
  if (price <= 20 && ram >= 8 && ssd >= 256 && gpuType === 'integrated' && weight <= 1.8) suitable.push('finance_student');
  if (ram >= 8 && ssd >= 256 && gpuType === 'integrated' && weight <= 2.0) suitable.push('office_worker');
  if (ram >= 16 && ssd >= 512 && (gpuType === 'dedicated' || laptop.screen_score >= 8)) suitable.push('design_student');
  if (gpuType === 'dedicated' && ram >= 16) suitable.push('gamer');
  if (cpuScore >= 8 && ram >= 16 && ssd >= 512 && (gpuType === 'dedicated' || laptop.screen_score >= 8)) suitable.push('content_creator');
  if (price <= 18 && ram >= 8 && ssd >= 256 && weight <= 1.8) suitable.push('beginner');
  
  return [...new Set(suitable)];
}

function generateTags(laptop) {
  const tags = [];
  const ram = parseInt(laptop.ram) || 0;
  const ssd = parseInt(laptop.ssd) || 0;
  const cpuScore = laptop.cpu_score;
  const gpuType = laptop.gpu_type;
  const weight = parseFloat(laptop.weight) || 2;
  const batteryScore = laptop.battery_score;
  const priceMillion = parseFloat(laptop.price_vnd_million) || 0;
  
  if (ram >= 16) tags.push('ram_16gb');
  if (ram >= 32) tags.push('ram_32gb');
  else if (ram == 8) tags.push('ram_8gb');
  
  if (ssd >= 1000) tags.push('ssd_1tb', 'ssd_large');
  else if (ssd >= 512) tags.push('ssd_512gb');
  else if (ssd == 256) tags.push('ssd_256gb');
  else if (ssd < 256) tags.push('storage_small');
  
  if (gpuType === 'dedicated') tags.push('gpu_dedicated');
  else tags.push('integrated_gpu');
  
  if (weight <= 1.5) tags.push('lightweight', 'portable');
  if (batteryScore >= 7) tags.push('battery_good');
  
  const screen = (laptop.screen || '').toLowerCase();
  if (laptop.ips === '1' || laptop.ips === 'true' || laptop.ips === true) tags.push('ips_screen');
  if (screen.includes('oled')) tags.push('oled_screen', 'color_screen', 'screen_good');
  
  const xRes = parseInt(laptop.x_res) || 0;
  const yRes = parseInt(laptop.y_res) || 0;
  if (xRes >= 2560 || yRes >= 1440) tags.push('screen_good', 'color_screen');
  if (screen.includes('120hz') || screen.includes('144hz') || screen.includes('165hz')) tags.push('high_refresh_rate');
  if (laptop.touch_screen === '1' || laptop.touch_screen === 'true' || laptop.touch_screen === true) tags.push('touch_screen');
  
  if (priceMillion <= 18 && cpuScore >= 6) tags.push('value_for_money', 'student_friendly');
  
  if (cpuScore >= 8) tags.push('cpu_strong');
  else if (cpuScore >= 6.5) tags.push('cpu_good');
  else tags.push('cpu_basic');
  
  tags.push('office', 'excel', 'coding');
  if (laptop.upgradeable) tags.push('upgradeable');
  tags.push('durable', 'keyboard_good', 'webcam_good');
  if (laptop.gpu_type === 'dedicated') tags.push('design');
  if (laptop.cpu_score >= 8 && laptop.gpu_type === 'dedicated') tags.push('content_creator');
  
  return [...new Set(tags)];
}

function generatePros(laptop) {
  const pros = [];
  const ram = parseInt(laptop.ram) || 0;
  const ssd = parseInt(laptop.ssd) || 0;
  
  if (ram >= 16) pros.push(`RAM ${ram}GB phù hợp đa nhiệm, học tập và làm việc nhiều phần mềm.`);
  if (ssd >= 512) pros.push(`SSD ${ssd}GB đủ để cài phần mềm và lưu tài liệu học tập/làm việc.`);
  if (laptop.weight <= 1.5) pros.push('Máy nhẹ, phù hợp mang đi học hoặc đi làm hằng ngày.');
  if (laptop.gpu_type === 'dedicated') pros.push('Có card đồ họa rời, phù hợp hơn cho gaming, thiết kế hoặc dựng video.');
  if (laptop.price_vnd_million <= 18) pros.push('Mức giá dễ tiếp cận với sinh viên và người mới mua laptop.');
  if (laptop.cpu_score >= 8) pros.push('CPU hiệu năng cao, xử lý mượt mà các tác vụ nặng.');
  if (pros.length < 3) pros.push('Cấu hình cân bằng cho nhu cầu sử dụng phổ thông.');
  return pros.slice(0, 4);
}

function generateCons(laptop) {
  const cons = [];
  const ram = parseInt(laptop.ram) || 0;
  const ssd = parseInt(laptop.ssd) || 0;
  
  if (ram <= 8) cons.push(`RAM ${ram}GB chỉ phù hợp nhu cầu cơ bản, có thể hạn chế khi mở nhiều ứng dụng.`);
  if (ssd <= 256) cons.push(`SSD ${ssd}GB hơi ít nếu cài phần mềm hoặc lưu nhiều dữ liệu.`);
  if (laptop.gpu_type !== 'dedicated') cons.push('Không có card đồ họa rời, không tối ưu cho game nặng hoặc render chuyên sâu.');
  if (laptop.weight > 2.0) cons.push('Trọng lượng khá nặng nếu phải mang đi lại thường xuyên.');
  if (laptop.screen_score <= 6) cons.push('Màn hình ở mức cơ bản, không phù hợp nếu cần màu sắc hoặc độ nét cao.');
  if (laptop.gpu_type === 'dedicated' && laptop.battery_score <= 6) cons.push('Thời lượng pin có thể không cao do gánh cấu hình mạnh.');
  if (laptop.price_vnd_million > 30) cons.push('Mức giá khá cao, phù hợp với người dùng có ngân sách dư dả.');
  if (cons.length === 0) cons.push('Cần kiểm tra giá và cấu hình thực tế tại cửa hàng trước khi mua.');
  return cons.slice(0, 3);
}

async function run() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node importLaptopsFromCsv.js <path-to-csv>");
    process.exit(1);
  }

  const results = [];
  const errors = [];
  
  fs.createReadStream(path.resolve(filePath))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Parsed ${results.length} rows from CSV.`);
      
      let successCount = 0;
      
      for (const row of results) {
        try {
          const brand = (row.Company || '').trim().replace(/^Asus$/i, 'ASUS').replace(/^Hp$/i, 'HP').replace(/^Msi$/i, 'MSI');
          const name = (row.TypeName || '').trim();
          if (!name || !brand) {
            throw new Error('Name or Brand is empty');
          }
          
          const priceStr = String(row.Price_VND || row.Price || '0').replace(/[^0-9]/g, '');
          const price = parseFloat(priceStr);
          if (isNaN(price) || price <= 0) {
            throw new Error(`Invalid price: ${row.Price_VND}`);
          }
          
          const cpu = (row.Cpu || '').trim();
          if (!cpu) throw new Error('CPU is empty');
          
          const ram = parseInt(row.Ram_GB || row.Ram || 0);
          if (ram <= 0) throw new Error(`Invalid RAM: ${row.Ram_GB}`);
          
          const weight = parseFloat(row.Weight_kg || row.Weight || 0);
          if (weight <= 0) throw new Error(`Invalid Weight: ${row.Weight_kg}`);
          
          const xRes = parseInt(row.X_res || 0);
          const yRes = parseInt(row.Y_res || 0);
          if (xRes <= 0 || yRes <= 0) throw new Error('Invalid resolution');
          
          const ssd = parseInt(row.SSD || 0);
          const hdd = parseInt(row.HHD || row.HDD || 0);
          
          // Generate unique external ID to prevent dupes
          const noVal = row.No ? row.No.trim() : null;
          const external_id = noVal ? `import-${noVal}` : `import-${brand}-${name}-${cpu}-${ram}-${ssd}-${price}`.replace(/\s+/g, '-').toLowerCase();
          
          const laptop = {
            external_id,
            original_csv_row: row.Original_CSV_Row || JSON.stringify(row),
            name,
            brand,
            type_name: name,
            price,
            price_usd: parseFloat(row.Price_USD) || null,
            price_vnd: price,
            price_vnd_million: parseFloat(row.Price_VND_Million) || (price / 1000000),
            cpu,
            ram,
            ssd,
            hdd,
            total_storage_gb: parseInt(row.Total_Storage_GB || (ssd + hdd)),
            storage_type: row.Storage_Type,
            storage_category: row.Storage_Category || (ssd >= 1000 ? '1TB' : (ssd === 512 ? '512GB' : (ssd === 256 ? '256GB' : 'Other'))),
            gpu: row.Gpu,
            dedicated_gpu: row.Dedicated_Gpu === '1' || row.Dedicated_Gpu === 'true' || row.Dedicated_Gpu === true,
            screen: row.ScreenResolution || row.Screen,
            inches: parseFloat(row.Inches) || null,
            x_res: xRes,
            y_res: yRes,
            ppi: parseFloat(row.ppi) || null,
            ips: row.Ips === '1' || row.Ips === 'true' || row.Ips === true,
            touch_screen: row.TouchScreen === '1' || row.TouchScreen === 'true' || row.TouchScreen === true,
            operating_system: row.OpSys,
            weight
          };
          
          laptop.cpu_score = calculateCpuScore(laptop.cpu);
          laptop.gpu_type = detectGpuType(laptop.gpu, row.Dedicated_Gpu);
          laptop.screen_score = calculateScreenScore(laptop);
          laptop.battery_score = calculateBatteryScore(laptop);
          laptop.upgradeable = detectUpgradeable(laptop);
          
          laptop.suitable_for = generateSuitableFor(laptop);
          laptop.tags = generateTags(laptop);
          laptop.pros = generatePros(laptop);
          laptop.cons = generateCons(laptop);
          
          const { error } = await supabase.from('laptops').upsert(laptop, { onConflict: 'external_id' });
          if (error) {
            throw error;
          }
          successCount++;
        } catch (err) {
          errors.push({ row, error: err.message });
        }
      }
      
      console.log(`Successfully imported ${successCount} laptops.`);
      if (errors.length > 0) {
        console.error(`Failed to import ${errors.length} laptops. Check import-errors.json`);
        fs.writeFileSync(path.resolve(__dirname, 'import-errors.json'), JSON.stringify(errors, null, 2));
      }
    });
}

run();
