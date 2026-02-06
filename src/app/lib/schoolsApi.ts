// src/app/lib/schoolsApi.ts
import { schools } from '../data/schools';

export async function fetchSchoolsProxy(q: string): Promise<string[]> {
  if (!q?.trim()) return [];

  const ql = q.trim().toLowerCase();
  const localMatches = schools.filter(s => s.toLowerCase().includes(ql));

  try {
    const res = await fetch(`/api/institution?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    if (!res.ok) return localMatches;
    const json = await res.json();
    if (!Array.isArray(json)) return localMatches;
    const remote = json.map((it: any) => String(it.name || "")).filter(Boolean);
    // if remote returns nothing, fall back to local matches
    return remote.length ? remote : localMatches;
  } catch {
    return localMatches;
  }
}