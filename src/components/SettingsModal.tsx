import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, RotateCcw, X, AlertTriangle, Check, Sliders } from 'lucide-react';
import { sound } from '../services/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetGame }) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [volume, setVolume] = useState(Math.round(sound.getVolume() * 100));
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    sound.setVolume(val / 100);
    if (val > 0 && isMuted) {
      sound.setMuted(false);
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-black text-lg text-slate-100">Cài Đặt Trò Chơi</h3>
            <p className="text-xs text-slate-400">Âm thanh & Tái sinh luân hồi</p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="space-y-5">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" /> Âm Lượng Hiệu Ứng
              </span>
              <button
                onClick={handleToggleMute}
                className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
                  isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-sky-400'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isMuted ? 'Đang Tắt' : 'Bật'}
              </button>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>
          </div>

          {/* Reset / Trùng sinh section */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <RotateCcw className="w-4 h-4" /> Tái Sinh Luân Hồi (Chơi Lại Từ Đầu)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tán hết tu vi hiện tại, xoá toàn bộ Linh Thạch và Túi Đồ để bắt đầu lại một kiếp tu tiên mới tại Luyện Khí Tầng 1.
            </p>

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Thiết Lập Lại Kiếp Tu Tiên</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-950/80 rounded-xl border border-rose-500 text-center space-y-3 animate-in fade-in">
                <p className="text-xs text-rose-200 font-semibold">
                  Đạo hữu có chắc chắn muốn trùng sinh luân hồi? Hành động này không thể hoàn tác!
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onResetGame();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Xác Nhận Chơi Lại
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition"
          >
            Đóng Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
