import React, { useState } from 'react';
import { MONSTER_INDEX_DATA, MonsterIndexItem } from '../constants/gameData';
import { BookOpen, Shield, Swords, Zap, Wind, Skull, Sparkles, Crosshair, ChevronRight } from 'lucide-react';

export const IndexMonsterView: React.FC = () => {
  const [selectedMonster, setSelectedMonster] = useState<MonsterIndexItem>(MONSTER_INDEX_DATA[0]);

  return (
    <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 custom-scrollbar bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-serif text-slate-100 tracking-wide flex items-center gap-2">
              Đồ Giám Yêu Ma & Yêu Thú Bí Cảnh
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                8 Chủng Loại
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cẩm nang ghi chép tường tận về khí huyết, sát thương, tốc độ và kỹ năng dị biến của yêu thú
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monster List (4 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {MONSTER_INDEX_DATA.map((m) => {
            const isSelected = selectedMonster.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMonster(m)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-98 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/70 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-inner border"
                    style={{
                      backgroundColor: m.avatarColor + '25',
                      borderColor: m.avatarColor,
                      color: m.accentColor
                    }}
                  >
                    <Skull className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold transition-colors ${
                        isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-slate-100'
                      }`}
                    >
                      {m.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">{m.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: m.avatarColor + '20',
                      borderColor: m.avatarColor + '40',
                      color: m.accentColor
                    }}
                  >
                    {m.rangeType}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Monster Details (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Top Banner */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-xl"
                style={{
                  backgroundColor: selectedMonster.avatarColor + '30',
                  borderColor: selectedMonster.avatarColor,
                  color: selectedMonster.accentColor
                }}
              >
                <Skull className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black font-serif text-slate-100">
                  {selectedMonster.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Phân loại: {selectedMonster.type}
                  </span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-bold border"
                    style={{
                      backgroundColor: selectedMonster.avatarColor + '25',
                      borderColor: selectedMonster.avatarColor + '60',
                      color: selectedMonster.accentColor
                    }}
                  >
                    Đặc tính: {selectedMonster.rangeType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Hình thái & Miêu tả:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
              {selectedMonster.desc}
            </p>
          </div>

          {/* Combat Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Khí Huyết (HP):</span>
              </div>
              <div className="font-mono font-bold text-rose-300 text-sm">{selectedMonster.hp}</div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span>Sát Thương (ATK):</span>
              </div>
              <div className="font-mono font-bold text-amber-300 text-sm">{selectedMonster.atk}</div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Tốc Độ Ra Đòn / Hồi Đạn:</span>
              </div>
              <div className="font-mono font-bold text-yellow-200 text-sm">{selectedMonster.attackInterval}</div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>Tốc Độ Di Chuyển:</span>
              </div>
              <div className="font-mono font-bold text-sky-300 text-sm">{selectedMonster.moveSpeed}</div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" /> Kỹ Năng & Hành Vi Dị Biến:
            </span>
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              {selectedMonster.skills}
            </div>
          </div>

          {/* Drops */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Vật Phẩm Rơi Ra:
            </span>
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200/90 leading-relaxed font-semibold">
              {selectedMonster.drops}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
