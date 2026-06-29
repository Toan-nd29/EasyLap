const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const commonQuestions = [
  {
    "question_key": "common_user_group",
    "question_group": "common",
    "question": "Bạn thuộc nhóm nào?",
    "type": "single",
    "options": [
      { "label": "Sinh viên Công nghệ thông tin / Lập trình", "value": "it_student" },
      { "label": "Sinh viên Tài chính / Kinh tế / Marketing", "value": "finance_student" },
      { "label": "Sinh viên Thiết kế đồ họa / Truyền thông", "value": "design_student" },
      { "label": "Nhân viên văn phòng", "value": "office_worker" },
      { "label": "Người làm Content / Dựng video", "value": "content_creator" },
      { "label": "Người chơi game", "value": "gamer" },
      { "label": "Người mua laptop lần đầu", "value": "beginner" }
    ],
    "display_order": 1
  },
  {
    "question_key": "common_budget",
    "question_group": "common",
    "question": "Ngân sách của bạn là bao nhiêu?",
    "type": "single",
    "options": [
      { "label": "Dưới 10 triệu", "value": "under-10" },
      { "label": "10–15 triệu", "value": "10-15" },
      { "label": "15–20 triệu", "value": "15-20" },
      { "label": "20–25 triệu", "value": "20-25" },
      { "label": "25–30 triệu", "value": "25-30" },
      { "label": "Trên 30 triệu", "value": "over-30" }
    ],
    "display_order": 2
  },
  {
    "question_key": "common_mobility",
    "question_group": "common",
    "question": "Bạn có thường xuyên mang laptop đi học/đi làm không?",
    "type": "single",
    "options": [
      { "label": "Ít khi, chủ yếu để một chỗ", "value": "rarely" },
      { "label": "Thỉnh thoảng", "value": "sometimes" },
      { "label": "Thường xuyên mang đi hằng ngày", "value": "frequent" }
    ],
    "display_order": 3
  },
  {
    "question_key": "common_usage_years",
    "question_group": "common",
    "question": "Bạn muốn dùng laptop trong bao lâu?",
    "type": "single",
    "options": [
      { "label": "1–2 năm", "value": "1-2" },
      { "label": "3–4 năm", "value": "3-4" },
      { "label": "Trên 4 năm", "value": "over-4" }
    ],
    "display_order": 4
  },
  {
    "question_key": "common_priorities",
    "question_group": "common",
    "question": "Bạn ưu tiên yếu tố nào?",
    "type": "multiple",
    "options": [
      { "label": "Giá rẻ", "value": "cheap" },
      { "label": "Máy nhẹ", "value": "lightweight" },
      { "label": "Pin lâu", "value": "battery" },
      { "label": "Hiệu năng mạnh", "value": "performance" },
      { "label": "Màn hình đẹp", "value": "screen" },
      { "label": "Bền, ít lỗi", "value": "durable" },
      { "label": "Dễ nâng cấp RAM/SSD", "value": "upgradeable" },
      { "label": "Ngoại hình đẹp", "value": "design_look" }
    ],
    "display_order": 5
  }
];

const itQuestions = [
  {
    "question_key": "it_fields",
    "question_group": "it_student",
    "question": "Bạn học hoặc làm mảng nào?",
    "type": "multiple",
    "options": [
      { "label": "Lập trình cơ bản ở trường", "value": "basic_programming" },
      { "label": "Web development", "value": "web_dev" },
      { "label": "Mobile app", "value": "mobile_app" },
      { "label": "Java / .NET", "value": "java_dotnet" },
      { "label": "Database / SQL", "value": "database" },
      { "label": "Data / AI cơ bản", "value": "data_ai_basic" },
      { "label": "Cybersecurity", "value": "cybersecurity" },
      { "label": "Game development", "value": "game_dev" }
    ],
    "display_order": 1
  },
  {
    "question_key": "it_software",
    "question_group": "it_student",
    "question": "Bạn thường dùng phần mềm nào?",
    "type": "multiple",
    "options": [
      { "label": "VS Code", "value": "vscode" },
      { "label": "NetBeans", "value": "netbeans" },
      { "label": "IntelliJ IDEA", "value": "intellij" },
      { "label": "Eclipse", "value": "eclipse" },
      { "label": "Android Studio", "value": "android_studio" },
      { "label": "SQL Server / MySQL / PostgreSQL", "value": "database_tools" },
      { "label": "Docker", "value": "docker" },
      { "label": "VMware / VirtualBox", "value": "virtual_machine" },
      { "label": "Git / GitHub", "value": "git" },
      { "label": "Figma cơ bản", "value": "figma_basic" }
    ],
    "display_order": 2
  },
  {
    "question_key": "it_virtualization",
    "question_group": "it_student",
    "question": "Bạn có cần chạy máy ảo, Docker hoặc nhiều môi trường dev không?",
    "type": "single",
    "options": [
      { "label": "Không cần", "value": "none" },
      { "label": "Có, nhưng chỉ dùng nhẹ", "value": "light" },
      { "label": "Có, dùng thường xuyên", "value": "frequent" }
    ],
    "display_order": 3
  },
  {
    "question_key": "it_android_studio",
    "question_group": "it_student",
    "question": "Bạn có cần dùng Android Studio không?",
    "type": "single",
    "options": [
      { "label": "Không", "value": "no" },
      { "label": "Có, thỉnh thoảng", "value": "sometimes" },
      { "label": "Có, thường xuyên", "value": "frequent" }
    ],
    "display_order": 4
  },
  {
    "question_key": "it_ai_data",
    "question_group": "it_student",
    "question": "Bạn có học AI, Data hoặc Machine Learning không?",
    "type": "single",
    "options": [
      { "label": "Không", "value": "no" },
      { "label": "Có, mức cơ bản", "value": "basic" },
      { "label": "Có, cần chạy mô hình/dữ liệu nặng", "value": "heavy" }
    ],
    "display_order": 5
  },
  {
    "question_key": "it_extra_needs",
    "question_group": "it_student",
    "question": "Bạn có chơi game hoặc làm đồ họa thêm không?",
    "type": "multiple",
    "options": [
      { "label": "Không", "value": "none" },
      { "label": "Game nhẹ", "value": "light_gaming" },
      { "label": "Game trung bình", "value": "medium_gaming" },
      { "label": "Game nặng", "value": "heavy_gaming" },
      { "label": "Có chỉnh ảnh cơ bản", "value": "basic_photo_editing" },
      { "label": "Có dựng video/đồ họa nhẹ", "value": "light_video_design" }
    ],
    "display_order": 6
  }
];

const financeQuestions = [
  {
    "question_key": "finance_tasks",
    "question_group": "finance_student",
    "question": "Bạn dùng laptop chủ yếu cho việc gì?",
    "type": "multiple",
    "options": [
      { "label": "Học online", "value": "online_learning" },
      { "label": "Làm Word, PowerPoint", "value": "word_powerpoint" },
      { "label": "Làm Excel", "value": "excel" },
      { "label": "Làm báo cáo, tiểu luận", "value": "report_writing" },
      { "label": "Làm thuyết trình", "value": "presentation" },
      { "label": "Quản lý fanpage / marketing", "value": "marketing_fanpage" },
      { "label": "Làm Canva cơ bản", "value": "canva_basic" },
      { "label": "Làm Figma cơ bản", "value": "figma_basic" }
    ],
    "display_order": 1
  },
  {
    "question_key": "finance_excel_level",
    "question_group": "finance_student",
    "question": "Bạn dùng Excel ở mức nào?",
    "type": "single",
    "options": [
      { "label": "Ít dùng", "value": "low" },
      { "label": "Dùng cơ bản", "value": "basic" },
      { "label": "Dùng nhiều công thức, nhiều sheet", "value": "medium" },
      { "label": "Dùng file lớn, dữ liệu nhiều", "value": "heavy" }
    ],
    "display_order": 2
  },
  {
    "question_key": "finance_browser_tabs",
    "question_group": "finance_student",
    "question": "Bạn có thường xuyên mở nhiều tab trình duyệt không?",
    "type": "single",
    "options": [
      { "label": "Ít", "value": "low" },
      { "label": "Thỉnh thoảng", "value": "medium" },
      { "label": "Thường xuyên mở nhiều tab", "value": "high" }
    ],
    "display_order": 3
  },
  {
    "question_key": "finance_meeting",
    "question_group": "finance_student",
    "question": "Bạn có thường xuyên thuyết trình hoặc họp online không?",
    "type": "single",
    "options": [
      { "label": "Ít", "value": "low" },
      { "label": "Thỉnh thoảng", "value": "medium" },
      { "label": "Thường xuyên", "value": "high" }
    ],
    "display_order": 4
  },
  {
    "question_key": "finance_laptop_style",
    "question_group": "finance_student",
    "question": "Bạn muốn laptop thiên về kiểu nào?",
    "type": "multiple",
    "options": [
      { "label": "Giá hợp lý", "value": "value_for_money" },
      { "label": "Mỏng nhẹ", "value": "thin_light" },
      { "label": "Pin lâu", "value": "battery_good" },
      { "label": "Bàn phím dễ gõ", "value": "keyboard_good" },
      { "label": "Webcam/mic ổn", "value": "webcam_good" },
      { "label": "Ngoại hình đẹp", "value": "good_looking" },
      { "label": "Thương hiệu phổ biến", "value": "popular_brand" }
    ],
    "display_order": 5
  }
];

const designQuestions = [
  {
    "question_key": "design_fields",
    "question_group": "design_student",
    "question": "Bạn học hoặc làm mảng nào?",
    "type": "multiple",
    "options": [
      { "label": "Thiết kế đồ họa 2D", "value": "graphic_2d" },
      { "label": "UI/UX design", "value": "ui_ux" },
      { "label": "Chỉnh ảnh", "value": "photo_editing" },
      { "label": "Thiết kế poster/banner", "value": "poster_banner" },
      { "label": "Dựng video", "value": "video_editing" },
      { "label": "Motion graphic", "value": "motion_graphic" },
      { "label": "3D / render", "value": "render_3d" },
      { "label": "Kiến trúc / nội thất", "value": "architecture_interior" }
    ],
    "display_order": 1
  },
  {
    "question_key": "design_software",
    "question_group": "design_student",
    "question": "Bạn thường dùng phần mềm nào?",
    "type": "multiple",
    "options": [
      { "label": "Canva", "value": "canva" },
      { "label": "Figma", "value": "figma" },
      { "label": "Photoshop", "value": "photoshop" },
      { "label": "Illustrator", "value": "illustrator" },
      { "label": "Lightroom", "value": "lightroom" },
      { "label": "Premiere Pro", "value": "premiere" },
      { "label": "After Effects", "value": "after_effects" },
      { "label": "Blender", "value": "blender" },
      { "label": "SketchUp", "value": "sketchup" },
      { "label": "AutoCAD", "value": "autocad" }
    ],
    "display_order": 2
  },
  {
    "question_key": "design_level",
    "question_group": "design_student",
    "question": "Mức độ thiết kế của bạn hiện tại?",
    "type": "single",
    "options": [
      { "label": "Cơ bản, làm bài tập nhẹ", "value": "basic" },
      { "label": "Trung bình, dùng phần mềm thường xuyên", "value": "medium" },
      { "label": "Nặng, làm project lớn hoặc render", "value": "heavy" }
    ],
    "display_order": 3
  },
  {
    "question_key": "design_color_screen",
    "question_group": "design_student",
    "question": "Bạn có cần màn hình màu đẹp không?",
    "type": "single",
    "options": [
      { "label": "Không quá quan trọng", "value": "not_important" },
      { "label": "Cần màn hình ổn", "value": "good" },
      { "label": "Rất cần màu đẹp, màu chuẩn", "value": "color_accurate" }
    ],
    "display_order": 4
  },
  {
    "question_key": "design_video",
    "question_group": "design_student",
    "question": "Bạn có dựng video không?",
    "type": "single",
    "options": [
      { "label": "Không", "value": "no" },
      { "label": "Có, video ngắn nhẹ", "value": "light" },
      { "label": "Có, video dài hoặc nặng", "value": "heavy" }
    ],
    "display_order": 5
  },
  {
    "question_key": "design_3d_render",
    "question_group": "design_student",
    "question": "Bạn có làm 3D/render không?",
    "type": "single",
    "options": [
      { "label": "Không", "value": "no" },
      { "label": "Có, mức cơ bản", "value": "basic" },
      { "label": "Có, thường xuyên", "value": "frequent" }
    ],
    "display_order": 6
  },
  {
    "question_key": "design_power_vs_portability",
    "question_group": "design_student",
    "question": "Bạn ưu tiên máy mạnh hay máy nhẹ?",
    "type": "single",
    "options": [
      { "label": "Máy nhẹ, dễ mang đi", "value": "portable" },
      { "label": "Cân bằng", "value": "balanced" },
      { "label": "Máy mạnh, nặng hơn cũng được", "value": "power" }
    ],
    "display_order": 7
  }
];

const officeQuestions = [
  {
    "question_key": "office_tasks",
    "question_group": "office_worker",
    "question": "Công việc chính của bạn là gì?",
    "type": "multiple",
    "options": [
      { "label": "Soạn thảo Word", "value": "word" },
      { "label": "Làm Excel", "value": "excel" },
      { "label": "Làm PowerPoint", "value": "powerpoint" },
      { "label": "Kế toán", "value": "accounting" },
      { "label": "Sale / chăm sóc khách hàng", "value": "sales_customer_service" },
      { "label": "Quản lý dữ liệu", "value": "data_management" },
      { "label": "Họp online", "value": "online_meeting" },
      { "label": "Làm việc nhiều tab trình duyệt", "value": "many_browser_tabs" }
    ],
    "display_order": 1
  },
  {
    "question_key": "office_excel_level",
    "question_group": "office_worker",
    "question": "Bạn dùng Excel ở mức nào?",
    "type": "single",
    "options": [
      { "label": "Không dùng nhiều", "value": "low" },
      { "label": "Dùng cơ bản", "value": "basic" },
      { "label": "Dùng nhiều sheet/công thức", "value": "medium" },
      { "label": "Dùng file lớn, dữ liệu nặng", "value": "heavy" }
    ],
    "display_order": 2
  },
  {
    "question_key": "office_num_keyboard",
    "question_group": "office_worker",
    "question": "Bạn có cần bàn phím số không?",
    "type": "single",
    "options": [
      { "label": "Không cần", "value": "no" },
      { "label": "Có thì tốt", "value": "nice_to_have" },
      { "label": "Bắt buộc cần", "value": "required" }
    ],
    "display_order": 3
  },
  {
    "question_key": "office_meeting",
    "question_group": "office_worker",
    "question": "Bạn có họp online nhiều không?",
    "type": "single",
    "options": [
      { "label": "Ít", "value": "low" },
      { "label": "Thỉnh thoảng", "value": "medium" },
      { "label": "Hằng ngày", "value": "daily" }
    ],
    "display_order": 4
  },
  {
    "question_key": "office_work_location",
    "question_group": "office_worker",
    "question": "Bạn thường làm việc ở đâu?",
    "type": "single",
    "options": [
      { "label": "Văn phòng cố định", "value": "fixed_office" },
      { "label": "Hay đi gặp khách hàng", "value": "meet_clients" },
      { "label": "Làm việc hybrid, di chuyển nhiều", "value": "hybrid_mobile" }
    ],
    "display_order": 5
  },
  {
    "question_key": "office_priorities",
    "question_group": "office_worker",
    "question": "Bạn ưu tiên yếu tố nào cho công việc?",
    "type": "multiple",
    "options": [
      { "label": "Pin lâu", "value": "battery_good" },
      { "label": "Máy nhẹ", "value": "lightweight" },
      { "label": "Bền, ít lỗi", "value": "durable" },
      { "label": "Bàn phím tốt", "value": "keyboard_good" },
      { "label": "Webcam/mic tốt", "value": "webcam_good" },
      { "label": "Màn hình lớn", "value": "large_screen" },
      { "label": "Giá hợp lý", "value": "value_for_money" }
    ],
    "display_order": 6
  }
];

const contentCreatorQuestions = [
  {
    "question_key": "content_type",
    "question_group": "content_creator",
    "question": "Bạn làm nội dung dạng nào?",
    "type": "multiple",
    "options": [
      { "label": "Video TikTok/Reels ngắn", "value": "short_video" },
      { "label": "YouTube cơ bản", "value": "youtube_basic" },
      { "label": "Video dài", "value": "long_video" },
      { "label": "Livestream", "value": "livestream" },
      { "label": "Chỉnh ảnh + dựng video", "value": "photo_video" },
      { "label": "Motion graphic", "value": "motion_graphic" },
      { "label": "Nội dung quảng cáo", "value": "ads_content" },
      { "label": "Podcast/video phỏng vấn", "value": "podcast_interview" }
    ],
    "display_order": 1
  },
  {
    "question_key": "content_software",
    "question_group": "content_creator",
    "question": "Bạn thường dùng phần mềm nào?",
    "type": "multiple",
    "options": [
      { "label": "CapCut", "value": "capcut" },
      { "label": "Canva", "value": "canva" },
      { "label": "Photoshop", "value": "photoshop" },
      { "label": "Lightroom", "value": "lightroom" },
      { "label": "Premiere Pro", "value": "premiere" },
      { "label": "After Effects", "value": "after_effects" },
      { "label": "DaVinci Resolve", "value": "davinci" },
      { "label": "OBS Studio", "value": "obs" }
    ],
    "display_order": 2
  },
  {
    "question_key": "content_resolution",
    "question_group": "content_creator",
    "question": "Bạn dựng video ở độ phân giải nào?",
    "type": "single",
    "options": [
      { "label": "1080p", "value": "1080p" },
      { "label": "2K", "value": "2k" },
      { "label": "4K", "value": "4k" },
      { "label": "Không biết", "value": "unknown" }
    ],
    "display_order": 3
  },
  {
    "question_key": "content_editing_level",
    "question_group": "content_creator",
    "question": "Bạn dựng video nặng ở mức nào?",
    "type": "single",
    "options": [
      { "label": "Video ngắn, cắt ghép đơn giản", "value": "basic" },
      { "label": "Video dài, nhiều layer", "value": "medium" },
      { "label": "Video nhiều hiệu ứng, màu sắc, animation", "value": "heavy" }
    ],
    "display_order": 4
  },
  {
    "question_key": "content_storage_need",
    "question_group": "content_creator",
    "question": "Bạn có lưu nhiều video trong máy không?",
    "type": "single",
    "options": [
      { "label": "Ít", "value": "low" },
      { "label": "Vừa", "value": "medium" },
      { "label": "Rất nhiều", "value": "high" }
    ],
    "display_order": 5
  },
  {
    "question_key": "content_priorities",
    "question_group": "content_creator",
    "question": "Bạn ưu tiên điều gì?",
    "type": "multiple",
    "options": [
      { "label": "Render nhanh", "value": "fast_render" },
      { "label": "Màn hình đẹp", "value": "color_screen" },
      { "label": "Bộ nhớ lớn", "value": "large_storage" },
      { "label": "Tản nhiệt tốt", "value": "cooling_good" },
      { "label": "Máy nhẹ", "value": "lightweight" },
      { "label": "Giá hợp lý", "value": "value_for_money" }
    ],
    "display_order": 6
  }
];

const gamerQuestions = [
  {
    "question_key": "gamer_games",
    "question_group": "gamer",
    "question": "Bạn chơi game gì là chính?",
    "type": "multiple",
    "options": [
      { "label": "Liên Minh Huyền Thoại", "value": "lol" },
      { "label": "Valorant", "value": "valorant" },
      { "label": "FIFA Online", "value": "fifa_online" },
      { "label": "Genshin Impact", "value": "genshin" },
      { "label": "GTA V", "value": "gta_v" },
      { "label": "PUBG / Apex / Warzone", "value": "fps_heavy" },
      { "label": "Game AAA nặng", "value": "aaa_games" },
      { "label": "Game indie/giải trí nhẹ", "value": "indie_light" },
      { "label": "Chưa rõ, chỉ muốn chơi game ổn", "value": "general_gaming" }
    ],
    "display_order": 1
  },
  {
    "question_key": "gamer_graphic_level",
    "question_group": "gamer",
    "question": "Bạn muốn chơi ở mức đồ họa nào?",
    "type": "single",
    "options": [
      { "label": "Low/Medium là được", "value": "low_medium" },
      { "label": "Medium/High", "value": "medium_high" },
      { "label": "High, FPS ổn định", "value": "high_fps" }
    ],
    "display_order": 2
  },
  {
    "question_key": "gamer_extra_use",
    "question_group": "gamer",
    "question": "Bạn có dùng laptop cho việc khác ngoài game không?",
    "type": "multiple",
    "options": [
      { "label": "Học tập/văn phòng", "value": "study_office" },
      { "label": "Lập trình", "value": "coding" },
      { "label": "Thiết kế đồ họa", "value": "design" },
      { "label": "Dựng video", "value": "video_editing" },
      { "label": "Chỉ chơi game là chính", "value": "gaming_only" }
    ],
    "display_order": 3
  },
  {
    "question_key": "gamer_weight_battery_acceptance",
    "question_group": "gamer",
    "question": "Bạn có chấp nhận máy nặng và pin yếu hơn không?",
    "type": "single",
    "options": [
      { "label": "Không, vẫn muốn máy nhẹ", "value": "want_light" },
      { "label": "Có thể chấp nhận", "value": "acceptable" },
      { "label": "Chấp nhận, miễn máy mạnh", "value": "performance_first" }
    ],
    "display_order": 4
  },
  {
    "question_key": "gamer_cooling",
    "question_group": "gamer",
    "question": "Bạn có quan tâm tản nhiệt không?",
    "type": "single",
    "options": [
      { "label": "Không rõ", "value": "unknown" },
      { "label": "Có", "value": "yes" },
      { "label": "Rất quan trọng", "value": "very_important" }
    ],
    "display_order": 5
  },
  {
    "question_key": "gamer_refresh_rate",
    "question_group": "gamer",
    "question": "Bạn có cần màn hình tần số quét cao không?",
    "type": "single",
    "options": [
      { "label": "Không cần", "value": "no" },
      { "label": "Có thì tốt", "value": "nice_to_have" },
      { "label": "Bắt buộc cần 120Hz/144Hz trở lên", "value": "required" }
    ],
    "display_order": 6
  }
];

const beginnerQuestions = [
  {
    "question_key": "beginner_buy_for",
    "question_group": "beginner",
    "question": "Bạn mua laptop cho ai?",
    "type": "single",
    "options": [
      { "label": "Cho bản thân", "value": "self" },
      { "label": "Cho con/em đi học", "value": "family_student" },
      { "label": "Cho công việc", "value": "work" },
      { "label": "Cho gia đình dùng chung", "value": "family_shared" },
      { "label": "Chưa rõ, cần tư vấn", "value": "unknown" }
    ],
    "display_order": 1
  },
  {
    "question_key": "beginner_daily_tasks",
    "question_group": "beginner",
    "question": "Bạn thường làm gì trên laptop?",
    "type": "multiple",
    "options": [
      { "label": "Học online", "value": "online_learning" },
      { "label": "Làm bài tập", "value": "homework" },
      { "label": "Xem phim, lướt web", "value": "web_movie" },
      { "label": "Làm việc văn phòng", "value": "office_work" },
      { "label": "Chơi game nhẹ", "value": "light_gaming" },
      { "label": "Thiết kế/chỉnh ảnh cơ bản", "value": "basic_design" },
      { "label": "Lập trình cơ bản", "value": "basic_coding" },
      { "label": "Dựng video nhẹ", "value": "light_video" }
    ],
    "display_order": 2
  },
  {
    "question_key": "beginner_laptop_style",
    "question_group": "beginner",
    "question": "Bạn muốn laptop kiểu nào?",
    "type": "multiple",
    "options": [
      { "label": "Rẻ, đủ dùng", "value": "cheap_enough" },
      { "label": "Nhẹ, dễ mang", "value": "lightweight" },
      { "label": "Bền, dùng lâu", "value": "durable" },
      { "label": "Mạnh, chạy mượt", "value": "smooth_performance" },
      { "label": "Đẹp, hiện đại", "value": "good_looking" },
      { "label": "Pin lâu", "value": "battery_good" },
      { "label": "Dễ sử dụng", "value": "easy_use" }
    ],
    "display_order": 3
  },
  {
    "question_key": "beginner_concerns",
    "question_group": "beginner",
    "question": "Bạn lo nhất điều gì khi mua laptop?",
    "type": "multiple",
    "options": [
      { "label": "Không hiểu thông số", "value": "dont_understand_specs" },
      { "label": "Sợ mua máy yếu", "value": "too_weak" },
      { "label": "Sợ mua dư cấu hình", "value": "overbuy" },
      { "label": "Sợ bị tư vấn sai", "value": "wrong_advice" },
      { "label": "Sợ máy nhanh lỗi", "value": "not_durable" },
      { "label": "Sợ giá quá cao", "value": "too_expensive" },
      { "label": "Không biết hãng nào tốt", "value": "unknown_brand" }
    ],
    "display_order": 4
  },
  {
    "question_key": "beginner_advice_style",
    "question_group": "beginner",
    "question": "Bạn muốn hệ thống tư vấn theo kiểu nào?",
    "type": "multiple",
    "options": [
      { "label": "Gợi ý nhanh 3 mẫu", "value": "quick_top_3" },
      { "label": "Giải thích kỹ lý do chọn", "value": "explain_reason" },
      { "label": "So sánh các mẫu trước khi mua", "value": "compare_before_buy" },
      { "label": "Có checklist trước khi mua", "value": "buying_checklist" },
      { "label": "Giải thích CPU/RAM/SSD dễ hiểu", "value": "explain_specs" }
    ],
    "display_order": 5
  },
  {
    "question_key": "beginner_usage_years_expectation",
    "question_group": "beginner",
    "question": "Bạn có muốn máy dùng ổn trong nhiều năm không?",
    "type": "single",
    "options": [
      { "label": "Chỉ cần đủ dùng hiện tại", "value": "current_only" },
      { "label": "Muốn dùng ổn 3–4 năm", "value": "3_4_years" },
      { "label": "Muốn dùng lâu nhất có thể trong ngân sách", "value": "long_term" }
    ],
    "display_order": 6
  }
];

const allQuestions = [
  ...commonQuestions,
  ...itQuestions,
  ...financeQuestions,
  ...designQuestions,
  ...officeQuestions,
  ...contentCreatorQuestions,
  ...gamerQuestions,
  ...beginnerQuestions
];

async function seed() {
  console.log('Clearing existing quiz_questions...');
  const { error: deleteError } = await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error clearing questions:', deleteError);
    return;
  }
  
  console.log(`Inserting ${allQuestions.length} new questions...`);
  const { error: insertError } = await supabase.from('quiz_questions').insert(allQuestions);
  if (insertError) {
    console.error('Error inserting questions:', insertError);
  } else {
    console.log('Seed completed successfully!');
  }
}

seed();
