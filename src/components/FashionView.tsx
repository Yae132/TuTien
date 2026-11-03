import React, { useState } from 'react';
import { FashionConfig, PlayerStats } from '../types/game';
import { ChibiCharacterRenderer } from './ChibiCharacterRenderer';
import { sound } from '../services/audio';
import { Sparkles, Palette, Check, Scissors, Shirt, Wand2, Shield } from 'lucide-react';

interface FashionViewProps {
  player: PlayerStats;
  onSaveFashion: (newFashion: FashionConfig) => void;
}

const HAIR_STYLES = [
  { id: 'ngan_phat_bit_mat', name: 'Ngân Phát Kiếm Tiên (Bịt Mắt)', color: '#e2e8f0', desc: 'Tóc bạc buộc đuôi ngựa cao kèm dải lụa bịt mắt ngọc lục tiêu sái như ảnh' },
  { id: 'hac_phat_tram', name: 'Hắc Phát Búi Trâm', color: '#1e293b', desc: 'Tóc đen tuyền cài trâm ngọc và dải ruy băng xanh bồng bềnh' },
  { id: 'dao_hoa_song_binh', name: 'Đào Hoa Song Bính', color: '#f472b6', desc: 'Tóc hồng hai bím kẹp hoa vàng đào hoa tiên nữ' },
  { id: 'lam_diem_tien_tu', name: 'Lam Diễm Tiên Tử', color: '#38bdf8', desc: 'Tóc xanh nước biển búi sen uyển chuyển xuất trần' },
  { id: 'long_toc_bich_giac', name: 'Long Tộc Bích Giác', color: '#0ea5e9', desc: 'Tóc xanh ngọc với cặp sừng rồng băng tuyết cao quý' },
  { id: 'xich_diem_ma_dao', name: 'Xích Diễm Ma Đạo', color: '#ef4444', desc: 'Tóc đỏ ánh lửa ma tu cuồng bạo phong trần' },
  { id: 'hoang_kim_quan', name: 'Hoàng Kim Miện Quan', color: '#0f172a', desc: 'Búi tóc đội vương miện hoàng kim tôn quý của tông môn' },
];

const OUTFITS = [
  { id: 'bach_da_kiem_y', name: 'Bạch Dạ Kiếm Y', desc: 'Y phục trắng xám vạt xéo đen tiêu dao kinh điển của kiếm khách' },
  { id: 'thanh_truc_tien_y', name: 'Thanh Trúc Tiên Y', desc: 'Xiêm y xanh ngọc sen bồng bềnh thanh tao thoát tục' },
  { id: 'bich_thuy_luu_tien', name: 'Bích Thủy Lưu Tiên', desc: 'Váy dạ hội lam ngọc trễ vai tà áo dài lượn sóng' },
  { id: 'ma_dao_hac_bao', name: 'Ma Đạo Hắc Bào', desc: 'Chiến bào đen đỏ hở ngực đai lưng da dũng mãnh' },
  { id: 'loi_dinh_tuong_bao', name: 'Lôi Đình Tướng Bào', desc: 'Tướng bào tím đậm đính lông vũ trắng và giáp vai' },
  { id: 'huyen_lam_du_hiep', name: 'Huyền Lam Du Hiệp', desc: 'Áo lam xám giáp tay của hiệp khách vân du bốn bể' },
];

const ACCESSORIES = [
  { id: 'bit_mat', name: 'Bịt Mắt Kiếm Tiên', desc: 'Dải băng lụa ngọc bích che mắt' },
  { id: 'phi_kiem_lung', name: 'Cõng Phi Kiếm Sau Lưng', desc: 'Bảo kiếm đeo sau lưng sẵn sàng xuất vỏ' },
  { id: 'long_giac', name: 'Sừng Long Tộc', desc: 'Cặp sừng rồng xanh ngọc phát sáng' },
  { id: 'none', name: 'Không Đeo Phụ Kiện', desc: 'Giữ dáng vẻ thanh thuần giản dị' },
];

const WEAPONS = [
  { id: 'azure_frost', name: 'Thanh Sương Linh Kiếm', desc: 'Kiếm băng lam phát sáng sắc bén' },
  { id: 'crimson_fire', name: 'Xích Tiêu Hỏa Kiếm', desc: 'Kiếm lửa rực rỡ khí diễm' },
  { id: 'violet_thunder', name: 'Tử Điện Lôi Kiếm', desc: 'Lôi quang tím xoay vần hộ thể' },
  { id: 'xuan_yuan', name: 'Hiên Viên Cổ Kiếm', desc: 'Hoàng kim thánh kiếm uy chấn' },
];

const AURAS = [
  { id: 'spirit_wind', name: 'Thanh Phong Linh Khí', desc: 'Linh khí xoay quanh thân như gió tiên' },
  { id: 'golden_lotus', name: 'Liên Hoa Hoàng Kim', desc: 'Cánh sen vàng kim xoay quanh thân' },
  { id: 'violet_lightning', name: 'Cửu Thiên Lôi Quang', desc: 'Tia chớp tím rạch trời hộ thể' },
  { id: 'blood_shadow', name: 'Huyết Ma Ám Ảnh', desc: 'Khí tức cuồng bạo đỏ thẫm' },
];

export const FashionView: React.FC<FashionViewProps> = ({ player, onSaveFashion }) => {
  const [fashion, setFashion] = useState<FashionConfig>({ ...player.fashion });
  const [posture, setPosture] = useState<'standing' | 'meditating'>('standing');
  const [activeTab, setActiveTab] = useState<'hair' | 'outfit' | 'accessory' | 'weapon' | 'aura'>('hair');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleApply = () => {
    sound.playLevelUp();
    onSaveFashion(fashion);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-slate-950 text-slate-100 custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Title */}
        <div className="pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-pink-400 bg-pink-950/40 px-3 py-1 rounded-full border border-pink-600/30 mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>THỜI TRANG CHIBI TIÊN HIỆP VÕ HIỆP</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 font-serif">PHÒNG THAY ĐỒ TIÊN GIA</h1>
          <p className="text-xs text-slate-400">
            Tạo hình nhân vật Chibi Võ Hiệp thanh thoát không mặt (Faceless Mannequin) chuẩn phong cách cổ trang kiếm hiệp.
          </p>
        </div>

        {/* 2-Column: Left Character Preview, Right Customization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Preview Box */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-2xl">
            <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Giao Diện Tiên Nhân
            </div>

            {/* Posture Switcher Buttons */}
            <div className="flex items-center gap-1.5 absolute top-3.5 right-4 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPosture('standing')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  posture === 'standing' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đứng Thẳng
              </button>
              <button
                onClick={() => setPosture('meditating')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  posture === 'meditating' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tọa Thiền
              </button>
            </div>

            <div className="my-6">
              <ChibiCharacterRenderer
                fashion={fashion}
                action={posture}
                size={270}
                showAura={true}
              />
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold text-xs tracking-wider shadow-lg shadow-pink-500/20 active:scale-95 transition flex items-center justify-center gap-2"
            >
              {savedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>ĐÃ LƯU THỜI TRANG THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ÁP DỤNG DIỆN MẠO NÀY</span>
                </>
              )}
            </button>
          </div>

          {/* Right Customization Tabs & Options */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('hair')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'hair' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" /> Kiểu Tóc ({HAIR_STYLES.length})
              </button>

              <button
                onClick={() => setActiveTab('outfit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'outfit' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" /> Y Phục Cổ Trang ({OUTFITS.length})
              </button>

              <button
                onClick={() => setActiveTab('accessory')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'accessory' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Phụ Kiện
              </button>

              <button
                onClick={() => setActiveTab('weapon')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'weapon' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" /> Phi Kiếm
              </button>

              <button
                onClick={() => setActiveTab('aura')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'aura' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Hào Quang
              </button>
            </div>

            {/* TAB: KIỂU TÓC */}
            {activeTab === 'hair' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {HAIR_STYLES.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      sound.playLootDing();
                      setFashion((prev) => ({ ...prev, hairStyle: h.id as any, hairColor: h.color }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      fashion.hairStyle === h.id
                        ? 'border-sky-500 bg-sky-950/30 shadow-md ring-1 ring-sky-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" style={{ backgroundColor: h.color }} />
                        {h.name}
                      </span>
                      {fashion.hairStyle === h.id && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{h.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: Y PHỤC */}
            {activeTab === 'outfit' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {OUTFITS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      sound.playLootDing();
                      setFashion((prev) => ({ ...prev, outfit: o.id as any }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      fashion.outfit === o.id
                        ? 'border-emerald-500 bg-emerald-950/30 shadow-md ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{o.name}</span>
                      {fashion.outfit === o.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{o.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: PHỤ KIỆN */}
            {activeTab === 'accessory' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {ACCESSORIES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      sound.playLootDing();
                      setFashion((prev) => ({ ...prev, accessory: a.id as any }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      fashion.accessory === a.id
                        ? 'border-purple-500 bg-purple-950/30 shadow-md ring-1 ring-purple-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{a.name}</span>
                      {fashion.accessory === a.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{a.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: PHI KIẾM */}
            {activeTab === 'weapon' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {WEAPONS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      sound.playLootDing();
                      setFashion((prev) => ({ ...prev, weapon: w.id as any }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      fashion.weapon === w.id
                        ? 'border-amber-500 bg-amber-950/30 shadow-md ring-1 ring-amber-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{w.name}</span>
                      {fashion.weapon === w.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{w.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: HÀO QUANG */}
            {activeTab === 'aura' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {AURAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      sound.playLootDing();
                      setFashion((prev) => ({ ...prev, aura: a.id as any }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      fashion.aura === a.id
                        ? 'border-cyan-500 bg-cyan-950/30 shadow-md ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{a.name}</span>
                      {fashion.aura === a.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{a.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
