import React, { useState } from 'react';
import { PlayerStats, Item } from '../types/game';
import { DEFAULT_EQUIPMENT_LIST } from '../constants/gameData';
import { Shield, Swords, Compass, Gem, CheckCircle, PlusCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { sound } from '../services/audio';

interface EquipmentViewProps {
  player: PlayerStats;
  onEquipItem: (item: Item) => void;
  onUnequipItem: (slot: 'weapon' | 'armor' | 'boots' | 'ring') => void;
  onBuyEquipment: (item: Item) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  player,
  onEquipItem,
  onUnequipItem,
  onBuyEquipment
}) => {
  const [activeTab, setActiveTab] = useState<'equipped' | 'forge'>('equipped');

  // Equipped gear slots
  const gear = player.equippedGear || {};

  return (
    <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 custom-scrollbar bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-serif text-slate-100 tracking-wide flex items-center gap-2">
              Trang Bị Pháp Bảo & Đạo Y
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Khoác lên mình pháp bảo đao kiếm, chiến giáp hộ thân gia tăng công thủ toàn diện
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
            <span className="text-xs text-slate-400">Linh Thạch:</span>
            <span className="font-mono font-black text-amber-400 text-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              {player.spiritStones.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('equipped')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center gap-2 ${
            activeTab === 'equipped'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>PHÁP BẢO ĐANG TRANG BỊ</span>
        </button>

        <button
          onClick={() => setActiveTab('forge')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center gap-2 ${
            activeTab === 'forge'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>LÒ RÈN & PHÁP BẢO CÁC</span>
        </button>
      </div>

      {activeTab === 'equipped' && (
        <div className="space-y-6">
          {/* 4 Main Equipment Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slot 1: Vũ Khí */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Vị trí: Vũ Khí Chính
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">
                      {gear.weapon ? gear.weapon.name : 'Chưa Trang Bị'}
                    </h4>
                    <span className="text-[11px] text-amber-400">
                      {gear.weapon ? `+${gear.weapon.addAtk || 15} Công Kích` : 'Trống'}
                    </span>
                  </div>
                </div>
              </div>
              {gear.weapon && (
                <button
                  onClick={() => onUnequipItem('weapon')}
                  className="mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Tháo Vũ Khí
                </button>
              )}
            </div>

            {/* Slot 2: Đạo Bào */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Vị trí: Đạo Bào Hộ Thân
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">
                      {gear.armor ? gear.armor.name : 'Chưa Trang Bị'}
                    </h4>
                    <span className="text-[11px] text-sky-400">
                      {gear.armor ? `+12 Def & +50 Max HP` : 'Trống'}
                    </span>
                  </div>
                </div>
              </div>
              {gear.armor && (
                <button
                  onClick={() => onUnequipItem('armor')}
                  className="mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Tháo Đạo Bào
                </button>
              )}
            </div>

            {/* Slot 3: Giày Phi Hành */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Vị trí: Phi Hành Ngoa
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">
                      {gear.boots ? gear.boots.name : 'Chưa Trang Bị'}
                    </h4>
                    <span className="text-[11px] text-teal-400">
                      {gear.boots ? `+25 Tốc Độ Chạy` : 'Trống'}
                    </span>
                  </div>
                </div>
              </div>
              {gear.boots && (
                <button
                  onClick={() => onUnequipItem('boots')}
                  className="mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Tháo Giày
                </button>
              )}
            </div>

            {/* Slot 4: Giới Chỉ */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Vị trí: Trữ Vật Linh Giới
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Gem className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">
                      {gear.ring ? gear.ring.name : 'Chưa Trang Bị'}
                    </h4>
                    <span className="text-[11px] text-purple-400">
                      {gear.ring ? `+8% Bạo Kích` : 'Trống'}
                    </span>
                  </div>
                </div>
              </div>
              {gear.ring && (
                <button
                  onClick={() => onUnequipItem('ring')}
                  className="mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Tháo Nhẫn
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'forge' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEFAULT_EQUIPMENT_LIST.map((item) => {
            const canAfford = player.spiritStones >= item.price;
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl hover:border-cyan-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-bold">
                      {item.quality}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-400 text-sm">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{item.price} Linh Thạch</span>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (!canAfford) return;
                      sound.playLevelUp();
                      onBuyEquipment(item);
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                    }`}
                  >
                    <span>Rèn & Mua Ngay</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
