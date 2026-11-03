import { RealmInfo, Item, FashionConfig, PlayerStats, CongPhap } from '../types/game';

export const REALMS: RealmInfo[] = [
  { name: 'Luyện Khí Tầng 1', level: 1, baseHp: 100, baseMp: 60, baseAtk: 18, baseDef: 5, reqExp: 50, isMajor: false, lifespanReward: 5, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 2', level: 2, baseHp: 130, baseMp: 75, baseAtk: 23, baseDef: 7, reqExp: 100, isMajor: false, lifespanReward: 5, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 3', level: 3, baseHp: 170, baseMp: 95, baseAtk: 29, baseDef: 10, reqExp: 180, isMajor: false, lifespanReward: 5, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 4', level: 4, baseHp: 220, baseMp: 120, baseAtk: 36, baseDef: 14, reqExp: 280, isMajor: false, lifespanReward: 5, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 5', level: 5, baseHp: 280, baseMp: 150, baseAtk: 45, baseDef: 18, reqExp: 420, isMajor: false, lifespanReward: 10, maxHunger: 100, maxThirst: 100 },
  { name: 'Luyện Khí Tầng 6', level: 6, baseHp: 350, baseMp: 190, baseAtk: 55, baseDef: 23, reqExp: 600, isMajor: false, lifespanReward: 10, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 7', level: 7, baseHp: 440, baseMp: 240, baseAtk: 68, baseDef: 29, reqExp: 850, isMajor: false, lifespanReward: 10, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 8', level: 8, baseHp: 550, baseMp: 300, baseAtk: 84, baseDef: 36, reqExp: 1200, isMajor: false, lifespanReward: 15, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 9', level: 9, baseHp: 680, baseMp: 370, baseAtk: 102, baseDef: 45, reqExp: 1700, isMajor: false, lifespanReward: 15, maxHunger: 150, maxThirst: 150 },
  { name: 'Luyện Khí Tầng 10 (Đỉnh Phong)', level: 10, baseHp: 850, baseMp: 450, baseAtk: 125, baseDef: 55, reqExp: 2400, isMajor: true, lifespanReward: 30, maxHunger: 150, maxThirst: 150 },
  
  // Trúc Cơ - Đại Cảnh Giới
  { name: 'Trúc Cơ Sơ Kỳ', subStage: 'Trúc Cơ', level: 11, baseHp: 1200, baseMp: 650, baseAtk: 180, baseDef: 80, reqExp: 3800, isMajor: false, lifespanReward: 50, maxHunger: 220, maxThirst: 220 },
  { name: 'Trúc Cơ Trung Kỳ', subStage: 'Trúc Cơ', level: 12, baseHp: 1600, baseMp: 850, baseAtk: 240, baseDef: 110, reqExp: 5800, isMajor: false, lifespanReward: 50, maxHunger: 220, maxThirst: 220 },
  { name: 'Trúc Cơ Hậu Kỳ', subStage: 'Trúc Cơ', level: 13, baseHp: 2200, baseMp: 1150, baseAtk: 320, baseDef: 150, reqExp: 8500, isMajor: false, lifespanReward: 60, maxHunger: 220, maxThirst: 220 },
  { name: 'Trúc Cơ Viên Mãn', subStage: 'Trúc Cơ', level: 14, baseHp: 3000, baseMp: 1550, baseAtk: 430, baseDef: 200, reqExp: 12500, isMajor: true, lifespanReward: 80, maxHunger: 220, maxThirst: 220 },

  // Kim Đan
  { name: 'Kim Đan Sơ Kỳ', subStage: 'Kim Đan', level: 15, baseHp: 4200, baseMp: 2200, baseAtk: 600, baseDef: 280, reqExp: 18000, isMajor: false, lifespanReward: 120, maxHunger: 350, maxThirst: 350 },
  { name: 'Kim Đan Trung Kỳ', subStage: 'Kim Đan', level: 16, baseHp: 5800, baseMp: 3000, baseAtk: 820, baseDef: 380, reqExp: 26000, isMajor: false, lifespanReward: 140, maxHunger: 350, maxThirst: 350 },
  { name: 'Kim Đan Hậu Kỳ', subStage: 'Kim Đan', level: 17, baseHp: 8000, baseMp: 4100, baseAtk: 1100, baseDef: 520, reqExp: 37000, isMajor: false, lifespanReward: 160, maxHunger: 350, maxThirst: 350 },
  { name: 'Kim Đan Viên Mãn', subStage: 'Kim Đan', level: 18, baseHp: 11000, baseMp: 5600, baseAtk: 1500, baseDef: 700, reqExp: 52000, isMajor: true, lifespanReward: 200, maxHunger: 350, maxThirst: 350 },

  // Nguyên Anh
  { name: 'Nguyên Anh Sơ Kỳ', subStage: 'Nguyên Anh', level: 19, baseHp: 16000, baseMp: 8200, baseAtk: 2200, baseDef: 980, reqExp: 75000, isMajor: false, lifespanReward: 300, maxHunger: 500, maxThirst: 500 },
  { name: 'Hóa Thần Đỉnh Phong', subStage: 'Hóa Thần', level: 20, baseHp: 25000, baseMp: 13000, baseAtk: 3300, baseDef: 1500, reqExp: 120000, isMajor: false, lifespanReward: 500, maxHunger: 500, maxThirst: 500 }
];

export const DEFAULT_CONG_PHAP_LIST: CongPhap[] = [
  {
    id: 'van_kiem_quy_tong',
    name: 'Vạn Kiếm Quy Tông',
    desc: 'Bí pháp kiếm đạo chí cao. Khi kích hoạt tiêu tốn 10 Chân Nguyên mỗi giây, liên tục triệu hồi 10 phi kiếm bay quanh người tự động truy sát quái vật ở gần, va chạm kẻ địch sẽ gây sát thương bạo liệt rồi biến mất.',
    level: 1,
    maxLevel: 5,
    mpCostPerSec: 10,
    upgradeCost: 250,
    effectDesc: '10 Phi kiếm mỗi giây, tiêu tốn 10 MP/s',
    unlocked: true,
    equipped: true,
    hotkey: 'Q',
    icon: 'Swords'
  },
  {
    id: 'chan_nguyen_ho_the',
    name: 'Chân Nguyên Hộ Thể',
    desc: 'Ngưng tụ Chân Nguyên tạo thành vòng kim quang hộ thể bán kính 100px. Ngăn chặn mọi kẻ địch tiến vào, quái vật chạm hoặc tấn công tầm xa sẽ tiêu hao trực tiếp Chân Nguyên làm độ bền khiên theo quy đổi 1:50 (cứ 1 Chân Nguyên giảm 50 sát thương). Khi Chân Nguyên cạn kiệt, khiên sẽ tan biến.',
    level: 1,
    maxLevel: 5,
    mpCostPerSec: 0,
    upgradeCost: 350,
    effectDesc: 'Hào quang bảo hộ bán kính 100px, quy đổi 1:50 (1 MP giảm 50 sát thương)',
    unlocked: true,
    equipped: true,
    hotkey: 'E',
    icon: 'Shield'
  },
  {
    id: 'vo_ha_han',
    name: 'Vô Hạ Hạn (Gojo)',
    desc: 'Vận chuyển không gian bí thuật tạo ra một lĩnh vực vô hạn quanh thân bán kính 300px. Tiêu tốn 10 Chân Nguyên mỗi giây, toàn bộ kẻ địch cũng như đòn tấn công tầm xa bước vào sẽ bị bóp méo không gian, giảm tốc độ di chuyển từ 10% ở rìa lên đến 99% khi áp sát nhân vật (gần như đông cứng hoàn toàn).',
    level: 1,
    maxLevel: 5,
    mpCostPerSec: 10,
    upgradeCost: 400,
    effectDesc: 'Lĩnh vực không gian 300px, giảm tốc toàn bộ quái và đạn tầm xa từ 10% đến 99%, tiêu hao 10 MP/s',
    unlocked: true,
    equipped: true,
    hotkey: 'R',
    icon: 'Zap'
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
  hunger: 10,
  maxHunger: 100,
  thirst: 10,
  maxThirst: 100,
  spiritStones: 150,
  sectContributionPoints: 160,
  hasUnlockedVanKiem: true,
  congPhapList: DEFAULT_CONG_PHAP_LIST,
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
  category: 'cong_phap' | 'cong_thuc';
  costContribution: number;
  icon: string;
  oneTime?: boolean;
  effect: (player: PlayerStats) => { success: boolean; message: string; updatedPlayer: PlayerStats };
}

export const SECT_SHOP_ITEMS: SectShopItem[] = [
  // MỤC 1: CÔNG PHÁP
  {
    id: 'skill_van_kiem',
    name: 'Bí Kíp: Vạn Kiếm Quy Tông',
    desc: 'Bí pháp trấn môn! Kích hoạt (phím Q) tốn 50 Chân Nguyên/s, triệu hồi 5 phi kiếm bay quanh người tự động truy quét quái vật, biến mất khi chạm trúng.',
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
    desc: 'Tạo hào quang hộ thể kim quang. Ngăn chặn quái vật áp sát, nhận đòn đánh sẽ trừ thẳng Chân Nguyên làm độ bền khiên theo tỉ lệ 1:1!',
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
    name: 'Bí Kíp: Vô Hạ Hạn',
    desc: 'Tuyệt kỹ bóp méo không gian (phím R). Tốn 10 Chân Nguyên/s, làm chậm quái vật từ 10% ở rìa đến 99% khi áp sát nhân vật (gần như bất động).',
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

  // MỤC 2: CÔNG THỨC & ĐAN DƯỢC
  {
    id: 'recipe_bich_huyet_sword',
    name: 'Công Thức: Rèn Kiếm Bích Huyết',
    desc: 'Bí truyền luyện kiếm sắc bén, tăng vĩnh viễn +30 Sát Thương Công Kích (Atk).',
    category: 'cong_thuc',
    costContribution: 75,
    icon: 'Hammer',
    oneTime: true,
    effect: (p) => {
      return {
        success: true,
        message: 'Tôi luyện thành công Kiếm Bích Huyết! Tăng vĩnh viễn +30 Sát thương.',
        updatedPlayer: { ...p, atk: p.atk + 30 }
      };
    }
  },
  {
    id: 'recipe_thien_tam_giap',
    name: 'Công Thức: Dệt Giáp Thiên Tằm',
    desc: 'Bí truyền dệt thiên tằm bảo y, tăng vĩnh viễn +18 Điểm Phòng Ngự (Def).',
    category: 'cong_thuc',
    costContribution: 75,
    icon: 'Shield',
    oneTime: true,
    effect: (p) => {
      return {
        success: true,
        message: 'Dệt thành công Thiên Tằm Bảo Y! Tăng vĩnh viễn +18 Phòng ngự.',
        updatedPlayer: { ...p, def: p.def + 18 }
      };
    }
  },
  {
    id: 'pill_dai_hoan',
    name: 'Thần Đan: Đại Hoàn Đan Trấn Tông',
    desc: 'Hồi phục lập tức 100% Khí Huyết và Chân Nguyên khi sử dụng.',
    category: 'cong_thuc',
    costContribution: 60,
    icon: 'Heart',
    effect: (p) => {
      return {
        success: true,
        message: 'Đã nhận 1 viên Đại Hoàn Đan vào túi đồ!',
        updatedPlayer: {
          ...p,
          inventory: [
            ...p.inventory,
            {
              id: 'pill_daihoan_' + Date.now(),
              name: 'Đại Hoàn Đan Trấn Tông',
              desc: 'Hồi phục toàn bộ 100% Khí Huyết và Chân Nguyên ngay lập tức.',
              type: 'pill',
              quality: 'legendary',
              count: 1,
              icon: 'heart-pulse',
              healHp: p.maxHp,
              healMp: p.maxMp,
              price: 150
            }
          ]
        }
      };
    }
  },
  {
    id: 'pill_tukhi_permanent',
    name: 'Thần Đan: Cực Phẩm Tụ Khí Đan',
    desc: 'Gia tăng vĩnh viễn +2 Tu Vi mỗi giây khi tọa thiền tại Động Phủ!',
    category: 'cong_thuc',
    costContribution: 90,
    icon: 'Sparkles',
    effect: (p) => {
      return {
        success: true,
        message: 'Kinh mạch thông suốt! Tốc độ tọa thiền tăng vĩnh viễn +2 điểm/giây.',
        updatedPlayer: {
          ...p,
          cultivationSpeedBonus: p.cultivationSpeedBonus + 2
        }
      };
    }
  },
  {
    id: 'pill_tho_nguyen_sect',
    name: 'Thần Đan: Bổ Thọ Thiên Đan',
    desc: 'Cải tử hoàn đồng, tăng trực tiếp +30 Năm Thọ Nguyên (30 phút)!',
    category: 'cong_thuc',
    costContribution: 110,
    icon: 'Hourglass',
    effect: (p) => {
      return {
        success: true,
        message: 'Uống Bổ Thọ Thiên Đan! Thọ nguyên gia tăng thêm 30 năm.',
        updatedPlayer: {
          ...p,
          lifespanSeconds: p.lifespanSeconds + 30 * 60
        }
      };
    }
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
