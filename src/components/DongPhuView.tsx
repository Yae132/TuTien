import React from 'react';
import { PlayerStats, RealmInfo } from '../types/game';
import { ChibiCharacterRenderer } from './ChibiCharacterRenderer';
import { REALMS } from '../constants/gameData';
import { sound } from '../services/audio';
import {
  Sparkles,
  Swords,
  Flame,
  Zap,
  Play,
  Pause,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface DongPhuViewProps {
  player: PlayerStats;
  onEnterArena: () => void;
  onToggleMeditate: () => void;
  onBreakthrough: () => void;
  onUpdateName: (newName: string) => void;
  onNavigateTab: (tab: 'dongphu' | 'arena' | 'congphap' | 'inventory' | 'market' | 'sect' | 'fashion') => void;
}

export const DongPhuView: React.FC<DongPhuViewProps> = ({
  player,
  onEnterArena,
  onToggleMeditate,
  onBreakthrough,
  onUpdateName,
  onNavigateTab
}) => {
  const currentRealm = REALMS[player.realmIndex] || REALMS[0];
  const nextRealm = REALMS[player.realmIndex + 1] as RealmInfo | undefined;
  const canBreakthrough = player.exp >= currentRealm.reqExp;
  const expPercent = Math.min(100, (player.exp / currentRealm.reqExp) * 100);

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 custom-scrollbar flex flex-col items-center justify-between p-4 md:p-8">
      {/* Background celestial ambient patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ==================================================== */}
      {/* KHU VỰC TRUNG TÂM: TĨNH THẤT TU HÀNH & TỌA THIỀN */}
      {/* Rộng rãi, thoáng đãng, không bị che khuất */}
      {/* ==================================================== */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-between min-h-[580px] my-auto relative z-10 py-4">
        {/* Top Title Banner */}
        <div className="text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TĨNH THẤT ĐỘNG PHỦ • TU TIÊN NGHỊCH THIÊN</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100 font-serif tracking-wider">
            TỌA THIỀN TỤ KHÍ
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-lg">
            Hấp thu linh khí cửu thiên, rèn luyện thần hồn, ngưng tụ kim đan, chuẩn bị xuất quan chinh phạt hiểm cảnh.
          </p>
        </div>

        {/* Center: Chibi Tiên Nhân Meditating / Standing */}
        <div className="relative my-6 flex flex-col items-center justify-center shrink-0">
          {/* Subtle Ring of Runes / Bagua Circle */}
          <div className={`absolute w-80 h-80 rounded-full border border-sky-500/20 pointer-events-none ${
            player.isMeditating ? 'animate-[spin_20s_linear_infinite] border-sky-400/40' : 'animate-[spin_40s_linear_infinite]'
          }`} />
          <div className={`absolute w-96 h-96 rounded-full border border-dashed border-amber-500/15 pointer-events-none ${
            player.isMeditating ? 'animate-[spin_30s_linear_infinite_reverse] border-amber-400/30' : 'animate-[spin_60s_linear_infinite_reverse]'
          }`} />

          {/* Meditating Chibi Character Canvas */}
          <div className="relative z-10 transition-transform duration-300 hover:scale-105">
            <ChibiCharacterRenderer
              fashion={player.fashion}
              action={player.isMeditating ? 'meditating' : 'standing'}
              size={260}
              showAura={true}
            />
          </div>

          {/* State Indicator Badge */}
          <div className="text-center mt-3">
            <span className={`text-xs md:text-sm font-serif italic px-4 py-1.5 rounded-full border transition-all ${
              player.isMeditating
                ? 'text-sky-300 bg-sky-950/70 border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-pulse'
                : 'text-slate-400 bg-slate-900/60 border-slate-700/40'
            }`}>
              {player.isMeditating
                ? `Đang Tọa Thiền: +${player.cultivationSpeedBonus || 1} Tu Vi/giây`
                : 'Đang Nghỉ Ngơi • Nhấn Bắt Đầu Tọa Thiền để tu luyện'}
            </span>
          </div>
        </div>

        {/* Cultivation Progress & Controls */}
        <div className="w-full max-w-lg flex flex-col items-center gap-3.5 shrink-0">
          {/* Progress bar */}
          <div className="w-full bg-slate-900/85 p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center text-xs mb-2 font-medium">
              <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                <Flame className="w-4 h-4 text-amber-500" />
                Tu Vi Hiện Tại
              </span>
              <span className="text-slate-200 tabular-nums font-mono font-bold">
                {player.exp} / {currentRealm.reqExp}
                {player.exp > currentRealm.reqExp && (
                  <span className="text-emerald-400 ml-1.5">(+{player.exp - currentRealm.reqExp} bảo lưu)</span>
                )}
              </span>
            </div>
            <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-sky-400 rounded-full transition-all duration-200 shadow-[0_0_12px_#f59e0b]"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>

          {/* Action Row: Toggle Tọa Thiền & Đột Phá */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* TOGGLE STATE: Bắt Đầu Tọa Thiền / Ngừng Tọa Thiền */}
            <button
              onClick={onToggleMeditate}
              className={`py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-lg active:scale-95 transition flex items-center justify-center gap-2 ${
                player.isMeditating
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30 ring-2 ring-amber-400'
                  : 'bg-gradient-to-r from-sky-700 to-blue-600 hover:from-sky-600 hover:to-blue-500 text-white shadow-sky-600/20'
              }`}
            >
              {player.isMeditating ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>NGỪNG TỌA THIỀN</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>BẮT ĐẦU TỌA THIỀN</span>
                </>
              )}
            </button>

            {/* ĐỘT PHÁ CẢNH GIỚI (BẢO LƯU TU VI) */}
            <button
              onClick={onBreakthrough}
              disabled={!canBreakthrough}
              className={`py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 ${
                canBreakthrough
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/30 animate-pulse hover:brightness-110 active:scale-95'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              <Zap className={`w-4 h-4 ${canBreakthrough ? 'text-slate-950 fill-slate-950' : 'text-slate-500'}`} />
              <span>{canBreakthrough ? 'ĐỘT PHÁ CẢNH GIỚI' : 'CHƯA ĐỦ TU VI'}</span>
            </button>
          </div>

          {/* ==================================================== */}
          {/* NÚT LỚN TRUNG TÂM: VÀO BÍ CẢNH (TIÊU HAO 5 PHÚT THỌ NGUYÊN) */}
          {/* ==================================================== */}
          <div className="w-full mt-1">
            <button
              onClick={onEnterArena}
              className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-700 via-orange-600 to-amber-600 hover:from-rose-600 hover:via-orange-500 hover:to-amber-500 text-white font-black text-lg tracking-widest shadow-2xl shadow-orange-600/30 border-2 border-amber-300/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              <Swords className="w-6 h-6 text-amber-200 group-hover:rotate-12 transition-transform" />
              <div className="flex flex-col items-center">
                <span className="font-serif">VÀO BÍ CẢNH (XUẤT CHIẾN)</span>
                <span className="text-[11px] font-sans font-medium text-amber-200/90 -mt-0.5">
                  Tiêu hao 5 phút Thọ nguyên • Tạm dừng tọa thiền
                </span>
              </div>
              <ChevronRight className="w-6 h-6 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Next Realm Preview (Compact Banner Beneath) */}
          {nextRealm && (
            <div className="w-full p-3 rounded-2xl bg-slate-900/60 border border-purple-500/30 text-xs flex items-center justify-between mt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-300">Cảnh Giới Kế Tiếp:</span>
                <span className="font-bold text-slate-200 ml-1.5">{nextRealm.name}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Thưởng thọ nguyên: <span className="text-amber-400 font-semibold">+{nextRealm.lifespanReward} năm</span>
                {nextRealm.isMajor && <span className="ml-1 text-rose-400 font-bold">(Có Thiên Kiếp!)</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
