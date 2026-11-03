import { RealmInfo, Item, FashionConfig, PlayerStats, CongPhap, ChiBao } from '../types/game';

export const REALMS: RealmInfo[] = [
  // Luyện Khí (10 Tầng): Bắt đầu 100 Tu Vi, mỗi tầng +50%, thưởng Thọ Nguyên từ 50 tăng dần
  { name: 'Luyện Khí Tầng 1', level: 1, baseHp: 100, baseMp: 60, baseAtk: 18, baseDef: 5, reqExp: 100, isMajor: false, lifespanReward: 50, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 2', level: 2, baseHp: 130, baseMp: 75, baseAtk: 23, baseDef: 7, reqExp: 150, isMajor: false, lifespanReward: 60, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 3', level: 3, baseHp: 170, baseMp: 95, baseAtk: 29, baseDef: 10, reqExp: 225, isMajor: false, lifespanReward: 75, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 4', level: 4, baseHp: 220, baseMp: 120, baseAtk: 36, baseDef: 14, reqExp: 338, isMajor: false, lifespanReward: 95, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 5', level: 5, baseHp: 280, baseMp: 150, baseAtk: 45, baseDef: 18, reqExp: 506, isMajor: false, lifespanReward: 120, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 6', level: 6, baseHp: 350, baseMp: 190, baseAtk: 55, baseDef: 23, reqExp: 759, isMajor: false, lifespanReward: 150, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 7', level: 7, baseHp: 440, baseMp: 240, baseAtk: 68, baseDef: 29, reqExp: 1139, isMajor: false, lifespanReward: 190, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 8', level: 8, baseHp: 550, baseMp: 300, baseAtk: 84, baseDef: 36, reqExp: 1709, isMajor: false, lifespanReward: 240, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 9', level: 9, baseHp: 680, baseMp: 370, baseAtk: 102, baseDef: 45, reqExp: 2563, isMajor: false, lifespanReward: 300, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 10 (Đỉnh Phong)', level: 10, baseHp: 850, baseMp: 450, baseAtk: 125, baseDef: 55, reqExp: 3844, isMajor: true, lifespanReward: 400, maxHunger: 150, maxThirst: 150 },
  
  // Trúc Cơ - Đại Cảnh Giới
  { name: 'Trúc Cơ Sơ Kỳ', subStage: 'Trúc Cơ', level: 11, baseHp: 1200, baseMp: 650, baseAtk: 180, baseDef: 80, reqExp: 5766, isMajor: false, lifespanReward: 500, maxHunger: 220, maxThirst: 220 },
  { name: 'Trúc Cơ Trung Kỳ', subStage: 'Trúc Cơ', level: 12, baseHp: 1600, baseMp: 850, baseAtk: 240, baseDef: 110, reqExp: 8649, isMajor: false, lifespanReward: 650, maxHunger: 220, maxThirst: 220 },
  { name: 'Trúc Cơ Hậu Kỳ', subStage: 'Trúc Cơ', level: 13, baseHp: 2200, baseMp: 1150, baseAtk: 320, baseDef: 150, reqExp: 12974, isMajor: false, lifespanReward: 800, maxHunger: 220, maxThirst: 220 },
  { name: 'Trúc Cơ Viên Mãn', subStage: 'Trúc Cơ', level: 14, baseHp: 3000, baseMp: 1550, baseAtk: 430, baseDef: 200, reqExp: 19460, isMajor: true, lifespanReward: 1000, maxHunger: 220, maxThirst: 220 },

  // Kim Đan
  { name: 'Kim Đan Sơ Kỳ', subStage: 'Kim Đan', level: 15, baseHp: 4200, baseMp: 2200, baseAtk: 600, baseDef: 280, reqExp: 29190, isMajor: false, lifespanReward: 1300, maxHunger: 350, maxThirst: 350 },
  { name: 'Kim Đan Trung Kỳ', subStage: 'Kim Đan', level: 16, baseHp: 5800, baseMp: 3000, baseAtk: 820, baseDef: 380, reqExp: 43785, isMajor: false, lifespanReward: 1600, maxHunger: 350, maxThirst: 350 },
  { name: 'Kim Đan Hậu Kỳ', subStage: 'Kim Đan', level: 17, baseHp: 8000, baseMp: 4100, baseAtk: 1100, baseDef: 520, reqExp: 65678, isMajor: false, lifespanReward: 2000, maxHunger: 350, maxThirst: 350 },
  { name: 'Kim Đan Viên Mãn', subStage: 'Kim Đan', level: 18, baseHp: 11000, baseMp: 5600, baseAtk: 1500, baseDef: 700, reqExp: 98517, isMajor: true, lifespanReward: 2500, maxHunger: 350, maxThirst: 350 },

  // Nguyên Anh
  { name: 'Nguyên Anh Sơ Kỳ', subStage: 'Nguyên Anh', level: 19, baseHp: 16000, baseMp: 8200, baseAtk: 2200, baseDef: 980, reqExp: 147775, isMajor: false, lifespanReward: 3500, maxHunger: 500, maxThirst: 500 },
  { name: 'Hóa Thần Đỉnh Phong', subStage: 'Hóa Thần', level: 20, baseHp: 25000, baseMp: 13000, baseAtk: 3300, baseDef: 1500, reqExp: 221663, isMajor: false, lifespanReward: 5000, maxHunger: 500, maxThirst: 500 }
];

export const DEFAULT_CONG_PHAP_LIST: CongPhap[] = [
  {
    id: 'van_kiem_quy_tong',
    name: 'Vạn Kiếm Quy Tông',
    desc: 'Bí pháp kiếm đạo chí cao. Khi kích hoạt tiêu tốn 10 Chân Nguyên mỗi giây, liên tục triệu hồi phi kiếm bay quanh người tự động truy sát quái vật ở gần (tối đa tích trữ 30 thanh kiếm, khi đủ 30 thanh sẽ ngừng trừ MP). Va chạm kẻ địch gây sát thương rồi biến mất.',
    level: 1,
    maxLevel: 5,
    mpCostPerSec: 10,
    upgradeCost: 250,
    effectDesc: 'Tầng 1: 10 Phi kiếm/s, 125% sát thương, tiêu tốn 10 MP/s (ngưng khi đủ 30 kiếm)',
    unlocked: true,
    equipped: true,
    hotkey: 'Q',
    icon: 'Swords'
  },
  {
    id: 'chan_nguyen_ho_the',
    name: 'Chân Nguyên Hộ Thể',
    desc: 'Ngưng tụ Chân Nguyên tạo thành vòng kim quang hộ thể bán kính 50px. Ngăn chặn mọi kẻ địch tiến vào, quái vật chạm hoặc tấn công tầm xa sẽ tiêu hao trực tiếp Chân Nguyên làm độ bền khiên theo tỉ lệ quy đổi (Tầng 1 là 1:50, Tầng 2 là 1:75,...). Khi Chân Nguyên cạn kiệt, khiên sẽ tan biến.',
    level: 1,
    maxLevel: 5,
    mpCostPerSec: 0,
    upgradeCost: 350,
    effectDesc: 'Tầng 1: Hào quang bảo vệ bán kính 50px, quy đổi 1:50 (1 MP giảm 50 sát thương)',
    unlocked: true,
    equipped: true,
    hotkey: 'E',
    icon: 'Shield'
  },
  {
    id: 'vo_ha_han',
    name: 'Vô Hạ Hạn (Gojo)',
    desc: 'Vận chuyển không gian bí thuật tạo ra một lĩnh vực vô hạn quanh thân bán kính 300px. Tiêu tốn 5 Chân Nguyên mỗi giây. Toàn bộ kẻ địch và đòn tấn công tầm xa bước vào sẽ bị bóp méo không gian: trong bán kính 140px giảm tới 99% tốc độ (gần như đông cứng hoàn toàn), từ 140px đến 300px giảm từ 99% đến 10%.',
    level: 1,
    maxLevel: 5,
    mpCostPerSec: 5,
    upgradeCost: 400,
    effectDesc: 'Tầng 1: Lĩnh vực 300px (140px chậm 99%), tiêu hao 5 MP/s',
    unlocked: true,
    equipped: true,
    hotkey: 'R',
    icon: 'Zap'
  }
];

export const DEFAULT_CHI_BAO_LIST: ChiBao[] = [
  {
    id: 'tu_khi_dan',
    name: 'Cực Phẩm Tụ Khí Đan',
    desc: 'Chí bảo đan đạo vĩnh cửu. Gia tăng vĩnh viễn +1 Tu Vi mỗi giây khi tọa thiền tại Động Phủ. Có thể nâng cấp tối đa lên 5 sao bằng Linh Thạch.',
    icon: 'Sparkles',
    unlocked: true,
    equipped: true,
    stars: 1,
    maxStars: 5,
    starUpgradeCost: 200,
    contributionCost: 80,
    effectDesc: '+1 Tu Vi/s khi tọa thiền (1 Sao)'
  },
  {
    id: 'niet_ban_phuong_vu',
    name: 'Niết Bàn Phượng Vũ',
    desc: 'Lông vũ Phượng Hoàng niết bàn. Ban cho chủ nhân 1 mạng phụ: Khi Khí Huyết hoặc Thọ Nguyên về 0, bảo vật hồi sinh nhân vật thay vì tử trận chơi lại từ đầu toàn bộ, hồi phục 50% Khí Huyết và 50% Chân Nguyên (chỉ dùng được 1 lần mỗi 10 phút).',
    icon: 'Flame',
    unlocked: true,
    equipped: true,
    stars: 1,
    maxStars: 1,
    starUpgradeCost: 0,
    contributionCost: 150,
    effectDesc: '1 Mạng phụ: Hồi sinh 50% HP & MP khi chết (Hồi chiêu 10 phút)'
  },
  {
    id: 'huyet_tinh_ma_binh',
    name: 'Huyết Tinh Ma Bình',
    desc: 'Bảo bình cổ xưa luyện từ huyết tinh ma đạo. Mỗi khi thanh phi kiếm tiêu diệt 1 quái vật trong Bí Cảnh, hút ngược 1% Khí Huyết tối đa về cho nhân vật, giải quyết bài toán thiếu hụt máu khi chiến đấu lâu.',
    icon: 'Heart',
    unlocked: true,
    equipped: true,
    stars: 1,
    maxStars: 1,
    starUpgradeCost: 0,
    contributionCost: 120,
    effectDesc: 'Phi kiếm trảm quái hút ngược 1% Max HP'
  },
  {
    id: 'bich_hai_linh_ho',
    name: 'Bích Hải Linh Hồ',
    desc: 'Hồ lô ngọc bích tích tụ linh tuyền biển sâu. Mỗi khi thanh phi kiếm tiêu diệt 1 quái vật trong Bí Cảnh, hấp thụ 1% Chân Nguyên tối đa về cho nhân vật, giải quyết vấn đề thiếu hụt chân nguyên.',
    icon: 'Droplet',
    unlocked: false,
    equipped: false,
    stars: 1,
    maxStars: 1,
    starUpgradeCost: 0,
    contributionCost: 120,
    effectDesc: 'Phi kiếm trảm quái hấp thụ 1% Max MP'
  }
];

export const DEFAULT_FASHION: FashionConfig = {
  gender: 'daoist',
  skinTone: '#fde7d6',
  hairStyle: 'ngan_phat_bit_mat', // Ngân Phát Kiếm Tiên (như trong ảnh mẫu)
  hairColor: '#e2e8f0', // Bạch ngân
  outfit: 'bach_da_kiem_y', // Bạch Dạ Kiếm Y (như ảnh mẫu)
  outfitColor: '#f8fafc',
  accessory: 'bit_mat',
  weapon: 'azure_frost',
  aura: 'spirit_wind'
};

export const MONSTER_MATERIALS: Item[] = [
  {
    id: 'mat_linh_dich',
    name: 'Linh Dịch Trục Cơ',
    desc: 'Chất lỏng tinh thuần rớt từ Slime Linh Khí, dùng để phối chế đan dược hoặc bán lấy Linh Thạch.',
    type: 'material',
    quality: 'common',
    count: 0,
    icon: 'flask-conical',
    price: 15
  },
  {
    id: 'mat_vun_linh_thach',
    name: 'Vụn Linh Thạch',
    desc: 'Mảnh vụn chứa đựng linh khí thuần khiết rớt từ Slime Linh Khí, có thể tích lũy hoặc bán đổi tiền.',
    type: 'material',
    quality: 'common',
    count: 0,
    icon: 'gem',
    price: 12
  },
  {
    id: 'mat_long_tho',
    name: 'Lông Thỏ Yêu',
    desc: 'Lông tơ mềm mại của Thỏ Ma Tinh Tinh, là nguyên liệu tuyệt hảo để dệt đạo bào hộ thể cao cấp.',
    type: 'material',
    quality: 'common',
    count: 0,
    icon: 'feather',
    price: 20
  },
  {
    id: 'mat_doc_bao_tu',
    name: 'Bào Tử Độc',
    desc: 'Bào tử kịch độc rơi từ Nấm Độc Mũ Đỏ trong U Minh Cốc, dược liệu quý để luyện phá cảnh đan.',
    type: 'material',
    quality: 'common',
    count: 0,
    icon: 'skull',
    price: 25
  },
  {
    id: 'mat_canh_doi',
    name: 'Cánh Dơi Dạ Quang',
    desc: 'Đôi cánh mỏng phát quang rơi từ Dơi Củ Tỏi, tích tụ sóng âm linh lực đặc biệt.',
    type: 'material',
    quality: 'common',
    count: 0,
    icon: 'moon',
    price: 30
  },
  {
    id: 'mat_giap_quy',
    name: 'Giáp Quy Vụn',
    desc: 'Mảnh mai rùa ngàn năm từ Rùa Đá Cổ Thụ, khắc hoa văn phù điêu cổ tích tụ phòng ngự kinh người.',
    type: 'material',
    quality: 'rare',
    count: 0,
    icon: 'shield',
    price: 50
  },
  {
    id: 'mat_truc_thiet',
    name: 'Trúc Tinh Thiết',
    desc: 'Đoạn thân cứng như huyền thiết rơi từ Tiểu Trúc Yêu đột biến, nguyên liệu rèn đúc linh kiếm.',
    type: 'material',
    quality: 'rare',
    count: 0,
    icon: 'crosshair',
    price: 45
  },
  {
    id: 'mat_ho_hoa',
    name: 'Hạt Hồ Hỏa',
    desc: 'Hỏa diễm lam biếc kết tinh từ Cáo Chín Đuôi Mini, ẩn chứa yêu lực huyễn hoặc.',
    type: 'material',
    quality: 'epic',
    count: 0,
    icon: 'flame',
    price: 85
  },
  {
    id: 'mat_ruong_tinh_anh',
    name: 'Rương Tinh Anh',
    desc: 'Bảo rương quý giá thu được khi trảm sát yêu thú Tinh Anh, mở ra chứa đầy Linh Thạch và cơ duyên.',
    type: 'material',
    quality: 'epic',
    count: 0,
    icon: 'package',
    price: 150
  },
  {
    id: 'mat_kim_giap',
    name: 'Kim Giáp Toái Phiến',
    desc: 'Mảnh giáp vàng ròng khắc hoa văn vân mây từ Heo Rừng Kim Giáp, tỏa ánh hào quang chói lọi.',
    type: 'material',
    quality: 'epic',
    count: 0,
    icon: 'shield',
    price: 90
  },
  {
    id: 'food_thit_heo_rung',
    name: 'Thịt Heo Rừng Nướng Linh Chi',
    desc: 'Món thịt yêu thú tươi ngon đậm đà năng lượng, giúp hồi phục 60 điểm đói và 40 Khí Huyết tức thì.',
    type: 'food',
    quality: 'rare',
    count: 0,
    icon: 'utensils',
    price: 35,
    reduceHunger: 60,
    healHp: 40
  },
  {
    id: 'mat_dan_dien',
    name: 'Yêu Thú Đan Điền',
    desc: 'Nội đan kết tinh từ đan điền của yêu thú, tích tụ linh khí đất trời vô cùng nồng đậm.',
    type: 'material',
    quality: 'rare',
    count: 0,
    icon: 'gem',
    price: 45
  },
  {
    id: 'mat_huyet_hach',
    name: 'Huyết Ma Hạch',
    desc: 'Tinh hạch ma đạo ngưng tụ từ máu của yêu ma, phát ra ánh đỏ yêu dị.',
    type: 'material',
    quality: 'rare',
    count: 0,
    icon: 'flame',
    price: 60
  },
  {
    id: 'mat_loi_dan',
    name: 'Lôi Lạc Yêu Đan',
    desc: 'Lôi hạch của Tà Lôi Thú, chứa đựng sức mạnh lôi kiếp cuồn cuộn.',
    type: 'material',
    quality: 'epic',
    count: 0,
    icon: 'zap',
    price: 120
  }
];

export const INITIAL_PLAYER: PlayerStats = {
  name: 'Tiêu Diêu Kiếm Khách',
  realmIndex: 0,
  exp: 0,
  hp: 100,
  maxHp: 100,
  mp: 60,
  maxMp: 60,
  atk: 22,
  def: 6,
  speed: 220,
  critRate: 0.12,
  critDmg: 1.5,
  lifespanSeconds: 6000, // 100 phút
  hunger: 100, // No bụng (100 -> 0 đói lả)
  maxHunger: 100,
  thirst: 100, // Đủ nước (100 -> 0 khát khô)
  maxThirst: 100,
  spiritStones: 150,
  sectContributionPoints: 160,
  hasUnlockedVanKiem: true,
  congPhapList: DEFAULT_CONG_PHAP_LIST,
  chiBaoList: DEFAULT_CHI_BAO_LIST,
  equippedArtifactIds: ['tu_khi_dan', 'niet_ban_phuong_vu', 'huyet_tinh_ma_binh'],
  phoenixReviveCooldownSeconds: 0,
  isMeditating: false,
  fashion: DEFAULT_FASHION,
  inventory: [
    {
      id: 'food_dry',
      name: 'Lương Khô Bách Thảo',
      desc: 'Lương thực thanh đạm no lâu, giảm 35 điểm đói bụng và hồi phục 30 HP.',
      type: 'food',
      quality: 'common',
      count: 6,
      icon: 'bread',
      reduceHunger: 35,
      healHp: 30,
      price: 10
    },
    {
      id: 'water_spring',
      name: 'Nước Suối Linh Tuyền',
      desc: 'Nước suối ngọt lành thấm đượm linh khí, giảm 40 điểm khát và hồi 30 MP.',
      type: 'drink',
      quality: 'common',
      count: 6,
      icon: 'droplet',
      reduceThirst: 40,
      healMp: 30,
      price: 10
    },
    {
      id: 'pill_hp_1',
      name: 'Hồi Huyết Đan',
      desc: 'Đan dược cấp 1 luyện từ Linh Chi, hồi phục ngay 100 Khí Huyết.',
      type: 'pill',
      quality: 'common',
      count: 4,
      icon: 'pill',
      healHp: 100,
      price: 25
    },
    {
      id: 'pill_mp_1',
      name: 'Thanh Tâm Hoàn',
      desc: 'Đan dược bồi bổ thần thức, hồi phục ngay 80 Chân Nguyên.',
      type: 'pill',
      quality: 'common',
      count: 4,
      icon: 'zap',
      healMp: 80,
      price: 25
    }
  ],
  activeMissions: [],
  totalKills: 0,
  cultivationSpeedBonus: 0
};

export const SHOP_ITEMS: Item[] = [
  {
    id: 'food_dry',
    name: 'Lương Khô Bách Thảo',
    desc: 'Lương thực thanh đạm no lâu, giảm 35 điểm đói bụng và hồi 30 HP.',
    type: 'food',
    quality: 'common',
    count: 1,
    icon: 'bread',
    reduceHunger: 35,
    healHp: 30,
    price: 12
  },
  {
    id: 'water_spring',
    name: 'Nước Suối Linh Tuyền',
    desc: 'Nước suối ngọt lành thấm đượm linh khí, giảm 40 điểm khát và hồi 30 MP.',
    type: 'drink',
    quality: 'common',
    count: 1,
    icon: 'droplet',
    reduceThirst: 40,
    healMp: 30,
    price: 12
  },
  {
    id: 'food_thit_kho',
    name: 'Thịt Khô Yêu Thú',
    desc: 'Thịt sấy ngâm rượu thảo dược, giảm 65 điểm đói và tăng 50 HP.',
    type: 'food',
    quality: 'rare',
    count: 1,
    icon: 'drumstick',
    reduceHunger: 65,
    healHp: 50,
    price: 28
  },
  {
    id: 'pill_hp_1',
    name: 'Hồi Huyết Đan (Cấp 1)',
    desc: 'Đan dược bồi bổ huyết khí, hồi phục 100 Khí Huyết.',
    type: 'pill',
    quality: 'common',
    count: 1,
    icon: 'pill',
    healHp: 100,
    price: 25
  },
  {
    id: 'pill_hp_2',
    name: 'Bổ Huyết Thần Đan (Cấp 2)',
    desc: 'Luyện chế từ Huyết Tinh yêu thú, lập tức hồi phục 350 Khí Huyết.',
    type: 'pill',
    quality: 'rare',
    count: 1,
    icon: 'heart-pulse',
    healHp: 350,
    price: 70
  },
  {
    id: 'pill_mp_1',
    name: 'Thanh Tâm Đan (Hồi MP)',
    desc: 'Dược lực thấm vào đan điền, lập tức hồi phục 120 Chân Nguyên.',
    type: 'pill',
    quality: 'common',
    count: 1,
    icon: 'zap',
    healMp: 120,
    price: 30
  },
  {
    id: 'pill_tho_nguyen_1',
    name: 'Diên Thọ Tán',
    desc: 'Dược liệu quý ngàn năm, gia tăng thêm 5 Năm Thọ Nguyên (5 phút)!',
    type: 'pill',
    quality: 'rare',
    count: 1,
    icon: 'hourglass',
    addLifespan: 5,
    price: 90
  },
  {
    id: 'pill_tuvi_1',
    name: 'Tụ Linh Hoàn',
    desc: 'Uống vào tăng trực tiếp +80 Tu Vi.',
    type: 'pill',
    quality: 'common',
    count: 1,
    icon: 'sparkles',
    addExp: 80,
    price: 45
  }
];

export interface SectShopItem {
  id: string;
  name: string;
  desc: string;
  category: 'cong_phap' | 'chi_bao';
  costContribution: number;
  icon: string;
  oneTime?: boolean;
  effect: (player: PlayerStats) => { success: boolean; message: string; updatedPlayer: PlayerStats };
}

export const SECT_SHOP_ITEMS: SectShopItem[] = [
  // MỤC 1: BÍ KÍP CÔNG PHÁP
  {
    id: 'skill_van_kiem',
    name: 'Bí Kíp: Vạn Kiếm Quy Tông',
    desc: 'Lĩnh ngộ kiếm quyết tối thượng (phím Q). Triệu hồi phi kiếm tự động truy kích quái vật, gây sát thương bạo liệt.',
    category: 'cong_phap',
    costContribution: 80,
    icon: 'Swords',
    oneTime: true,
    effect: (p) => {
      const existing = p.congPhapList.find((c) => c.id === 'van_kiem_quy_tong');
      if (existing && existing.unlocked) {
        return { success: false, message: 'Đạo hữu đã lĩnh ngộ công pháp này rồi!', updatedPlayer: p };
      }
      const updatedList = p.congPhapList.map((c) =>
        c.id === 'van_kiem_quy_tong' ? { ...c, unlocked: true, equipped: true } : c
      );
      return {
        success: true,
        message: 'Lĩnh ngộ thành công Vạn Kiếm Quy Tông! Trong Bí Cảnh nhấn phím Q để phóng kiếm.',
        updatedPlayer: { ...p, hasUnlockedVanKiem: true, congPhapList: updatedList }
      };
    }
  },
  {
    id: 'skill_chan_nguyen_ho_the',
    name: 'Bí Kíp: Chân Nguyên Hộ Thể',
    desc: 'Tạo hào quang hộ thể kim quang bán kính 50px (phím E). Ngăn chặn quái vật áp sát, tiêu hao Chân Nguyên làm độ bền khiên.',
    category: 'cong_phap',
    costContribution: 90,
    icon: 'Shield',
    oneTime: true,
    effect: (p) => {
      const existing = p.congPhapList.find((c) => c.id === 'chan_nguyen_ho_the');
      if (existing && existing.unlocked) {
        return { success: false, message: 'Đạo hữu đã lĩnh ngộ công pháp này rồi!', updatedPlayer: p };
      }
      const updatedList = p.congPhapList.map((c) =>
        c.id === 'chan_nguyen_ho_the' ? { ...c, unlocked: true, equipped: true } : c
      );
      return {
        success: true,
        message: 'Lĩnh ngộ thành công Chân Nguyên Hộ Thể! Trong Bí Cảnh nhấn phím E để bật khiên bảo hộ.',
        updatedPlayer: { ...p, congPhapList: updatedList }
      };
    }
  },
  {
    id: 'skill_vo_ha_han',
    name: 'Bí Kíp: Vô Hạ Hạn (Gojo)',
    desc: 'Tuyệt kỹ bóp méo không gian 300px (phím R). Tốn 5 Chân Nguyên/s, làm chậm quái vật và đạn tầm xa (trong 140px chậm tới 99%).',
    category: 'cong_phap',
    costContribution: 100,
    icon: 'Zap',
    oneTime: true,
    effect: (p) => {
      const existing = p.congPhapList.find((c) => c.id === 'vo_ha_han');
      if (existing && existing.unlocked) {
        return { success: false, message: 'Đạo hữu đã lĩnh ngộ công pháp này rồi!', updatedPlayer: p };
      }
      const updatedList = p.congPhapList.map((c) =>
        c.id === 'vo_ha_han' ? { ...c, unlocked: true, equipped: true } : c
      );
      return {
        success: true,
        message: 'Lĩnh ngộ thành công Vô Hạ Hạn! Trong Bí Cảnh nhấn phím R để tạo trường lực làm chậm.',
        updatedPlayer: { ...p, congPhapList: updatedList }
      };
    }
  },

  // MỤC 2: CHÍ BẢO TRẤN TÔNG (Cho phép mang theo 3 chí bảo cùng lúc)
  {
    id: 'chibao_tu_khi_dan',
    name: 'Chí Bảo: Cực Phẩm Tụ Khí Đan',
    desc: 'Gia tăng vĩnh viễn +1 Tu Vi mỗi giây khi tọa thiền tại Động Phủ. Có thể nâng cấp tối đa 5 sao bằng Linh Thạch.',
    category: 'chi_bao',
    costContribution: 80,
    icon: 'Sparkles',
    oneTime: true,
    effect: (p) => {
      const updated = p.chiBaoList.map((cb) => (cb.id === 'tu_khi_dan' ? { ...cb, unlocked: true } : cb));
      return {
        success: true,
        message: 'Đã sở hữu Chí Bảo Cực Phẩm Tụ Khí Đan! Vào mục Chí Bảo để nâng sao và trang bị.',
        updatedPlayer: { ...p, chiBaoList: updated }
      };
    }
  },
  {
    id: 'chibao_niet_ban',
    name: 'Chí Bảo: Niết Bàn Phượng Vũ',
    desc: 'Ban cho một mạng phụ: Khi Khí Huyết hoặc Thọ Nguyên về 0, hồi sinh nhân vật với 50% HP và 50% MP (Hồi chiêu 10 phút).',
    category: 'chi_bao',
    costContribution: 150,
    icon: 'Flame',
    oneTime: true,
    effect: (p) => {
      const updated = p.chiBaoList.map((cb) => (cb.id === 'niet_ban_phuong_vu' ? { ...cb, unlocked: true } : cb));
      return {
        success: true,
        message: 'Đã sở hữu Chí Bảo Niết Bàn Phượng Vũ! Mang theo bên mình để nhận 1 mạng phụ bảo mệnh.',
        updatedPlayer: { ...p, chiBaoList: updated }
      };
    }
  },
  {
    id: 'chibao_huyet_tinh',
    name: 'Chí Bảo: Huyết Tinh Ma Bình',
    desc: 'Mỗi khi thanh phi kiếm tiêu diệt 1 quái vật trong Bí Cảnh, hút ngược 1% Khí Huyết tối đa về cho nhân vật.',
    category: 'chi_bao',
    costContribution: 120,
    icon: 'Heart',
    oneTime: true,
    effect: (p) => {
      const updated = p.chiBaoList.map((cb) => (cb.id === 'huyet_tinh_ma_binh' ? { ...cb, unlocked: true } : cb));
      return {
        success: true,
        message: 'Đã sở hữu Chí Bảo Huyết Tinh Ma Bình! Hút máu khi kiếm diệt quái.',
        updatedPlayer: { ...p, chiBaoList: updated }
      };
    }
  },
  {
    id: 'chibao_bich_hai',
    name: 'Chí Bảo: Bích Hải Linh Hồ',
    desc: 'Mỗi khi thanh phi kiếm tiêu diệt 1 quái vật trong Bí Cảnh, hấp thụ 1% Chân Nguyên tối đa về cho nhân vật.',
    category: 'chi_bao',
    costContribution: 120,
    icon: 'Droplet',
    oneTime: true,
    effect: (p) => {
      const updated = p.chiBaoList.map((cb) => (cb.id === 'bich_hai_linh_ho' ? { ...cb, unlocked: true } : cb));
      return {
        success: true,
        message: 'Đã sở hữu Chí Bảo Bích Hải Linh Hồ! Hồi phục MP khi kiếm diệt quái.',
        updatedPlayer: { ...p, chiBaoList: updated }
      };
    }
  }
];

export interface MonsterIndexItem {
  id: string;
  name: string;
  type: string;
  avatarColor: string;
  accentColor: string;
  hp: string;
  atk: string;
  attackInterval: string;
  moveSpeed: string;
  rangeType: 'Cận Chiến' | 'Tầm Xa' | 'Lướt / Đột Kích' | 'Phòng Ngự / Phản Đòn';
  skills: string;
  drops: string;
  desc: string;
}

export const MONSTER_INDEX_DATA: MonsterIndexItem[] = [
  {
    id: 'slime',
    name: 'Slime Linh Khí (Linh Thạch Thạch)',
    type: 'Bầy đàn (Swarm)',
    avatarColor: '#10b981',
    accentColor: '#4ade80',
    hp: '40 (+20/phút sinh tồn)',
    atk: '8 (+3/phút)',
    attackInterval: '1.0s (Cắn cận chiến)',
    moveSpeed: '65 - 80 (Chậm)',
    rangeType: 'Cận Chiến',
    skills: 'Nhảy tưng tưng theo đàn, số lượng cực đông để người chơi "dọn cỏ" thu thập linh thạch.',
    drops: '1 Linh Thạch (100%), Linh Dịch Trục Cơ, Vụn Linh Thạch',
    desc: 'Cục thạch núng nính màu xanh ngọc bích mọc mầm lá trên đầu, mắt hạt tiêu tròn xoe hiền lành nhưng cắn buốt.'
  },
  {
    id: 'rabbit',
    name: 'Thỏ Ma Tinh Tinh (Thỏ Yêu Bông)',
    type: 'Bầy đàn cơ động (Fast Swarm)',
    avatarColor: '#785b65',
    accentColor: '#ef4444',
    hp: '50 (+20/phút)',
    atk: '11 (+3/phút)',
    attackInterval: '0.85s (Vồ cắn nhanh)',
    moveSpeed: '135 (Nhanh gấp đôi Slime)',
    rangeType: 'Cận Chiến',
    skills: 'Đôi cánh dơi vỗ liên hồi, phi thân lao thẳng vào người chơi với tốc độ cao, mắt phát sáng đỏ rực.',
    drops: '1 Linh Thạch (100%), Lông Thỏ Yêu',
    desc: 'Thân hình tròn vo lông nâu đậm mềm mượt, đầu có cặp sừng ác ma nhỏ và cánh dơi đen hung hãn.'
  },
  {
    id: 'mushroom',
    name: 'Nấm Độc Mũ Đỏ (Hắc Bào Nấm)',
    type: 'Đấu sĩ tầm xa (Ranged Caster)',
    avatarColor: '#dc2626',
    accentColor: '#ffffff',
    hp: '65 (+20/phút)',
    atk: '12 (+3/phút)',
    attackInterval: '2.4s (Chu kỳ phóng đạn)',
    moveSpeed: '70 (Vừa phải)',
    rangeType: 'Tầm Xa',
    skills: 'Giữ cự ly 160-260px và liên tục bắn Bào Tử Độc màu tím về phía nhân vật.',
    drops: '1 Linh Thạch (100%), Bào Tử Độc',
    desc: 'Cây nấm lùn mũ đỏ chấm bi trắng tinh nghịch, luôn lùi lại giữ khoảng cách an toàn để xả đạn độc.'
  },
  {
    id: 'bat',
    name: 'Dơi Củ Tỏi (Dơi Tiên Nhí)',
    type: 'Cơ động bay lượn (Aerial Skirmisher)',
    avatarColor: '#c084fc',
    accentColor: '#7c3aed',
    hp: '70 (+25/phút)',
    atk: '14 (+3/phút)',
    attackInterval: '2.8s (Bắn sóng âm)',
    moveSpeed: '125 (Bay lượn hình sin)',
    rangeType: 'Tầm Xa',
    skills: 'Bay lượn uốn lượn hình sin khó đoán, há miệng bắn chùm Sóng Âm Dạ Quang màu tím đậm.',
    drops: '1 Linh Thạch (100%), Cánh Dơi Dạ Quang',
    desc: 'Dơi nhỏ tròn xoe như củ tỏi, cánh dơi mỏng phát huỳnh quang tím ma mị.'
  },
  {
    id: 'bamboo',
    name: 'Tiểu Trúc Yêu (Búp Măng Đột Biến)',
    type: 'Sát thủ lướt tới (Dasher)',
    avatarColor: '#84cc16',
    accentColor: '#ef4444',
    hp: '95 (+30/phút)',
    atk: '15 (+4/phút)',
    attackInterval: '0.9s (Húc càn sau lướt)',
    moveSpeed: '90 (Bình thường) -> 225 (Lướt bộc phá)',
    rangeType: 'Lướt / Đột Kích',
    skills: 'Nhảy lướt càn quét (Dash burst gấp 2.5 lần tốc độ) lao thẳng vào mục tiêu, sau đó dừng nghỉ tích lực 1.2s.',
    drops: '1 Linh Thạch (100%), Trúc Tinh Thiết',
    desc: 'Búp măng xanh ngọc có 2 mắt tròn xoe, thân bọc các bẹ măng cứng như thép huyền thiết.'
  },
  {
    id: 'turtle',
    name: 'Rùa Đá Cổ Thụ (Thạch Quy)',
    type: 'Hộ vệ thiết giáp (Heavy Tanker)',
    avatarColor: '#64748b',
    accentColor: '#22d3ee',
    hp: '220 (+70/phút)',
    atk: '18 (+4/phút)',
    attackInterval: '1.2s (Đập đá)',
    moveSpeed: '45 (Rất chậm)',
    rangeType: 'Phòng Ngự / Phản Đòn',
    skills: 'Mai Rùa Hộ Thể: Khi HP tụt dưới 55%, tự động kích hoạt mai đá khắc cổ phù, giảm ngay 70% toàn bộ sát thương nhận vào.',
    drops: '1 Linh Thạch (100%), Giáp Quy Vụn',
    desc: 'Mai rùa phủ đầy rêu phong và đá tảng, trên đỉnh mọc mầm cây xanh, bốn chân khắc phù văn cổ đại phát sáng xanh ngọc.'
  },
  {
    id: 'fox',
    name: 'Cáo Chín Đuôi Mini (Hồ Ly Bông)',
    type: 'Tinh Anh phép thuật (Elite Caster)',
    avatarColor: '#f97316',
    accentColor: '#fdba74',
    hp: '260 (+80/phút)',
    atk: '22 (+5/phút)',
    attackInterval: '3.2s (Bắn 3 luồng Hồ Hỏa)',
    moveSpeed: '95 (Khá nhanh)',
    rangeType: 'Tầm Xa',
    skills: 'Bắn 3 luồng đạn Hồ Hỏa màu lam biếc tỏa hình rẻ quạt cùng lúc, uy lực sát thương diện rộng cực kỳ nguy hiểm.',
    drops: '1 Linh Thạch (100%), Hạt Hồ Hỏa, Rương Tinh Anh',
    desc: 'Hồ ly tròn xoe như cục bông cam rực rỡ, 9 chiếc đuôi xòe như quạt lông vũ mềm mại.'
  },
  {
    id: 'boar',
    name: 'Heo Rừng Kim Giáp (Mini-Boss)',
    type: 'Thủ lĩnh húc càn (Elite Juggernaut)',
    avatarColor: '#eab308',
    accentColor: '#ca8a04',
    hp: '380 (+100/phút)',
    atk: '28 (+6/phút)',
    attackInterval: '1.2s (Húc nghiền nát)',
    moveSpeed: '80 (Bình thường) -> 360 (Húc càn cực đại)',
    rangeType: 'Lướt / Đột Kích',
    skills: 'Húc Càn Kim Giáp: Hiện vạch chỉ hướng màu đỏ cảnh báo trong 0.8s, sau đó kích hoạt động lượng cực đại lao vút tới 360px.',
    drops: '1 Linh Thạch (100%), Kim Giáp Toái Phiến, Thịt Heo Rừng Nướng Linh Chi',
    desc: 'Chú heo rừng lông vàng kim óng ả, mặc giáp trụ đồng điêu khắc hoa văn vân mây vương giả, hai chiếc nanh trắng cong vút.'
  }
];

export const DEFAULT_EQUIPMENT_LIST: Item[] = [
  {
    id: 'eq_sword_1',
    name: 'Thanh Phong Kiếm (Hạ Phẩm)',
    desc: 'Thanh kiếm trúc rèn bằng linh thiết mỏng nhẹ, tăng +15 Sát Thương Công Kích.',
    type: 'equipment',
    quality: 'common',
    count: 1,
    icon: 'swords',
    addAtk: 15,
    price: 80
  },
  {
    id: 'eq_armor_1',
    name: 'Huyền Thiết Đạo Bào (Trung Phẩm)',
    desc: 'Áo choàng đạo gia gia cố sợi tơ huyền thiết, tăng +12 Phòng Ngự và +50 Khí Huyết Tối Đa.',
    type: 'equipment',
    quality: 'rare',
    count: 1,
    icon: 'shield',
    healHp: 50,
    price: 120
  },
  {
    id: 'eq_boots_1',
    name: 'Vân Tung Phi Hành Ngoa',
    desc: 'Đôi giày thêu vân mây phi hành, tăng +25 Tốc Độ di chuyển trong bí cảnh.',
    type: 'equipment',
    quality: 'rare',
    count: 1,
    icon: 'compass',
    price: 100
  },
  {
    id: 'eq_ring_1',
    name: 'U Tinh Trữ Vật Giới',
    desc: 'Nhẫn không gian chứa đựng linh lực hư không, tăng +8% Tỉ Lệ Bạo Kích.',
    type: 'equipment',
    quality: 'epic',
    count: 1,
    icon: 'gem',
    price: 150
  }
];

export interface SectMission {
  id: string;
  title: string;
  desc: string;
  reqKills: number;
  rewardStones: number;
  rewardExp: number;
  rewardContribution: number;
  claimed: boolean;
}

export const SECT_MISSIONS: SectMission[] = [
  {
    id: 'mission_1',
    title: 'Thanh Trừng Slime Dị Biến',
    desc: 'Tiêu diệt 15 Linh Khí Slime nơi cửa Bí Cảnh.',
    reqKills: 15,
    rewardStones: 50,
    rewardExp: 100,
    rewardContribution: 40,
    claimed: false
  },
  {
    id: 'mission_2',
    title: 'Trừ Khử Độc Nấm & Yêu Thỏ',
    desc: 'Tiêu diệt 40 Quái Vật Bí Cảnh.',
    reqKills: 40,
    rewardStones: 120,
    rewardExp: 300,
    rewardContribution: 70,
    claimed: false
  },
  {
    id: 'mission_3',
    title: 'Huyết Chiến Bí Cảnh',
    desc: 'Chém giết 100 Quái Vật các loại, lập chiến công hiển hách.',
    reqKills: 100,
    rewardStones: 280,
    rewardExp: 800,
    rewardContribution: 120,
    claimed: false
  }
];
