import React from 'react';
import { PlayerStats, ChiBao } from '../types/game';
import { Sparkles, Flame, Heart, Droplet, Star, ShieldCheck, CheckCircle2, Lock, Zap, ArrowUpCircle } from 'lucide-react';
import { sound } from '../services/audio';

interface ChiBaoViewProps {
  player: PlayerStats;
  onUpgradeStar: (chiBaoId: string) => void;
  onToggleEquip: (chiBaoId: string) => void;
}

export const ChiBaoView: React.FC<ChiBaoViewProps> = ({
  player,
  onUpgradeStar,
  onToggleEquip
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'tu_khi_dan':
        return <Sparkles className="w-7 h-7 text-amber-400" />;
      case 'niet_ban_phuong_vu':
        return <Flame className="w-7 h-7 text-rose-400" />;
      case 'huyet_tinh_ma_binh':
        return <Heart className="w-7 h-7 text-red-400" />;
      case 'bich_hai_linh_ho':
        return <Droplet className="w-7 h-7 text-sky-400" />;
      default:
        return <Zap className="w-7 h-7 text-purple-400" />;
    }
  };

  const equippedCount = player.equippedArtifactIds ? player.equippedArtifactIds.length : 0;

  return (
    <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 custom-scrollbar bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-serif text-slate-100 tracking-wide flex items-center gap-2">
                Chí Bảo Thần Khí
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Tối Đa 3 Món
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mang theo tối đa 3 bảo vật thượng cổ cùng lúc để kích hoạt thiên phú trấn phái
              </p>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Đang Mang:</span>
            <span className="font-mono font-black text-emerald-300 text-sm">
              {equippedCount} / 3
            </span>
          </div>

          <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
            <span className="text-xs text-slate-400">Linh Thạch:</span>
            <span className="font-mono font-black text-amber-400 text-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              {player.spiritStones.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Niết Bàn Phượng Vũ Cooldown Bar */}
      {player.phoenixReviveCooldownSeconds > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-200">
                Niết Bàn Phượng Vũ Đang Trong Thời Gian Hồi Chiêu
              </h4>
              <p className="text-[11px] text-rose-300/80">
                Bảo vật vừa kích hoạt cứu mạng. Đang hấp thụ linh khí hồi phục niết bàn hỏa...
              </p>
            </div>
          </div>
          <div className="font-mono font-black text-rose-300 text-sm shrink-0 bg-rose-900/40 px-3 py-1 rounded-xl border border-rose-500/30">
            {Math.floor(player.phoenixReviveCooldownSeconds / 60)}m {player.phoenixReviveCooldownSeconds % 60}s
          </div>
        </div>
      )}

      {/* Grid of 4 Chi Bao */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {player.chiBaoList.map((cb) => {
          const isEquipped = (player.equippedArtifactIds || []).includes(cb.id);
          const isTuKhiDan = cb.id === 'tu_khi_dan';
          const canUpgradeStar = isTuKhiDan && cb.stars < cb.maxStars && player.spiritStones >= (cb.starUpgradeCost || 200 * cb.stars);
          const isMaxStar = isTuKhiDan && cb.stars >= cb.maxStars;

          return (
            <div
              key={cb.id}
              className={`rounded-3xl p-5 border shadow-xl transition-all flex flex-col justify-between ${
                !cb.unlocked
                  ? 'bg-slate-900/50 border-slate-800/80 opacity-70'
                  : isEquipped
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 border-amber-500/50 shadow-amber-500/10'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                      {getIcon(cb.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black font-serif text-slate-100 text-base">{cb.name}</h3>
                        {cb.unlocked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Đã Sở Hữu
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Chưa Mua
                          </span>
                        )}
                      </div>

                      {/* Stars for Tu Khi Dan */}
                      {isTuKhiDan && (
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-3.5 h-3.5 ${
                                starNum <= cb.stars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-700 fill-slate-800'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] text-amber-300 ml-1 font-bold">
                            ({cb.stars}/5 Sao)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {cb.unlocked && isEquipped && (
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/20 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Đang Mang
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{cb.desc}</p>

                {/* Current Effect Highlight */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Hiệu Lực Kích Hoạt:
                  </span>
                  <span className="text-sky-300 font-bold">{cb.effectDesc}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                {cb.unlocked ? (
                  <>
                    {/* Equip Toggle */}
                    <button
                      onClick={() => {
                        sound.playSkillCast();
                        onToggleEquip(cb.id);
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                        isEquipped
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : equippedCount >= 3
                          ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-md'
                      }`}
                    >
                      {isEquipped
                        ? 'Tháo Ra'
                        : equippedCount >= 3
                        ? 'Đã Đầy (Tối Đa 3 Món)'
                        : 'Mang Theo'}
                    </button>

                    {/* Star Upgrade for Tu Khi Dan */}
                    {isTuKhiDan && (
                      <button
                        disabled={isMaxStar || !canUpgradeStar}
                        onClick={() => {
                          if (!canUpgradeStar) return;
                          sound.playLevelUp();
                          onUpgradeStar(cb.id);
                        }}
                        className={`py-2.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                          isMaxStar
                            ? 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                            : canUpgradeStar
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                            : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                        <span>
                          {isMaxStar ? 'Tối Đa 5 Sao' : `Nâng Sao (${cb.stars * 200} L.Thạch)`}
                        </span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-slate-500 italic">
                    Chưa sở hữu. Hãy đến mục Tông Môn để đổi bằng Điểm Cống Hiến ({cb.contributionCost} Điểm).
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
