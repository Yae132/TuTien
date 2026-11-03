import { PlayerStats } from '../types/game';
import { INITIAL_PLAYER, REALMS, DEFAULT_CONG_PHAP_LIST } from '../constants/gameData';

const STORAGE_KEY = 'tientu_save_data_v3';

export function loadGame(): PlayerStats {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem('tientu_save_data_v2');
    }
    if (!raw) {
      raw = localStorage.getItem('tientu_save_data_v1');
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
        return {
          ...def,
          level: found.level || def.level,
          unlocked: found.unlocked !== undefined ? found.unlocked : def.unlocked,
          equipped: found.equipped !== undefined ? found.equipped : def.equipped,
        };
      }),
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
