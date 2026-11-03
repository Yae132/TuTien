import React from 'react';
import { Sparkles, Swords, Clock, CheckCircle2, AlertTriangle, ArrowRight, Gem } from 'lucide-react';
import { Item } from '../types/game';
import { formatTimeShort } from '../services/storage';

interface RetreatModalProps {
  result: {
    survived: boolean;
    spiritStonesGained: number;
    monstersKilled: number;
    survivalSeconds: number;
    remainingHp: number;
    lootItems?: Item[];
  };
  onClose: () => void;
}

export const RetreatModal: React.FC<RetreatModalProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div
        className={`w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-5 ${
          result.survived ? 'border-amber-500/60 shadow-amber-500/20' : 'border-rose-500/60 shadow-rose-500/20'
        }`}
      >
        {/* Status Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-xl ${
            result.survived
              ? 'bg-amber-950/60 border-amber-400 text-amber-300'
              : 'bg-rose-950/60 border-rose-400 text-rose-300'
          }`}
        >
          {result.survived ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black font-serif tracking-wider text-slate-100">
            {result.survived ? 'AN TOÀN RÚT LUI' : 'TRỌNG THƯƠNG THOÁT THÂN'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {result.survived
              ? 'Chiến tích lẫy lừng, bảo toàn nguyên khí đem toàn bộ chiến lợi phẩm trở về Động Phủ!'
              : 'Khí huyết cạn kiệt chỉ còn 1 HP! Ngọc phù hộ mệnh đã kịp thời truyền tống đạo hữu trở về Tĩnh Thất an dưỡng!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" /> Thời Gian
            </span>
            <span className="text-sm font-bold text-slate-200 mt-1 font-mono">
              {formatTimeShort(result.survivalSeconds)}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-rose-400" /> Trảm Yêu
            </span>
            <span className="text-sm font-bold text-rose-400 mt-1 tabular-nums">
              {result.monstersKilled}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Linh Thạch
            </span>
            <span className="text-sm font-bold text-amber-400 mt-1 tabular-nums">
              +{result.spiritStonesGained}
            </span>
          </div>
        </div>

        {/* Materials Collected Preview */}
        {result.lootItems && result.lootItems.length > 0 && (
          <div className="w-full bg-slate-950/80 p-3 rounded-2xl border border-purple-500/30 text-left">
            <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5 mb-2">
              <Gem className="w-3.5 h-3.5" /> Nguyên Liệu Đã Thu Hoạch ({result.lootItems.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.lootItems.map((item) => (
                <span
                  key={item.id}
                  className="px-2 py-0.5 rounded-lg bg-purple-950/70 border border-purple-500/40 text-[10px] font-medium text-purple-200"
                >
                  {item.name} x{item.count}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg active:scale-95 transition flex items-center justify-center gap-2 ${
            result.survived
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-rose-500/20'
          }`}
        >
          <span>Trở Về Tĩnh Thất Tu Hành</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
