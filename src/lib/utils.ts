import { BUY_PLACES, FREQ } from '../data/constants';
import { siteConfig } from '../config/site';

export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export const formatDate = (ts: number): string =>
  new Date(ts).toLocaleDateString('ar-JO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const makeOrderId = (): string => {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `RY-${stamp}${rand}`;
};

export const makeTrackingNo = (): string => {
  const digits = Math.floor(100000000 + Math.random() * 899999999);
  return `JO${digits}`;
};

export const pct = (current: number, total: number): number =>
  total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100));

/** تعطيل عشوائي بسيط للترتيب */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const BRAND = siteConfig.brandName;
export { BUY_PLACES, FREQ };
