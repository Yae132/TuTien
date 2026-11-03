import React, { useState } from 'react';
import { PlayerStats, Item } from '../types/game';
import { sound } from '../services/audio';
import { Sparkles, Heart, Droplet, Utensils, Zap, Package, Gem, Coins } from 'lucide-react';

interface InventoryViewProps {
  player: PlayerStats;
  onUseItem: (itemId: string) => void;
  onSellItem?: (itemId: string, count: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ player, onUseItem, onSellItem }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pill' | 'food' | 'material'>('all');

  const items = player.inventory.filter((i) => {
    if (i.count <= 0) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'pill') return i.type === 'pill';
    if (activeCategory === 'food') return i.type === 'food' || i.type === 'drink';
    if (activeCategory === 'material') return i.type === 'material';
    return true;
  });

  const handleUse = (item: Item) => {
    sound.playLootDing();
    onUseItem(item.id);
  };

  const handleSell = (item: Item) => {
    if (onSellItem) {
      sound.playLootDing(true);
      onSellItem(item.id, 1);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-slate-950 text-slate-100 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-600/30 mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>TRỮ VẬT ĐẠI (TÚI ĐỒ)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 font-serif">KHO BẢO VẬT TU TIÊN</h1>
            <p className="text-xs text-slate-400">
              Linh đan diệu dược, lương thực cứu sinh và nguyên liệu yêu ma thu hoạch từ bí cảnh.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Linh Thạch</span>
              <span className="text-lg font-black text-amber-300 tabular-nums">
                {player.spiritStones.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Current Player Vitals with Dynamic Realm Max Bounds */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Khí Huyết
            </span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {player.hp} / {player.maxHp}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-400" /> Chân Nguyên
            </span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {player.mp} / {player.maxMp}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-amber-400" /> Đói Bụng
            </span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {player.hunger} / {player.maxHunger}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Khát Nước
            </span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {player.thirst} / {player.maxThirst}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất Cả ({player.inventory.filter((i) => i.count > 0).length})
          </button>
          <button
            onClick={() => setActiveCategory('pill')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === 'pill'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đan Dược
          </button>
          <button
            onClick={() => setActiveCategory('food')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === 'food'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lương Thực & Nước
          </button>
          <button
            onClick={() => setActiveCategory('material')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeCategory === 'material'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            <span>Nguyên Liệu Yêu Ma (Bí Cảnh)</span>
          </button>
        </div>

        {/* Item Grid */}
        {items.length === 0 ? (
          <div className="py-16 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Không có vật phẩm trong mục này.</p>
            <p className="text-xs text-slate-600 mt-1">
              Xuất chiến Bí Cảnh để nhặt Linh Dịch, Độc Bào Tử, Yêu Thú Đan Điền và Huyết Hạch!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const isMaterial = item.type === 'material';

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg border ${
                            item.quality === 'legendary'
                              ? 'bg-amber-950/60 border-amber-400 text-amber-300'
                              : item.quality === 'epic'
                              ? 'bg-purple-950/60 border-purple-400 text-purple-300'
                              : item.quality === 'rare'
                              ? 'bg-sky-950/60 border-sky-400 text-sky-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {item.type === 'material' ? (
                            <Gem className="w-5 h-5 text-purple-400" />
                          ) : item.type === 'pill' ? (
                            <Sparkles className="w-5 h-5 text-rose-400" />
                          ) : (
                            <Utensils className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Số lượng: <b className="text-amber-400 font-bold">{item.count}</b>
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          isMaterial
                            ? 'bg-purple-950 text-purple-300 border border-purple-500'
                            : item.type === 'pill'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500'
                            : 'bg-amber-950 text-amber-300 border border-amber-500'
                        }`}
                      >
                        {isMaterial ? 'Nguyên Liệu' : item.type === 'pill' ? 'Đan Dược' : 'Lương Thực'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Actions: Use or Sell */}
                  <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center gap-2">
                    {isMaterial ? (
                      <button
                        onClick={() => handleSell(item)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95"
                      >
                        <Coins className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Bán (+{item.price} Linh Thạch)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUse(item)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1"
                      >
                        <span>Sử Dụng</span>
                      </button>
                    )}
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
