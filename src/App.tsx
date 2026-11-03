import React, { useState, useEffect } from 'react';
import { PlayerStats, RealmInfo, Item, FashionConfig, EquipmentItem } from './types/game';
import { REALMS, INITIAL_PLAYER, SectShopItem } from './constants/gameData';
import { loadGame, saveGame, resetGame, formatLifespan } from './services/storage';
import { sound } from './services/audio';

import { ChibiCharacterRenderer } from './components/ChibiCharacterRenderer';
import { DongPhuView } from './components/DongPhuView';
import { ArenaCanvas } from './components/ArenaCanvas';
import { CongPhapView } from './components/CongPhapView';
import { EquipmentView } from './components/EquipmentView';
import { ChiBaoView } from './components/ChiBaoView';
import { IndexMonsterView } from './components/IndexMonsterView';
import { InventoryView } from './components/InventoryView';
import { MarketView } from './components/MarketView';
import { SectView } from './components/SectView';
import { FashionView } from './components/FashionView';
import { ThienKiepModal } from './components/ThienKiepModal';
import { RetreatModal } from './components/RetreatModal';
import { SettingsModal } from './components/SettingsModal';

import {
  Flame,
  Swords,
  BookOpen,
  Package,
  Store,
  Shield,
  Palette,
  Heart,
  Zap,
  Utensils,
  Droplet,
  Hourglass,
  Volume2,
  VolumeX,
  Sparkles,
  Edit2,
  AlertTriangle,
  Settings,
  Compass,
  Skull
} from 'lucide-react';

export default function App() {
  const [player, setPlayer] = useState<PlayerStats>(loadGame);
  const [currentScreen, setCurrentScreen] = useState<'dongphu' | 'arena'>('dongphu');
  const [activeTab, setActiveTab] = useState<'dongphu' | 'equipment' | 'artifacts' | 'congphap' | 'index' | 'inventory' | 'market' | 'sect' | 'fashion'>('dongphu');
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);
  const [isTrueDeath, setIsTrueDeath] = useState(false);

  // Modals
  const [tribulationRealm, setTribulationRealm] = useState<RealmInfo | null>(null);
  const [retreatResult, setRetreatResult] = useState<{
    survived: boolean;
    spiritStonesGained: number;
    monstersKilled: number;
    survivalSeconds: number;
    remainingHp: number;
    lootItems?: Item[];
  } | null>(null);
  const [dailySalaryClaimed, setDailySalaryClaimed] = useState(false);
  const [arenaSessionId, setArenaSessionId] = useState(Date.now());

  // Auto Save to localStorage on changes
  useEffect(() => {
    saveGame(player);
  }, [player]);

  // Real-time main game loop (Tọa thiền tự động, thọ nguyên, đói khát, hồi HP chậm ở Tĩnh Thất)
  useEffect(() => {
    let secondCounter = 0;

    const timer = setInterval(() => {
      secondCounter += 1;

      setPlayer((prev) => {
        // 1. Tọa Thiền Tự Động (khi isMeditating bật và đang ở Tĩnh Thất)
        let expGain = 0;
        if (currentScreen === 'dongphu' && prev.isMeditating) {
          const isTuKhiEquipped = prev.equippedArtifactIds?.includes('chi_bao_tu_khi');
          const tuKhiObj = prev.chiBaoList?.find((c) => c.id === 'chi_bao_tu_khi');
          const tuKhiBonus = isTuKhiEquipped ? (tuKhiObj?.star || 1) : 0;
          expGain = (prev.cultivationSpeedBonus || 1) + tuKhiBonus;
        }

        // 2. Thọ nguyên đếm ngược: 1 giây
        const newLifespan = Math.max(0, prev.lifespanSeconds - 1);

        // 3. Đói & Khát giảm dần về 0: 1 điểm mỗi 30s (0 = đói khát)
        const hungerRate = prev.maxHunger / 3000;
        const thirstRate = prev.maxThirst / 2500;
        const newHunger = Math.max(0, prev.hunger - hungerRate);
        const newThirst = Math.max(0, prev.thirst - thirstRate);

        // 4. Hồi Khí Huyết (HP) ở Tĩnh Thất: +1 HP mỗi 60 giây (1 phút)
        let newHp = prev.hp;
        if (currentScreen === 'dongphu' && secondCounter % 60 === 0 && newHp < prev.maxHp) {
          newHp = Math.min(prev.maxHp, newHp + 1);
        }

        // 5. MP hồi phục ở bên ngoài: +1 MP mỗi 60 giây (1 phút)
        let newMp = prev.mp;
        if (currentScreen === 'dongphu' && secondCounter % 60 === 0 && newMp < prev.maxMp) {
          newMp = Math.min(prev.maxMp, newMp + 1);
        }

        // 6. Niết Bàn Phượng Vũ hồi chiêu giảm dần
        let newPhoenixCd = prev.phoenixReviveCooldownSeconds || 0;
        if (newPhoenixCd > 0) {
          newPhoenixCd = Math.max(0, newPhoenixCd - 1);
        }

        return {
          ...prev,
          exp: prev.exp + expGain,
          lifespanSeconds: newLifespan,
          hunger: Number(newHunger.toFixed(2)),
          thirst: Number(newThirst.toFixed(2)),
          hp: Math.round(newHp),
          mp: Math.round(newMp),
          phoenixReviveCooldownSeconds: newPhoenixCd
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen]);

  // Action: Vào Bí Cảnh (Tiêu hao 1 năm Thọ nguyên = 60s)
  const handleEnterArena = () => {
    if (player.lifespanSeconds < 60) {
      alert('Thọ nguyên không đủ 1 năm (60s)! Hãy dùng Diên Thọ Tán hoặc đột phá cảnh giới để gia tăng thọ mệnh.');
      return;
    }

    sound.playSwordSlash();

    const realm = REALMS[player.realmIndex] || REALMS[0];
    setArenaSessionId(Date.now()); // Tạo phiên bí cảnh mới hoàn toàn

    // Khởi tạo lại toàn bộ chỉ số thực tế theo cảnh giới, tuyệt đối không giữ buff của trận trước
    setPlayer((prev) => ({
      ...prev,
      maxHp: realm.baseHp,
      maxMp: realm.baseMp,
      atk: realm.baseAtk,
      def: realm.baseDef,
      speed: 220,
      critRate: 0.12,
      critDmg: 1.5,
      hp: Math.min(realm.baseHp, prev.hp),
      mp: Math.min(realm.baseMp, prev.mp),
      lifespanSeconds: prev.lifespanSeconds - 60, // Giảm từ 5 năm xuống 1 năm
      isMeditating: false
    }));

    setCurrentScreen('arena');
  };

  // Action: Quay về từ Bí Cảnh
  const handleRetreatFromArena = (result: {
    survived: boolean;
    spiritStonesGained: number;
    monstersKilled: number;
    survivalSeconds: number;
    remainingHp: number;
    lootItems: Item[];
  }) => {
    // Nếu tử nạn trong Bí Cảnh và hết máu (không được hồi sinh bởi Niết Bàn Phượng Vũ)
    if (!result.survived && result.remainingHp <= 0) {
      setIsTrueDeath(true);
      return;
    }

    setPlayer((prev) => {
      const realm = REALMS[prev.realmIndex] || REALMS[0];
      const inv = [...prev.inventory];
      if (result.lootItems && result.lootItems.length > 0) {
        result.lootItems.forEach((loot) => {
          const existing = inv.find((i) => i.id === loot.id);
          if (existing) {
            existing.count += loot.count;
          } else {
            inv.push({ ...loot });
          }
        });
      }

      return {
        ...prev,
        maxHp: realm.baseHp,
        maxMp: realm.baseMp,
        atk: realm.baseAtk,
        def: realm.baseDef,
        speed: 220,
        critRate: 0.12,
        critDmg: 1.5,
        hp: Math.min(realm.baseHp, Math.max(1, result.remainingHp)),
        mp: Math.min(realm.baseMp, prev.mp),
        spiritStones: prev.spiritStones + result.spiritStonesGained,
        totalKills: prev.totalKills + result.monstersKilled,
        inventory: inv
      };
    });

    setCurrentScreen('dongphu');
    setRetreatResult({
      survived: result.survived,
      spiritStonesGained: result.spiritStonesGained,
      monstersKilled: result.monstersKilled,
      survivalSeconds: result.survivalSeconds,
      remainingHp: Math.max(1, result.remainingHp),
      lootItems: result.lootItems
    });
  };

  // Action: Live Sync Vitals from Arena to Player state (chỉ đồng bộ lượng máu và chân nguyên, không vượt quá maxHp/maxMp gốc)
  const handleSyncVitals = (vitals: { hp: number; mp: number }) => {
    setPlayer((prev) => {
      const realm = REALMS[prev.realmIndex] || REALMS[0];
      return {
        ...prev,
        hp: Math.min(realm.baseHp, vitals.hp),
        mp: Math.min(realm.baseMp, vitals.mp)
      };
    });
  };

  // Action: Toggle Tọa Thiền [Bắt Đầu Tọa Thiền] / [Ngừng Tọa Thiền]
  const handleToggleMeditate = () => {
    sound.playMeditate();
    setPlayer((prev) => ({
      ...prev,
      isMeditating: !prev.isMeditating
    }));
  };

  // Action: Đột Phá Cảnh Giới (BẢO LƯU TU VI DƯ THỪA TRIỆT ĐỂ, TĂNG GIỚI HẠN ĐÓI KHÁT)
  const handleBreakthrough = () => {
    const currentRealm = REALMS[player.realmIndex] || REALMS[0];
    const nextRealm = REALMS[player.realmIndex + 1];

    if (!nextRealm) {
      alert('Đạo hữu đã đạt cảnh giới tối cao Hóa Thần Đỉnh Phong!');
      return;
    }

    if (player.exp < currentRealm.reqExp) {
      alert('Chưa đủ Tu Vi để ngưng tụ phá cảnh!');
      return;
    }

    // Nếu là Đại Cảnh Giới -> Mở Thiên Kiếp
    if (currentRealm.isMajor) {
      setTribulationRealm(nextRealm);
    } else {
      // Tiểu cảnh giới: Trừ đúng reqExp, GIỮ NGUYÊN TU VI DƯ
      sound.playLevelUp();
      const excessExp = player.exp - currentRealm.reqExp;

      setPlayer((prev) => ({
        ...prev,
        realmIndex: prev.realmIndex + 1,
        exp: excessExp, // Giữ nguyên phần dư!
        hp: nextRealm.baseHp,
        maxHp: nextRealm.baseHp,
        mp: nextRealm.baseMp,
        maxMp: nextRealm.baseMp,
        atk: nextRealm.baseAtk,
        def: nextRealm.baseDef,
        maxHunger: nextRealm.maxHunger,
        maxThirst: nextRealm.maxThirst,
        lifespanSeconds: prev.lifespanSeconds + nextRealm.lifespanReward * 60
      }));
    }
  };

  // Action: Nâng Cấp Công Pháp Bằng Linh Thạch
  const handleUpgradeCongPhap = (id: string) => {
    setPlayer((prev) => {
      const cp = prev.congPhapList.find((c) => c.id === id);
      if (!cp || cp.level >= cp.maxLevel || prev.spiritStones < cp.upgradeCost) return prev;

      sound.playLevelUp();
      const updatedList = prev.congPhapList.map((c) => {
        if (c.id === id) {
          const nextLevel = c.level + 1;
          const nextTier = nextLevel;
          const nextCost = Math.round(c.upgradeCost * 1.8);
          let newDesc = c.effectDesc;
          if (c.id === 'van_kiem_quy_tong') {
            newDesc = `${10 + (nextTier - 1) * 5} Phi kiếm truy kích, ${100 + nextTier * 25}% sát thương, 10 MP/s (cap 30 kiếm)`;
          } else if (c.id === 'chan_nguyen_ho_the') {
            newDesc = `Hào quang bảo hộ bán kính 50px, quy đổi 1:${50 + (nextTier - 1) * 25} (1 MP giảm ${50 + (nextTier - 1) * 25} sát thương)`;
          } else if (c.id === 'vo_ha_han') {
            newDesc = `Lĩnh vực không gian 300px (vùng 140px làm chậm 99%), tiêu tốn 5 MP/s`;
          }
          return {
            ...c,
            level: nextLevel,
            tier: nextTier,
            upgradeCost: nextCost,
            effectDesc: newDesc
          };
        }
        return c;
      });

      return {
        ...prev,
        spiritStones: prev.spiritStones - cp.upgradeCost,
        congPhapList: updatedList
      };
    });
  };

  // Action: Xóa / Phế Bỏ Công Pháp (Để khi mua lại up tầng từ đầu)
  const handleDeleteCongPhap = (id: string) => {
    setPlayer((prev) => {
      const updatedList = prev.congPhapList.map((c) => {
        if (c.id === id) {
          const baseCost = c.id === 'van_kiem_quy_tong' ? 300 : c.id === 'chan_nguyen_ho_the' ? 250 : 400;
          return {
            ...c,
            unlocked: false,
            level: 1,
            tier: 1,
            equipped: false,
            upgradeCost: baseCost
          };
        }
        return c;
      });
      return {
        ...prev,
        congPhapList: updatedList
      };
    });
  };

  // Action: Trang Bị / Gỡ Bỏ Công Pháp
  const handleToggleEquipCongPhap = (id: string) => {
    setPlayer((prev) => {
      const updatedList = prev.congPhapList.map((c) => {
        if (c.id === id) {
          return { ...c, equipped: !c.equipped };
        }
        return c;
      });
      return {
        ...prev,
        congPhapList: updatedList
      };
    });
  };

  // Action: Trang Bị / Tháo Chí Bảo Trấn Tông (Tối đa 3 món)
  const handleToggleEquipChiBao = (id: string) => {
    setPlayer((prev) => {
      const equipped = prev.equippedArtifactIds || [];
      if (equipped.includes(id)) {
        return {
          ...prev,
          equippedArtifactIds: equipped.filter((item) => item !== id)
        };
      } else {
        if (equipped.length >= 3) {
          alert('Chỉ có thể trang bị tối đa 3 Chí Bảo Trấn Tông cùng lúc!');
          return prev;
        }
        return {
          ...prev,
          equippedArtifactIds: [...equipped, id]
        };
      }
    });
  };

  // Action: Nâng Cấp Sao Chí Bảo Tụ Khí Đan
  const handleUpgradeChiBaoStar = (id: string) => {
    setPlayer((prev) => {
      const list = prev.chiBaoList || [];
      const cb = list.find((c) => c.id === id);
      if (!cb || cb.star >= 5) return prev;
      const cost = cb.star * 500;
      if (prev.spiritStones < cost) {
        alert(`Không đủ Linh Thạch! Cần ${cost} Linh Thạch.`);
        return prev;
      }
      sound.playLevelUp();
      return {
        ...prev,
        spiritStones: prev.spiritStones - cost,
        chiBaoList: list.map((c) => (c.id === id ? { ...c, star: c.star + 1 } : c))
      };
    });
  };

  // Action: Trang Bị & Mua Trang Bị Lò Rèn
  const handleEquipGear = (gear: EquipmentItem) => {
    sound.playSwordSummon();
    setPlayer((prev) => ({
      ...prev,
      equippedGear: {
        ...prev.equippedGear,
        [gear.slot]: gear
      }
    }));
  };

  const handleUnequipGear = (slot: 'weapon' | 'armor' | 'boots' | 'ring') => {
    setPlayer((prev) => ({
      ...prev,
      equippedGear: {
        ...prev.equippedGear,
        [slot]: undefined
      }
    }));
  };

  const handleBuyEquipment = (gear: EquipmentItem) => {
    if (player.spiritStones < gear.cost) {
      alert(`Không đủ Linh Thạch! Cần ${gear.cost} Linh Thạch.`);
      return;
    }
    sound.playLevelUp();
    setPlayer((prev) => ({
      ...prev,
      spiritStones: prev.spiritStones - gear.cost,
      equippedGear: {
        ...prev.equippedGear,
        [gear.slot]: gear
      }
    }));
  };

  // Action: Sử dụng vật phẩm từ Túi Đồ
  const handleUseItem = (itemId: string) => {
    setPlayer((prev) => {
      const inv = [...prev.inventory];
      const item = inv.find((i) => i.id === itemId);
      if (!item || item.count <= 0) return prev;

      item.count -= 1;

      let newHp = prev.hp;
      let newMp = prev.mp;
      let newExp = prev.exp;
      let newHunger = prev.hunger;
      let newThirst = prev.thirst;
      let newLifespan = prev.lifespanSeconds;

      if (item.healHp) newHp = Math.min(prev.maxHp, newHp + item.healHp);
      if (item.healMp) newMp = Math.min(prev.maxMp, newMp + item.healMp);
      if (item.addExp) newExp += item.addExp;
      // Đói và khát giảm về 0 nên khi dùng thức ăn/nước uống sẽ tăng trở lại giới hạn max
      if (item.reduceHunger) newHunger = Math.min(prev.maxHunger, newHunger + item.reduceHunger);
      if (item.reduceThirst) newThirst = Math.min(prev.maxThirst, newThirst + item.reduceThirst);
      if (item.addLifespan) newLifespan += item.addLifespan * 60;

      return {
        ...prev,
        hp: newHp,
        mp: newMp,
        exp: newExp,
        hunger: newHunger,
        thirst: newThirst,
        lifespanSeconds: newLifespan,
        inventory: inv
      };
    });
  };

  // Action: Bán nguyên liệu yêu ma lấy Linh Thạch
  const handleSellItem = (itemId: string, count: number) => {
    setPlayer((prev) => {
      const inv = [...prev.inventory];
      const item = inv.find((i) => i.id === itemId);
      if (!item || item.count <= 0) return prev;

      const sellCount = Math.min(item.count, count);
      item.count -= sellCount;
      const stonesGained = (item.price || 15) * sellCount;

      return {
        ...prev,
        spiritStones: prev.spiritStones + stonesGained,
        inventory: inv.filter((i) => i.count > 0)
      };
    });
  };

  // Action: Mua từ Chợ Linh Vật
  const handleBuyItem = (shopItem: Item) => {
    setPlayer((prev) => {
      if (prev.spiritStones < shopItem.price) return prev;

      const inv = [...prev.inventory];
      const existing = inv.find((i) => i.id === shopItem.id);
      if (existing) {
        existing.count += 1;
      } else {
        inv.push({ ...shopItem, count: 1 });
      }

      return {
        ...prev,
        spiritStones: prev.spiritStones - shopItem.price,
        inventory: inv
      };
    });
  };

  // Action: Mua từ Tông Môn Tàng Các
  const handleBuySectItem = (sectItem: SectShopItem) => {
    setPlayer((prev) => {
      if (prev.sectContributionPoints < sectItem.costContribution) return prev;

      const result = sectItem.effect(prev);
      if (!result.success) {
        alert(result.message);
        return prev;
      }

      alert(result.message);
      return {
        ...result.updatedPlayer,
        sectContributionPoints: prev.sectContributionPoints - sectItem.costContribution
      };
    });
  };

  // Action: Lãnh thưởng nhiệm vụ Tông Môn
  const handleClaimMission = (mission: { id: string; rewardStones: number; rewardExp: number; rewardContribution: number }) => {
    setPlayer((prev) => ({
      ...prev,
      spiritStones: prev.spiritStones + mission.rewardStones,
      sectContributionPoints: prev.sectContributionPoints + (mission.rewardContribution || 30),
      exp: prev.exp + mission.rewardExp,
      activeMissions: [...prev.activeMissions, `claimed_${mission.id}`]
    }));
  };

  // Action: Lãnh Bổng Lộc Hàng Ngày
  const handleClaimDailySalary = () => {
    setPlayer((prev) => ({
      ...prev,
      spiritStones: prev.spiritStones + 100,
      sectContributionPoints: prev.sectContributionPoints + 30
    }));
    setDailySalaryClaimed(true);
  };

  // Action: Lưu Thời Trang Chibi Tiên Hiệp
  const handleSaveFashion = (newFashion: FashionConfig) => {
    setPlayer((prev) => ({
      ...prev,
      fashion: newFashion
    }));
  };

  // Action: Đổi Đạo Hiệu
  const handleUpdateName = (newName: string) => {
    setPlayer((prev) => ({
      ...prev,
      name: newName
    }));
  };

  // Action: Reset Game (Tái Sinh Luân Hồi)
  const handleResetGame = () => {
    const fresh = resetGame();
    setPlayer(fresh);
    sound.playLevelUp();
    alert('Đã tái sinh luân hồi thành công! Chúc đạo hữu một kiếp tu tiên rực rỡ.');
  };

  const currentRealm = REALMS[player.realmIndex] || REALMS[0];

  // ========================================================
  // RENDER MÀN HÌNH CHIẾN ĐẤU BÍ CẢNH (FULL VIEW ĐỘC LẬP)
  // ========================================================
  if (currentScreen === 'arena') {
    return (
      <ArenaCanvas
        key={arenaSessionId}
        player={player}
        onRetreat={handleRetreatFromArena}
        onSyncVitals={handleSyncVitals}
      />
    );
  }

  // ========================================================
  // RENDER MÀN HÌNH ĐỘNG PHỦ (TĨNH THẤT TU HÀNH)
  // ========================================================
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* ==================================================== */}
      {/* CỘT TRÁI: THÔNG TIN NHÂN VẬT & MENU ĐIỀU HƯỚNG */}
      {/* ==================================================== */}
      <aside className="w-80 lg:w-84 shrink-0 h-screen bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-4 z-20 custom-scrollbar">
        <div className="space-y-4">
          {/* Top Logo & Setting Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                <Flame className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <span className="font-serif font-black text-sm tracking-wide text-amber-300 block">
                  TIÊN TU: BÍ CẢNH
                </span>
                <span className="text-[10px] text-slate-400 -mt-0.5 block">Roguelite Tu Tiên</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                title="Cài Đặt Âm Thanh & Chơi Lại"
              >
                <Settings className="w-4 h-4 text-slate-300" />
              </button>
              <button
                onClick={() => {
                  const muted = sound.toggleMute();
                  setIsMuted(muted);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                title="Bật/Tắt Âm Thanh"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
              </button>
            </div>
          </div>

          {/* Character Identity & Avatar Box (Faceless Chibi Tiên Hiệp) */}
          <div className="bg-slate-950/85 rounded-2xl p-3.5 border border-slate-800 shadow-inner flex flex-col items-center relative">
            {/* Chibi Character Avatar */}
            <div className="relative mb-2">
              <ChibiCharacterRenderer
                fashion={player.fashion}
                action={player.isMeditating ? 'meditating' : 'standing'}
                size={110}
                showAura={true}
              />
            </div>

            {/* Đạo Hiệu / Player Name with Edit */}
            <div className="flex items-center gap-1.5">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-300 w-28 text-center"
                    maxLength={14}
                  />
                  <button
                    onClick={() => {
                      if (tempName.trim()) {
                        handleUpdateName(tempName.trim());
                        setIsEditingName(false);
                      }
                    }}
                    className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-serif font-black text-base text-slate-100">{player.name}</span>
                  <button
                    onClick={() => {
                      setTempName(player.name);
                      setIsEditingName(true);
                    }}
                    className="text-slate-500 hover:text-amber-400 transition"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>

            {/* Cảnh Giới Badge */}
            <div className="mt-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
              {currentRealm.name}
            </div>

            {/* Thọ Nguyên Đếm Ngược */}
            <div className="mt-3 w-full bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Hourglass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Thọ Nguyên</span>
              </div>
              <span className="font-mono font-bold text-slate-200 tabular-nums">
                {formatLifespan(player.lifespanSeconds)}
              </span>
            </div>

            {/* Vitals: HP & MP (100% Đồng Bộ) */}
            <div className="w-full mt-2.5 space-y-1.5">
              {/* Khí Huyết */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-0.5">
                  <span className="text-rose-400 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Khí Huyết
                  </span>
                  <span className="text-slate-300 tabular-nums">{player.hp}/{player.maxHp}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, (player.hp / player.maxHp) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Chân Nguyên */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-0.5">
                  <span className="text-sky-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Chân Nguyên
                  </span>
                  <span className="text-slate-300 tabular-nums">{player.mp}/{player.maxMp}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, (player.mp / player.maxMp) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sinh tồn: Đói bụng & Khát nước (Dạng thanh bar tăng giới hạn theo cảnh giới) */}
            <div className="w-full mt-2.5 space-y-1.5 pt-2 border-t border-slate-800/80">
              {/* Đói Bụng */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-0.5">
                  <span className="text-amber-400 flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> Đói Bụng
                  </span>
                  <span className="text-slate-300 tabular-nums">
                    {Math.round(player.hunger)}/{player.maxHunger}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      player.hunger > player.maxHunger * 0.7 ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, (player.hunger / player.maxHunger) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Khát Nước */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-0.5">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Droplet className="w-3 h-3" /> Khát Nước
                  </span>
                  <span className="text-slate-300 tabular-nums">
                    {Math.round(player.thirst)}/{player.maxThirst}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      player.thirst > player.maxThirst * 0.7 ? 'bg-rose-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, (player.thirst / player.maxThirst) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Điều Hướng (Đầy đủ theo yêu cầu) */}
          <nav className="space-y-1.5 pt-1">
            <button
              onClick={() => setActiveTab('dongphu')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'dongphu'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Tĩnh Thất (Tu Hành)</span>
            </button>

            <button
              onClick={handleEnterArena}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-rose-600/30 to-amber-600/30 text-rose-300 border border-rose-500/40 hover:from-rose-600/50 hover:to-amber-600/50 transition shadow-sm"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>Bí Cảnh (Xuất Chiến - 1 Năm)</span>
            </button>

            {/* MỤC MỚI: TRANG BỊ (TRÊN CÔNG PHÁP) */}
            <button
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'equipment'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Trang Bị (Lò Rèn)</span>
              </div>
            </button>

            {/* MỤC MỚI: CHÍ BẢO (TRÊN CÔNG PHÁP, 3 SLOT) */}
            <button
              onClick={() => setActiveTab('artifacts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'artifacts'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Chí Bảo Trấn Tông</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                {player.equippedArtifactIds?.length || 0}/3
              </span>
            </button>

            {/* CÔNG PHÁP */}
            <button
              onClick={() => setActiveTab('congphap')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'congphap'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Công Pháp (Tuyệt Kỹ)</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-500/40">
                {player.congPhapList.filter((c) => c.unlocked).length}
              </span>
            </button>

            {/* MỤC MỚI: ĐỒ GIÁM YÊU THÚ (INDEX) */}
            <button
              onClick={() => setActiveTab('index')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'index'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Đồ Giám Yêu Thú</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                8 Yêu Quái
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'inventory'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Túi Đồ (Trữ Vật Đại)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {player.inventory.filter((i) => i.count > 0).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'market'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Chợ Linh Vật</span>
            </button>

            <button
              onClick={() => setActiveTab('sect')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'sect'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Tông Môn (Vạn Kiếm)</span>
              </div>
              <span className="text-[10px] font-bold text-yellow-300">
                {player.sectContributionPoints} CH
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fashion')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                activeTab === 'fashion'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <Palette className="w-4 h-4 text-pink-400" />
              <span>Thời Trang (Tiên Phục)</span>
            </button>
          </nav>
        </div>

        {/* Footer Credit */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Tiên Tu: Bí Cảnh Sinh Tồn • Cửu Châu Tiên Giới
        </div>
      </aside>

      {/* ==================================================== */}
      {/* KHU VỰC NỘI DUNG CHÍNH (ĐỘNG PHỦ / TRANG BỊ / CHÍ BẢO / CÔNG PHÁP / INDEX / TÚI ĐỒ / CHỢ / TÔNG MÔN / THỜI TRANG) */}
      {/* ==================================================== */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col bg-slate-950">
        {activeTab === 'dongphu' && (
          <DongPhuView
            player={player}
            onEnterArena={handleEnterArena}
            onToggleMeditate={handleToggleMeditate}
            onBreakthrough={handleBreakthrough}
            onUpdateName={handleUpdateName}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentView
            player={player}
            onEquip={handleEquipGear}
            onUnequip={handleUnequipGear}
            onBuyEquipment={handleBuyEquipment}
          />
        )}

        {activeTab === 'artifacts' && (
          <ChiBaoView
            player={player}
            onToggleEquip={handleToggleEquipChiBao}
            onUpgradeStar={handleUpgradeChiBaoStar}
          />
        )}

        {activeTab === 'congphap' && (
          <CongPhapView
            player={player}
            onUpgradeCongPhap={handleUpgradeCongPhap}
            onToggleEquip={handleToggleEquipCongPhap}
            onDeleteCongPhap={handleDeleteCongPhap}
          />
        )}

        {activeTab === 'index' && (
          <IndexMonsterView />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            player={player}
            onUseItem={handleUseItem}
            onSellItem={handleSellItem}
          />
        )}

        {activeTab === 'market' && (
          <MarketView
            player={player}
            onBuyItem={handleBuyItem}
          />
        )}

        {activeTab === 'sect' && (
          <SectView
            player={player}
            onClaimMission={handleClaimMission}
            onClaimDailySalary={handleClaimDailySalary}
            hasClaimedDailySalary={dailySalaryClaimed}
            onBuySectItem={handleBuySectItem}
          />
        )}

        {activeTab === 'fashion' && (
          <FashionView
            player={player}
            onSaveFashion={handleSaveFashion}
          />
        )}
      </main>

      {/* THIÊN KIẾP BREAKTHROUGH MODAL */}
      {tribulationRealm && (
        <ThienKiepModal
          player={player}
          targetRealm={tribulationRealm}
          onSuccess={(updated) => {
            setPlayer((prev) => ({
              ...prev,
              ...updated,
              maxHunger: tribulationRealm.maxHunger,
              maxThirst: tribulationRealm.maxThirst
            }));
            setTribulationRealm(null);
          }}
          onFail={() => {
            setPlayer((prev) => ({
              ...prev,
              hp: Math.max(10, Math.floor(prev.hp * 0.3)),
              exp: Math.floor(prev.exp * 0.8)
            }));
            setTribulationRealm(null);
          }}
        />
      )}

      {/* RETREAT SUMMARY MODAL */}
      {retreatResult && (
        <RetreatModal
          result={retreatResult}
          onClose={() => setRetreatResult(null)}
        />
      )}

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetGame={handleResetGame}
      />
    </div>
  );
}
