import React from 'react';
import { PlayerStats, Item } from '../types/game';
import { SHOP_ITEMS } from '../constants/gameData';
import { sound } from '../services/audio';
import { Store, Sparkles, Utensils, Droplet, Heart, Zap, Hourglass, ShoppingCart, Shield } from 'lucide-react';

interface MarketViewProps {
  player: PlayerStats;
  onBuyItem: (item: Item) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ player, onBuyItem }) => {
  const handleBuy = (item: Item) => {
    if (player.spiritStones < item.price) {
      alert('Không đủ Linh Thạch! Hãy xuất chiến Bí Cảnh để thu thập thêm.');
      return;
    }
    sound.playLootDing(true);
    onBuyItem(item);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-slate-950 text-slate-100 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-600/30 mb-1">
              <Store className="w-3.5 h-3.5" />
              <span>LINH VẬT PHƯỜNG THỊ</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 font-serif">CHỢ LINH VẬT TU TIÊN</h1>
            <p className="text-xs text-slate-400">
              Dùng Linh Thạch đoạt được từ bí cảnh để mua lương thực sinh tồn, đan dược hồi giáp, hồi máu và cải mệnh.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Linh Thạch Khả Dụng</span>
              <span className="text-lg font-black text-amber-300 tabular-nums">
                {player.spiritStones.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_ITEMS.map((item) => {
            const canAfford = player.spiritStones >= item.price;
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg border ${
                        item.quality === 'legendary' ? 'bg-amber-950/60 border-amber-400 text-amber-300' :
                        item.quality === 'epic' ? 'bg-purple-950/60 border-purple-400 text-purple-300' :
                        item.quality === 'rare' ? 'bg-sky-950/60 border-sky-400 text-sky-300' :
                        'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {item.type === 'food' && <Utensils className="w-5 h-5 text-amber-400" />}
                        {item.type === 'drink' && <Droplet className="w-5 h-5 text-cyan-400" />}
                        {item.type === 'pill' && <Sparkles className="w-5 h-5 text-rose-400" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{item.price} Linh Thạch</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.quality === 'legendary' ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                      item.quality === 'epic' ? 'bg-purple-950 text-purple-300 border border-purple-500' :
                      item.quality === 'rare' ? 'bg-sky-950 text-sky-300 border border-sky-500' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {item.quality === 'legendary' ? 'Thần' : item.quality === 'epic' ? 'Cực' : item.quality === 'rare' ? 'Hiếm' : 'Thường'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Effects badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.healHp && (
                      <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-md">
                        +{item.healHp} HP
                      </span>
                    )}
                    {item.healMp && (
                      <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded-md">
                        +{item.healMp} MP
                      </span>
                    )}
                    {item.addExp && (
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-md">
                        +{item.addExp} Tu Vi
                      </span>
                    )}
                    {item.reduceHunger && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                        -{item.reduceHunger}% Đói
                      </span>
                    )}
                    {item.reduceThirst && (
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-md">
                        -{item.reduceThirst}% Khát
                      </span>
                    )}
                    {item.addLifespan && (
                      <span className="text-[10px] font-semibold text-yellow-300 bg-yellow-950/60 border border-yellow-800 px-2 py-0.5 rounded-md">
                        +{item.addLifespan} Năm Thọ
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs transition shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{canAfford ? 'Mua Ngay' : 'Không Đủ Linh Thạch'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
