import React from 'react';
import { PlayerStats, CongPhap } from '../types/game';
import { Swords, Shield, Zap, Sparkles, BookOpen, ArrowUpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { sound } from '../services/audio';

interface CongPhapViewProps {
  player: PlayerStats;
  onUpgradeCongPhap: (congPhapId: string) => void;
  onToggleEquip: (congPhapId: string) => void;
  onDeleteCongPhap: (congPhapId: string) => void;
}

export const CongPhapView: React.FC<CongPhapViewProps> = ({
  player,
  onUpgradeCongPhap,
  onToggleEquip,
  onDeleteCongPhap
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'van_kiem_quy_tong':
        return <Swords className="w-6 h-6 text-amber-400" />;
      case 'chan_nguyen_ho_the':
        return <Shield className="w-6 h-6 text-sky-400" />;
      case 'vo_ha_han':
        return <Zap className="w-6 h-6 text-purple-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-teal-400" />;
    }
  };

  const getBorderColor = (id: string) => {
    switch (id) {
      case 'van_kiem_quy_tong':
        return 'border-amber-500/40 hover:border-amber-400 shadow-amber-500/10';
      case 'chan_nguyen_ho_the':
        return 'border-sky-500/40 hover:border-sky-400 shadow-sky-500/10';
      case 'vo_ha_han':
        return 'border-purple-500/40 hover:border-purple-400 shadow-purple-500/10';
      default:
        return 'border-slate-800';
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar bg-slate-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-serif text-slate-100 tracking-wide">
                Tàng Thư Các & Công Pháp Tu Luyện
              </h2>
              <p className="text-xs text-slate-400">
                Lĩnh ngộ, nâng tầng tăng cường chỉ số từng cấp, hoặc phế bỏ tu luyện lại từ đầu
              </p>
            </div>
          </div>
        </div>

        {/* Linh Thạch Balance */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-xs text-slate-400">Linh Thạch:</span>
          <span className="font-mono font-black text-amber-400 text-base flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            {player.spiritStones.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Overview Hotkeys Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-black flex items-center justify-center text-lg border border-amber-500/40">
            Q
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Phím Tắt [Q]</div>
            <div className="text-[11px] text-amber-400">Vạn Kiếm Quy Tông (Tăng theo tầng, ngưng khi đủ 30 kiếm)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-sky-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 font-mono font-black flex items-center justify-center text-lg border border-sky-500/40">
            E
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Phím Tắt [E]</div>
            <div className="text-[11px] text-sky-400">Chân Nguyên Hộ Thể (50px - Tỉ lệ 1:50, 1:75...)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-purple-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black flex items-center justify-center text-lg border border-purple-500/40">
            R
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Phím Tắt [R]</div>
            <div className="text-[11px] text-purple-400">Vô Hạ Hạn (Gojo) (300px - 140px chậm 99% - 5 MP/s)</div>
          </div>
        </div>
      </div>

      {/* List of Cong Phap */}
      <div className="space-y-4">
        {player.congPhapList.map((cp) => {
          const canUpgrade = cp.level < cp.maxLevel && player.spiritStones >= cp.upgradeCost;
          const isMax = cp.level >= cp.maxLevel;

          return (
            <div
              key={cp.id}
              className={`bg-slate-900/90 rounded-3xl p-6 border shadow-lg transition-all ${
                !cp.unlocked ? 'opacity-60 border-slate-800' : getBorderColor(cp.id)
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
                    {getIcon(cp.id)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-lg font-black font-serif text-slate-100">{cp.name}</h3>
                      {cp.unlocked && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                          Tầng {cp.level} / {cp.maxLevel}
                        </span>
                      )}
                      {cp.unlocked ? (
                        cp.equipped ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đang Trang Bị [{cp.hotkey}]
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                            Chưa Kích Hoạt
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-300 border border-rose-800">
                          Đã Xóa / Chưa Lĩnh Ngộ
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{cp.desc}</p>

                    {cp.unlocked && (
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-semibold">
                        <span className="text-slate-400">
                          Hiệu lực hiện tại:{' '}
                          <b className="text-sky-300">{cp.effectDesc}</b>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  {cp.unlocked ? (
                    <>
                      {/* Equip Toggle */}
                      <button
                        onClick={() => {
                          sound.playSkillCast();
                          onToggleEquip(cp.id);
                        }}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          cp.equipped
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-md'
                        }`}
                      >
                        {cp.equipped ? 'Gỡ Khỏi Phím' : `Trang Bị [Phím ${cp.hotkey}]`}
                      </button>

                      {/* Upgrade Button */}
                      <button
                        disabled={isMax || !canUpgrade}
                        onClick={() => {
                          if (!canUpgrade) return;
                          onUpgradeCongPhap(cp.id);
                        }}
                        className={`py-2.5 px-5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                          isMax
                            ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800'
                            : canUpgrade
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                        }`}
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                        <span>
                          {isMax ? 'Viên Mãn Đỉnh Cấp' : `Nâng Tầng (${cp.upgradeCost} Linh Thạch)`}
                        </span>
                      </button>

                      {/* Nút Xóa Công Pháp */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Đạo hữu có chắc chắn muốn XÓA công pháp "${cp.name}"? Khi mua lại tại Tông Môn sẽ nâng tầng lại từ đầu!`)) {
                            sound.playBarrierShatter();
                            onDeleteCongPhap(cp.id);
                          }
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold transition bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 hover:border-rose-600"
                        title="Xóa công pháp để khi mua lại up tầng từ đầu"
                      >
                        Xóa Công Pháp
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2">
                      Đã phế bỏ. Vào mục Tông Môn để mua và nâng tầng lại từ đầu.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};


