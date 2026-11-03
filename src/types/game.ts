export type RealmStage = 'Sơ Kỳ' | 'Trung Kỳ' | 'Hậu Kỳ' | 'Viên Mãn';

export interface RealmInfo {
  name: string;
  subStage?: string;
  level: number; // 1 to 20
  baseHp: number;
  baseMp: number;
  baseAtk: number;
  baseDef: number;
  reqExp: number;
  isMajor: boolean;
  lifespanReward: number; // in minutes
  maxHunger: number; // Tăng theo cảnh giới (100 -> 500)
  maxThirst: number; // Tăng theo cảnh giới (100 -> 500)
}

export interface FashionConfig {
  gender: 'male' | 'female' | 'daoist';
  skinTone: string;
  hairStyle:
    | 'ngan_phat_bit_mat' // Ngân Phát Kiếm Tiên (Bịt mắt, đuôi ngựa cao)
    | 'hac_phat_tram' // Hắc Phát Búi Trâm Tiên Kiếm
    | 'dao_hoa_song_binh' // Đào Hoa Song Bính (Tóc hồng hoa vàng)
    | 'lam_diem_tien_tu' // Lam Diễm Tiên Tử (Tóc xanh búi sen)
    | 'long_toc_bich_giac' // Long Tộc Bích Giác (Sừng rồng xanh ngọc)
    | 'xich_diem_ma_dao' // Xích Diễm Ma Đạo (Tóc đỏ ma tu)
    | 'hoang_kim_quan'; // Hoàng Kim Miện Quan (Tóc vương miện)
  hairColor: string;
  outfit:
    | 'bach_da_kiem_y' // Bạch Dạ Kiếm Y (Áo trắng xám tiêu sái)
    | 'thanh_truc_tien_y' // Thanh Trúc Tiên Y (Xiêm y xanh ngọc sen)
    | 'bich_thuy_luu_tien' // Bích Thủy Lưu Tiên (Váy dạ hội lam ngọc uyển chuyển)
    | 'ma_dao_hac_bao' // Ma Đạo Hắc Bào (Áo đen đỏ ma tu)
    | 'loi_dinh_tuong_bao' // Lôi Đình Tướng Bào (Chiến bào lông vũ tím)
    | 'huyen_lam_du_hiep' // Huyền Lam Du Hiệp (Áo lam xám giáp tay)
    | 'kim_cuong_chien_bao'; // Kim Cương Chiến Bào (Chiến bào viền vàng đai đỏ)
  outfitColor: string;
  accessory: 'none' | 'bit_mat' | 'long_giac' | 'tram_ngoc' | 'kim_quan' | 'phi_kiem_lung';
  weapon: 'azure_frost' | 'crimson_fire' | 'violet_thunder' | 'xuan_yuan';
  aura: 'none' | 'spirit_wind' | 'golden_lotus' | 'violet_lightning' | 'blood_shadow';
}

export interface CongPhap {
  id: 'van_kiem_quy_tong' | 'chan_nguyen_ho_the' | 'vo_ha_han';
  name: string;
  desc: string;
  level: number; // 1 to 5
  maxLevel: number;
  mpCostPerSec: number;
  upgradeCost: number; // in spirit stones
  effectDesc: string;
  unlocked: boolean;
  equipped: boolean;
  hotkey: 'Q' | 'E' | 'R';
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  desc: string;
  type: 'pill' | 'food' | 'drink' | 'material' | 'fashion' | 'manual' | 'recipe' | 'equipment';
  quality: 'common' | 'rare' | 'epic' | 'legendary';
  count: number;
  icon: string;
  healHp?: number;
  healMp?: number;
  addExp?: number;
  reduceHunger?: number;
  reduceThirst?: number;
  addLifespan?: number;
  addAtk?: number;
  addCultivationBonus?: number;
  price: number;
  craftResultId?: string;
  craftIngredients?: { id: string; count: number }[];
}

export interface ChiBao {
  id: 'tu_khi_dan' | 'niet_ban_phuong_vu' | 'huyet_tinh_ma_binh' | 'bich_hai_linh_ho';
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  equipped: boolean;
  stars: number; // 1 to 5
  maxStars: number;
  starUpgradeCost: number; // in spirit stones
  contributionCost: number; // in sect points
  effectDesc: string;
}

export interface PlayerStats {
  name: string;
  realmIndex: number;
  exp: number; // Tu Vi hiện tại
  hp: number; // Khí Huyết hiện tại
  maxHp: number;
  mp: number; // Chân Nguyên hiện tại
  maxMp: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number;
  critDmg: number;
  lifespanSeconds: number; // Thọ nguyên tính bằng giây
  hunger: number; // maxHunger (no đủ) -> 0 (đói lả)
  maxHunger: number;
  thirst: number; // maxThirst (đủ nước) -> 0 (khát khô)
  maxThirst: number;
  spiritStones: number;
  sectContributionPoints: number; // Điểm cống hiến tông môn
  hasUnlockedVanKiem: boolean;
  congPhapList: CongPhap[];
  chiBaoList: ChiBao[];
  equippedArtifactIds: string[]; // Tối đa mang theo 3 chí bảo cùng lúc
  phoenixReviveCooldownSeconds: number; // 10 phút (600s) cho Niết Bàn Phượng Vũ
  isMeditating: boolean; // Trạng thái tọa thiền tự động
  fashion: FashionConfig;
  inventory: Item[];
  activeMissions: string[];
  totalKills: number;
  cultivationSpeedBonus: number; // Tu vi tăng thêm mỗi giây khi tọa thiền
  equippedGear?: {
    weapon?: Item;
    armor?: Item;
    boots?: Item;
    ring?: Item;
  };
}

export interface Monster {
  id: string;
  type: 'slime' | 'rabbit' | 'mushroom' | 'bat' | 'turtle' | 'bamboo' | 'fox' | 'boar' | 'wolf' | 'boss';
  name: string;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  atk: number;
  color: string;
  accentColor: string;
  hitFlashTimer: number;
  knockbackX: number;
  knockbackY: number;
  xpValue: number;
  stoneDrop: number;
  shootCooldown?: number;
  attackCooldown?: number;
  attackInterval?: number;
  biteAnimTimer?: number;
  isShielding?: boolean;
  isCharging?: boolean;
  chargeTimer?: number;
  chargeVx?: number;
  chargeVy?: number;
  isClone?: boolean;
  dropMaterialId?: string;
  dropMaterialName?: string;
  dropMaterialIcon?: string;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isCrit: boolean;
  pierce: number;
  color: string;
  life: number;
  maxLife: number;
  arcAngle: number;
  trail: { x: number; y: number; alpha: number }[];
  isEnemy?: boolean;
}

export interface FloatingSword {
  id: string;
  x: number;
  y: number;
  angle: number;
  state: 'orbiting' | 'attacking';
  targetMonsterId: string | null;
  targetX: number;
  targetY: number;
  speed: number;
  orbitAngle: number;
  orbitRadius: number;
  damage: number;
  active: boolean;
  pierce?: number;
  flightTimer?: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
  vy: number;
  opacity: number;
}

export interface LootOrb {
  id: string;
  x: number;
  y: number;
  type: 'stone' | 'pill_hp' | 'pill_mp' | 'exp' | 'material' | 'chest';
  amount: number;
  color: string;
  radius: number;
  vx: number;
  vy: number;
  isAttracted?: boolean;
  materialId?: string;
  materialName?: string;
}

export interface RogueliteUpgrade {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'defense' | 'sword' | 'utility';
  effect: (arenaState: ArenaRuntimeState) => void;
}

export interface ArenaRuntimeState {
  playerX: number;
  playerY: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  speed: number;
  atk: number;
  critRate: number;
  critDmg: number;
  swordSpeed: number;
  pickupRadius: number;
  lifeSteal: number;
  lightningChain: boolean;
  exp: number;
  level: number;
  reqExp: number;
  spiritStonesGained: number;
  monstersKilled: number;
  survivalSeconds: number;
  lootCollected: Item[];
  // Buff specific runtime states
  damageReductionPercent: number; // Hộ Thể Cương Khí
  hpRegenRate: number; // Quy Tức Hồi Xuân (1 -> 2.5 HP/s)
  mpRegenRate: number; // Hồi phục chân nguyên (mặc định 5 MP/s + buff)
  dodgeRate: number; // Huyễn Ảnh Thần Hành (+15% né đòn)
  swordCooldownMultiplier: number; // Tốc Ngưng Kiếm Khí (-25% hồi chiêu)
  doubleSwordSpawn: boolean; // Song Kiếm Tề Xuất (2 kiếm cùng lúc)
  swordAoEExplosion: boolean; // Kiếm Cương Bộc Phá (nổ lan khi chạm)
  swordPierceCount: number; // Kiếm Ý Xuyên Vân (xuyên 1 mục tiêu rồi nổ)
  swordSpeedBonusPercent: number; // Tật Phong Phi Kiếm (+40% tốc độ kiếm)
  hasThoiKhongDoatMenh: boolean; // Deprecated
  killsSinceLastLifespan: number;
  dropRateBonus: number; // Cơ Duyên Bộc Phát (+35% rơi rương & đan dược)
  // Cong Phap Active State in Arena & Tiers
  activeVanKiem: boolean;
  activeChanNguyenShield: boolean;
  activeVoHaHan: boolean;
  vanKiemSwordsPerTick: number; // 10, 15, 20, 25, 30 theo tầng
  vanKiemDmgMult: number; // 1.25, 1.5, 1.8, 2.1, 2.5 theo tầng
  barrierRatio: number; // 50, 75, 100, 125, 150 theo tầng
  barrierRadius: number; // 50px
  voHaHanRadius: number; // 300px
  voHaHanSlowDist: number; // 140px (trong 140px giảm 99% tốc độ)
  orbitingSwords: FloatingSword[];
  // Chi Bao
  equippedArtifactIds: string[];
  phoenixReviveCooldownSeconds: number;
}
