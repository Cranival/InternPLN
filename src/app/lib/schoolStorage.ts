// Helper untuk manage custom schools - load dari localStorage & tambah baru

const STORAGE_KEY = "custom_schools";
import { schools as defaultSchoolsList } from '../data/schools';

function normalizeName(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Load custom schools dari localStorage
 */
export function loadCustomSchools(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  try {
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    // normalize stored values
    const normalized = parsed
      .map((v: any) => typeof v === 'string' ? normalizeName(v) : '')
      .filter(Boolean);
    // dedupe case-insensitive
    const map = new Map<string, string>();
    for (const v of normalized) {
      const key = v.toLowerCase();
      if (!map.has(key)) map.set(key, v);
    }
    return Array.from(map.values());
  } catch {
    return [];
  }
}

/**
 * Tambah custom school ke localStorage (duplicate check)
 */
export function addCustomSchool(schoolName: string): boolean {
  if (typeof window === "undefined") return false;
  const trimmed = normalizeName(schoolName);
  if (!trimmed) return false;

  const custom = loadCustomSchools();
  const lower = trimmed.toLowerCase();

  // Check against existing custom schools (case-insensitive)
  if (custom.some(c => c.toLowerCase() === lower)) return false;

  // Also check against default schools to avoid adding duplicates of defaults
  if (defaultSchoolsList.some(s => s.toLowerCase() === lower)) return false;

  custom.push(trimmed);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  return true;
}

/**
 * Gabung default schools + custom schools, sorted
 */
export function getAllSchools(defaultSchools: string[]): string[] {
  const custom = loadCustomSchools();
  // Use a map keyed by lowercase to dedupe case-insensitive while preserving
  // the original casing preference: prefer defaultSchools' casing first.
  const map = new Map<string, string>();
  for (const s of defaultSchools) {
    const key = s.toLowerCase();
    if (!map.has(key)) map.set(key, s);
  }
  for (const s of custom) {
    const key = s.toLowerCase();
    if (!map.has(key)) map.set(key, s);
  }
  const merged = Array.from(map.values());
  return merged.sort((a, b) => a.localeCompare(b));
}