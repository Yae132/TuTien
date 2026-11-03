import React, { useEffect, useRef } from 'react';
import { FashionConfig } from '../types/game';

interface ChibiCharacterRendererProps {
  fashion: FashionConfig;
  action?: 'meditating' | 'standing' | 'walking';
  size?: number; // width/height in px
  showAura?: boolean;
}

export const ChibiCharacterRenderer: React.FC<ChibiCharacterRendererProps> = ({
  fashion,
  action = 'standing',
  size = 280,
  showAura = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * (action === 'meditating' ? 0.58 : 0.52);
      const scale = size / 260;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Subtle breathing float
      const breathY = action === 'meditating' ? Math.sin(elapsed * 2) * 2.5 : Math.sin(elapsed * 2.5) * 1.5;
      const floatAngle = action === 'meditating' ? Math.sin(elapsed * 1.5) * 0.02 : 0;
      ctx.translate(0, breathY);
      ctx.rotate(floatAngle);

      // 1. AURA EFFECTS (Vòng Hào Quang Tiên Khí)
      if (showAura && fashion.aura !== 'none') {
        ctx.save();
        if (fashion.aura === 'spirit_wind') {
          // Gió Tiên Xanh Lam
          const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, 75);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
          grad.addColorStop(0.7, 'rgba(14, 165, 233, 0.08)');
          grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, 80, 0, Math.PI * 2);
          ctx.fill();

          // Swirling rune particles
          for (let i = 0; i < 4; i++) {
            const ang = elapsed * 1.5 + (i * Math.PI) / 2;
            const r = 55 + Math.sin(elapsed * 3 + i) * 8;
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * r, Math.sin(ang) * (r * 0.75), 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (fashion.aura === 'golden_lotus') {
          // Kim Liên Hoàng Quang
          const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, 80);
          grad.addColorStop(0, 'rgba(250, 204, 21, 0.3)');
          grad.addColorStop(0.8, 'rgba(234, 179, 8, 0.08)');
          grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, 85, 0, Math.PI * 2);
          ctx.fill();
        } else if (fashion.aura === 'violet_lightning') {
          // Tử Tiêu Lôi Điện
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 68 + Math.sin(elapsed * 8) * 3, 0, Math.PI * 2);
          ctx.stroke();
        } else if (fashion.aura === 'blood_shadow') {
          // Huyết Ma Ảnh
          const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, 75);
          grad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
          grad.addColorStop(1, 'rgba(159, 18, 57, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, 75, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. BACK WEAPON / FLOATING SWORD
      if (fashion.accessory === 'phi_kiem_lung' || action === 'meditating') {
        ctx.save();
        ctx.translate(28, -15);
        ctx.rotate(-0.35 + Math.sin(elapsed * 2) * 0.05);

        // Sword blade
        ctx.fillStyle = fashion.weapon === 'crimson_fire' ? '#f43f5e' : fashion.weapon === 'violet_thunder' ? '#a855f7' : '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -45);
        ctx.lineTo(4, 25);
        ctx.lineTo(-4, 25);
        ctx.closePath();
        ctx.fill();

        // Sword guard & hilt
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-7, 24, 14, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-2.5, 28, 5, 14);

        // Tassel
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 42);
        ctx.lineTo(Math.sin(elapsed * 3) * 4, 52);
        ctx.stroke();
        ctx.restore();
      }

      // 3. BACK HAIR (Tóc sau lưng buông dài)
      ctx.save();
      const hairCol = fashion.hairColor || '#1e293b';
      ctx.fillStyle = hairCol;

      if (fashion.hairStyle === 'ngan_phat_bit_mat') {
        // High ponytail swaying
        ctx.beginPath();
        ctx.moveTo(-10, -32);
        ctx.quadraticCurveTo(18 + Math.sin(elapsed * 2) * 4, -40, 26 + Math.sin(elapsed * 2.5) * 6, 25);
        ctx.quadraticCurveTo(16, 28, 6, -15);
        ctx.closePath();
        ctx.fill();
      } else if (fashion.hairStyle === 'dao_hoa_song_binh') {
        // Twin-tails
        ctx.beginPath();
        ctx.moveTo(-20, -25);
        ctx.quadraticCurveTo(-38 + Math.sin(elapsed * 2) * 3, -10, -35 + Math.sin(elapsed * 2) * 5, 28);
        ctx.quadraticCurveTo(-26, 15, -16, -18);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(20, -25);
        ctx.quadraticCurveTo(38 - Math.sin(elapsed * 2) * 3, -10, 35 - Math.sin(elapsed * 2) * 5, 28);
        ctx.quadraticCurveTo(26, 15, 16, -18);
        ctx.fill();
      } else {
        // Long flowing locks
        ctx.beginPath();
        ctx.moveTo(-18, -25);
        ctx.quadraticCurveTo(-25, 15, -12 + Math.sin(elapsed * 2) * 3, 38);
        ctx.lineTo(12 + Math.sin(elapsed * 2) * 3, 38);
        ctx.quadraticCurveTo(25, 15, 18, -25);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 4. LOWER BODY & LEGS / SITTING MEDITATION
      if (action === 'meditating') {
        // Tọa thiền khoanh chân
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, 34, 32, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shoes tips
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(-22, 33, 4.5, 0, Math.PI * 2);
        ctx.arc(22, 33, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // Đứng thẳng (Hai chân thon gọn, giày bốt cổ cao)
        ctx.save();
        const legCol = fashion.outfit === 'bich_thuy_luu_tien' ? '#38bdf8' : '#1e293b';
        ctx.fillStyle = legCol;

        // Left leg & boot
        ctx.fillRect(-12, 30, 8, 32);
        ctx.fillStyle = '#0f172a'; // boot
        ctx.fillRect(-13, 50, 9, 14);

        // Right leg & boot
        ctx.fillStyle = legCol;
        ctx.fillRect(4, 30, 8, 32);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(3, 50, 9, 14);
        ctx.restore();
      }

      // 5. OUTFIT / ROBES (Y Phục Cổ Trang Kiếm Hiệp theo ảnh mẫu)
      ctx.save();
      const outfit = fashion.outfit;

      if (outfit === 'bach_da_kiem_y') {
        // Áo trắng viền xám đen tiêu dao (row 3 left)
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(18, -2);
        ctx.lineTo(22, 34);
        ctx.lineTo(-22, 34);
        ctx.closePath();
        ctx.fill();

        // Dark diagonal lapel & sash
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(0, 16);
        ctx.lineTo(14, 16);
        ctx.lineTo(5, -2);
        ctx.closePath();
        ctx.fill();

        // Dark waist belt with gold accent
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-16, 16, 32, 7);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-4, 16.5, 8, 6);

        // Asymmetric sash tail hanging
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(2, 23, 7, 18);
      } else if (outfit === 'thanh_truc_tien_y') {
        // Xiêm y xanh ngọc sen thanh tao (row 1 center & row 3)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(18, -2);
        ctx.lineTo(24, 35);
        ctx.lineTo(-24, 35);
        ctx.closePath();
        ctx.fill();

        // Jade collar & ribbon
        ctx.fillStyle = '#a7f3d0';
        ctx.beginPath();
        ctx.moveTo(-14, -2);
        ctx.lineTo(0, 15);
        ctx.lineTo(14, -2);
        ctx.fill();

        // Lotus belt
        ctx.fillStyle = '#065f46';
        ctx.fillRect(-16, 15, 32, 6);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 18, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (outfit === 'bich_thuy_luu_tien') {
        // Váy dạ hội xanh ngọc uyển chuyển (row 1 second)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-16, 4);
        ctx.lineTo(16, 4);
        ctx.lineTo(25, 36);
        ctx.lineTo(-25, 36);
        ctx.closePath();
        ctx.fill();

        // Flared mermaid hem
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(-25, 36);
        ctx.quadraticCurveTo(0, 42, 25, 36);
        ctx.lineTo(22, 32);
        ctx.lineTo(-22, 32);
        ctx.fill();

        // Lotus corsage
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.arc(0, 10, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (outfit === 'ma_dao_hac_bao') {
        // Áo đen đỏ ma tu (row 1 left)
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(18, -2);
        ctx.lineTo(22, 35);
        ctx.lineTo(-22, 35);
        ctx.closePath();
        ctx.fill();

        // Crimson lapel & open warrior wrap
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(-12, -2);
        ctx.lineTo(0, 16);
        ctx.lineTo(-6, 20);
        ctx.fill();

        // Waist sash & armor studs
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-16, 16, 32, 7);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-3, 17, 6, 5);
      } else if (outfit === 'loi_dinh_tuong_bao') {
        // Tướng bào tím lông vũ (row 2 right)
        ctx.fillStyle = '#3730a3';
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(18, -2);
        ctx.lineTo(22, 35);
        ctx.lineTo(-22, 35);
        ctx.closePath();
        ctx.fill();

        // White feathered mantle on shoulders
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(-22, -2);
        ctx.lineTo(-12, 10);
        ctx.lineTo(-18, 14);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(22, -2);
        ctx.lineTo(12, 10);
        ctx.lineTo(18, 14);
        ctx.fill();

        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(-16, 16, 32, 7);
      } else {
        // Huyền Lam Du Hiệp (Default martial arts tunic)
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(-17, -2);
        ctx.lineTo(17, -2);
        ctx.lineTo(22, 35);
        ctx.lineTo(-22, 35);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.moveTo(-12, -2);
        ctx.lineTo(0, 15);
        ctx.lineTo(12, -2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-15, 16, 30, 6);
      }
      ctx.restore();

      // 6. SLEEVES & ARMS
      ctx.save();
      const sleeveCol =
        outfit === 'bach_da_kiem_y'
          ? '#f8fafc'
          : outfit === 'thanh_truc_tien_y'
          ? '#10b981'
          : outfit === 'bich_thuy_luu_tien'
          ? '#38bdf8'
          : outfit === 'ma_dao_hac_bao'
          ? '#18181b'
          : '#475569';

      ctx.fillStyle = sleeveCol;

      if (action === 'meditating') {
        // Khoanh tay trước bụng tĩnh tọa kết ấn
        ctx.beginPath();
        ctx.ellipse(-14, 12, 9, 14, 0.4, 0, Math.PI * 2);
        ctx.ellipse(14, 12, 9, 14, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Hands resting
        ctx.fillStyle = fashion.skinTone || '#fde7d6';
        ctx.beginPath();
        ctx.arc(0, 19, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standing sleeves
        ctx.beginPath();
        ctx.moveTo(-16, -2);
        ctx.lineTo(-26, 18);
        ctx.lineTo(-18, 22);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(16, -2);
        ctx.lineTo(26, 18);
        ctx.lineTo(18, 22);
        ctx.lineTo(12, 10);
        ctx.closePath();
        ctx.fill();

        // Hands
        ctx.fillStyle = fashion.skinTone || '#fde7d6';
        ctx.beginPath();
        ctx.arc(-22, 21, 3.5, 0, Math.PI * 2);
        ctx.arc(22, 21, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 7. FACELESS CHIBI HEAD & NECK (Style đúng như ảnh mẫu)
      ctx.save();
      const skin = fashion.skinTone || '#fde7d6';

      // Neck
      ctx.fillStyle = '#f8d5bb';
      ctx.fillRect(-4.5, -9, 9, 8);

      // Chin and head contour (Faceless chibi anime doll)
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(0, -20, 20, 19, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle warm blush on cheeks (Thanh nhã không vẽ mắt mũi - chuẩn mannequin tiên hiệp)
      ctx.fillStyle = 'rgba(251, 113, 133, 0.22)';
      ctx.beginPath();
      ctx.arc(-11, -17, 3.5, 0, Math.PI * 2);
      ctx.arc(11, -17, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // BLINDFOLD ACCESSORY (Bịt Mắt Kiếm Tiên như nhân vật tóc bạc trong ảnh)
      if (fashion.accessory === 'bit_mat' || fashion.hairStyle === 'ngan_phat_bit_mat') {
        ctx.fillStyle = '#064e3b'; // Jade green silk blindfold ribbon
        ctx.fillRect(-20, -22, 40, 7.5);
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-20, -22, 40, 7.5);
      }

      ctx.restore();

      // 8. FRONT HAIR & BANGS (Tóc mái & búi tóc)
      ctx.save();
      ctx.fillStyle = hairCol;

      if (fashion.hairStyle === 'ngan_phat_bit_mat') {
        // High ponytail tie & bangs
        ctx.beginPath();
        ctx.moveTo(-18, -25);
        ctx.quadraticCurveTo(-12, -34, 0, -35);
        ctx.quadraticCurveTo(12, -34, 18, -25);
        ctx.lineTo(16, -18);
        ctx.quadraticCurveTo(8, -26, 0, -26);
        ctx.quadraticCurveTo(-8, -26, -16, -18);
        ctx.closePath();
        ctx.fill();

        // Ponytail ring
        ctx.fillStyle = '#065f46';
        ctx.fillRect(-5, -39, 10, 6);
      } else if (fashion.hairStyle === 'dao_hoa_song_binh') {
        // Pink bangs & flower clips
        ctx.beginPath();
        ctx.arc(0, -27, 18, Math.PI, 0);
        ctx.fill();

        // Golden hair flowers
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-16, -30, 4, 0, Math.PI * 2);
        ctx.arc(16, -30, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (fashion.hairStyle === 'hac_phat_tram') {
        // Daoist top knot with hairpin
        ctx.beginPath();
        ctx.arc(0, -26, 19, Math.PI * 0.9, Math.PI * 0.1);
        ctx.fill();

        // Top bun
        ctx.beginPath();
        ctx.arc(0, -38, 9, 0, Math.PI * 2);
        ctx.fill();

        // Jade hairpin & ribbon
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-16, -38);
        ctx.lineTo(16, -38);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-2, -33, 4, 12);
      } else if (fashion.hairStyle === 'long_toc_bich_giac') {
        // Azure hair with dragon horns
        ctx.beginPath();
        ctx.arc(0, -26, 18, Math.PI, 0);
        ctx.fill();

        // Crystal Dragon Horns (Sừng Long Tộc)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-12, -32);
        ctx.quadraticCurveTo(-18, -48, -24, -45);
        ctx.quadraticCurveTo(-16, -40, -10, -32);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(12, -32);
        ctx.quadraticCurveTo(18, -48, 24, -45);
        ctx.quadraticCurveTo(16, -40, 10, -32);
        ctx.fill();
      } else if (fashion.hairStyle === 'hoang_kim_quan') {
        // Antler Golden Crown
        ctx.beginPath();
        ctx.arc(0, -26, 18, Math.PI, 0);
        ctx.fill();

        // Crown
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(-14, -34);
        ctx.lineTo(-8, -48);
        ctx.lineTo(0, -40);
        ctx.lineTo(8, -48);
        ctx.lineTo(14, -34);
        ctx.closePath();
        ctx.fill();
      } else {
        // Default clean daoist bangs
        ctx.beginPath();
        ctx.arc(0, -26, 18, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#eab308';
        ctx.fillRect(-4, -37, 8, 4);
      }
      ctx.restore();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [fashion, action, size, showAura]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block mx-auto filter drop-shadow-xl"
    />
  );
};
