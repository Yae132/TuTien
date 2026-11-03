import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { SECT_MISSIONS, SectMission, SECT_SHOP_ITEMS, SectShopItem } from '../constants/gameData';
import { sound } from '../services/audio';
import { Shield, Sparkles, Swords, Award, CheckCircle, Gift, BookOpen, ShoppingBag, Heart, Hourglass, Zap, Hammer, Scroll } from 'lucide-react';

interface SectViewProps {
  player: PlayerStats;
  onClaimMission: (mission: SectMission) => void;
  onClaimDailySalary: () => void;
  hasClaimedDailySalary: boolean;
  onBuySectItem: (item: SectShopItem) => void;
}

export const SectView: React.FC<SectViewProps> = ({
  player,
  onClaimMission,
  onClaimDailySalary,
  hasClaimedDailySalary,
  onBuySectItem
}) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'shop'>('shop');
  const [shopCategory, setShopCategory] = useState<'cong_phap' | 'cong_thuc'>('cong_phap');

  // Disciple rank
  let rank = 'Ngoại Môn Đệ Tử';
  if (player.realmIndex >= 14) {
    rank = 'Thái Thượng Trưởng Lão';
  } else if (player.realmIndex >= 10) {
    rank = 'Chân Truyền Đệ Tử';
  } else if (player.realmIndex >= 5) {
    rank = 'Nội Môn Đệ Tử';
  }

  const handleBuy = (item: SectShopItem) => {
    if (player.sectContributionPoints < item.costContribution) {
      alert('Không đủ Điểm Cống Hiến! Hãy hoàn thành nhiệm vụ tông môn để nhận thêm.');
      return;
    }

    sound.playLevelUp();
    onBuySectItem(item);
  };

  const filteredShopItems = SECT_SHOP_ITEMS.filter((item) => item.category === shopCategory);

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-slate-950 text-slate-100 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Sect Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-sky-950/70 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 font-black text-2xl border-2 border-yellow-200">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-amber-300 font-serif">VẠN KIẾM TIÊN TÔNG</h1>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Đại Môn Phái
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Thân phận: <span className="text-sky-300 font-bold">{rank}</span> • Đạo hiệu: <span className="text-slate-200 font-semibold">{player.name}</span>
              </p>
              <div className="flex items-center gap-4 mt-1.5 text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  Điểm Cống Hiến: <b className="text-yellow-300 tabular-nums">{player.sectContributionPoints}</b>
                </span>
                <span className="text-slate-400">
                  Trảm yêu: <b className="text-rose-400 tabular-nums">{player.totalKills}</b>
                </span>
              </div>
            </div>
          </div>

          {/* Daily Allowance Button */}
          <button
            onClick={() => {
              if (!hasClaimedDailySalary) {
                sound.playLootDing(true);
                onClaimDailySalary();
              }
            }}
            disabled={hasClaimedDailySalary}
            className={`px-5 py-3 rounded-2xl font-bold text-xs tracking-wider transition shadow-lg flex items-center gap-2 active:scale-95 shrink-0 ${
              !hasClaimedDailySalary
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20 animate-pulse'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{hasClaimedDailySalary ? 'ĐÃ NHẬN BỔNG LỘC HÔM NAY' : 'LÃNH BỔNG LỘC (+100 L.THẠCH & +30 CỐNG HIẾN)'}</span>
          </button>
        </div>

        {/* 2 Main Tabs: [Tông Môn Tàng Các] & [Bảng Nhiệm Vụ] */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>TÔNG MÔN TÀNG CÁC (ĐỔI CỐNG HIẾN)</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center gap-2 ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>BẢNG NHIỆM VỤ TÔNG MÔN</span>
          </button>
        </div>

        {/* TAB 1: TÔNG MÔN TÀNG CÁC (CHIA 2 MỤC: CÔNG PHÁP & CÔNG THỨC) */}
        {activeTab === 'shop' && (
          <div className="space-y-5">
            {/* Sub-tabs: Công Pháp & Công Thức */}
            <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShopCategory('cong_phap')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    shopCategory === 'cong_phap'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scroll className="w-4 h-4" />
                  <span>1. BÍ KÍP CÔNG PHÁP (Vạn Kiếm, Hộ Thể, Vô Hạ Hạn)</span>
                </button>

                <button
                  onClick={() => setShopCategory('cong_thuc')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    shopCategory === 'cong_thuc'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Hammer className="w-4 h-4" />
                  <span>2. CÔNG THỨC & ĐAN DƯỢC</span>
                </button>
              </div>

              <span className="text-yellow-300 font-bold text-xs mr-2">
                Điểm cống hiến: {player.sectContributionPoints}
              </span>
            </div>

            {/* Shop Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredShopItems.map((item) => {
                let isOwned = false;
                if (item.id === 'skill_van_kiem') {
                  const cp = player.congPhapList.find((c) => c.id === 'van_kiem_quy_tong');
                  isOwned = Boolean(cp && cp.unlocked);
                } else if (item.id === 'skill_chan_nguyen_ho_the') {
                  const cp = player.congPhapList.find((c) => c.id === 'chan_nguyen_ho_the');
                  isOwned = Boolean(cp && cp.unlocked);
                } else if (item.id === 'skill_vo_ha_han') {
                  const cp = player.congPhapList.find((c) => c.id === 'vo_ha_han');
                  isOwned = Boolean(cp && cp.unlocked);
                }

                const canAfford = player.sectContributionPoints >= item.costContribution;

                return (
                  <div
                    key={item.id}
                    className={`bg-slate-900/90 border rounded-2xl p-4 flex flex-col justify-between transition shadow-lg ${
                      isOwned ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800 hover:border-purple-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg border ${
                            item.category === 'cong_phap' ? 'bg-amber-950/60 border-amber-400 text-amber-300' :
                            'bg-sky-950/60 border-sky-400 text-sky-300'
                          }`}>
                            {item.icon === 'Swords' && <Swords className="w-5 h-5" />}
                            {item.icon === 'Shield' && <Shield className="w-5 h-5" />}
                            {item.icon === 'Zap' && <Zap className="w-5 h-5" />}
                            {item.icon === 'Hammer' && <Hammer className="w-5 h-5" />}
                            {item.icon === 'Heart' && <Heart className="w-5 h-5" />}
                            {item.icon === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                            {item.icon === 'Hourglass' && <Hourglass className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                            <div className="flex items-center gap-1 text-yellow-300 font-bold text-xs mt-0.5">
                              <Award className="w-3.5 h-3.5" />
                              <span>{item.costContribution} Cống Hiến</span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          item.category === 'cong_phap'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500'
                            : 'bg-sky-950 text-sky-300 border border-sky-500'
                        }`}>
                          {item.category === 'cong_phap' ? 'Công Pháp' : 'Công Thức'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isOwned || !canAfford}
                      className={`mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs transition shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                        isOwned
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50 cursor-not-allowed'
                          : canAfford
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {isOwned ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Đã Lĩnh Ngộ</span>
                        </>
                      ) : canAfford ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Đổi Ngay ({item.costContribution} Điểm)</span>
                        </>
                      ) : (
                        <span>Chưa Đủ Điểm Cống Hiến</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BẢNG NHIỆM VỤ */}
        {activeTab === 'missions' && (
          <div className="space-y-4">
            {SECT_MISSIONS.map((mission) => {
              const isClaimed = player.activeMissions.includes(`claimed_${mission.id}`);
              const isReady = player.totalKills >= mission.reqKills;
              const progress = Math.min(100, Math.floor((player.totalKills / mission.reqKills) * 100));

              return (
                <div
                  key={mission.id}
                  className={`bg-slate-900/90 border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition shadow-lg ${
                    isClaimed
                      ? 'border-slate-800/60 opacity-60'
                      : isReady
                      ? 'border-amber-500/60 bg-amber-950/20 shadow-amber-500/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">{mission.title}</h4>
                      {isReady && !isClaimed && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full animate-bounce">
                          Hoàn thành!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{mission.desc}</p>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-300">
                        {player.totalKills}/{mission.reqKills} ({progress}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs space-y-0.5">
                      <div className="text-amber-400 font-bold flex items-center justify-end gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> +{mission.rewardStones} Linh Thạch
                      </div>
                      <div className="text-yellow-300 font-bold flex items-center justify-end gap-1">
                        <Award className="w-3.5 h-3.5" /> +{mission.rewardContribution} Cống Hiến
                      </div>
                      <div className="text-sky-300 text-[11px]">+{mission.rewardExp} Tu Vi</div>
                    </div>

                    <button
                      onClick={() => {
                        if (isReady && !isClaimed) {
                          sound.playLevelUp();
                          onClaimMission(mission);
                        }
                      }}
                      disabled={!isReady || isClaimed}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isClaimed
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : isReady
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md animate-pulse active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã Nhận</span>
                        </>
                      ) : isReady ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          <span>LÃNH THƯỞNG</span>
                        </>
                      ) : (
                        <span>Chưa Đạt</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
