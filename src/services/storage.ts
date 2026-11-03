import { PlayerStats, ChiBao } from '../types/game';
import { INITIAL_PLAYER, REALMS, DEFAULT_CONG_PHAP_LIST, DEFAULT_CHI_BAO_LIST } from '../constants/gameData';

const STORAGE_KEY = 'tientu_save_data_v4';

export function getCongPhapEffectDesc(id: string, level: number): string {
  if (id === 'van_kiem_quy_tong') {
    const swords = 10 + (level - 1) * 5; // 10, 15, 20, 25, 30
    const dmg = 100 + level * 25; // 125%, 150%, 175%, 200%, 225%
    return `Tầng ${level}: ${swords} Phi kiếm/s, ${dmg}% sát thương, tiêu tốn 10 MP/s (ngưng khi đủ 30 kiếm)`;
  }
  if (id === 'chan_nguyen_ho_the') {
    const ratio = 50 + (level - 1) * 25; // 50, 75, 100, 125, 150
    return `Tầng ${level}: Hào quang bảo vệ bán kính 50px, quy đổi 1:${ratio} (1 MP giảm ${ratio} sát thương)`;
  }
  if (id === 'vo_ha_han') {
    return `Tầng ${level}: Lĩnh vực 300px (trong 140px giảm 99% tốc độ), tiêu hao 5 MP/s`;
  }
  return '';
}

export function loadGame(): PlayerStats {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem('tientu_save_data_v3');
    }
    if (!raw) {
      raw = localStorage.getItem('tientu_save_data_v2');
    }
    if (!raw) return { ...INITIAL_PLAYER };
    const parsed = JSON.parse(raw);

    const stats: PlayerStats = {
      ...INITIAL_PLAYER,
      ...parsed,
      sectContributionPoints: parsed.sectContributionPoints !== undefined ? parsed.sectContributionPoints : INITIAL_PLAYER.sectContributionPoints,
      hasUnlockedVanKiem: Boolean(parsed.hasUnlockedVanKiem !== undefined ? parsed.hasUnlockedVanKiem : true),
      congPhapList: DEFAULT_CONG_PHAP_LIST.map((def) => {
        const found = Array.isArray(parsed.congPhapList) ? parsed.congPhapList.find((p: any) => p.id === def.id) : null;
        if (!found) return def;
        const lvl = found.level || def.level;
        return {
          ...def,
          level: lvl,
          unlocked: found.unlocked !== undefined ? found.unlocked : def.unlocked,
          equipped: found.equipped !== undefined ? found.equipped : def.equipped,
          effectDesc: getCongPhapEffectDesc(def.id, lvl)
        };
      }),
      chiBaoList: DEFAULT_CHI_BAO_LIST.map((def) => {
        const found = Array.isArray(parsed.chiBaoList) ? parsed.chiBaoList.find((c: any) => c.id === def.id) : null;
        if (!found) return def;
        return {
          ...def,
          unlocked: found.unlocked !== undefined ? found.unlocked : def.unlocked,
          equipped: found.equipped !== undefined ? found.equipped : def.equipped,
          stars: found.stars || def.stars,
          effectDesc: def.id === 'tu_khi_dan' ? `+${found.stars || 1} Tu Vi/s khi tọa thiền (${found.stars || 1} Sao)` : def.effectDesc
        };
      }),
      equippedArtifactIds: Array.isArray(parsed.equippedArtifactIds) && parsed.equippedArtifactIds.length > 0
        ? parsed.equippedArtifactIds
        : INITIAL_PLAYER.equippedArtifactIds,
      phoenixReviveCooldownSeconds: parsed.phoenixReviveCooldownSeconds || 0,
      hunger: parsed.hunger !== undefined ? parsed.hunger : 100,
      thirst: parsed.thirst !== undefined ? parsed.thirst : 100,
      isMeditating: false, // Always start non-meditating on page load
      fashion: { ...INITIAL_PLAYER.fashion, ...(parsed.fashion || {}) },
      inventory: parsed.inventory || INITIAL_PLAYER.inventory,
      activeMissions: parsed.activeMissions || INITIAL_PLAYER.activeMissions,
    };

    // Recalculate stats according to current realm
    const currentRealm = REALMS[stats.realmIndex] || REALMS[0];
    if (stats.maxHp < currentRealm.baseHp) {
      stats.maxHp = currentRealm.baseHp;
    }
    if (stats.maxMp < currentRealm.baseMp) {
      stats.maxMp = currentRealm.baseMp;
    }
    stats.maxHunger = currentRealm.maxHunger;
    stats.maxThirst = currentRealm.maxThirst;
    stats.hunger = Math.min(stats.maxHunger, Math.max(0, stats.hunger || 0));
    stats.thirst = Math.min(stats.maxThirst, Math.max(0, stats.thirst || 0));

    return stats;
  } catch (e) {
    console.error('Failed to load save data:', e);
    return { ...INITIAL_PLAYER };
  }
}

export function saveGame(stats: PlayerStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save game data:', e);
  }
}

export function resetGame(): PlayerStats {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('tientu_save_data_v2');
    localStorage.removeItem('tientu_save_data_v1');
  } catch (e) {
    console.error('Failed to reset:', e);
  }
  return { ...INITIAL_PLAYER };
}

export function formatLifespan(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes} năm ${seconds} tháng (còn ${minutes}p${seconds < 10 ? '0' : ''}${seconds}s)`;
}

export function formatTimeShort(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
