import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  PlayerStats,
  Monster,
  Projectile,
  FloatingText,
  LootOrb,
  RogueliteUpgrade,
  ArenaRuntimeState,
  Item,
  FloatingSword
} from '../types/game';
import { MONSTER_MATERIALS } from '../constants/gameData';
import { sound } from '../services/audio';
import {
  Sparkles,
  Swords,
  Zap,
  Heart,
  Compass,
  Volume2,
  VolumeX,
  LogOut,
  Shield,
  Clock,
  Radio
} from 'lucide-react';

interface ArenaCanvasProps {
  player: PlayerStats;
  onRetreat: (result: {
    survived: boolean;
    spiritStonesGained: number;
    monstersKilled: number;
    survivalSeconds: number;
    remainingHp: number;
    lootItems: Item[];
  }) => void;
  onSyncVitals?: (vitals: { hp: number; mp: number }) => void;
}

const ARENA_WIDTH = 3200;
const ARENA_HEIGHT = 3200;

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({ player, onRetreat, onSyncVitals }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Upgrade Selection Modal State
  const [levelUpChoices, setLevelUpChoices] = useState<RogueliteUpgrade[] | null>(null);
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [arenaLevel, setArenaLevel] = useState(1);
  const [arenaExpPercent, setArenaExpPercent] = useState(0);
  const [survivalTimeStr, setSurvivalTimeStr] = useState('00:00');
  const [killsCount, setKillsCount] = useState(0);
  const [stonesCount, setStonesCount] = useState(0);

  // Synchronized state for UI HUD
  const [currentHp, setCurrentHp] = useState(player.hp);
  const [maxHp, setMaxHp] = useState(player.maxHp);
  const [currentMp, setCurrentMp] = useState(player.mp);
  const [maxMp, setMaxMp] = useState(player.maxMp);

  // Cong Phap Status in UI
  const [isVanKiemActive, setIsVanKiemActive] = useState(false);
  const [isBarrierActive, setIsBarrierActive] = useState(false);
  const [isVoHaHanActive, setIsVoHaHanActive] = useState(false);

  // Virtual joystick for touch
  const joystickRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
    dx: number;
    dy: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
    dx: 0,
    dy: 0
  });

  const [joystickTouch, setJoystickTouch] = useState<{
    active: boolean;
    x: number;
    y: number;
    kx: number;
    ky: number;
  }>({ active: false, x: 0, y: 0, kx: 0, ky: 0 });

  // RUNTIME ARENA STATE (All buffs strictly stay inside this run)
  const gameState = useRef<ArenaRuntimeState>({
    playerX: ARENA_WIDTH / 2,
    playerY: ARENA_HEIGHT / 2,
    hp: player.hp,
    maxHp: player.maxHp,
    mp: player.mp,
    maxMp: player.maxMp,
    speed: player.speed,
    atk: player.atk,
    critRate: player.critRate,
    critDmg: player.critDmg,
    swordSpeed: 640,
    pickupRadius: 110,
    lifeSteal: 0,
    lightningChain: false,
    damageReductionPercent: 0,
    hpRegenRate: 1.0,
    dodgeRate: 0,
    swordCooldownMultiplier: 1.0,
    doubleSwordSpawn: false,
    swordAoEExplosion: false,
    swordPierceCount: 1,
    swordSpeedBonusPercent: 0,
    hasThoiKhongDoatMenh: false,
    killsSinceLastLifespan: 0,
    dropRateBonus: 0,
    exp: 0,
    level: 1,
    reqExp: 10,
    spiritStonesGained: 0,
    monstersKilled: 0,
    survivalSeconds: 0,
    lootCollected: [],
    activeVanKiem: false,
    activeChanNguyenShield: false,
    activeVoHaHan: false,
    orbitingSwords: []
  });

  // Entities
  const monsters = useRef<Monster[]>([]);
  const projectiles = useRef<Projectile[]>([]);
  const lootOrbs = useRef<LootOrb[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPaused = useRef<boolean>(false);
  const swordSpawnTimer = useRef<number>(0);
  const vanKiemTickTimer = useRef<number>(0);
  const autoAttackScanTimer = useRef<number>(0);
  const cameraShake = useRef<number>(0);
  const lastSyncedHp = useRef<number>(player.hp);
  const lastSyncedMp = useRef<number>(player.mp);

  // Helper to spawn orbiting swords
  const spawnSwords = useCallback((count: number, damageMult = 1.0) => {
    const s = gameState.current;
    const currentCount = s.orbitingSwords.length;
    const maxCapacity = 30; // Cho phép duy trì tới 30 phi kiếm khi Vạn Kiếm Quy Tông kích hoạt
    const toSpawn = Math.min(count, Math.max(0, maxCapacity - currentCount));
    if (toSpawn <= 0) return;

    sound.playSwordSummon();
    for (let i = 0; i < toSpawn; i++) {
      const ang = (i * Math.PI * 2) / toSpawn + Math.random() * 0.4;
      const pierce = s.swordPierceCount || 1;
      const speed = Math.round(720 * (1 + (s.swordSpeedBonusPercent || 0) / 100));
      s.orbitingSwords.push({
        id: 'vk_sword_' + Math.random(),
        x: s.playerX + Math.cos(ang) * 55,
        y: s.playerY + Math.sin(ang) * 55,
        angle: ang,
        state: 'orbiting',
        targetMonsterId: null,
        targetX: 0,
        targetY: 0,
        speed,
        orbitAngle: ang,
        orbitRadius: 52,
        damage: Math.round(s.atk * damageMult),
        active: true,
        pierce
      });
    }
  }, []);

  // Cong Phap 1: Toggle Vạn Kiếm Quy Tông (Q) - Tiêu tốn 10 MP/giây, mỗi giây tạo 10 phi kiếm
  const toggleVanKiem = useCallback(() => {
    const s = gameState.current;
    if (s.mp < 10 && !s.activeVanKiem) {
      floatingTexts.current.push({
        id: 'warn_' + Math.random(),
        text: 'Chân Nguyên không đủ 10 MP!',
        x: s.playerX,
        y: s.playerY - 45,
        color: '#f43f5e',
        size: 15,
        vy: -30,
        opacity: 1
      });
      return;
    }
    s.activeVanKiem = !s.activeVanKiem;
    setIsVanKiemActive(s.activeVanKiem);
    sound.playSkillCast();

    if (s.activeVanKiem) {
      // Ngay khi bật, lập tức triệu hồi ngay đợt 10 phi kiếm bao quanh người
      spawnSwords(10, 1.25);
    }

    floatingTexts.current.push({
      id: 'vk_' + Math.random(),
      text: s.activeVanKiem ? 'VẠN KIẾM QUY TÔNG: KHỞI! (+10 Kiếm)' : 'VẠN KIẾM QUY TÔNG: THU!',
      x: s.playerX,
      y: s.playerY - 45,
      color: '#facc15',
      size: 18,
      vy: -40,
      opacity: 1
    });
  }, [spawnSwords]);

  // Cong Phap 2: Toggle Chân Nguyên Hộ Thể (E) - Bán kính 100px, tỉ lệ 5:1
  const toggleBarrier = useCallback(() => {
    const s = gameState.current;
    if (s.mp <= 0 && !s.activeChanNguyenShield) {
      floatingTexts.current.push({
        id: 'warn_' + Math.random(),
        text: 'Hết Chân Nguyên để ngưng khiên!',
        x: s.playerX,
        y: s.playerY - 45,
        color: '#f43f5e',
        size: 15,
        vy: -30,
        opacity: 1
      });
      return;
    }
    s.activeChanNguyenShield = !s.activeChanNguyenShield;
    setIsBarrierActive(s.activeChanNguyenShield);
    sound.playSkillCast();

    floatingTexts.current.push({
      id: 'bar_' + Math.random(),
      text: s.activeChanNguyenShield ? 'CHÂN NGUYÊN HỘ THỂ (100px): KÍCH HOẠT!' : 'CHÂN NGUYÊN HỘ THỂ: GIẢI!',
      x: s.playerX,
      y: s.playerY - 45,
      color: '#38bdf8',
      size: 18,
      vy: -40,
      opacity: 1
    });
  }, []);

  // Cong Phap 3: Toggle Vô Hạ Hạn (Gojo) (R) - Bán kính 300px
  const toggleVoHaHan = useCallback(() => {
    const s = gameState.current;
    if (s.mp < 10 && !s.activeVoHaHan) {
      floatingTexts.current.push({
        id: 'warn_' + Math.random(),
        text: 'Chân Nguyên không đủ 10 MP!',
        x: s.playerX,
        y: s.playerY - 45,
        color: '#f43f5e',
        size: 15,
        vy: -30,
        opacity: 1
      });
      return;
    }
    s.activeVoHaHan = !s.activeVoHaHan;
    setIsVoHaHanActive(s.activeVoHaHan);
    sound.playSkillCast();

    floatingTexts.current.push({
      id: 'vhh_' + Math.random(),
      text: s.activeVoHaHan ? 'LĨNH VỰC: VÔ HẠ HẠN (GOJO)!' : 'VÔ HẠ HẠN (GOJO): ĐÓNG!',
      x: s.playerX,
      y: s.playerY - 45,
      color: '#c084fc',
      size: 18,
      vy: -40,
      opacity: 1
    });
  }, []);

  // Shoot manual sword projectile on click/tap
  const shootManualSword = (targetX: number, targetY: number) => {
    const state = gameState.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    sound.playSwordSlash();

    const worldTargetX = state.playerX - canvas.width / 2 + targetX;
    const worldTargetY = state.playerY - canvas.height / 2 + targetY;
    const ang = Math.atan2(worldTargetY - state.playerY, worldTargetX - state.playerX);
    const speed = state.swordSpeed;

    projectiles.current.push({
      id: 'sword_' + Math.random(),
      x: state.playerX + Math.cos(ang) * 20,
      y: state.playerY + Math.sin(ang) * 20,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      radius: 9,
      damage: Math.round(state.atk * (Math.random() < state.critRate ? state.critDmg : 1)),
      isCrit: Math.random() < state.critRate,
      pierce: 1, // Chạm vào kẻ địch là biến mất ngay
      color: player.fashion.weapon === 'crimson_fire' ? '#f43f5e' : player.fashion.weapon === 'violet_thunder' ? '#c084fc' : '#38bdf8',
      life: 1.8,
      maxLife: 1.8,
      arcAngle: ang,
      trail: []
    });
  };

  // Keyboard and Mouse listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === 'q' || e.key === 'Q') toggleVanKiem();
      if (e.key === 'e' || e.key === 'E') toggleBarrier();
      if (e.key === 'r' || e.key === 'R') toggleVoHaHan();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && !isPaused.current) {
        shootManualSword(e.clientX, e.clientY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [toggleVanKiem, toggleBarrier, toggleVoHaHan]);

  // Touch joystick handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    joystickRef.current = {
      active: true,
      startX: x,
      startY: y,
      currX: x,
      currY: y,
      dx: 0,
      dy: 0
    };

    setJoystickTouch({ active: true, x, y, kx: x, ky: y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickRef.current.active) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const currX = touch.clientX - rect.left;
    const currY = touch.clientY - rect.top;

    const j = joystickRef.current;
    let dx = currX - j.startX;
    let dy = currY - j.startY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 45;

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    j.currX = j.startX + dx;
    j.currY = j.startY + dy;
    j.dx = dx / maxRadius;
    j.dy = dy / maxRadius;

    setJoystickTouch({ active: true, x: j.startX, y: j.startY, kx: j.currX, ky: j.currY });
  };

  const handleTouchEnd = () => {
    joystickRef.current = {
      active: false,
      startX: 0,
      startY: 0,
      currX: 0,
      currY: 0,
      dx: 0,
      dy: 0
    };
    setJoystickTouch({ active: false, x: 0, y: 0, kx: 0, ky: 0 });
  };

  // Roguelite Level Up Upgrades (Purely temporary within the arena run)
  const triggerLevelUp = () => {
    isPaused.current = true;
    sound.playLevelUp();

    const pool: RogueliteUpgrade[] = [
      // 1. Nhóm Khí Huyết & Phòng Thủ
      {
        id: 'kim_cuong_bat_hoai',
        title: 'Kim Cương Bất Hoại (Hạ Phẩm)',
        desc: 'Tăng +30 Khí Huyết Tối Đa và hồi phục 30 HP ngay tức khắc.',
        icon: 'Heart',
        tier: 'common',
        category: 'defense',
        effect: (s) => {
          s.maxHp += 30;
          s.hp = Math.min(s.maxHp, s.hp + 30);
          setMaxHp(s.maxHp);
          setCurrentHp(Math.round(s.hp));
        }
      },
      {
        id: 'ho_the_cuong_khi',
        title: 'Hộ Thể Cương Khí (Trung Phẩm)',
        desc: 'Tăng điểm Phòng Ngự (giảm 15% sát thương nhận vào từ quái vật).',
        icon: 'Shield',
        tier: 'rare',
        category: 'defense',
        effect: (s) => {
          s.damageReductionPercent = Math.min(0.75, (s.damageReductionPercent || 0) + 0.15);
        }
      },
      {
        id: 'quy_tuc_hoi_xuan',
        title: 'Quy Tức Hồi Xuân (Thượng Phẩm)',
        desc: 'Tăng tốc độ tự hồi Khí Huyết trong Bí Cảnh từ 1 HP/s lên 2.5 HP/s.',
        icon: 'Heart',
        tier: 'rare',
        category: 'defense',
        effect: (s) => {
          s.hpRegenRate = 2.5;
        }
      },
      {
        id: 'huyen_anh_than_hanh',
        title: 'Huyễn Ảnh Thần Hành (Trung Phẩm)',
        desc: 'Tăng 15% tỉ lệ Né Đòn (khi né thành công không bị trừ Khí Huyết).',
        icon: 'Compass',
        tier: 'rare',
        category: 'defense',
        effect: (s) => {
          s.dodgeRate = Math.min(0.6, (s.dodgeRate || 0) + 0.15);
        }
      },

      // 2. Nhóm Ngự Kiếm
      {
        id: 'toc_ngung_kiem_khi',
        title: 'Tốc Ngưng Kiếm Khí (Hạ Phẩm)',
        desc: 'Giảm 25% thời gian hồi để triệu hồi thanh phi kiếm tiếp theo.',
        icon: 'Clock',
        tier: 'common',
        category: 'sword',
        effect: (s) => {
          s.swordCooldownMultiplier = (s.swordCooldownMultiplier || 1.0) * 0.75;
        }
      },
      {
        id: 'song_kiem_te_xuat',
        title: 'Song Kiếm Tề Xuất (Thượng Phẩm)',
        desc: 'Mỗi lần hồi chiêu ngưng tụ cùng lúc 2 thanh phi kiếm lơ lửng quanh người và phóng tới mục tiêu gần nhất.',
        icon: 'Swords',
        tier: 'rare',
        category: 'sword',
        effect: (s) => {
          s.doubleSwordSpawn = true;
        }
      },
      {
        id: 'kiem_cuong_boc_pha',
        title: 'Kiếm Cương Bộc Phá (Thượng Phẩm)',
        desc: 'Khi kiếm chạm mục tiêu và biến mất, phát nổ gây sát thương lan ra quái xung quanh.',
        icon: 'Zap',
        tier: 'rare',
        category: 'sword',
        effect: (s) => {
          s.swordAoEExplosion = true;
        }
      },
      {
        id: 'kiem_y_xuyen_van',
        title: 'Kiếm Ý Xuyên Vân (Cực Phẩm)',
        desc: 'Kiếm có thể xuyên qua 1 mục tiêu (gây sát thương con thứ nhất), sau đó đâm tiếp con thứ hai rồi mới phát nổ biến mất.',
        icon: 'Swords',
        tier: 'legendary',
        category: 'sword',
        effect: (s) => {
          s.swordPierceCount = 2;
        }
      },
      {
        id: 'tat_phong_phi_kiem',
        title: 'Tật Phong Phi Kiếm (Hạ Phẩm)',
        desc: 'Tăng 40% tốc độ bay của kiếm khi lao về phía quái.',
        icon: 'Swords',
        tier: 'common',
        category: 'sword',
        effect: (s) => {
          s.swordSpeed = Math.round(s.swordSpeed * 1.4);
          s.swordSpeedBonusPercent = (s.swordSpeedBonusPercent || 0) + 40;
        }
      },

      // 3. Nhóm Thu Thập, Thọ Nguyên & Tiện Ích
      {
        id: 'tu_linh_quyet',
        title: 'Tụ Linh Quyết (Hạ Phẩm)',
        desc: 'Mở rộng gấp đôi bán kính tự động hút Linh Thạch rơi trên sàn đấu.',
        icon: 'Sparkles',
        tier: 'common',
        category: 'utility',
        effect: (s) => {
          s.pickupRadius = Math.round(s.pickupRadius * 2);
        }
      },
      {
        id: 'thoi_khong_doat_menh',
        title: 'Thời Không Đoạt Mệnh (Thượng Phẩm)',
        desc: 'Tiêu diệt mỗi 25 quái vật hồi lại +10 giây Thọ Nguyên.',
        icon: 'Clock',
        tier: 'rare',
        category: 'utility',
        effect: (s) => {
          s.hasThoiKhongDoatMenh = true;
        }
      },
      {
        id: 'co_duyen_boc_phat',
        title: 'Cơ Duyên Bộc Phát (Trung Phẩm)',
        desc: 'Tăng 35% tỉ lệ rơi rương nguyên liệu và đan dược từ quái vật.',
        icon: 'Sparkles',
        tier: 'rare',
        category: 'utility',
        effect: (s) => {
          s.dropRateBonus = (s.dropRateBonus || 0) + 0.35;
        }
      }
    ];

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setLevelUpChoices(shuffled.slice(0, 3));
  };

  const handleSelectUpgrade = (upgrade: RogueliteUpgrade) => {
    upgrade.effect(gameState.current);
    setLevelUpChoices(null);
    isPaused.current = false;
  };

  // Main Roguelite Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let spawnTimer = 0;
    let tickSecondTimer = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const gameLoop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05);

      const state = gameState.current;

      if (!isPaused.current) {
        // 1. Tick timers
        state.survivalSeconds += dt;
        tickSecondTimer += dt;
        swordSpawnTimer.current += dt;
        autoAttackScanTimer.current += dt;

        // Passive Regeneration in Bí Cảnh: +5 MP/s, Quy Tức Hồi Xuân (1 HP/s or 2.5 HP/s)
        state.mp = Math.min(state.maxMp, state.mp + 5 * dt);
        state.hp = Math.min(state.maxHp, state.hp + (state.hpRegenRate || 1.0) * dt);

        // Cong Phap 1: Vạn Kiếm Quy Tông (Tốn 10 MP/giây, mỗi giây tạo ra 10 thanh phi kiếm bay quanh người)
        if (state.activeVanKiem) {
          vanKiemTickTimer.current += dt;
          if (vanKiemTickTimer.current >= 1.0) {
            vanKiemTickTimer.current -= 1.0;
            if (state.mp >= 10) {
              state.mp -= 10;
              spawnSwords(10, 1.25);
            } else {
              state.activeVanKiem = false;
              setIsVanKiemActive(false);
              floatingTexts.current.push({
                id: 'vk_off_' + Math.random(),
                text: 'Hết MP: Tắt Vạn Kiếm Quy Tông!',
                x: state.playerX,
                y: state.playerY - 40,
                color: '#f43f5e',
                size: 14,
                vy: -30,
                opacity: 1
              });
            }
          }
        }

        // Cong Phap 3: Vô Hạ Hạn (Gojo) (Tốn 10 MP/s)
        if (state.activeVoHaHan) {
          if (state.mp >= 10 * dt) {
            state.mp -= 10 * dt;
          } else {
            state.activeVoHaHan = false;
            setIsVoHaHanActive(false);
            floatingTexts.current.push({
              id: 'vhh_off_' + Math.random(),
              text: 'Hết MP: Tắt Vô Hạ Hạn (Gojo)!',
              x: state.playerX,
              y: state.playerY - 40,
              color: '#f43f5e',
              size: 14,
              vy: -30,
              opacity: 1
            });
          }
        }

        // Real-time synchronization of HP & MP to HUD state without discrepancy
        const roundHp = Math.round(state.hp);
        const roundMp = Math.round(state.mp);
        if (roundHp !== lastSyncedHp.current || roundMp !== lastSyncedMp.current) {
          lastSyncedHp.current = roundHp;
          lastSyncedMp.current = roundMp;
          setCurrentHp(roundHp);
          setCurrentMp(roundMp);
          if (onSyncVitals) {
            onSyncVitals({ hp: roundHp, mp: roundMp });
          }
        }

        // One-second survival tick for timer display
        if (tickSecondTimer >= 1.0) {
          tickSecondTimer -= 1.0;

          // Format survival clock
          const mins = Math.floor(state.survivalSeconds / 60);
          const secs = Math.floor(state.survivalSeconds % 60);
          setSurvivalTimeStr(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
          setKillsCount(state.monstersKilled);
          setStonesCount(state.spiritStonesGained);
        }

        // 2. ORBITING SWORD SPAWNER (Cứ mỗi 1s hoặc ngắn hơn theo buff ngưng tụ kiếm quanh người)
        const spawnerInterval = 1.0 * (state.swordCooldownMultiplier || 1.0);
        if (swordSpawnTimer.current >= spawnerInterval) {
          swordSpawnTimer.current -= spawnerInterval;
          const maxSwords = state.activeVanKiem ? 30 : 12;
          const spawnCount = state.doubleSwordSpawn ? 2 : 1;

          for (let sIdx = 0; sIdx < spawnCount; sIdx++) {
            if (state.orbitingSwords.length < maxSwords) {
              sound.playSwordSummon();
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.round(680 * (1 + (state.swordSpeedBonusPercent || 0) / 100));
              state.orbitingSwords.push({
                id: 'orb_sword_' + Math.random(),
                x: state.playerX + Math.cos(ang) * 50,
                y: state.playerY + Math.sin(ang) * 50,
                angle: ang,
                state: 'orbiting',
                targetMonsterId: null,
                targetX: 0,
                targetY: 0,
                speed: spd,
                orbitAngle: ang,
                orbitRadius: 48,
                damage: Math.round(state.atk),
                active: true,
                pierce: state.swordPierceCount || 1
              });
            }
          }
        }

        // 3. AUTO SWORD SCAN & ATTACK (Tự động phát hiện kẻ địch trong phạm vi rồi phóng tới)
        if (autoAttackScanTimer.current >= 0.15) {
          autoAttackScanTimer.current = 0;
          const detectionRadius = 360;

          const readySwords = state.orbitingSwords.filter((sw) => sw.state === 'orbiting');
          if (readySwords.length > 0 && monsters.current.length > 0) {
            let closestM: Monster | null = null;
            let closestDist = detectionRadius;

            for (const m of monsters.current) {
              const d = Math.hypot(m.x - state.playerX, m.y - state.playerY);
              if (d < closestDist) {
                closestDist = d;
                closestM = m;
              }
            }

            if (closestM) {
              const launchSword = readySwords[0];
              launchSword.state = 'attacking';
              launchSword.targetMonsterId = closestM.id;
              launchSword.targetX = closestM.x;
              launchSword.targetY = closestM.y;
              sound.playSwordSlash();
            }
          }
        }

        // Update Orbiting / Attacking Swords
        state.orbitingSwords.forEach((sw) => {
          if (sw.state === 'orbiting') {
            sw.orbitAngle += dt * 3.5;
            sw.x = state.playerX + Math.cos(sw.orbitAngle) * sw.orbitRadius;
            sw.y = state.playerY + Math.sin(sw.orbitAngle) * sw.orbitRadius;
            sw.angle = sw.orbitAngle + Math.PI / 2;
          } else if (sw.state === 'attacking') {
            const targetM = monsters.current.find((m) => m.id === sw.targetMonsterId);
            if (targetM) {
              sw.targetX = targetM.x;
              sw.targetY = targetM.y;
            }

            const ang = Math.atan2(sw.targetY - sw.y, sw.targetX - sw.x);
            sw.x += Math.cos(ang) * sw.speed * dt;
            sw.y += Math.sin(ang) * sw.speed * dt;
            sw.angle = ang;

            // Check hit target monster
            for (const m of monsters.current) {
              const hitDist = Math.hypot(m.x - sw.x, m.y - sw.y);
              if (hitDist < m.radius + 12) {
                // Check if turtle is shielding (70% damage reduction)
                const dmgMultiplier = m.type === 'turtle' && m.isShielding ? 0.3 : 1.0;
                const finalDamage = Math.max(1, Math.round(sw.damage * dmgMultiplier));

                m.hp -= finalDamage;
                m.hitFlashTimer = 0.12;
                sound.playHit();

                floatingTexts.current.push({
                  id: 'dmg_' + Math.random(),
                  text: m.isShielding ? `Kháng: -${finalDamage}` : `-${finalDamage}`,
                  x: m.x + (Math.random() - 0.5) * 20,
                  y: m.y - 15,
                  color: m.isShielding ? '#a5b4fc' : '#38bdf8',
                  size: 15,
                  vy: -40,
                  opacity: 1
                });

                // Kiếm Cương Bộc Phá (AoE Lan ~65px)
                if (state.swordAoEExplosion) {
                  const aoeRadius = 65;
                  const aoeDmg = Math.round(sw.damage * 0.75);
                  monsters.current.forEach((nearbyM) => {
                    if (nearbyM.id !== m.id && Math.hypot(nearbyM.x - m.x, nearbyM.y - m.y) < aoeRadius + nearbyM.radius) {
                      nearbyM.hp -= aoeDmg;
                      nearbyM.hitFlashTimer = 0.12;
                      floatingTexts.current.push({
                        id: 'aoe_' + Math.random(),
                        text: `Nổ Lan: -${aoeDmg}`,
                        x: nearbyM.x,
                        y: nearbyM.y - 12,
                        color: '#fbbf24',
                        size: 13,
                        vy: -30,
                        opacity: 1
                      });
                    }
                  });
                }

                // Kiếm Ý Xuyên Vân (Pierce count)
                sw.pierce = (sw.pierce ?? (state.swordPierceCount || 1)) - 1;
                if (sw.pierce <= 0) {
                  sw.active = false;
                  break;
                }
              }
            }
          }
        });
        state.orbitingSwords = state.orbitingSwords.filter((sw) => sw.active);

        // 4. Player Movement (WASD + Joystick)
        let moveX = 0;
        let moveY = 0;
        const keys = keysPressed.current;

        if (keys['w'] || keys['arrowup']) moveY -= 1;
        if (keys['s'] || keys['arrowdown']) moveY += 1;
        if (keys['a'] || keys['arrowleft']) moveX -= 1;
        if (keys['d'] || keys['arrowright']) moveX += 1;

        if (joystickRef.current.active) {
          moveX += joystickRef.current.dx;
          moveY += joystickRef.current.dy;
        }

        const moveLen = Math.hypot(moveX, moveY);
        if (moveLen > 0) {
          state.playerX += (moveX / moveLen) * state.speed * dt;
          state.playerY += (moveY / moveLen) * state.speed * dt;
        }

        // Clamp in Arena boundaries
        state.playerX = Math.max(60, Math.min(ARENA_WIDTH - 60, state.playerX));
        state.playerY = Math.max(60, Math.min(ARENA_HEIGHT - 60, state.playerY));

        // 5. Update Projectiles (Player & Enemy)
        const pRadius = 18;
        const barrierRadius = 100; // Tăng bán kính Chân Nguyên Hộ Thể lên 100px

        projectiles.current.forEach((p) => {
          // Cong Phap 3: VÔ HẠ HẠN (GOJO) làm chậm cả đòn tấn công tầm xa của kẻ địch
          if (p.isEnemy && state.activeVoHaHan) {
            const distToP = Math.hypot(p.x - state.playerX, p.y - state.playerY);
            if (distToP < 300) {
              const slowFactor = Math.max(0.04, distToP / 300); // Bị làm chậm như quay chậm trong không gian Gojo
              p.x += p.vx * slowFactor * dt;
              p.y += p.vy * slowFactor * dt;
            } else {
              p.x += p.vx * dt;
              p.y += p.vy * dt;
            }
          } else {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
          }

          p.life -= dt;

          p.trail.push({ x: p.x, y: p.y, alpha: 1 });
          if (p.trail.length > 7) p.trail.shift();

          if (p.isEnemy) {
            // Check enemy projectile hitting barrier or player
            const distToPlayer = Math.hypot(p.x - state.playerX, p.y - state.playerY);

            // Barrier absorbs enemy projectile (1:50 ratio: 1 MP hấp thụ 50 sát thương)
            if (state.activeChanNguyenShield && state.mp > 0 && distToPlayer < barrierRadius + p.radius) {
              const mpLoss = Math.max(1, Math.ceil(p.damage / 50));
              state.mp = Math.max(0, state.mp - mpLoss);
              sound.playBarrierHit();

              floatingTexts.current.push({
                id: 'bar_mp_' + Math.random(),
                text: `Hộ Thể: -${mpLoss} MP`,
                x: state.playerX,
                y: state.playerY - 40,
                color: '#38bdf8',
                size: 13,
                vy: -30,
                opacity: 0.95
              });

              if (state.mp <= 0) {
                state.activeChanNguyenShield = false;
                setIsBarrierActive(false);
                sound.playBarrierShatter();
                floatingTexts.current.push({
                  id: 'bar_shat_' + Math.random(),
                  text: 'KHIÊN CHÂN NGUYÊN VỠ TAN!',
                  x: state.playerX,
                  y: state.playerY - 50,
                  color: '#ef4444',
                  size: 18,
                  vy: -40,
                  opacity: 1
                });
              }

              p.life = 0;
            } else if (distToPlayer < pRadius + p.radius && p.life > 0) {
              // Huyễn Ảnh Thần Hành: Tỉ lệ Né Đòn
              if (Math.random() < (state.dodgeRate || 0)) {
                floatingTexts.current.push({
                  id: 'dodge_' + Math.random(),
                  text: 'NÉ ĐÒN!',
                  x: state.playerX,
                  y: state.playerY - 30,
                  color: '#34d399',
                  size: 16,
                  vy: -35,
                  opacity: 1
                });
                p.life = 0;
                return;
              }

              // Hits player directly with Hộ Thể Cương Khí (Giảm % sát thương)
              const dmgReduced = p.damage * (1 - (state.damageReductionPercent || 0));
              const finalDmg = Math.max(1, Math.round(dmgReduced - player.def * 0.35));
              state.hp = Math.max(0, state.hp - finalDmg);
              sound.playHit();
              cameraShake.current = 6;

              floatingTexts.current.push({
                id: 'hit_p_' + Math.random(),
                text: `Trúng Đạn: -${finalDmg} HP`,
                x: state.playerX,
                y: state.playerY - 25,
                color: '#f43f5e',
                size: 14,
                vy: -35,
                opacity: 1
              });

              p.life = 0;
            }
          } else {
            // Player projectile hits monster
            for (const m of monsters.current) {
              const dist = Math.hypot(m.x - p.x, m.y - p.y);
              if (dist < m.radius + p.radius && p.life > 0) {
                const dmgMultiplier = m.type === 'turtle' && m.isShielding ? 0.3 : 1.0;
                const finalDamage = Math.max(1, Math.round(p.damage * dmgMultiplier));

                m.hp -= finalDamage;
                m.hitFlashTimer = 0.12;
                sound.playHit();

                floatingTexts.current.push({
                  id: 'dmg_' + Math.random(),
                  text: `${p.isCrit ? 'BẠO! ' : ''}-${finalDamage}`,
                  x: m.x,
                  y: m.y - 12,
                  color: p.isCrit ? '#facc15' : m.isShielding ? '#a5b4fc' : '#ffffff',
                  size: p.isCrit ? 19 : 14,
                  vy: -35,
                  opacity: 1
                });

                // Kiếm Cương Bộc Phá (AoE Lan ~65px)
                if (state.swordAoEExplosion) {
                  const aoeRadius = 65;
                  const aoeDmg = Math.round(p.damage * 0.75);
                  monsters.current.forEach((nearbyM) => {
                    if (nearbyM.id !== m.id && Math.hypot(nearbyM.x - m.x, nearbyM.y - m.y) < aoeRadius + nearbyM.radius) {
                      nearbyM.hp -= aoeDmg;
                      nearbyM.hitFlashTimer = 0.12;
                      floatingTexts.current.push({
                        id: 'aoe_' + Math.random(),
                        text: `Nổ Lan: -${aoeDmg}`,
                        x: nearbyM.x,
                        y: nearbyM.y - 12,
                        color: '#fbbf24',
                        size: 13,
                        vy: -30,
                        opacity: 1
                      });
                    }
                  });
                }

                // Kiếm Ý Xuyên Vân (Pierce count)
                p.pierce = (p.pierce ?? (state.swordPierceCount || 1)) - 1;
                if (p.pierce <= 0) {
                  p.life = 0;
                  break;
                }
              }
            }
          }
        });
        projectiles.current = projectiles.current.filter((p) => p.life > 0);

        // 6. Monster Spawning: 8 Distinct Monsters (Matching image_a1d8093a.png & image_c9fd0faf.png)
        spawnTimer -= dt;
        const currentMinute = Math.floor(state.survivalSeconds / 60);
        const spawnInterval = Math.max(0.35, 1.4 - currentMinute * 0.15);

        if (spawnTimer <= 0) {
          spawnTimer = spawnInterval;

          const angle = Math.random() * Math.PI * 2;
          const spawnDist = Math.max(canvas.width, canvas.height) * 0.55 + 60;
          const sx = state.playerX + Math.cos(angle) * spawnDist;
          const sy = state.playerY + Math.sin(angle) * spawnDist;

          const rand = Math.random();
          let mType: Monster['type'] = 'slime';
          let mName = 'Slime Linh Khí';
          let mHp = 40 + currentMinute * 20;
          let mSpeed = 65 + Math.random() * 15;
          let mColor = '#10b981';
          let mAccent = '#4ade80';
          let mRadius = 17;
          let mStone = 1;
          let mXp = 3;
          let mAtk = 8 + currentMinute * 3;
          let dropMatId = Math.random() < 0.5 ? 'mat_linh_dich' : 'mat_vun_linh_thach';
          let dropMatName = dropMatId === 'mat_linh_dich' ? 'Linh Dịch Trục Cơ' : 'Vụn Linh Thạch';
          let atkInterval = 1.0;

          // Monster tier selection based on survival progress
          if (currentMinute >= 3 && rand < 0.08) {
            // Group 4: Heo Rừng Kim Giáp (Mini-Boss / Elite)
            mType = 'boar';
            mName = 'Heo Rừng Kim Giáp';
            mHp = 380 + currentMinute * 100;
            mSpeed = 80;
            mColor = '#eab308';
            mAccent = '#ca8a04';
            mRadius = 26;
            mStone = 15;
            mXp = 35;
            mAtk = 28 + currentMinute * 6;
            dropMatId = Math.random() < 0.5 ? 'mat_kim_giap' : 'food_thit_heo_rung';
            dropMatName = dropMatId === 'mat_kim_giap' ? 'Kim Giáp Toái Phiến' : 'Thịt Heo Rừng';
            atkInterval = 1.2;
          } else if (currentMinute >= 2 && rand < 0.15) {
            // Group 4: Cáo Chín Đuôi Mini (Hồ Ly Bông)
            mType = 'fox';
            mName = 'Cáo Chín Đuôi Mini';
            mHp = 260 + currentMinute * 80;
            mSpeed = 95;
            mColor = '#f97316';
            mAccent = '#fdba74';
            mRadius = 24;
            mStone = 10;
            mXp = 25;
            mAtk = 22 + currentMinute * 5;
            dropMatId = Math.random() < 0.4 ? 'mat_ruong_tinh_anh' : 'mat_ho_hoa';
            dropMatName = dropMatId === 'mat_ruong_tinh_anh' ? 'Rương Tinh Anh' : 'Hạt Hồ Hỏa';
            atkInterval = 1.1;
          } else if (currentMinute >= 2 && rand < 0.35) {
            // Group 3: Rùa Đá Cổ Thụ (Thạch Quy Nhỏ - Tanker)
            mType = 'turtle';
            mName = 'Rùa Đá Cổ Thụ';
            mHp = 220 + currentMinute * 70;
            mSpeed = 45;
            mColor = '#64748b';
            mAccent = '#22d3ee';
            mRadius = 25;
            mStone = 5;
            mXp = 14;
            mAtk = 18 + currentMinute * 4;
            dropMatId = 'mat_giap_quy';
            dropMatName = 'Giáp Quy Vụn';
            atkInterval = 1.2;
          } else if (currentMinute >= 1 && rand < 0.5) {
            // Group 3: Tiểu Trúc Yêu (Búp Măng Đột Biến)
            mType = 'bamboo';
            mName = 'Tiểu Trúc Yêu';
            mHp = 95 + currentMinute * 30;
            mSpeed = 90;
            mColor = '#84cc16';
            mAccent = '#ef4444';
            mRadius = 19;
            mStone = 3;
            mXp = 8;
            mAtk = 15 + currentMinute * 4;
            dropMatId = 'mat_truc_thiet';
            dropMatName = 'Trúc Tinh Thiết';
            atkInterval = 0.9;
          } else if (currentMinute >= 1 && rand < 0.7) {
            // Group 2: Dơi Củ Tỏi (Dơi Tiên Nhí)
            mType = 'bat';
            mName = 'Dơi Củ Tỏi';
            mHp = 70 + currentMinute * 25;
            mSpeed = 125;
            mColor = '#c084fc';
            mAccent = '#7c3aed';
            mRadius = 18;
            mStone = 3;
            mXp = 7;
            mAtk = 14 + currentMinute * 3;
            dropMatId = 'mat_canh_doi';
            dropMatName = 'Cánh Dơi Dạ Quang';
            atkInterval = 0.9;
          } else if (currentMinute >= 1 && rand < 0.85) {
            // Group 2: Nấm Độc Mũ Đỏ (Hắc Bào Nấm - Tầm Xa)
            mType = 'mushroom';
            mName = 'Nấm Độc Mũ Đỏ';
            mHp = 65 + currentMinute * 20;
            mSpeed = 70;
            mColor = '#dc2626';
            mAccent = '#ffffff';
            mRadius = 18;
            mStone = 2;
            mXp = 6;
            mAtk = 12 + currentMinute * 3;
            dropMatId = 'mat_doc_bao_tu';
            dropMatName = 'Bào Tử Độc';
            atkInterval = 1.3;
          } else if (rand < 0.95) {
            // Group 1: Thỏ Ma Tinh Tinh (Thỏ Yêu Bông - Nhanh gấp đôi Slime)
            mType = 'rabbit';
            mName = 'Thỏ Ma Tinh Tinh';
            mHp = 50 + currentMinute * 20;
            mSpeed = 135;
            mColor = '#785b65';
            mAccent = '#ef4444';
            mRadius = 17;
            mStone = 2;
            mXp = 5;
            mAtk = 11 + currentMinute * 3;
            dropMatId = 'mat_long_tho';
            dropMatName = 'Lông Thỏ Yêu';
            atkInterval = 0.85;
          }

          monsters.current.push({
            id: 'm_' + Math.random(),
            type: mType,
            name: mName,
            x: sx,
            y: sy,
            radius: mRadius,
            hp: mHp,
            maxHp: mHp,
            speed: mSpeed,
            atk: mAtk,
            color: mColor,
            accentColor: mAccent,
            hitFlashTimer: 0,
            knockbackX: 0,
            knockbackY: 0,
            xpValue: mXp,
            stoneDrop: mStone,
            dropMaterialId: dropMatId,
            dropMaterialName: dropMatName,
            attackCooldown: 0,
            attackInterval: atkInterval,
            biteAnimTimer: 0,
            shootCooldown: 1.5 + Math.random() * 1.5,
            chargeTimer: 2.0 + Math.random() * 2
          });
        }

        // 7. Update Monsters, Combat Attacks, Barrier Blocking & Vô Hạ Hạn (Gojo) 300px
        const survivingMonsters: Monster[] = [];
        const voHaHanRadius = 300; // Mở rộng lĩnh vực không gian Vô Hạ Hạn lên 300px

        monsters.current.forEach((m) => {
          if (m.hitFlashTimer > 0) m.hitFlashTimer -= dt;
          if (m.attackCooldown && m.attackCooldown > 0) m.attackCooldown -= dt;
          if (m.biteAnimTimer && m.biteAnimTimer > 0) m.biteAnimTimer -= dt;
          if (m.shootCooldown && m.shootCooldown > 0) m.shootCooldown -= dt;
          if (m.chargeTimer && m.chargeTimer > 0) m.chargeTimer -= dt;

          // Stone Turtle activates shell defense if below 50% HP
          if (m.type === 'turtle') {
            m.isShielding = m.hp < m.maxHp * 0.55;
          }

          const dx = state.playerX - m.x;
          const dy = state.playerY - m.y;
          const dist = Math.hypot(dx, dy);
          const ang = Math.atan2(dy, dx);

          // Cong Phap 3: VÔ HẠ HẠN (GOJO) (Làm chậm quái từ 10% ở viền 300px đến 99% khi áp sát)
          let speedMultiplier = 1.0;
          if (state.activeVoHaHan && dist < voHaHanRadius) {
            const factor = Math.max(0, Math.min(1, dist / voHaHanRadius));
            speedMultiplier = 0.01 + factor * 0.89; // 0.01 sát người (chậm 99%), 0.90 ở viền 300px
          }

          // Special Monster Behaviors
          if (m.type === 'mushroom') {
            // Nấm Độc Mũ Đỏ: Quái tầm xa, dừng bắn khi cách 160-260px
            if (dist > 180) {
              m.x += Math.cos(ang) * m.speed * speedMultiplier * dt;
              m.y += Math.sin(ang) * m.speed * speedMultiplier * dt;
            }
            if (m.shootCooldown && m.shootCooldown <= 0 && dist < 360) {
              m.shootCooldown = 2.4;
              const spd = 160;
              projectiles.current.push({
                id: 'spore_' + Math.random(),
                x: m.x,
                y: m.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                radius: 7,
                damage: m.atk,
                isCrit: false,
                pierce: 1,
                color: '#a855f7',
                life: 3.0,
                maxLife: 3.0,
                arcAngle: ang,
                trail: [],
                isEnemy: true
              });
            }
          } else if (m.type === 'bat') {
            // Dơi Củ Tỏi: Lượn vòng cung và bắn sóng âm
            const arcOffset = Math.sin(state.survivalSeconds * 3 + m.x) * 0.5;
            m.x += Math.cos(ang + arcOffset) * m.speed * speedMultiplier * dt;
            m.y += Math.sin(ang + arcOffset) * m.speed * speedMultiplier * dt;

            if (m.shootCooldown && m.shootCooldown <= 0 && dist < 320) {
              m.shootCooldown = 2.8;
              const spd = 180;
              projectiles.current.push({
                id: 'sonic_' + Math.random(),
                x: m.x,
                y: m.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                radius: 8,
                damage: m.atk,
                isCrit: false,
                pierce: 1,
                color: '#7c3aed',
                life: 2.5,
                maxLife: 2.5,
                arcAngle: ang,
                trail: [],
                isEnemy: true
              });
            }
          } else if (m.type === 'fox') {
            // Cáo Chín Đuôi Mini: Triệu hồi phân thân và bắn Hồ Hỏa
            m.x += Math.cos(ang) * m.speed * speedMultiplier * dt;
            m.y += Math.sin(ang) * m.speed * speedMultiplier * dt;

            if (m.shootCooldown && m.shootCooldown <= 0 && dist < 380) {
              m.shootCooldown = 3.2;
              // Bắn 3 quả cầu Hồ Hỏa màu lam biếc
              [-0.25, 0, 0.25].forEach((offsetAngle) => {
                const fAng = ang + offsetAngle;
                const spd = 200;
                projectiles.current.push({
                  id: 'foxfire_' + Math.random(),
                  x: m.x,
                  y: m.y,
                  vx: Math.cos(fAng) * spd,
                  vy: Math.sin(fAng) * spd,
                  radius: 8,
                  damage: Math.round(m.atk * 0.9),
                  isCrit: false,
                  pierce: 1,
                  color: '#38bdf8',
                  life: 2.8,
                  maxLife: 2.8,
                  arcAngle: fAng,
                  trail: [],
                  isEnemy: true
                });
              });
            }
          } else if (m.type === 'boar') {
            // Heo Rừng Kim Giáp: Húc càn với động lượng lớn
            if (m.chargeTimer && m.chargeTimer <= 0) {
              m.isCharging = true;
              m.chargeTimer = 4.0;
              m.chargeVx = Math.cos(ang) * 360;
              m.chargeVy = Math.sin(ang) * 360;
              sound.playSkillCast();
            }

            if (m.isCharging) {
              m.x += (m.chargeVx || 0) * dt;
              m.y += (m.chargeVy || 0) * dt;
              if (m.chargeTimer && m.chargeTimer < 3.0) {
                m.isCharging = false;
              }
            } else {
              m.x += Math.cos(ang) * m.speed * speedMultiplier * dt;
              m.y += Math.sin(ang) * m.speed * speedMultiplier * dt;
            }
          } else if (m.type === 'bamboo') {
            // Tiểu Trúc Yêu: Nhảy lướt tới rồi dừng nghỉ
            if (m.chargeTimer && m.chargeTimer <= 0.4) {
              // Dash burst
              m.x += Math.cos(ang) * m.speed * 2.5 * speedMultiplier * dt;
              m.y += Math.sin(ang) * m.speed * 2.5 * speedMultiplier * dt;
            } else if (m.chargeTimer && m.chargeTimer > 1.2) {
              // Pause to rest
            } else {
              m.x += Math.cos(ang) * m.speed * speedMultiplier * dt;
              m.y += Math.sin(ang) * m.speed * speedMultiplier * dt;
            }
            if (m.chargeTimer && m.chargeTimer <= 0) {
              m.chargeTimer = 2.2;
            }
          } else {
            // Slime, Rabbit standard swarm rush
            m.x += Math.cos(ang) * m.speed * speedMultiplier * dt;
            m.y += Math.sin(ang) * m.speed * speedMultiplier * dt;
          }

          // Check death
          if (m.hp <= 0) {
            state.monstersKilled += 1;

            // Thời Không Đoạt Mệnh: Cứ diệt 25 quái vật hồi lại +10 giây Thọ Nguyên
            if (state.hasThoiKhongDoatMenh) {
              state.killsSinceLastLifespan = (state.killsSinceLastLifespan || 0) + 1;
              if (state.killsSinceLastLifespan >= 25) {
                state.killsSinceLastLifespan = 0;
                player.lifespanSeconds = (player.lifespanSeconds || 0) + 10;
                sound.playSkillCast();
                floatingTexts.current.push({
                  id: 'life_' + Math.random(),
                  text: '+10s Thọ Nguyên!',
                  x: state.playerX,
                  y: state.playerY - 45,
                  color: '#22c55e',
                  size: 16,
                  vy: -40,
                  opacity: 1
                });
              }
            }

            // Drop EXP
            lootOrbs.current.push({
              id: 'xp_' + Math.random(),
              x: m.x,
              y: m.y,
              type: 'exp',
              amount: m.xpValue,
              color: '#38bdf8',
              radius: 6,
              vx: (Math.random() - 0.5) * 40,
              vy: (Math.random() - 0.5) * 40
            });

            // Drop Spirit Stones
            lootOrbs.current.push({
              id: 'st_' + Math.random(),
              x: m.x + (Math.random() - 0.5) * 15,
              y: m.y + (Math.random() - 0.5) * 15,
              type: 'stone',
              amount: m.stoneDrop,
              color: '#facc15',
              radius: 8,
              vx: (Math.random() - 0.5) * 50,
              vy: (Math.random() - 0.5) * 50
            });

            floatingTexts.current.push({
              id: 'txt_' + Math.random(),
              text: `+${m.stoneDrop} Linh Thạch`,
              x: m.x,
              y: m.y - 20,
              color: '#facc15',
              size: 13,
              vy: -25,
              opacity: 1
            });

            // Drop Material with ~45% chance (or 100% for elites) + Cơ Duyên Bộc Phát bonus (+35%)
            const baseChance = m.type === 'boar' || m.type === 'fox' ? 1.0 : 0.45;
            const dropChance = Math.min(1.0, baseChance * (1 + (state.dropRateBonus || 0)));
            if (m.dropMaterialId && Math.random() < dropChance) {
              lootOrbs.current.push({
                id: 'mat_' + Math.random(),
                x: m.x + (Math.random() - 0.5) * 10,
                y: m.y + (Math.random() - 0.5) * 10,
                type: 'material',
                amount: 1,
                color: '#a855f7',
                radius: 10,
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 0.5) * 30,
                materialId: m.dropMaterialId,
                materialName: m.dropMaterialName
              });
            }

            return;
          }

          // MELEE COMBAT & BITE COOLDOWN MECHANICS
          // Cong Phap 2: CHÂN NGUYÊN HỘ THỂ (Bán kính 100px, tỉ lệ 1:50 - cứ 1 MP giảm 50 sát thương)
          if (state.activeChanNguyenShield && state.mp > 0) {
            if (dist < barrierRadius + m.radius) {
              // Block monster at 100px barrier boundary
              m.x = state.playerX - Math.cos(ang) * (barrierRadius + m.radius + 2);
              m.y = state.playerY - Math.sin(ang) * (barrierRadius + m.radius + 2);

              // Attack on cooldown instead of continuous touch damage
              if (!m.attackCooldown || m.attackCooldown <= 0) {
                m.attackCooldown = m.attackInterval || 1.0;
                m.biteAnimTimer = 0.22;

                // Tỉ lệ 1:50 (1 chân nguyên giảm 50 sát thương, hiển thị trừ X chân nguyên)
                const mpLoss = Math.max(1, Math.ceil(m.atk / 50));
                state.mp = Math.max(0, state.mp - mpLoss);
                sound.playBarrierHit();

                floatingTexts.current.push({
                  id: 'bar_mp_' + Math.random(),
                  text: `Hộ Thể: -${mpLoss} MP`,
                  x: state.playerX,
                  y: state.playerY - 40,
                  color: '#38bdf8',
                  size: 13,
                  vy: -30,
                  opacity: 0.95
                });

                if (state.mp <= 0) {
                  state.activeChanNguyenShield = false;
                  setIsBarrierActive(false);
                  sound.playBarrierShatter();
                  floatingTexts.current.push({
                    id: 'bar_shat_' + Math.random(),
                    text: 'KHIÊN CHÂN NGUYÊN VỠ TAN!',
                    x: state.playerX,
                    y: state.playerY - 50,
                    color: '#ef4444',
                    size: 18,
                    vy: -40,
                    opacity: 1
                  });
                }
              }
            }
          } else {
            // Normal Monster Melee Attack on Player HP (Tấn công theo nhịp cắn/vồ có cooldown)
            if (dist < pRadius + m.radius) {
              if (!m.attackCooldown || m.attackCooldown <= 0) {
                m.attackCooldown = m.attackInterval || 1.0;
                m.biteAnimTimer = 0.22;

                // Huyễn Ảnh Thần Hành: Tỉ lệ Né Đòn 15%
                if (Math.random() < (state.dodgeRate || 0)) {
                  floatingTexts.current.push({
                    id: 'dodge_' + Math.random(),
                    text: 'NÉ ĐÒN!',
                    x: state.playerX,
                    y: state.playerY - 30,
                    color: '#34d399',
                    size: 16,
                    vy: -35,
                    opacity: 1
                  });
                } else {
                  // Hộ Thể Cương Khí: Giảm % sát thương nhận vào từ quái vật
                  const dmgReduced = m.atk * (1 - (state.damageReductionPercent || 0));
                  const finalDmg = Math.max(1, Math.round(dmgReduced - player.def * 0.35));
                  state.hp = Math.max(0, state.hp - finalDmg);
                  sound.playHit();
                  cameraShake.current = 6;

                  floatingTexts.current.push({
                    id: 'bite_dmg_' + Math.random(),
                    text: `Cắn: -${finalDmg} HP`,
                    x: state.playerX + (Math.random() - 0.5) * 16,
                    y: state.playerY - 25,
                    color: '#f43f5e',
                    size: 15,
                    vy: -35,
                    opacity: 1
                  });
                }
              }
            }
          }

          survivingMonsters.push(m);
        });
        monsters.current = survivingMonsters;

        // Player Defeat Check: RỜI BÍ CẢNH CÒN 1 KHÍ HUYẾT THAY VÌ CHẾT HẲN
        if (state.hp <= 0) {
          isPaused.current = true;
          onRetreat({
            survived: false,
            spiritStonesGained: Math.floor(state.spiritStonesGained * 0.5),
            monstersKilled: state.monstersKilled,
            survivalSeconds: Math.floor(state.survivalSeconds),
            remainingHp: 1, // Ra ngoài còn đúng 1 Khí Huyết theo yêu cầu!
            lootItems: state.lootCollected
          });
          return;
        }

        // 8. Loot Magnet & Collection (Exp, Linh Thạch, Đan Dược & Nguyên Liệu)
        lootOrbs.current.forEach((orb) => {
          orb.x += orb.vx * dt;
          orb.y += orb.vy * dt;
          orb.vx *= 0.92;
          orb.vy *= 0.92;

          const dist = Math.hypot(state.playerX - orb.x, state.playerY - orb.y);
          if (dist < state.pickupRadius) {
            orb.isAttracted = true;
            const magAngle = Math.atan2(state.playerY - orb.y, state.playerX - orb.x);
            const attractSpeed = 460;
            orb.x += Math.cos(magAngle) * attractSpeed * dt;
            orb.y += Math.sin(magAngle) * attractSpeed * dt;

            if (dist < pRadius + orb.radius) {
              sound.playLootDing(orb.type === 'stone' || orb.type === 'material');

              if (orb.type === 'stone') {
                state.spiritStonesGained += orb.amount;
              } else if (orb.type === 'exp') {
                state.exp += orb.amount;
                if (state.exp >= state.reqExp) {
                  state.exp -= state.reqExp;
                  state.level += 1;
                  state.reqExp = Math.round(state.reqExp * 1.5 + 10);
                  setArenaLevel(state.level);
                  triggerLevelUp();
                }
                setArenaExpPercent(Math.min(100, (state.exp / state.reqExp) * 100));
              } else if (orb.type === 'material' && orb.materialId) {
                // Add monster material to collected loot
                const existing = state.lootCollected.find((i) => i.id === orb.materialId);
                if (existing) {
                  existing.count += 1;
                } else {
                  const sample = MONSTER_MATERIALS.find((m) => m.id === orb.materialId);
                  if (sample) {
                    state.lootCollected.push({ ...sample, count: 1 });
                  }
                }

                floatingTexts.current.push({
                  id: 'mat_loot_' + Math.random(),
                  text: `+1 ${orb.materialName || 'Nguyên Liệu'}`,
                  x: state.playerX,
                  y: state.playerY - 35,
                  color: '#c084fc',
                  size: 15,
                  vy: -35,
                  opacity: 1
                });
              }

              orb.amount = 0;
            }
          }
        });
        lootOrbs.current = lootOrbs.current.filter((o) => o.amount > 0);

        // 9. Floating Texts update
        floatingTexts.current.forEach((ft) => {
          ft.y += ft.vy * dt;
          ft.opacity -= dt * 1.1;
        });
        floatingTexts.current = floatingTexts.current.filter((ft) => ft.opacity > 0);
      }

      // ==========================================
      // RENDERING (HTML5 Canvas 2D)
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shakeX = (Math.random() - 0.5) * cameraShake.current;
      const shakeY = (Math.random() - 0.5) * cameraShake.current;
      cameraShake.current = Math.max(0, cameraShake.current - dt * 15);

      ctx.save();
      const camX = state.playerX - canvas.width / 2 + shakeX;
      const camY = state.playerY - canvas.height / 2 + shakeY;
      ctx.translate(-camX, -camY);

      // Arena Background & Grid
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 160;
      const startGX = Math.floor(Math.max(0, camX) / gridSize) * gridSize;
      const endGX = Math.min(ARENA_WIDTH, camX + canvas.width + gridSize);
      const startGY = Math.floor(Math.max(0, camY) / gridSize) * gridSize;
      const endGY = Math.min(ARENA_HEIGHT, camY + canvas.height + gridSize);

      for (let x = startGX; x <= endGX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startGY);
        ctx.lineTo(x, endGY);
        ctx.stroke();
      }
      for (let y = startGY; y <= endGY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startGX, y);
        ctx.lineTo(endGX, y);
        ctx.stroke();
      }

      // Arena Barrier
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 20;
      ctx.strokeRect(30, 30, ARENA_WIDTH - 60, ARENA_HEIGHT - 60);
      ctx.shadowBlur = 0;

      // CONG PHAP 3: VÔ HẠ HẠN (GOJO) DOMAIN VISUAL (Lĩnh vực làm chậm 300px)
      if (state.activeVoHaHan) {
        ctx.save();
        const vRadius = 300; // Mở rộng lĩnh vực không gian lên 300px
        const grad = ctx.createRadialGradient(state.playerX, state.playerY, 20, state.playerX, state.playerY, vRadius);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.18)');
        grad.addColorStop(0.85, 'rgba(126, 34, 206, 0.08)');
        grad.addColorStop(1, 'rgba(126, 34, 206, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(state.playerX, state.playerY, vRadius, 0, Math.PI * 2);
        ctx.fill();

        // Concentric ripple rings of Gojo space distortion
        ctx.strokeStyle = 'rgba(216, 180, 254, 0.45)';
        ctx.lineWidth = 1.5;
        const pulseR1 = (currentTime * 0.04) % 100;
        const pulseR2 = ((currentTime * 0.04) + 50) % 100;
        ctx.beginPath();
        ctx.arc(state.playerX, state.playerY, pulseR1 * 3, 0, Math.PI * 2);
        ctx.arc(state.playerX, state.playerY, pulseR2 * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Outer limit boundary ring
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(state.playerX, state.playerY, vRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // CONG PHAP 2: CHÂN NGUYÊN HỘ THỂ BARRIER VISUAL (Bán kính 100px)
      if (state.activeChanNguyenShield && state.mp > 0) {
        ctx.save();
        const bRadius = 100; // Tăng bán kính Chân Nguyên Hộ Thể lên 100px
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(state.playerX, state.playerY, bRadius + Math.sin(currentTime * 0.007) * 4, 0, Math.PI * 2);
        ctx.stroke();

        // Inner golden sacred aura
        ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.fill();

        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(state.playerX, state.playerY, bRadius - 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Loot Orbs on floor
      lootOrbs.current.forEach((orb) => {
        ctx.save();
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orb.x - 1.5, orb.y - 1.5, orb.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Monster sprites (8 types strictly matching image_a1d8093a.png and image_c9fd0faf.png)
      monsters.current.forEach((m) => {
        ctx.save();
        ctx.translate(m.x, m.y);

        // Telegraph charge line for Boar
        if (m.type === 'boar' && m.chargeTimer && m.chargeTimer <= 0.8 && !m.isCharging) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(state.playerX - m.x, state.playerY - m.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        const isHit = m.hitFlashTimer > 0;

        if (m.type === 'slime') {
          // Slime Linh Khí: Bouncing jade green jelly with peppery eyes & leaf sprout (image_a1d8093a.png)
          const bounce = Math.sin(currentTime * 0.008 + m.x) * 2;
          ctx.fillStyle = isHit ? '#ffffff' : '#10b981';
          ctx.beginPath();
          ctx.ellipse(0, 2, m.radius + bounce * 0.6, m.radius * 0.85 - bounce * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          if (!isHit) {
            // Leaf sprout on head
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.ellipse(-3, -m.radius * 0.9, 3, 5, -0.4, 0, Math.PI * 2);
            ctx.ellipse(3, -m.radius * 0.9, 3, 5, 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Peppery black eyes
            ctx.fillStyle = '#064e3b';
            ctx.beginPath();
            ctx.arc(-5, 0, 2, 0, Math.PI * 2);
            ctx.arc(5, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            // Blush
            ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
            ctx.beginPath();
            ctx.arc(-7, 3, 1.8, 0, Math.PI * 2);
            ctx.arc(7, 3, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (m.type === 'rabbit') {
          // Thỏ Ma Tinh Tinh: Chubby brown bunny, devil horns, bat wings, glowing red eyes (image_a1d8093a.png)
          ctx.fillStyle = isHit ? '#ffffff' : '#785b65';
          ctx.beginPath();
          ctx.ellipse(0, 2, m.radius, m.radius * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();

          if (!isHit) {
            // Ears
            ctx.fillStyle = '#5c414a';
            ctx.beginPath();
            ctx.ellipse(-5, -m.radius * 0.9, 3.5, 9, -0.2, 0, Math.PI * 2);
            ctx.ellipse(5, -m.radius * 0.9, 3.5, 9, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Small horns
            ctx.fillStyle = '#26171d';
            ctx.beginPath();
            ctx.moveTo(-7, -m.radius * 0.7);
            ctx.lineTo(-10, -m.radius * 1.3);
            ctx.lineTo(-4, -m.radius * 0.7);
            ctx.moveTo(7, -m.radius * 0.7);
            ctx.lineTo(10, -m.radius * 1.3);
            ctx.lineTo(4, -m.radius * 0.7);
            ctx.fill();

            // Bat wings flapping
            const wingFlap = Math.sin(currentTime * 0.015) * 4;
            ctx.fillStyle = '#26171d';
            ctx.beginPath();
            ctx.moveTo(-m.radius * 0.8, -2);
            ctx.lineTo(-m.radius * 1.5, -6 + wingFlap);
            ctx.lineTo(-m.radius * 0.8, 4);
            ctx.moveTo(m.radius * 0.8, -2);
            ctx.lineTo(m.radius * 1.5, -6 + wingFlap);
            ctx.lineTo(m.radius * 0.8, 4);
            ctx.fill();

            // Glowing red eyes
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(-4, 0, 2.2, 0, Math.PI * 2);
            ctx.arc(4, 0, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (m.type === 'mushroom') {
          // Nấm Độc Mũ Đỏ: Red mushroom cap with white polka dots, chubby beige stem (image_a1d8093a.png)
          ctx.fillStyle = isHit ? '#ffffff' : '#fef08a';
          ctx.fillRect(-m.radius * 0.5, -2, m.radius, m.radius * 0.95);

          // Red Cap
          ctx.fillStyle = isHit ? '#ffffff' : '#dc2626';
          ctx.beginPath();
          ctx.arc(0, -3, m.radius * 1.05, Math.PI, 0);
          ctx.closePath();
          ctx.fill();

          if (!isHit) {
            // White polka dots
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-8, -10, 2.2, 0, Math.PI * 2);
            ctx.arc(0, -14, 2.5, 0, Math.PI * 2);
            ctx.arc(8, -10, 2.2, 0, Math.PI * 2);
            ctx.arc(-4, -6, 1.8, 0, Math.PI * 2);
            ctx.arc(5, -6, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Tiny eyes on stem
            ctx.fillStyle = '#1c1917';
            ctx.beginPath();
            ctx.arc(-3, 3, 1.5, 0, Math.PI * 2);
            ctx.arc(3, 3, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (m.type === 'bat') {
          // Dơi Củ Tỏi: Round garlic lavender body, flapping wings, beaded necklace
          ctx.fillStyle = isHit ? '#ffffff' : '#c084fc';
          ctx.beginPath();
          ctx.arc(0, 0, m.radius * 0.75, 0, Math.PI * 2);
          ctx.fill();

          if (!isHit) {
            // Wings
            const wFlap = Math.sin(currentTime * 0.012) * 5;
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath();
            ctx.moveTo(-m.radius * 0.6, -2);
            ctx.lineTo(-m.radius * 1.6, -8 + wFlap);
            ctx.lineTo(-m.radius * 0.6, 6);
            ctx.moveTo(m.radius * 0.6, -2);
            ctx.lineTo(m.radius * 1.6, -8 + wFlap);
            ctx.lineTo(m.radius * 0.6, 6);
            ctx.fill();

            // Beaded necklace
            ctx.fillStyle = '#f8fafc';
            for (let i = -3; i <= 3; i++) {
              ctx.beginPath();
              ctx.arc(i * 3, 5, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }

            // Violet eyes
            ctx.fillStyle = '#4c1d95';
            ctx.beginPath();
            ctx.arc(-3, -1, 1.8, 0, Math.PI * 2);
            ctx.arc(3, -1, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (m.type === 'turtle') {
          // Rùa Đá Cổ Thụ: Cracked mossy stone shell, herb sprout, glowing cyan runes (image_c9fd0faf.png)
          ctx.fillStyle = isHit ? '#ffffff' : '#64748b';
          // 4 Sturdy stone legs
          ctx.fillRect(-m.radius * 0.85, m.radius * 0.3, 7, 7);
          ctx.fillRect(m.radius * 0.5, m.radius * 0.3, 7, 7);
          ctx.fillRect(-m.radius * 0.85, -m.radius * 0.7, 7, 7);
          ctx.fillRect(m.radius * 0.5, -m.radius * 0.7, 7, 7);

          // Head (retracted inside if isShielding)
          if (!m.isShielding) {
            ctx.beginPath();
            ctx.arc(0, -m.radius * 0.9, 7, 0, Math.PI * 2);
            ctx.fill();
            // Sleepy eyes
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(-2.5, -m.radius * 0.9, 1.2, 0, Math.PI * 2);
            ctx.arc(2.5, -m.radius * 0.9, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Main Stone Shell
          ctx.fillStyle = isHit ? '#ffffff' : '#475569';
          ctx.beginPath();
          ctx.ellipse(0, 0, m.radius, m.radius * 0.85, 0, 0, Math.PI * 2);
          ctx.fill();

          if (!isHit) {
            // Green moss patch on top of shell
            ctx.fillStyle = '#65a30d';
            ctx.beginPath();
            ctx.ellipse(0, -m.radius * 0.25, m.radius * 0.55, m.radius * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Herbal sprout on top of back
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.ellipse(-2, -m.radius * 0.7, 2, 4.5, -0.3, 0, Math.PI * 2);
            ctx.ellipse(2, -m.radius * 0.7, 2, 4.5, 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Glowing cyan ancient runes
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(0, 0, m.radius * 0.4, 0, Math.PI);
            ctx.moveTo(-6, 0);
            ctx.lineTo(6, 0);
            ctx.stroke();

            if (m.isShielding) {
              // Shielding barrier glow
              ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
              ctx.lineWidth = 2.5;
              ctx.strokeRect(-m.radius - 2, -m.radius - 2, (m.radius + 2) * 2, (m.radius + 2) * 2);
            }
          }
        } else if (m.type === 'bamboo') {
          // Tiểu Trúc Yêu: Bamboo shoot with red scarf & bamboo leaf twig
          ctx.fillStyle = isHit ? '#ffffff' : '#84cc16';
          ctx.beginPath();
          ctx.moveTo(0, -m.radius * 1.2);
          ctx.lineTo(m.radius * 0.8, m.radius * 0.9);
          ctx.lineTo(-m.radius * 0.8, m.radius * 0.9);
          ctx.closePath();
          ctx.fill();

          if (!isHit) {
            // Red scarf
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-m.radius * 0.5, 0, m.radius, 4);

            // Leaf twig in hand
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.ellipse(m.radius * 0.7, -4, 2.5, 6, 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(-3, -4, 1.5, 0, Math.PI * 2);
            ctx.arc(3, -4, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (m.type === 'fox') {
          // Cáo Chín Đuôi Mini: Chubby orange fox with 9 fluffy tails & cinnabar mark
          if (!isHit) {
            // 9 Fluffy tails fanning behind
            ctx.fillStyle = '#fdba74';
            for (let i = -4; i <= 4; i++) {
              const tailAngle = (i * Math.PI) / 10 + Math.PI / 2;
              const tx = Math.cos(tailAngle) * (m.radius * 1.2);
              const ty = Math.sin(tailAngle) * (m.radius * 1.2);
              ctx.beginPath();
              ctx.arc(tx, ty + 4, 5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Main Body
          ctx.fillStyle = isHit ? '#ffffff' : '#f97316';
          ctx.beginPath();
          ctx.arc(0, 0, m.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();

          if (!isHit) {
            // White chest
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 4, m.radius * 0.45, 0, Math.PI * 2);
            ctx.fill();

            // Cinnabar mark on forehead
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, -6, 2, 0, Math.PI * 2);
            ctx.fill();

            // Fox ears
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.moveTo(-7, -m.radius * 0.6);
            ctx.lineTo(-12, -m.radius * 1.2);
            ctx.lineTo(-2, -m.radius * 0.8);
            ctx.moveTo(7, -m.radius * 0.6);
            ctx.lineTo(12, -m.radius * 1.2);
            ctx.lineTo(2, -m.radius * 0.8);
            ctx.fill();

            // Slanted cunning eyes
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.ellipse(-4, -1, 2, 1.2, -0.3, 0, Math.PI * 2);
            ctx.ellipse(4, -1, 2, 1.2, 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (m.type === 'boar') {
          // Heo Rừng Kim Giáp: Golden boar with ornate golden cloud armor & tusks (image_c9fd0faf.png)
          ctx.fillStyle = isHit ? '#ffffff' : '#eab308';
          // Chubby body
          ctx.beginPath();
          ctx.ellipse(0, 0, m.radius, m.radius * 0.85, 0, 0, Math.PI * 2);
          ctx.fill();

          if (!isHit) {
            // Ornate golden cloud armor pauldrons on back and shoulders
            ctx.fillStyle = '#ca8a04';
            ctx.beginPath();
            ctx.ellipse(0, -m.radius * 0.35, m.radius * 0.75, m.radius * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(-6, -m.radius * 0.35, 4, 0, Math.PI * 2);
            ctx.arc(6, -m.radius * 0.35, 4, 0, Math.PI * 2);
            ctx.stroke();

            // Pig snout
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.ellipse(0, 4, 5.5, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Nostrils
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(-2, 4, 1, 0, Math.PI * 2);
            ctx.arc(2, 4, 1, 0, Math.PI * 2);
            ctx.fill();

            // White curved tusks
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-6, 3);
            ctx.lineTo(-9, 0);
            ctx.lineTo(-5, 5);
            ctx.moveTo(6, 3);
            ctx.lineTo(9, 0);
            ctx.lineTo(5, 5);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(-5, -2, 1.8, 0, Math.PI * 2);
            ctx.arc(5, -2, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // BITE / SCRATCH ANIMATION EFFECT
        if (m.biteAnimTimer && m.biteAnimTimer > 0) {
          ctx.save();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, m.radius + 6, -Math.PI / 4, Math.PI / 4);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, m.radius + 6, Math.PI * 0.75, Math.PI * 1.25);
          ctx.stroke();
          ctx.restore();
        }

        // Overhead monster health bar
        const mBarW = m.radius * 2.2;
        const mBarH = 3.5;
        const mBarY = -m.radius - 8;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(-mBarW / 2, mBarY, mBarW, mBarH);

        const hpPct = Math.max(0, m.hp / m.maxHp);
        ctx.fillStyle = hpPct > 0.3 ? '#22c55e' : '#ef4444';
        ctx.fillRect(-mBarW / 2, mBarY, mBarW * hpPct, mBarH);

        ctx.restore();
      });

      // Flying Swords (Orbiting & Attacking)
      state.orbitingSwords.forEach((sw) => {
        ctx.save();
        ctx.translate(sw.x, sw.y);
        ctx.rotate(sw.angle);

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-8, -4.5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, 4.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-9, -2, 3, 4);

        ctx.restore();
      });

      // Projectile Swords
      projectiles.current.forEach((p) => {
        // Draw sword trail
        p.trail.forEach((t, i) => {
          ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + (i / p.trail.length) * 0.4})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.radius * (0.3 + (i / p.trail.length) * 0.6), 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.arcAngle);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(-10, -5);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -1, 10, 2);

        ctx.restore();
      });

      // ==========================================
      // PLAYER CHIBI CHARACTER RENDERING
      // ==========================================
      ctx.save();
      ctx.translate(state.playerX, state.playerY);

      // Shadow on floor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 16, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Robes Body (Faceless Chibi Tiên Nhân)
      const pOutfit = player.fashion.outfit;
      ctx.fillStyle =
        pOutfit === 'bach_da_kiem_y'
          ? '#f8fafc'
          : pOutfit === 'thanh_truc_tien_y'
          ? '#10b981'
          : pOutfit === 'bich_thuy_luu_tien'
          ? '#38bdf8'
          : pOutfit === 'ma_dao_hac_bao'
          ? '#18181b'
          : '#475569';

      ctx.beginPath();
      ctx.moveTo(-11, -2);
      ctx.lineTo(11, -2);
      ctx.lineTo(14, 16);
      ctx.lineTo(-14, 16);
      ctx.closePath();
      ctx.fill();

      // Sash
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10, 6, 20, 3.5);

      // Faceless Head
      ctx.fillStyle = player.fashion.skinTone || '#fde7d6';
      ctx.beginPath();
      ctx.arc(0, -12, 11, 0, Math.PI * 2);
      ctx.fill();

      // Cheeks blush
      ctx.fillStyle = 'rgba(251, 113, 133, 0.3)';
      ctx.beginPath();
      ctx.arc(-6, -10, 2, 0, Math.PI * 2);
      ctx.arc(6, -10, 2, 0, Math.PI * 2);
      ctx.fill();

      // Blindfold if equipped
      if (player.fashion.accessory === 'bit_mat' || player.fashion.hairStyle === 'ngan_phat_bit_mat') {
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(-11, -14, 22, 4.5);
      }

      // Hair
      ctx.fillStyle = player.fashion.hairColor || '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -15, 10.5, Math.PI, 0);
      ctx.fill();

      // OVERHEAD BARS: Tên nhân vật, Thanh Khí Huyết (HP), Thanh Chân Nguyên (MP)
      const pBarW = 64;
      const pBarH = 4.5;
      const pBarY = -36;

      ctx.font = 'bold 10px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(`${player.name} (Lv.${state.level})`, 0, pBarY - 5);

      // 1. Thanh Khí Huyết (HP đỏ / xanh lá)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(-pBarW / 2, pBarY, pBarW, pBarH);

      const hpPercent = Math.max(0, Math.min(1, state.hp / state.maxHp));
      ctx.fillStyle = hpPercent > 0.35 ? '#22c55e' : '#ef4444';
      ctx.fillRect(-pBarW / 2, pBarY, pBarW * hpPercent, pBarH);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-pBarW / 2, pBarY, pBarW, pBarH);

      // 2. Thanh Chân Nguyên (MP xanh dương)
      const mpBarY = pBarY + pBarH + 2.5;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(-pBarW / 2, mpBarY, pBarW, pBarH);

      const mpPercent = Math.max(0, Math.min(1, state.mp / state.maxMp));
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-pBarW / 2, mpBarY, pBarW * mpPercent, pBarH);

      ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-pBarW / 2, mpBarY, pBarW, pBarH);

      ctx.restore();

      // Floating Texts
      floatingTexts.current.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.opacity);
        ctx.font = `bold ${ft.size}px "Be Vietnam Pro", sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [player, onRetreat, onSyncVitals]);

  const handleManualRetreat = () => {
    const state = gameState.current;
    onRetreat({
      survived: true,
      spiritStonesGained: state.spiritStonesGained,
      monstersKilled: state.monstersKilled,
      survivalSeconds: Math.floor(state.survivalSeconds),
      remainingHp: Math.round(state.hp),
      lootItems: state.lootCollected
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 block cursor-crosshair" />

      {/* TOP HEADS-UP DISPLAY (HUD) */}
      <header className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex items-center justify-between z-20">
        {/* Left Status: HP & MP */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <div className="flex flex-col gap-1 w-44">
            {/* Khí Huyết (HP) */}
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> Khí Huyết
              </span>
              <span className="text-slate-200 tabular-nums">
                {currentHp}/{maxHp}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, (currentHp / maxHp) * 100))}%` }}
              />
            </div>

            {/* Chân Nguyên (MP) */}
            <div className="flex justify-between text-xs font-semibold mt-0.5">
              <span className="text-sky-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Chân Nguyên
              </span>
              <span className="text-slate-200 tabular-nums">
                {currentMp}/{maxMp}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-600 to-blue-400 h-full transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, (currentMp / maxMp) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Clock & Level */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{survivalTimeStr}</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span>Cảnh Cấp:</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Lv.{arenaLevel}
            </span>
          </div>
        </div>

        {/* Right Stats & Retreat */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-lg text-xs font-bold">
            <span className="text-rose-400 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" /> {killsCount}
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> +{stonesCount}
            </span>
          </div>

          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2.5 rounded-xl bg-slate-900/85 border border-slate-700/60 text-slate-300 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          <button
            onClick={handleManualRetreat}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wider shadow-lg flex items-center gap-1.5 active:scale-95 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>RÚT LUI</span>
          </button>
        </div>
      </header>

      {/* BOTTOM SKILLS HUD (Q, E, R CONG PHAP BUTTONS) */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {/* Skill [Q] Vạn Kiếm Quy Tông */}
        <button
          onClick={toggleVanKiem}
          className={`px-4 py-2.5 rounded-2xl border backdrop-blur-md font-bold text-xs flex items-center gap-2 shadow-xl transition active:scale-95 ${
            isVanKiemActive
              ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400 animate-pulse'
              : 'bg-slate-900/85 border-slate-700 text-slate-300 hover:border-amber-400'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center font-mono font-black text-amber-300 text-xs">
            Q
          </span>
          <div className="text-left">
            <div className="text-[11px] leading-tight">Vạn Kiếm Quy Tông</div>
            <div className="text-[9px] text-amber-400/90">{isVanKiemActive ? 'ĐANG BẬT (10 MP/s - 10 Kiếm/s)' : 'Nhấn để bật'}</div>
          </div>
        </button>

        {/* Skill [E] Chân Nguyên Hộ Thể */}
        <button
          onClick={toggleBarrier}
          className={`px-4 py-2.5 rounded-2xl border backdrop-blur-md font-bold text-xs flex items-center gap-2 shadow-xl transition active:scale-95 ${
            isBarrierActive
              ? 'bg-sky-500/30 border-sky-400 text-sky-200 ring-2 ring-sky-400 animate-pulse'
              : 'bg-slate-900/85 border-slate-700 text-slate-300 hover:border-sky-400'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center font-mono font-black text-sky-300 text-xs">
            E
          </span>
          <div className="text-left">
            <div className="text-[11px] leading-tight">Chân Nguyên Hộ Thể</div>
            <div className="text-[9px] text-sky-400/90">{isBarrierActive ? 'ĐANG BẬT (Khiên 100px - 1:50 MP)' : 'Nhấn để bật'}</div>
          </div>
        </button>

        {/* Skill [R] Vô Hạ Hạn (Gojo) */}
        <button
          onClick={toggleVoHaHan}
          className={`px-4 py-2.5 rounded-2xl border backdrop-blur-md font-bold text-xs flex items-center gap-2 shadow-xl transition active:scale-95 ${
            isVoHaHanActive
              ? 'bg-purple-500/30 border-purple-400 text-purple-200 ring-2 ring-purple-400 animate-pulse'
              : 'bg-slate-900/85 border-slate-700 text-slate-300 hover:border-purple-400'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center font-mono font-black text-purple-300 text-xs">
            R
          </span>
          <div className="text-left">
            <div className="text-[11px] leading-tight">Vô Hạ Hạn (Gojo)</div>
            <div className="text-[9px] text-purple-400/90">{isVoHaHanActive ? 'ĐANG BẬT (300px - Chậm Quái & Đạn)' : 'Nhấn để bật'}</div>
          </div>
        </button>
      </footer>

      {/* MOBILE TOUCH JOYSTICK */}
      <div
        className="absolute inset-0 z-10 touch-none pointer-events-auto sm:pointer-events-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {joystickTouch.active && (
          <div
            className="absolute rounded-full border-2 border-sky-400/50 bg-sky-950/30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: joystickTouch.x,
              top: joystickTouch.y,
              width: 90,
              height: 90
            }}
          >
            <div
              className="absolute w-8 h-8 rounded-full bg-sky-400/80 shadow-md shadow-sky-400/50 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: joystickTouch.kx - joystickTouch.x + 45,
                top: joystickTouch.ky - joystickTouch.y + 45
              }}
            />
          </div>
        )}
      </div>

      {/* ROGUELITE UPGRADE MODAL */}
      {levelUpChoices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in">
          <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                ĐỘT PHÁ TẠO HÓA BÍ CẢNH
              </span>
              <h2 className="text-2xl font-black font-serif text-slate-100">
                CHỌN 1 TRONG 3 NGỌC PHÙ BẢO VẬT
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Các thuộc tính tăng cường này chỉ phát huy uy lực trong chuyến xuất chiến bí cảnh hiện tại.
              </p>
            </div>

            <div className="space-y-3">
              {levelUpChoices.map((up) => (
                <button
                  key={up.id}
                  onClick={() => handleSelectUpgrade(up)}
                  className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/80 hover:bg-slate-900 transition-all text-left flex items-center gap-4 group active:scale-98 shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-110 transition-transform">
                    {up.icon === 'Swords' ? (
                      <Swords className="w-6 h-6" />
                    ) : up.icon === 'Heart' ? (
                      <Heart className="w-6 h-6 text-rose-400" />
                    ) : up.icon === 'Compass' ? (
                      <Compass className="w-6 h-6 text-sky-400" />
                    ) : up.icon === 'Sparkles' ? (
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300 transition-colors">
                        {up.title}
                      </h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {up.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{up.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
