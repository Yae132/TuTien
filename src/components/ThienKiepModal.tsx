import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, RealmInfo } from '../types/game';
import { sound } from '../services/audio';
import { Zap, ShieldAlert, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface ThienKiepModalProps {
  player: PlayerStats;
  targetRealm: RealmInfo;
  onSuccess: (updatedStats: Partial<PlayerStats>) => void;
  onFail: () => void;
}

export const ThienKiepModal: React.FC<ThienKiepModalProps> = ({
  player,
  targetRealm,
  onSuccess,
  onFail
}) => {
  const [tribulationProgress, setTribulationProgress] = useState(15); // 0 to 100%
  const [tribulationHp, setTribulationHp] = useState(player.hp);
  const [lightningStrikes, setLightningStrikes] = useState<{ id: number; x: number; y: number }[]>([]);
  const [status, setStatus] = useState<'battling' | 'success' | 'failed'>('battling');
  const [lightningCount, setLightningCount] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Lightning strikes every 0.8s
  useEffect(() => {
    if (status !== 'battling') return;

    sound.playThunder();

    const interval = window.setInterval(() => {
      const x = 30 + Math.random() * 40; // % across width
      const id = Date.now() + Math.random();
      setLightningStrikes(prev => [...prev.slice(-3), { id, x, y: 100 }]);

      // Damage player HP
      const boltDmg = Math.round(targetRealm.baseHp * 0.12);
      sound.playThunder();

      setTribulationHp(prevHp => {
        const nextHp = prevHp - boltDmg;
        if (nextHp <= 0) {
          setStatus('failed');
          clearInterval(interval);
          return 0;
        }
        return nextHp;
      });

      setLightningCount(c => c + 1);

      // Clean strike visual after 250ms
      setTimeout(() => {
        setLightningStrikes(prev => prev.filter(s => s.id !== id));
      }, 250);
    }, 850);

    timerRef.current = interval;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, targetRealm.baseHp]);

  // Handle player resist/channel energy (Vận công chống đỡ)
  const handleResist = () => {
    if (status !== 'battling') return;

    setTribulationProgress(prev => {
      const next = prev + 12;
      if (next >= 100) {
        setStatus('success');
        sound.playLevelUp();
        if (timerRef.current) clearInterval(timerRef.current);
        return 100;
      }
      return next;
    });
  };

  // Consume Pill in modal to heal
  const handleUseHealPill = () => {
    if (status !== 'battling') return;
    const pill = player.inventory.find(i => i.id.startsWith('pill_hp') && i.count > 0);
    if (pill) {
      pill.count -= 1;
      setTribulationHp(h => Math.min(player.maxHp, h + (pill.healHp || 60)));
      sound.playLootDing();
    }
  };

  const hasPill = player.inventory.some(i => i.id.startsWith('pill_hp') && i.count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden select-none">
      {/* Sấm sét lôi điện rơi từ đỉnh màn hình */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lightningStrikes.map(strike => (
          <div
            key={strike.id}
            className="absolute top-0 w-2 h-full bg-gradient-to-b from-purple-200 via-sky-300 to-amber-200 animate-pulse shadow-[0_0_35px_#38bdf8]"
            style={{
              left: `${strike.x}%`,
              transform: `skewX(${Math.sin(strike.id) * 15}deg)`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-purple-950/60 to-slate-950/95 border-2 border-purple-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 rounded-2xl bg-purple-900/40 border-2 border-purple-400 flex items-center justify-center text-purple-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Zap className="w-8 h-8 animate-bounce text-yellow-300" />
        </div>

        <h2 className="text-2xl font-black text-amber-300 tracking-wider">
          CỬU THIÊN LÔI KIẾP GIÁNG LÂM
        </h2>
        <p className="text-sm text-purple-200 mt-1">
          Nghịch thiên tu tiên, đột phá <span className="font-bold text-yellow-300">{targetRealm.name}</span>!
        </p>

        {/* Status HP and Tribulation Bar */}
        <div className="w-full mt-6 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-rose-400">Khí Huyết Hộ Thể</span>
              <span className="text-slate-200 tabular-nums">{tribulationHp}/{player.maxHp}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-150"
                style={{ width: `${Math.max(0, (tribulationHp / player.maxHp) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-amber-400">Tiến Độ Độ Kiếp</span>
              <span className="text-yellow-300 tabular-nums font-bold">{Math.round(tribulationProgress)}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-amber-600/50 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-purple-400 rounded-full transition-all duration-100 shadow-[0_0_15px_#f59e0b]"
                style={{ width: `${tribulationProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current status display */}
        {status === 'battling' && (
          <div className="mt-6 w-full space-y-3">
            <button
              onClick={handleResist}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-lg tracking-wider shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-6 h-6 fill-slate-950" />
              <span>VẬN CÔNG CHỐNG ĐỠ (NHẤN LIÊN TỤC!)</span>
            </button>

            {hasPill && (
              <button
                onClick={handleUseHealPill}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-rose-500/50 text-rose-300 text-sm font-semibold transition"
              >
                Cắn Hồi Huyết Đan Hộ Mệnh (+HP)
              </button>
            )}

            <p className="text-xs text-slate-400">
              Đã giáng {lightningCount} đạo lôi kiếp! Hãy nhấp thật nhanh để tiêu trừ lôi uy!
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6 w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 flex items-center gap-3 justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-base">ĐỘ KIẾP THÀNH CÔNG!</div>
                <div className="text-xs text-emerald-200">
                  Kim thân bất hoại, thọ nguyên gia tăng thêm {targetRealm.lifespanReward} năm!
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess({
                  realmIndex: targetRealm.level - 1,
                  exp: Math.max(0, player.exp - (targetRealm.reqExp || 0)),
                  hp: targetRealm.baseHp,
                  maxHp: targetRealm.baseHp,
                  mp: targetRealm.baseMp,
                  maxMp: targetRealm.baseMp,
                  atk: targetRealm.baseAtk,
                  def: targetRealm.baseDef,
                  lifespanSeconds: player.lifespanSeconds + targetRealm.lifespanReward * 60
                });
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold tracking-wide shadow-lg transition"
            >
              Tiếp Nhận Tạo Hóa Tiên Cảnh
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-6 w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500 text-rose-300 flex items-center gap-3 justify-center">
              <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-base">ĐỘ KIẾP THẤT BẠI!</div>
                <div className="text-xs text-rose-200">
                  Thần hồn chấn thương, tu vi bị tổn thất nhẹ. Hãy dưỡng thương và thử lại sau!
                </div>
              </div>
            </div>

            <button
              onClick={onFail}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold tracking-wide transition border border-slate-600"
            >
              Quay Về Dưỡng Thương
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
