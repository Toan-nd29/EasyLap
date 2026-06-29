// ================================================================
// EasyLap – LaptopMatchVN App Engine
// Branching quiz flow: Common (5q) → User Group Detection → Group-specific Qs → Results
// ================================================================

const GROUP_INFO = {
    it: {
        label: 'Sinh viên CNTT / Lập trình',
        icon: '💻',
        scoreTags: ['ram_16gb', 'ssd_512gb', 'cpu_strong', 'upgradeable', 'coding'],
        tagWeights: { ram_16gb: 20, ssd_512gb: 15, cpu_strong: 15, upgradeable: 10, coding: 15 }
    },
    finance: {
        label: 'Sinh viên Tài chính / Kinh tế / Marketing',
        icon: '📊',
        scoreTags: ['lightweight', 'battery_good', 'office', 'excel', 'webcam_good'],
        tagWeights: { lightweight: 20, battery_good: 15, office: 15, excel: 10, webcam_good: 10 }
    },
    design: {
        label: 'Sinh viên Thiết kế đồ họa',
        icon: '🎨',
        scoreTags: ['color_screen', 'ram_16gb', 'gpu_dedicated', 'design'],
        tagWeights: { color_screen: 20, ram_16gb: 15, gpu_dedicated: 20, design: 15 }
    },
    office: {
        label: 'Nhân viên văn phòng',
        icon: '🏢',
        scoreTags: ['lightweight', 'battery_good', 'office', 'excel', 'webcam_good', 'durable'],
        tagWeights: { lightweight: 15, battery_good: 15, office: 15, excel: 10, webcam_good: 10, durable: 10 }
    },
    gaming: {
        label: 'Người chơi game',
        icon: '🎮',
        scoreTags: ['gpu_dedicated', 'cooling_good', 'high_refresh_rate', 'ram_16gb'],
        tagWeights: { gpu_dedicated: 25, cooling_good: 15, high_refresh_rate: 15, ram_16gb: 10 }
    },
    creator: {
        label: 'Người làm video / Content creator',
        icon: '🎬',
        scoreTags: ['cpu_strong', 'gpu_dedicated', 'ssd_large', 'color_screen', 'ram_16gb'],
        tagWeights: { cpu_strong: 15, gpu_dedicated: 20, ssd_large: 10, color_screen: 15, ram_16gb: 15 }
    },
    firsttime: {
        label: 'Người mua laptop lần đầu',
        icon: '🆕',
        scoreTags: ['easy_use', 'value_for_money', 'durable', 'balanced'],
        tagWeights: { easy_use: 20, value_for_money: 20, durable: 15, balanced: 15 }
    }
};

// ----------------------------------------------------------------
// Common questions (phases 1–5, for ALL users)
// ----------------------------------------------------------------
const COMMON_QUESTIONS = [
    {
        id: 'userGroup',
        text: 'Bạn thuộc nhóm người dùng nào?',
        type: 'single',
        options: [
            { value: 'it',        label: 'Sinh viên Công nghệ thông tin / Lập trình', icon: '💻' },
            { value: 'finance',   label: 'Sinh viên Tài chính / Kinh tế / Marketing', icon: '📊' },
            { value: 'design',    label: 'Sinh viên Thiết kế đồ họa / Mỹ thuật / Truyền thông', icon: '🎨' },
            { value: 'office',    label: 'Nhân viên văn phòng', icon: '🏢' },
            { value: 'gaming',    label: 'Người chơi game', icon: '🎮' },
            { value: 'creator',   label: 'Người làm video / Content creator', icon: '🎬' },
            { value: 'firsttime', label: 'Người mua laptop lần đầu, chưa biết chọn gì', icon: '🆕' }
        ]
    },
    {
        id: 'budget',
        text: 'Ngân sách của bạn là bao nhiêu?',
        type: 'single',
        options: [
            { value: 10,  label: 'Dưới 10 triệu' },
            { value: 15,  label: '10–15 triệu' },
            { value: 20,  label: '15–20 triệu' },
            { value: 25,  label: '20–25 triệu' },
            { value: 30,  label: '25–30 triệu' },
            { value: 100, label: 'Trên 30 triệu' }
        ]
    },
    {
        id: 'mobility',
        text: 'Bạn có thường xuyên mang laptop đi học/đi làm không?',
        type: 'single',
        options: [
            { value: 'low',    label: 'Rất ít, chủ yếu để một chỗ' },
            { value: 'medium', label: 'Thỉnh thoảng' },
            { value: 'high',   label: 'Thường xuyên mang đi hằng ngày' }
        ]
    },
    {
        id: 'lifespan',
        text: 'Bạn muốn dùng laptop trong bao lâu?',
        type: 'single',
        options: [
            { value: 2, label: '1–2 năm' },
            { value: 4, label: '3–4 năm' },
            { value: 5, label: 'Trên 4 năm' }
        ]
    },
    {
        id: 'priorities',
        text: 'Bạn ưu tiên điều gì nhất?',
        type: 'multi',
        options: [
            { value: 'price',     label: 'Giá rẻ' },
            { value: 'light',     label: 'Máy nhẹ' },
            { value: 'battery',   label: 'Pin lâu' },
            { value: 'perf',      label: 'Hiệu năng mạnh' },
            { value: 'screen',    label: 'Màn hình đẹp' },
            { value: 'durable',   label: 'Bền, ít lỗi' },
            { value: 'upgrade',   label: 'Dễ nâng cấp RAM/SSD' },
            { value: 'look',      label: 'Ngoại hình đẹp' }
        ]
    }
];

function getBudgetRange(value) {
    const key = String(value || '').trim();
    const ranges = {
        '10': { min: 0, max: 10000000 },
        '15': { min: 10000000, max: 15000000 },
        '20': { min: 15000000, max: 20000000 },
        '25': { min: 20000000, max: 25000000 },
        '30': { min: 25000000, max: 30000000 },
        '100': { min: 30000000, max: Infinity },
        'under-10': { min: 0, max: 10000000 },
        '10-15': { min: 10000000, max: 15000000 },
        '15-20': { min: 15000000, max: 20000000 },
        '20-25': { min: 20000000, max: 25000000 },
        '25-30': { min: 25000000, max: 30000000 },
        '20-30': { min: 20000000, max: 30000000 },
        'over-30': { min: 30000000, max: Infinity }
    };

    return ranges[key] || null;
}

function isInBudget(price, range) {
    if (!range) return true;
    return price >= range.min && price <= range.max;
}

// ----------------------------------------------------------------
// Group-specific question banks
// ----------------------------------------------------------------
const GROUP_QUESTIONS = {
    it: [
        {
            id: 'it_field',
            text: 'Bạn học hoặc làm mảng nào là chính?',
            type: 'multi',
            options: [
                { value: 'basic',    label: 'Lập trình cơ bản ở trường' },
                { value: 'web',      label: 'Web development' },
                { value: 'mobile',   label: 'Mobile app' },
                { value: 'java_net', label: 'Java / .NET' },
                { value: 'data_ai',  label: 'Data / AI cơ bản' },
                { value: 'security', label: 'Cybersecurity / máy ảo' },
                { value: 'gamedev',  label: 'Game development' }
            ]
        },
        {
            id: 'it_software',
            text: 'Bạn thường dùng phần mềm nào?',
            type: 'multi',
            options: [
                { value: 'vscode',       label: 'VS Code' },
                { value: 'netbeans_ij',  label: 'NetBeans / IntelliJ / Eclipse' },
                { value: 'android',      label: 'Android Studio' },
                { value: 'sql',          label: 'SQL Server / MySQL' },
                { value: 'docker',       label: 'Docker' },
                { value: 'vm',           label: 'VMware / VirtualBox' },
                { value: 'figma_basic',  label: 'Figma cơ bản' }
            ]
        },
        {
            id: 'it_vm',
            text: 'Bạn có cần chạy máy ảo hoặc Docker không?',
            type: 'single',
            options: [
                { value: 'none',   label: 'Không cần' },
                { value: 'light',  label: 'Có, nhưng nhẹ' },
                { value: 'heavy',  label: 'Có, dùng thường xuyên' }
            ]
        },
        {
            id: 'it_android',
            text: 'Bạn có cần dùng Android Studio không?',
            type: 'single',
            options: [
                { value: 'no',        label: 'Không' },
                { value: 'sometimes', label: 'Có, thỉnh thoảng' },
                { value: 'often',     label: 'Có, thường xuyên' }
            ]
        },
        {
            id: 'it_gaming',
            text: 'Bạn có chơi game hoặc làm đồ họa nặng không?',
            type: 'multi',
            options: [
                { value: 'none',         label: 'Không' },
                { value: 'game_light',   label: 'Game nhẹ' },
                { value: 'game_mid',     label: 'Game trung bình' },
                { value: 'game_heavy',   label: 'Game nặng' },
                { value: 'graphic_basic',label: 'Có làm đồ họa cơ bản' },
                { value: 'graphic_heavy',label: 'Có làm đồ họa nặng' }
            ]
        },
        {
            id: 'it_upgrade',
            text: 'Bạn có muốn nâng cấp RAM/SSD sau này không?',
            type: 'single',
            options: [
                { value: 'dunno',  label: 'Không biết' },
                { value: 'maybe',  label: 'Có thể cần' },
                { value: 'yes',    label: 'Chắc chắn cần' }
            ]
        }
    ],
    finance: [
        {
            id: 'fin_usage',
            text: 'Bạn dùng laptop chủ yếu để làm gì?',
            type: 'multi',
            options: [
                { value: 'online',   label: 'Học online' },
                { value: 'word_ppt', label: 'Làm Word, PowerPoint' },
                { value: 'excel',    label: 'Làm Excel' },
                { value: 'report',   label: 'Làm báo cáo, thuyết trình' },
                { value: 'marketing',label: 'Làm marketing, quản lý fanpage' },
                { value: 'canva',    label: 'Thiết kế Canva/Figma cơ bản' }
            ]
        },
        {
            id: 'fin_excel',
            text: 'Bạn có dùng Excel nhiều không?',
            type: 'single',
            options: [
                { value: 'low',   label: 'Ít' },
                { value: 'basic', label: 'Có, mức cơ bản' },
                { value: 'heavy', label: 'Có, file lớn, nhiều công thức' }
            ]
        },
        {
            id: 'fin_present',
            text: 'Bạn có thường xuyên thuyết trình hoặc họp online không?',
            type: 'single',
            options: [
                { value: 'rarely',     label: 'Ít' },
                { value: 'sometimes',  label: 'Thỉnh thoảng' },
                { value: 'often',      label: 'Thường xuyên' }
            ]
        },
        {
            id: 'fin_portable',
            text: 'Bạn có cần máy nhẹ để mang đi học không?',
            type: 'single',
            options: [
                { value: 'no',     label: 'Không quan trọng' },
                { value: 'prefer', label: 'Càng nhẹ càng tốt' },
                { value: 'must',   label: 'Bắt buộc nhẹ, dễ mang' }
            ]
        },
        {
            id: 'fin_style',
            text: 'Bạn thích laptop kiểu nào?',
            type: 'multi',
            options: [
                { value: 'cheap',    label: 'Giá rẻ, đủ dùng' },
                { value: 'slim',     label: 'Mỏng nhẹ, đẹp' },
                { value: 'battery',  label: 'Pin lâu' },
                { value: 'durable',  label: 'Bền, ổn định' },
                { value: 'brand',    label: 'Thương hiệu phổ biến' },
                { value: 'screen',   label: 'Màn hình đẹp' }
            ]
        }
    ],
    design: [
        {
            id: 'ds_level',
            text: 'Bạn làm thiết kế ở mức nào?',
            type: 'multi',
            options: [
                { value: 'canva_basic', label: 'Thiết kế cơ bản bằng Canva' },
                { value: 'figma',       label: 'Figma / UI design' },
                { value: 'ps_ai',       label: 'Photoshop / Illustrator' },
                { value: 'photo_edit',  label: 'Chỉnh ảnh' },
                { value: 'video_basic', label: 'Dựng video cơ bản' },
                { value: 'three_d',     label: '3D / render' },
                { value: 'pro',         label: 'Thiết kế chuyên nghiệp' }
            ]
        },
        {
            id: 'ds_software',
            text: 'Bạn thường dùng phần mềm nào?',
            type: 'multi',
            options: [
                { value: 'canva',     label: 'Canva' },
                { value: 'figma',     label: 'Figma' },
                { value: 'ps',        label: 'Photoshop' },
                { value: 'ai',        label: 'Illustrator' },
                { value: 'lr',        label: 'Lightroom' },
                { value: 'pr',        label: 'Premiere Pro' },
                { value: 'ae',        label: 'After Effects' },
                { value: 'blender',   label: 'Blender' },
                { value: 'sketchup',  label: 'SketchUp' },
                { value: 'autocad',   label: 'AutoCAD' }
            ]
        },
        {
            id: 'ds_color',
            text: 'Bạn có cần màn hình màu đẹp không?',
            type: 'single',
            options: [
                { value: 'low',    label: 'Không quá quan trọng' },
                { value: 'ok',     label: 'Có, cần màn hình ổn' },
                { value: 'must',   label: 'Rất cần, màu phải chuẩn' }
            ]
        },
        {
            id: 'ds_video',
            text: 'Bạn có dựng video không?',
            type: 'single',
            options: [
                { value: 'no',     label: 'Không' },
                { value: 'light',  label: 'Có, video ngắn nhẹ' },
                { value: 'heavy',  label: 'Có, video dài/nặng' }
            ]
        },
        {
            id: 'ds_3d',
            text: 'Bạn có làm 3D hoặc render không?',
            type: 'single',
            options: [
                { value: 'no',     label: 'Không' },
                { value: 'basic',  label: 'Có, mức cơ bản' },
                { value: 'often',  label: 'Có, thường xuyên' }
            ]
        },
        {
            id: 'ds_priority',
            text: 'Bạn ưu tiên máy mạnh hay máy nhẹ?',
            type: 'single',
            options: [
                { value: 'light',    label: 'Máy nhẹ, dễ mang đi' },
                { value: 'balanced', label: 'Cân bằng' },
                { value: 'power',    label: 'Máy mạnh, nặng hơn cũng được' }
            ]
        }
    ],
    office: [
        {
            id: 'off_job',
            text: 'Công việc chính của bạn là gì?',
            type: 'multi',
            options: [
                { value: 'word_xls',  label: 'Word, Excel, PowerPoint' },
                { value: 'accounting',label: 'Kế toán' },
                { value: 'sales',     label: 'Sale / chăm sóc khách hàng' },
                { value: 'meetings',  label: 'Họp online thường xuyên' },
                { value: 'data',      label: 'Quản lý dữ liệu' },
                { value: 'multitask', label: 'Làm việc đa nhiệm nhiều tab' }
            ]
        },
        {
            id: 'off_excel',
            text: 'Bạn có dùng Excel nặng không?',
            type: 'single',
            options: [
                { value: 'no',     label: 'Không' },
                { value: 'mid',    label: 'Có, mức vừa' },
                { value: 'heavy',  label: 'Có, file lớn, nhiều sheet/công thức' }
            ]
        },
        {
            id: 'off_meetings',
            text: 'Bạn có họp online nhiều không?',
            type: 'single',
            options: [
                { value: 'rarely',   label: 'Ít' },
                { value: 'sometime', label: 'Thỉnh thoảng' },
                { value: 'daily',    label: 'Hằng ngày' }
            ]
        },
        {
            id: 'off_numpad',
            text: 'Bạn có cần bàn phím số (numpad) không?',
            type: 'single',
            options: [
                { value: 'no',     label: 'Không cần' },
                { value: 'prefer', label: 'Có thì tốt' },
                { value: 'must',   label: 'Bắt buộc cần' }
            ]
        },
        {
            id: 'off_priorities',
            text: 'Bạn ưu tiên yếu tố nào nhất?',
            type: 'multi',
            options: [
                { value: 'battery',  label: 'Pin lâu' },
                { value: 'light',    label: 'Máy nhẹ' },
                { value: 'durable',  label: 'Bền' },
                { value: 'keyboard', label: 'Bàn phím tốt' },
                { value: 'bigscreen',label: 'Màn hình lớn' },
                { value: 'price',    label: 'Giá hợp lý' },
                { value: 'webcam',   label: 'Webcam/mic tốt' }
            ]
        },
        {
            id: 'off_location',
            text: 'Bạn thường làm việc ở đâu?',
            type: 'single',
            options: [
                { value: 'fixed',   label: 'Văn phòng cố định' },
                { value: 'client',  label: 'Hay đi gặp khách hàng' },
                { value: 'hybrid',  label: 'Làm việc hybrid, di chuyển nhiều' }
            ]
        }
    ],
    gaming: [
        {
            id: 'gm_games',
            text: 'Bạn chơi game gì là chính?',
            type: 'multi',
            options: [
                { value: 'lol',      label: 'LOL' },
                { value: 'valorant', label: 'Valorant' },
                { value: 'fifa',     label: 'FIFA Online' },
                { value: 'genshin',  label: 'Genshin Impact' },
                { value: 'gta',      label: 'GTA V' },
                { value: 'pubg',     label: 'PUBG / Apex / Warzone' },
                { value: 'aaa',      label: 'Game AAA nặng' },
                { value: 'casual',   label: 'Chưa rõ, chỉ muốn chơi game giải trí' }
            ]
        },
        {
            id: 'gm_quality',
            text: 'Bạn muốn chơi ở mức đồ họa nào?',
            type: 'single',
            options: [
                { value: 'low',  label: 'Low/Medium là được' },
                { value: 'mid',  label: 'Medium/High' },
                { value: 'high', label: 'High, FPS ổn định' }
            ]
        },
        {
            id: 'gm_work',
            text: 'Bạn có cần laptop để học/làm việc thêm không?',
            type: 'multi',
            options: [
                { value: 'study',   label: 'Có, học tập/văn phòng' },
                { value: 'coding',  label: 'Có, lập trình' },
                { value: 'design',  label: 'Có, thiết kế' },
                { value: 'gameonly',label: 'Không, chủ yếu chơi game' }
            ]
        },
        {
            id: 'gm_weight',
            text: 'Bạn có chấp nhận máy nặng và pin yếu hơn không?',
            type: 'single',
            options: [
                { value: 'no',     label: 'Không' },
                { value: 'maybe',  label: 'Có thể chấp nhận' },
                { value: 'yes',    label: 'Chấp nhận, miễn máy mạnh' }
            ]
        },
        {
            id: 'gm_cooling',
            text: 'Bạn có quan tâm tản nhiệt không?',
            type: 'single',
            options: [
                { value: 'dunno',      label: 'Không rõ' },
                { value: 'care',       label: 'Có' },
                { value: 'very',       label: 'Rất quan trọng' }
            ]
        }
    ],
    creator: [
        {
            id: 'cr_type',
            text: 'Bạn làm nội dung dạng nào?',
            type: 'multi',
            options: [
                { value: 'shorts',  label: 'Video TikTok/Reels ngắn' },
                { value: 'youtube', label: 'YouTube cơ bản' },
                { value: 'longvid', label: 'Dựng video dài' },
                { value: 'live',    label: 'Livestream' },
                { value: 'photo',   label: 'Chỉnh ảnh + dựng video' },
                { value: 'motion',  label: 'Motion graphic' }
            ]
        },
        {
            id: 'cr_resolution',
            text: 'Bạn dựng video độ phân giải nào?',
            type: 'single',
            options: [
                { value: '1080p', label: '1080p' },
                { value: '2k',    label: '2K' },
                { value: '4k',    label: '4K' },
                { value: 'dunno', label: 'Không biết' }
            ]
        },
        {
            id: 'cr_software',
            text: 'Bạn dùng phần mềm nào?',
            type: 'multi',
            options: [
                { value: 'capcut',  label: 'CapCut' },
                { value: 'canva',   label: 'Canva' },
                { value: 'pr',      label: 'Premiere Pro' },
                { value: 'ae',      label: 'After Effects' },
                { value: 'davinci', label: 'DaVinci Resolve' },
                { value: 'ps',      label: 'Photoshop' },
                { value: 'lr',      label: 'Lightroom' }
            ]
        },
        {
            id: 'cr_storage',
            text: 'Bạn có lưu nhiều video trong máy không?',
            type: 'single',
            options: [
                { value: 'low',  label: 'Ít' },
                { value: 'mid',  label: 'Vừa' },
                { value: 'high', label: 'Rất nhiều' }
            ]
        },
        {
            id: 'cr_priority',
            text: 'Bạn ưu tiên gì hơn?',
            type: 'multi',
            options: [
                { value: 'light',    label: 'Máy nhẹ' },
                { value: 'screen',   label: 'Màn hình đẹp' },
                { value: 'render',   label: 'Render nhanh' },
                { value: 'storage',  label: 'Bộ nhớ lớn' },
                { value: 'price',    label: 'Giá hợp lý' },
                { value: 'cooling',  label: 'Tản nhiệt tốt' }
            ]
        }
    ],
    firsttime: [
        {
            id: 'ft_for',
            text: 'Bạn mua laptop cho ai?',
            type: 'single',
            options: [
                { value: 'self',   label: 'Cho bản thân' },
                { value: 'child',  label: 'Cho con/em đi học' },
                { value: 'work',   label: 'Cho công việc' },
                { value: 'unsure', label: 'Chưa rõ, cần tư vấn' }
            ]
        },
        {
            id: 'ft_usage',
            text: 'Bạn thường làm gì trên laptop?',
            type: 'multi',
            options: [
                { value: 'online',  label: 'Học online' },
                { value: 'hw',      label: 'Làm bài tập' },
                { value: 'media',   label: 'Xem phim, lướt web' },
                { value: 'office',  label: 'Làm việc văn phòng' },
                { value: 'game',    label: 'Chơi game' },
                { value: 'design',  label: 'Thiết kế/chỉnh ảnh' },
                { value: 'code',    label: 'Lập trình cơ bản' }
            ]
        },
        {
            id: 'ft_style',
            text: 'Bạn muốn máy kiểu nào?',
            type: 'multi',
            options: [
                { value: 'cheap',    label: 'Rẻ, đủ dùng' },
                { value: 'light',    label: 'Nhẹ, dễ mang' },
                { value: 'durable',  label: 'Bền, dùng lâu' },
                { value: 'powerful', label: 'Mạnh, chạy mượt' },
                { value: 'nice',     label: 'Đẹp, hiện đại' },
                { value: 'battery',  label: 'Pin lâu' }
            ]
        },
        {
            id: 'ft_concern',
            text: 'Bạn có sợ mua nhầm máy không?',
            type: 'multi',
            options: [
                { value: 'specs',    label: 'Có, tôi không hiểu thông số' },
                { value: 'many',     label: 'Có, vì nhiều mẫu quá' },
                { value: 'weak',     label: 'Có, sợ mua máy yếu' },
                { value: 'overspec', label: 'Có, sợ mua dư cấu hình' },
                { value: 'none',     label: 'Không, tôi chỉ cần gợi ý nhanh' }
            ]
        },
        {
            id: 'ft_advice',
            text: 'Bạn muốn website tư vấn theo kiểu nào?',
            type: 'multi',
            options: [
                { value: 'quick',    label: 'Gợi ý nhanh 3 mẫu' },
                { value: 'explain',  label: 'Giải thích kỹ lý do chọn' },
                { value: 'compare',  label: 'So sánh các mẫu trước khi mua' },
                { value: 'checklist',label: 'Có checklist trước khi mua' },
                { value: 'simple',   label: 'Giải thích thông số dễ hiểu' }
            ]
        }
    ]
};

// ----------------------------------------------------------------
// APP
// ----------------------------------------------------------------
const app = {
    currentView: 'home',
    quizState: {
        phase: 'common',   // 'common' | 'transition' | 'group'
        commonStep: 0,
        groupStep: 0,
        userGroup: null,
        answers: { common: {}, group: {} },
        selectedMulti: []  // temp storage while multi answer is being built
    },
    compareList: [],

    init() {
        this.navigate('home');
        const modalHtml = `
        <div class="modal-overlay" id="laptop-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
                <div id="modal-body"></div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    navigate(viewName) {
        this.currentView = viewName;
        const mainContent = document.getElementById('app-content');
        const template = document.getElementById(`view-${viewName}`);
        if (template) {
            mainContent.innerHTML = template.innerHTML;
            if (viewName === 'quiz') {
                this.quizState = {
                    phase: 'common',
                    commonStep: 0,
                    groupStep: 0,
                    userGroup: null,
                    answers: { common: {}, group: {} },
                    selectedMulti: []
                };
                this.renderQuizStep();
            } else if (viewName === 'results') {
                this.renderResults();
            } else if (viewName === 'compare') {
                this.renderCompare();
            }
            window.scrollTo(0, 0);
        }
    },

    // ── Progress helpers ──────────────────────────────────────────
    getTotalSteps() {
        const groupKey = this.quizState.userGroup;
        const groupLen = groupKey ? (GROUP_QUESTIONS[groupKey] || []).length : 0;
        return COMMON_QUESTIONS.length + groupLen;
    },

    getCurrentAbsStep() {
        if (this.quizState.phase === 'common') return this.quizState.commonStep;
        return COMMON_QUESTIONS.length + this.quizState.groupStep;
    },

    // ── Render current quiz step ──────────────────────────────────
    renderQuizStep() {
        const { phase, commonStep, groupStep, userGroup } = this.quizState;
        let q;

        if (phase === 'common') {
            q = COMMON_QUESTIONS[commonStep];
        } else if (phase === 'transition') {
            this.renderGroupTransition();
            return;
        } else {
            const groupQs = GROUP_QUESTIONS[userGroup] || [];
            q = groupQs[groupStep];
        }

        if (!q) {
            this.navigate('results');
            return;
        }

        // Reset multi selection for new question
        this.quizState.selectedMulti = [];

        const totalSteps = this.getTotalSteps();
        const currentStep = this.getCurrentAbsStep();
        const progress = (currentStep / totalSteps) * 100;

        // Update progress
        const progressEl = document.getElementById('quiz-progress');
        const statusEl = document.getElementById('quiz-status');
        if (progressEl) progressEl.style.width = `${progress}%`;
        if (statusEl) statusEl.innerText = `Câu ${currentStep + 1} / ${totalSteps}`;

        const isSingle = q.type === 'single';
        const typeLabel = isSingle
            ? '<span class="question-type-label single">Chọn 1 đáp án</span>'
            : '<span class="question-type-label multi">Có thể chọn nhiều đáp án</span>';

        const showBack = currentStep > 0;
        const backBtn = showBack
            ? `<button class="btn-back" onclick="app.goBack()">← Quay lại</button>`
            : '<span></span>';

        let optionsHtml;
        if (isSingle) {
            optionsHtml = q.options.map(opt => {
                const icon = opt.icon ? `<span style="font-size:20px">${opt.icon}</span>` : '';
                return `
                <div class="option-card" onclick="app.answerSingle('${q.id}', '${opt.value}')" role="button" tabindex="0">
                    <span class="radio-indicator"></span>
                    ${icon}
                    <span>${opt.label}</span>
                </div>`;
            }).join('');
        } else {
            optionsHtml = q.options.map(opt => `
                <div class="option-card multi-card" id="opt-${opt.value}" onclick="app.toggleMulti('${q.id}', '${opt.value}')" role="button" tabindex="0">
                    <span class="check-indicator"></span>
                    <span>${opt.label}</span>
                </div>`).join('');
        }

        const continueBtn = isSingle
            ? ''
            : `<button class="btn-continue" id="continue-btn" disabled onclick="app.confirmMulti('${q.id}')">Tiếp tục →</button>`;

        const html = `
            <div class="question-header">
                ${typeLabel}
                <h2 class="question-title">${q.text}</h2>
            </div>
            <div class="options-grid">${optionsHtml}</div>
            <div class="quiz-nav">
                ${backBtn}
                ${continueBtn}
            </div>
        `;

        const box = document.getElementById('quiz-box');
        if (box) {
            box.innerHTML = html;
            box.style.animation = 'none';
            box.offsetHeight; // reflow
            box.style.animation = 'fadeInUp 0.35s ease';
        }
    },

    answerSingle(questionId, value) {
        const { phase } = this.quizState;
        if (phase === 'common') {
            this.quizState.answers.common[questionId] = value;
            if (questionId === 'userGroup') {
                this.quizState.userGroup = value;
            }
            this.quizState.commonStep++;
            if (this.quizState.commonStep >= COMMON_QUESTIONS.length) {
                this.quizState.phase = 'transition';
            }
        } else {
            this.quizState.answers.group[questionId] = value;
            this.quizState.groupStep++;
            const groupQs = GROUP_QUESTIONS[this.quizState.userGroup] || [];
            if (this.quizState.groupStep >= groupQs.length) {
                this.navigate('results');
                return;
            }
        }
        this.renderQuizStep();
    },

    toggleMulti(questionId, value) {
        const idx = this.quizState.selectedMulti.indexOf(value);
        const card = document.getElementById(`opt-${value}`);
        if (idx > -1) {
            this.quizState.selectedMulti.splice(idx, 1);
            if (card) card.classList.remove('selected');
        } else {
            this.quizState.selectedMulti.push(value);
            if (card) card.classList.add('selected');
        }
        const btn = document.getElementById('continue-btn');
        if (btn) btn.disabled = this.quizState.selectedMulti.length === 0;
    },

    confirmMulti(questionId) {
        const selected = [...this.quizState.selectedMulti];
        if (selected.length === 0) return;
        const { phase } = this.quizState;
        if (phase === 'common') {
            this.quizState.answers.common[questionId] = selected;
            this.quizState.commonStep++;
            if (this.quizState.commonStep >= COMMON_QUESTIONS.length) {
                this.quizState.phase = 'transition';
            }
        } else {
            this.quizState.answers.group[questionId] = selected;
            this.quizState.groupStep++;
            const groupQs = GROUP_QUESTIONS[this.quizState.userGroup] || [];
            if (this.quizState.groupStep >= groupQs.length) {
                this.navigate('results');
                return;
            }
        }
        this.quizState.selectedMulti = [];
        this.renderQuizStep();
    },

    goBack() {
        const { phase, commonStep, groupStep } = this.quizState;
        this.quizState.selectedMulti = [];
        if (phase === 'transition') {
            this.quizState.phase = 'common';
            this.quizState.commonStep--;
            delete this.quizState.answers.common[COMMON_QUESTIONS[this.quizState.commonStep].id];
        } else if (phase === 'group') {
            if (groupStep === 0) {
                this.quizState.phase = 'transition';
                this.renderGroupTransition();
                return;
            } else {
                this.quizState.groupStep--;
                const groupQs = GROUP_QUESTIONS[this.quizState.userGroup] || [];
                delete this.quizState.answers.group[groupQs[this.quizState.groupStep].id];
            }
        } else {
            if (commonStep === 0) return;
            this.quizState.commonStep--;
            delete this.quizState.answers.common[COMMON_QUESTIONS[this.quizState.commonStep].id];
        }
        this.renderQuizStep();
    },

    renderGroupTransition() {
        const group = this.quizState.userGroup;
        const info = GROUP_INFO[group] || { label: 'Người dùng', icon: '👤' };
        const totalSteps = this.getTotalSteps();
        const progress = (COMMON_QUESTIONS.length / totalSteps) * 100;

        const progressEl = document.getElementById('quiz-progress');
        const statusEl = document.getElementById('quiz-status');
        if (progressEl) progressEl.style.width = `${progress}%`;
        if (statusEl) statusEl.innerText = `Phần 2 / 2`;

        const html = `
            <div class="group-transition">
                <div class="group-icon">${info.icon}</div>
                <h3>Bạn là ${info.label}</h3>
                <p>Tuyệt! Bây giờ chúng tôi sẽ hỏi thêm vài câu hỏi cụ thể để gợi ý laptop phù hợp nhất với bạn.</p>
                <button class="btn-continue" onclick="app.startGroupQuestions()" style="margin: 0 auto; display:block;">
                    Tiếp tục →
                </button>
            </div>
        `;

        const box = document.getElementById('quiz-box');
        if (box) box.innerHTML = html;
    },

    startGroupQuestions() {
        this.quizState.phase = 'group';
        this.quizState.groupStep = 0;
        this.renderQuizStep();
    },

    // ── Scoring algorithm ─────────────────────────────────────────
    calculateScores() {
        const ac = this.quizState.answers.common;
        const ag = this.quizState.answers.group;
        const group = this.quizState.userGroup;
        const groupInfo = GROUP_INFO[group] || {};
        const tagWeights = groupInfo.tagWeights || {};

        const budgetRange = getBudgetRange(ac.budget);
        const candidateLaptops = laptops.filter(laptop => isInBudget(laptop.price, budgetRange));

        let results = candidateLaptops.map(laptop => {
            let nScore = 0, gScore = 0, pScore = 0, wScore = 0, dScore = 0;

            // ── N: Need / Use-case match (40%) ──────────────────
            const baseScore = (laptop.scoreByUseCase && laptop.scoreByUseCase[group]) || 50;
            nScore = baseScore;

            // Tag bonuses for group
            (laptop.tags || []).forEach(tag => {
                if (tagWeights[tag]) {
                    nScore += tagWeights[tag];
                }
            });

            // Group-specific answer bonuses
            if (group === 'it') {
                const sw = ag.it_software || [];
                const field = ag.it_field || [];
                if ((sw.includes('android') || sw.includes('vm') || sw.includes('docker') || ag.it_vm === 'heavy') && laptop.ramValue >= 16) nScore += 15;
                if ((field.includes('data_ai') || field.includes('gamedev') || ag.it_android === 'often') && laptop.hasDiscreteGPU) nScore += 15;
                if (field.includes('basic') && ag.it_vm === 'none' && !laptop.hasDiscreteGPU) nScore += 8;
                if (ag.it_upgrade === 'yes' && laptop.upgradeable) nScore += 10;
                const gaming = ag.it_gaming || [];
                if (gaming.includes('game_heavy') && laptop.hasDiscreteGPU) nScore += 12;
            }

            if (group === 'finance') {
                if (ag.fin_excel === 'heavy' && laptop.ramValue >= 16) nScore += 12;
                if (ag.fin_portable === 'must' && laptop.weightValue < 1.5) nScore += 15;
                if (ag.fin_present === 'often' && laptop.tags.includes('webcam_good')) nScore += 10;
            }

            if (group === 'design') {
                const sw = ag.ds_software || [];
                const heavy = ['pr', 'ae', 'blender', 'autocad', 'sketchup', 'davinci'];
                if (heavy.some(h => sw.includes(h)) && laptop.hasDiscreteGPU) nScore += 18;
                if (ag.ds_color === 'must' && laptop.hasColorScreen) nScore += 15;
                if (ag.ds_color === 'must' && !laptop.hasColorScreen) nScore -= 15;
                if (ag.ds_3d === 'often' && laptop.hasDiscreteGPU) nScore += 15;
                if (ag.ds_video === 'heavy' && laptop.hasDiscreteGPU) nScore += 12;
                if (ag.ds_priority === 'light' && laptop.weightValue < 1.5) nScore += 10;
                if (ag.ds_priority === 'power' && laptop.cpuLevel >= 3) nScore += 10;
            }

            if (group === 'office') {
                const job = ag.off_job || [];
                if ((job.includes('accounting') || ag.off_excel === 'heavy') && laptop.ramValue >= 16) nScore += 12;
                if (ag.off_meetings === 'daily' && laptop.tags.includes('webcam_good')) nScore += 10;
                if (ag.off_location === 'hybrid' && laptop.weightValue < 1.5) nScore += 12;
                if (ag.off_numpad === 'must' && laptop.screen.includes('15.6')) nScore += 8;
            }

            if (group === 'gaming') {
                const games = ag.gm_games || [];
                const heavyGames = ['pubg', 'aaa', 'gta'];
                const isHeavy = heavyGames.some(g => games.includes(g)) || ag.gm_quality === 'high';
                if (isHeavy && laptop.hasDiscreteGPU) nScore += 20;
                if (isHeavy && laptop.tags.includes('cooling_good')) nScore += 10;
                if (ag.gm_weight === 'no' && laptop.weightValue < 2) nScore += 12;
                if (ag.gm_weight === 'no' && laptop.weightValue >= 2.2) nScore -= 15;
                if (ag.gm_cooling === 'very' && laptop.tags.includes('cooling_good')) nScore += 12;
            }

            if (group === 'creator') {
                const sw = ag.cr_software || [];
                const heavy = ['pr', 'ae', 'davinci'];
                if (heavy.some(h => sw.includes(h)) && laptop.hasDiscreteGPU) nScore += 18;
                if (ag.cr_resolution === '4k' && laptop.ramValue >= 16) nScore += 12;
                if (ag.cr_storage === 'high' && laptop.ssdValue >= 1000) nScore += 10;
                if (ag.cr_type && ag.cr_type.includes('shorts') && !ag.cr_type.includes('longvid')) {
                    if (!laptop.hasDiscreteGPU && laptop.price < 20000000) nScore += 8;
                }
            }

            if (group === 'firsttime') {
                const concern = ag.ft_concern || [];
                if (concern.includes('overspec') && laptop.price < 15000000) nScore += 12;
                if (concern.includes('weak') && laptop.ramValue >= 16) nScore += 10;
                if (ag.ft_style && ag.ft_style.includes('cheap') && laptop.price < 15000000) nScore += 10;
                if (ag.ft_style && ag.ft_style.includes('durable') && laptop.tags.includes('durable')) nScore += 10;
            }

            // Common priority bonuses
            const priorities = ac.priorities || [];
            if (priorities.includes('screen') && laptop.hasColorScreen) nScore += 8;
            if (priorities.includes('upgrade') && laptop.upgradeable) nScore += 8;

            // ── G: Budget match (25%) ────────────────────────────
            if (budgetRange) {
                const budgetMax = budgetRange.max === Infinity ? laptop.price : budgetRange.max;
                const budgetMin = budgetRange.min;
                const budgetMid = (budgetMin + budgetMax) / 2;
                const budgetSpan = Math.max(budgetMax - budgetMin, 1);
                gScore = 100 - (Math.abs(laptop.price - budgetMid) / budgetSpan * 15);
            } else {
                const budgetMax = parseFloat(ac.budget) * 1000000;
                if (laptop.price <= budgetMax) {
                    gScore = 100 - ((budgetMax - laptop.price) / budgetMax * 15);
                } else {
                    const over = (laptop.price - budgetMax) / budgetMax;
                    gScore = Math.max(0, 100 - over * 100);
                }
            }

            // ── P: Performance (15%) ─────────────────────────────
            pScore = laptop.cpuLevel * 20; // 20/40/60/80
            if (laptop.hasDiscreteGPU) pScore = Math.min(100, pScore + 20);
            if (laptop.ramValue >= 16) pScore = Math.min(100, pScore + 10);

            const priorities2 = ac.priorities || [];
            if (priorities2.includes('perf') && laptop.cpuLevel >= 3) pScore = Math.min(100, pScore + 15);

            // ── W: Weight / Battery (10%) ────────────────────────
            if (ac.mobility === 'high') {
                if (laptop.weightValue < 1.5) wScore = 100;
                else if (laptop.weightValue < 1.8) wScore = 70;
                else wScore = 35;
            } else if (ac.mobility === 'medium') {
                if (laptop.weightValue < 1.8) wScore = 100;
                else wScore = 70;
            } else {
                wScore = 90;
            }
            if (priorities2.includes('battery') && laptop.batteryLevel === 3) wScore = Math.min(100, wScore + 15);
            if (priorities2.includes('light') && laptop.weightValue < 1.5) wScore = Math.min(100, wScore + 15);

            // ── D: Durability / Upgradeability (10%) ─────────────
            dScore = 70;
            if (laptop.upgradeable) dScore += 15;
            if (laptop.warrantyLevel >= 2 || laptop.warranty.includes('24')) dScore += 15;
            if (ac.lifespan >= 4 && laptop.ramValue >= 16) dScore = Math.min(100, dScore + 15);
            if (priorities2.includes('durable') && laptop.tags.includes('durable')) dScore = Math.min(100, dScore + 10);

            // Cap all scores
            nScore = Math.min(100, Math.max(0, nScore));
            gScore = Math.min(100, Math.max(0, gScore));
            pScore = Math.min(100, Math.max(0, pScore));
            wScore = Math.min(100, Math.max(0, wScore));
            dScore = Math.min(100, Math.max(0, dScore));

            const totalScore = (0.4 * nScore) + (0.25 * gScore) + (0.15 * pScore) + (0.1 * wScore) + (0.1 * dScore);

            return { ...laptop, matchScore: Math.round(totalScore), _nScore: nScore, _gScore: gScore };
        });

        return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
    },

    // ── Generate human-readable explanation ──────────────────────
    generateConfigRecommendation() {
        const ac = this.quizState.answers.common;
        const ag = this.quizState.answers.group;
        const group = this.quizState.userGroup;
        const groupInfo = GROUP_INFO[group] || { label: 'Người dùng', icon: '👤' };
        const budget = ac.budget;

        let lines = [];

        if (group === 'it') {
            const sw = ag.it_software || [];
            const field = ag.it_field || [];
            const needsHeavy = sw.includes('vm') || sw.includes('docker') || ag.it_android === 'often';
            const needsGPU = field.includes('data_ai') || field.includes('gamedev') || (ag.it_gaming || []).includes('game_heavy');
            lines.push(`Bạn là sinh viên IT với nhu cầu ${field.join(', ') || 'lập trình cơ bản'}.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i5 / Ryzen 5 trở lên.`);
            lines.push(`→ <strong>RAM:</strong> ${needsHeavy ? '16GB (bắt buộc, vì bạn dùng máy ảo/Docker/Android Studio)' : '16GB khuyến nghị, tối thiểu 8GB'}.`);
            lines.push(`→ <strong>SSD:</strong> Tối thiểu 512GB.`);
            if (needsGPU) lines.push(`→ <strong>GPU rời:</strong> Cần thiết vì bạn làm AI, game dev hoặc game nặng.`);
            else lines.push(`→ <strong>GPU rời:</strong> Không bắt buộc nếu bạn chỉ lập trình và không chơi game nặng.`);
        } else if (group === 'finance') {
            const heavy = ag.fin_excel === 'heavy';
            lines.push(`Bạn là sinh viên Tài chính/Kinh tế/Marketing.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i3–i5 hoặc Ryzen 3–5, đủ dùng.`);
            lines.push(`→ <strong>RAM:</strong> ${heavy ? '16GB khuyến nghị vì bạn dùng Excel file lớn' : '8GB là đủ, 16GB tốt hơn'}.`);
            lines.push(`→ <strong>SSD:</strong> 256–512GB thoải mái.`);
            lines.push(`→ <strong>GPU rời:</strong> Không cần thiết.`);
        } else if (group === 'design') {
            const needsGPU = (ag.ds_video === 'heavy' || ag.ds_3d === 'often');
            lines.push(`Bạn làm thiết kế đồ họa ở mức ${ag.ds_level ? ag.ds_level.join(', ') : 'cơ bản'}.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i5–i7 hoặc Ryzen 5–7.`);
            lines.push(`→ <strong>RAM:</strong> Tối thiểu 16GB.`);
            lines.push(`→ <strong>SSD:</strong> Tối thiểu 512GB.`);
            if (ag.ds_color === 'must') lines.push(`→ <strong>Màn hình:</strong> Cần màn hình OLED hoặc có độ phủ màu rộng (sRGB 100%).`);
            if (needsGPU) lines.push(`→ <strong>GPU rời:</strong> Cần thiết vì bạn dựng video nặng hoặc làm 3D/render.`);
        } else if (group === 'office') {
            const heavy = ag.off_excel === 'heavy';
            lines.push(`Bạn là nhân viên văn phòng${ag.off_job ? ` làm ${ag.off_job.join(', ')}` : ''}.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i3–i5 hoặc Ryzen 3–5 là đủ.`);
            lines.push(`→ <strong>RAM:</strong> ${heavy ? '16GB vì bạn dùng Excel nhiều' : '8–16GB'}.`);
            lines.push(`→ <strong>SSD:</strong> 256–512GB.`);
            if (ag.off_meetings === 'daily') lines.push(`→ <strong>Lưu ý:</strong> Ưu tiên máy có webcam/mic chất lượng tốt vì họp online hằng ngày.`);
        } else if (group === 'gaming') {
            const games = ag.gm_games || [];
            const heavy = games.includes('aaa') || games.includes('pubg') || ag.gm_quality === 'high';
            lines.push(`Bạn là game thủ, thích chơi ${games.length ? games.join(', ') : 'game giải trí'}.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i5–H series hoặc Ryzen 5–H series.`);
            lines.push(`→ <strong>RAM:</strong> Tối thiểu 16GB.`);
            lines.push(`→ <strong>GPU rời:</strong> Bắt buộc${heavy ? ' – cần GPU mạnh như RTX 4060 trở lên' : ' – RTX 4050 là đủ'}.`);
            lines.push(`→ <strong>Màn hình:</strong> Nên 144Hz trở lên để chơi game mượt mà.`);
            if (ag.gm_weight === 'no') lines.push(`→ <strong>Lưu ý:</strong> Laptop gaming thường nặng 2–2.5kg và pin kém hơn laptop thường.`);
        } else if (group === 'creator') {
            const sw = ag.cr_software || [];
            const heavy = sw.includes('pr') || sw.includes('ae') || sw.includes('davinci');
            lines.push(`Bạn là content creator, làm ${ag.cr_type ? ag.cr_type.join(', ') : 'video'}.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i5–i7 hoặc Ryzen 5–7.`);
            lines.push(`→ <strong>RAM:</strong> ${ag.cr_resolution === '4k' ? '32GB khuyến nghị cho dựng 4K' : '16GB tối thiểu'}.`);
            lines.push(`→ <strong>SSD:</strong> ${ag.cr_storage === 'high' ? '1TB trở lên vì bạn lưu nhiều video' : '512GB tối thiểu'}.`);
            if (heavy) lines.push(`→ <strong>GPU rời:</strong> Cần thiết vì bạn dùng Premiere/After Effects/DaVinci.`);
        } else {
            lines.push(`Bạn là người mua laptop lần đầu.`);
            lines.push(`→ <strong>CPU:</strong> Intel Core i3–i5 hoặc Ryzen 3–5 là đủ cho hầu hết nhu cầu.`);
            lines.push(`→ <strong>RAM:</strong> 8–16GB.`);
            lines.push(`→ <strong>SSD:</strong> 256–512GB.`);
            lines.push(`→ <strong>Lưu ý:</strong> Không cần GPU rời nếu bạn chỉ học tập và làm việc thông thường.`);
        }

        return `<h4>💡 Cấu hình khuyến nghị cho bạn</h4><p>${lines.join('<br>')}</p>`;
    },

    // ── Generate per-laptop explanation ──────────────────────────
    generateLaptopReason(laptop, rank) {
        const group = this.quizState.userGroup;
        const ac = this.quizState.answers.common;
        const ag = this.quizState.answers.group;
        let reasons = [];
        let warnings = [];

        // RAM
        if (laptop.ramValue >= 16) reasons.push('RAM 16GB giúp bạn mở nhiều phần mềm cùng lúc mà không bị chậm.');
        else if (laptop.ramValue === 8) {
            if (group === 'it' || group === 'design' || group === 'creator') warnings.push('RAM 8GB hơi ít cho nhu cầu của bạn, có thể bị chậm khi mở nhiều app nặng.');
        }

        // Weight
        if (ac.mobility === 'high' && laptop.weightValue < 1.5) reasons.push('Máy nhẹ và dễ mang đi học/đi làm hằng ngày.');
        if (ac.mobility === 'high' && laptop.weightValue >= 2) warnings.push('Máy khá nặng, không tiện mang đi mỗi ngày.');

        // GPU
        if (laptop.hasDiscreteGPU && (group === 'gaming' || group === 'creator' || group === 'design')) {
            reasons.push('Có card đồ họa rời, xử lý tốt game, dựng video hoặc thiết kế đồ họa nặng.');
        }
        if (!laptop.hasDiscreteGPU && group === 'gaming') {
            warnings.push('Máy không có card rời – sẽ không chơi được game nặng.');
        }

        // Color screen
        if (laptop.hasColorScreen && (group === 'design' || group === 'creator')) reasons.push('Màn hình OLED/Retina, màu sắc đẹp và chuẩn, phù hợp thiết kế hoặc dựng video.');
        if (!laptop.hasColorScreen && group === 'design' && ag.ds_color === 'must') warnings.push('Màn hình không tối ưu cho thiết kế chuyên nghiệp, màu sắc chưa đủ chuẩn.');

        // Battery
        if (laptop.batteryLevel === 3 && ac.mobility !== 'low') reasons.push('Pin tốt, dùng được cả ngày không cần cắm sạc liên tục.');
        if (laptop.batteryLevel === 1 && ac.mobility === 'high') warnings.push('Pin hơi yếu, cần mang theo sạc nếu đi học/đi làm cả ngày.');

        // Upgradeable
        if (laptop.upgradeable && ag.it_upgrade === 'yes') reasons.push('Dễ nâng cấp RAM và SSD sau này khi cần thiết.');

        // Gaming weight warning
        if (group === 'gaming' && ag.gm_weight === 'no' && laptop.weightValue >= 2) {
            warnings.push('Cảnh báo: Laptop gaming thường nặng và pin yếu hơn laptop văn phòng – đây là điểm đánh đổi bạn cần chấp nhận.');
        }

        if (reasons.length === 0) reasons.push('Phù hợp với ngân sách và nhu cầu tổng thể của bạn.');

        return { reasons, warnings };
    },

    // ── Render results page ───────────────────────────────────────
    renderResults() {
        const group = this.quizState.userGroup;
        const groupInfo = GROUP_INFO[group] || { label: 'Người dùng', icon: '👤' };
        const topMatches = this.calculateScores();
        const configRec = this.generateConfigRecommendation();

        // Header
        const headerEl = document.getElementById('results-header');
        if (headerEl) {
            headerEl.innerHTML = `
                <div class="user-group-badge">${groupInfo.icon} ${groupInfo.label}</div>
                <h2>Đây là laptop phù hợp nhất với bạn</h2>
                <div class="config-recommendation">${configRec}</div>
            `;
        }

        const grid = document.getElementById('results-grid');
        if (!grid) return;

        grid.innerHTML = topMatches.map((laptop, i) => {
            const rank = i + 1;
            const rankClass = `rank-${Math.min(rank, 5)}`;
            const scoreClass = laptop.matchScore >= 75 ? 'score-high' : laptop.matchScore >= 55 ? 'score-mid' : 'score-low';
            const { reasons, warnings } = this.generateLaptopReason(laptop, rank);

            const reasonsHtml = reasons.map(r => `<div class="laptop-reason">✅ ${r}</div>`).join('');
            const warningsHtml = warnings.map(w => `<div class="laptop-warning">⚠️ ${w}</div>`).join('');

            return `
            <div class="card laptop-card">
                <div class="laptop-rank ${rankClass}">#${rank}</div>
                <div class="match-score ${scoreClass}">${laptop.matchScore}% phù hợp</div>
                <div class="laptop-img-wrapper">
                    <img src="${laptop.image}" alt="${laptop.name}" loading="lazy">
                </div>
                <div class="laptop-info">
                    <div class="laptop-brand">${laptop.brand}</div>
                    <div class="laptop-name">${laptop.name}</div>
                    <div class="laptop-price">${laptop.priceFormatted}</div>
                    
                    <div class="score-bar-wrapper">
                        <div class="score-bar-fill" style="width:0%" data-score="${laptop.matchScore}"></div>
                    </div>
                    
                    <ul class="specs-list">
                        <li><span>CPU:</span> ${laptop.cpu}</li>
                        <li><span>RAM:</span> <strong>${laptop.ram}</strong></li>
                        <li><span>SSD:</span> ${laptop.ssd}</li>
                        <li><span>GPU:</span> ${laptop.gpu}</li>
                        <li><span>Màn:</span> ${laptop.screen}</li>
                        <li><span>Nặng:</span> ${laptop.weight}</li>
                    </ul>
                    
                    ${reasonsHtml}
                    ${warningsHtml}
                    
                    <div class="laptop-tags">
                        ${(laptop.tags || []).slice(0, 4).map(tag => `<span class="tag">${tag.replace(/_/g, ' ')}</span>`).join('')}
                    </div>
                    
                    <div class="laptop-actions">
                        <button class="btn btn-outline" onclick="app.showDetail('${laptop.id}')">Chi tiết</button>
                        <button class="btn btn-primary" onclick="app.toggleCompare('${laptop.id}')" id="btn-cmp-${laptop.id}">So sánh</button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Animate score bars after render
        setTimeout(() => {
            document.querySelectorAll('.score-bar-fill').forEach(el => {
                el.style.width = el.dataset.score + '%';
            });
        }, 100);
    },

    showDetail(id) {
        const laptop = laptops.find(l => l.id === id);
        if (!laptop) return;
        const { reasons, warnings } = this.generateLaptopReason(laptop, 1);

        const html = `
            <h2>${laptop.name}</h2>
            <p class="laptop-price" style="font-size:24px;color:var(--primary);font-weight:800;margin:10px 0;">${laptop.priceFormatted}</p>
            <div style="text-align:center;margin:20px 0;">
                <img src="${laptop.image}" alt="${laptop.name}" style="max-width:300px;">
            </div>
            <div class="pros-cons">
                <div class="pros">
                    <h4>👍 Ưu điểm</h4>
                    <ul>${(laptop.pros || []).map(p => `<li style="margin-bottom:8px">${p}</li>`).join('')}</ul>
                </div>
                <div class="cons">
                    <h4>👎 Điểm đánh đổi</h4>
                    <ul>${(laptop.cons || []).map(c => `<li style="margin-bottom:8px">${c}</li>`).join('')}</ul>
                </div>
            </div>
            ${reasons.length ? `<div style="background:#f0fdf8;padding:16px;border-radius:8px;border-left:4px solid var(--primary);margin-bottom:12px"><h4 style="color:var(--primary-hover);margin-bottom:8px">✅ Vì sao phù hợp với bạn</h4>${reasons.map(r => `<p style="margin-bottom:6px">• ${r}</p>`).join('')}</div>` : ''}
            ${warnings.length ? `<div style="background:#fffbeb;padding:16px;border-radius:8px;border-left:4px solid var(--warning);margin-bottom:12px"><h4 style="color:#92400e;margin-bottom:8px">⚠️ Lưu ý</h4>${warnings.map(w => `<p style="margin-bottom:6px">• ${w}</p>`).join('')}</div>` : ''}
            <div style="background:var(--bg-light);padding:20px;border-radius:8px;">
                <h4 style="margin-bottom:10px;">💡 Thông số chi tiết</h4>
                <table style="width:100%;font-size:14px;">
                    <tr><td style="padding:4px 0;font-weight:600;width:120px">CPU</td><td>${laptop.cpu}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">RAM</td><td>${laptop.ram}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">SSD</td><td>${laptop.ssd}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">GPU</td><td>${laptop.gpu}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">Màn hình</td><td>${laptop.screen}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">Pin</td><td>${laptop.battery}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">Trọng lượng</td><td>${laptop.weight}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">Bảo hành</td><td>${laptop.warranty}</td></tr>
                    <tr><td style="padding:4px 0;font-weight:600">Nâng cấp</td><td>${laptop.upgradeable ? '✅ Có thể nâng cấp RAM/SSD' : '❌ Không nâng cấp được'}</td></tr>
                </table>
            </div>
            <div class="actions-center">
                <button class="btn btn-primary" onclick="app.closeModal()">Đã hiểu, đóng lại</button>
            </div>`;

        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('laptop-modal').classList.add('active');
    },

    closeModal() {
        document.getElementById('laptop-modal').classList.remove('active');
    },

    toggleCompare(id) {
        const index = this.compareList.indexOf(id);
        const btn = document.getElementById(`btn-cmp-${id}`);

        if (index > -1) {
            this.compareList.splice(index, 1);
            if (btn) { btn.innerText = 'So sánh'; btn.classList.replace('btn-outline', 'btn-primary'); }
        } else {
            if (this.compareList.length >= 3) { alert('Chỉ so sánh tối đa 3 máy.'); return; }
            this.compareList.push(id);
            if (btn) { btn.innerText = 'Đã chọn ✓'; btn.classList.replace('btn-primary', 'btn-outline'); }
        }

        if (this.compareList.length > 0 && this.currentView !== 'compare') {
            let toast = document.getElementById('compare-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'compare-toast';
                toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--dark);color:white;padding:15px 25px;border-radius:50px;cursor:pointer;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);z-index:100;transition:all 0.3s;';
                toast.onclick = () => app.navigate('compare');
                document.body.appendChild(toast);
            }
            toast.innerHTML = `So sánh (${this.compareList.length}) máy ➔`;
            toast.style.display = 'block';
        } else {
            const toast = document.getElementById('compare-toast');
            if (toast) toast.style.display = 'none';
        }
    },

    renderCompare() {
        const toast = document.getElementById('compare-toast');
        if (toast) toast.style.display = 'none';

        const wrapper = document.getElementById('compare-wrapper');
        if (this.compareList.length === 0) {
            wrapper.innerHTML = `<div style="padding:40px;text-align:center;">Bạn chưa chọn máy nào để so sánh. Vui lòng làm Quiz và chọn máy từ kết quả.</div>`;
            return;
        }

        const list = this.compareList.map(id => laptops.find(l => l.id === id));
        const html = `
            <table class="compare-table">
                <thead><tr>
                    <th>Thông số</th>
                    ${list.map(l => `<th style="text-align:center"><img src="${l.image}" style="max-height:80px;margin-bottom:10px;"><br>${l.name}</th>`).join('')}
                </tr></thead>
                <tbody>
                    <tr><td>Giá</td>${list.map(l => `<td style="color:var(--primary);font-weight:bold;">${l.priceFormatted}</td>`).join('')}</tr>
                    <tr><td>CPU</td>${list.map(l => `<td>${l.cpu}</td>`).join('')}</tr>
                    <tr><td>RAM</td>${list.map(l => `<td><strong>${l.ram}</strong></td>`).join('')}</tr>
                    <tr><td>Ổ cứng (SSD)</td>${list.map(l => `<td>${l.ssd}</td>`).join('')}</tr>
                    <tr><td>Card đồ họa</td>${list.map(l => `<td>${l.gpu}</td>`).join('')}</tr>
                    <tr><td>Màn hình</td>${list.map(l => `<td>${l.screen}</td>`).join('')}</tr>
                    <tr><td>Pin</td>${list.map(l => `<td>${l.battery}</td>`).join('')}</tr>
                    <tr><td>Cân nặng</td>${list.map(l => `<td>${l.weight}</td>`).join('')}</tr>
                    <tr><td>Bảo hành</td>${list.map(l => `<td>${l.warranty}</td>`).join('')}</tr>
                    <tr><td>Nâng cấp</td>${list.map(l => `<td>${l.upgradeable ? '✅ Có thể' : '❌ Không thể'}</td>`).join('')}</tr>
                </tbody>
            </table>`;
        wrapper.innerHTML = html;
    }
};

document.addEventListener('DOMContentLoaded', () => { app.init(); });
