const GROUP_TAGS = {
  it_student: ["coding", "ram_16gb", "ssd_512gb", "cpu_good", "cpu_strong", "upgradeable", "student_friendly"],
  finance_student: ["office", "excel", "lightweight", "battery_good", "webcam_good", "value_for_money", "student_friendly"],
  design_student: ["design", "color_screen", "screen_good", "oled_screen", "ips_screen", "ram_16gb", "gpu_dedicated", "ssd_512gb"],
  office_worker: ["office", "excel", "keyboard_good", "webcam_good", "battery_good", "durable", "lightweight"],
  content_creator: ["content_creator", "cpu_strong", "gpu_dedicated", "ram_16gb", "ram_32gb", "ssd_1tb", "color_screen", "cooling_good"],
  gamer: ["gaming", "gpu_dedicated", "cooling_good", "high_refresh_rate", "ram_16gb", "cpu_strong"],
  beginner: ["beginner_friendly", "value_for_money", "balanced", "durable", "easy_use", "student_friendly"]
};

function calculateScore(laptop, commonAnswers, specificAnswers = {}) {
  const { userGroup, budget, priorities = [], usageYears } = commonAnswers;

  let N = 0; // Nhu cầu (Tag matching)
  let G = 0; // Ngân sách
  let P = 0; // Hiệu năng (CPU, RAM, SSD, GPU)
  let W = 0; // Di chuyển (Pin, Cân nặng)
  let D = 0; // Độ bền, Nâng cấp
  let F = 0; // Feature spec (Màn hình, Webcam, etc)

  // 1. Nhu cầu cơ bản từ Tags
  const targetTags = GROUP_TAGS[userGroup] || [];
  let tagMatch = 0;
  targetTags.forEach(tag => {
    if (laptop.tags && laptop.tags.includes(tag)) tagMatch += 2;
  });
  if (laptop.suitable_for && laptop.suitable_for.includes(userGroup)) tagMatch += 2;
  N = Math.min(10, tagMatch);

  // 2. Ngân sách
  let targetMin = 0, targetMax = 999;
  if (budget === 'under-10') { targetMax = 10; }
  else if (budget === '10-15') { targetMin = 10; targetMax = 15; }
  else if (budget === '15-20') { targetMin = 15; targetMax = 20; }
  else if (budget === '20-30') { targetMin = 20; targetMax = 30; }
  else if (budget === 'over-30') { targetMin = 30; }
  
  const priceMil = laptop.price / 1000000;
  if (priceMil >= targetMin && priceMil <= targetMax) G = 10;
  else if (priceMil < targetMin) G = 8;
  else G = Math.max(0, 10 - (priceMil - targetMax));

  // Base hardware scores
  let ramScore = laptop.ram >= 32 ? 10 : (laptop.ram >= 16 ? 8 : (laptop.ram >= 8 ? 5 : 2));
  let ssdScore = laptop.ssd >= 1000 ? 10 : (laptop.ssd >= 512 ? 8 : (laptop.ssd >= 256 ? 5 : 2));
  let gpuScore = laptop.gpu_type === 'dedicated' ? 10 : 4;
  let cpuScore = laptop.cpu_score || 5;

  let weightScore = laptop.weight <= 1.5 ? 10 : (laptop.weight <= 2.0 ? 7 : 4);
  let batteryScore = laptop.battery_score || 5;

  // 3. Process Specific Answers
  const spec = specificAnswers || {};

  if (userGroup === 'it_student') {
    const itSoftware = spec.it_software || [];
    const itExtra = spec.it_extra_needs || [];
    const itFields = spec.it_fields || [];
    
    // docker, virtual_machine, android_studio -> boost RAM/CPU/SSD
    if (itSoftware.includes('docker') || itSoftware.includes('virtual_machine') || itSoftware.includes('android_studio') || spec.it_virtualization === 'frequent' || spec.it_android_studio === 'frequent') {
      if (laptop.ram < 16) ramScore -= 3; else ramScore += 2;
      if (laptop.ssd < 512) ssdScore -= 3; else ssdScore += 2;
      if (laptop.cpu_score >= 7) cpuScore += 2;
    }
    
    // game_dev, data_ai, heavy_gaming -> boost GPU
    if (itFields.includes('game_dev') || spec.it_ai_data === 'heavy' || itExtra.includes('heavy_gaming')) {
      if (laptop.gpu_type !== 'dedicated') gpuScore -= 5;
      else gpuScore += 2;
    }
    
    if (itFields.includes('basic_programming')) {
      if (laptop.gpu_type === 'dedicated' && priceMil > targetMax) G -= 2; // don't over-recommend gaming
    }
  }

  if (userGroup === 'finance_student') {
    if (spec.finance_excel_level === 'medium' || spec.finance_excel_level === 'heavy' || spec.finance_browser_tabs === 'high') {
      if (laptop.ram >= 16) ramScore += 2; else ramScore -= 2;
    }
    if (spec.finance_meeting === 'high' || spec.finance_meeting === 'medium') {
      if (laptop.tags && laptop.tags.includes('webcam_good')) F += 2;
      batteryScore += 1;
    }
    if (laptop.gpu_type === 'dedicated') gpuScore -= 1; // not needed
  }

  if (userGroup === 'design_student') {
    const designSoftware = spec.design_software || [];
    const heavyDesign = ['photoshop', 'illustrator', 'premiere', 'after_effects', 'blender', 'autocad'];
    const hasHeavySoftware = designSoftware.some(s => heavyDesign.includes(s));
    
    if (hasHeavySoftware || spec.design_level === 'heavy' || spec.design_3d_render === 'frequent' || spec.design_video === 'heavy') {
      if (laptop.cpu_score >= 7) cpuScore += 2; else cpuScore -= 2;
      if (laptop.ram >= 16) ramScore += 2; else ramScore -= 3;
      if (laptop.gpu_type !== 'dedicated') gpuScore -= 4; else gpuScore += 2;
    }
    
    if (spec.design_color_screen === 'color_accurate') {
      if (laptop.tags && (laptop.tags.includes('color_screen') || laptop.tags.includes('oled_screen') || laptop.tags.includes('ips_screen') || laptop.tags.includes('screen_good'))) F += 4;
      else F -= 2;
    }
  }

  if (userGroup === 'office_worker') {
    const officeTasks = spec.office_tasks || [];
    if (officeTasks.includes('accounting') || spec.office_excel_level === 'heavy') {
      if (laptop.ram >= 16) ramScore += 2; else ramScore -= 2;
      if (spec.office_num_keyboard === 'required') {
        if (laptop.screen && laptop.screen.includes('15')) F += 3; // assumption: 15" has numpad
      }
    }
    if (spec.office_meeting === 'daily') {
      if (laptop.tags && laptop.tags.includes('webcam_good')) F += 2;
      batteryScore += 2;
    }
    if (spec.office_work_location === 'hybrid_mobile' || spec.office_work_location === 'meet_clients') {
      if (laptop.weight <= 1.5) weightScore += 3; else weightScore -= 2;
    }
  }

  if (userGroup === 'content_creator') {
    const contentRes = spec.content_resolution;
    const contentSoftware = spec.content_software || [];
    if (contentRes === '4k' || spec.content_editing_level === 'heavy') {
      if (laptop.ram >= 32) ramScore += 3; else if (laptop.ram < 16) ramScore -= 5;
      if (laptop.ssd >= 1000) ssdScore += 3;
      if (laptop.gpu_type !== 'dedicated') gpuScore -= 5;
    }
    if (contentSoftware.includes('premiere') || contentSoftware.includes('after_effects') || contentSoftware.includes('davinci')) {
      if (laptop.gpu_type === 'dedicated') gpuScore += 2; else gpuScore -= 3;
    }
    if (spec.content_storage_need === 'high') {
      if (laptop.ssd >= 1000) ssdScore += 3; else ssdScore -= 2;
    }
  }

  if (userGroup === 'gamer') {
    const games = spec.gamer_games || [];
    if (games.includes('aaa_games') || games.includes('fps_heavy') || spec.gamer_graphic_level === 'high_fps') {
      if (laptop.gpu_type !== 'dedicated') gpuScore -= 6; else gpuScore += 3;
      if (laptop.tags && laptop.tags.includes('cooling_good')) F += 2;
    }
    if (spec.gamer_refresh_rate === 'required') {
      if (laptop.tags && laptop.tags.includes('high_refresh_rate')) F += 3; else F -= 2;
    }
    if (spec.gamer_weight_battery_acceptance === 'want_light') {
      if (laptop.weight > 2.0) weightScore -= 3;
    } else if (spec.gamer_weight_battery_acceptance === 'performance_first') {
      weightScore += 2; // ignore weight penalty
    }
  }

  if (userGroup === 'beginner') {
    if (usageYears === '3-4' || usageYears === 'over-4' || spec.beginner_usage_years_expectation === 'long_term' || spec.beginner_concerns?.includes('too_weak')) {
      if (laptop.ram >= 16) ramScore += 2; else ramScore -= 2;
      if (laptop.cpu_score >= 6) cpuScore += 1;
      if (laptop.ssd >= 512) ssdScore += 1;
    }
    if (spec.beginner_concerns?.includes('overbuy')) {
      if (laptop.gpu_type === 'dedicated' && laptop.price > 20000000) G -= 3;
    }
  }

  // Final aggregations
  P = (Math.max(0, Math.min(10, cpuScore)) + Math.max(0, Math.min(10, ramScore)) + Math.max(0, Math.min(10, ssdScore)) + Math.max(0, Math.min(10, gpuScore))) / 4;
  W = (Math.max(0, Math.min(10, batteryScore)) + Math.max(0, Math.min(10, weightScore))) / 2;
  D = laptop.upgradeable ? 10 : 5;

  // Apply Common Priorities
  if (priorities.includes('performance')) P = Math.min(10, P + 2);
  if (priorities.includes('lightweight')) W = Math.min(10, W + 2);
  if (priorities.includes('battery')) W = Math.min(10, W + 1);
  if (priorities.includes('upgradeable')) D = Math.min(10, D + 2);
  if (priorities.includes('cheap')) G = Math.min(10, G + 1);

  // Score formula
  // Adding F to P to keep the 100 point scale balanced without restructuring completely
  const perfFactor = (P * 4 + F) / 5;
  
  const rawScore = 0.4 * N + 0.25 * G + 0.15 * perfFactor + 0.1 * W + 0.1 * D;
  const finalScore = Math.round(Math.min(10, Math.max(0, rawScore)) * 10); 

  return finalScore;
}

module.exports = {
  GROUP_TAGS,
  calculateScore
};
