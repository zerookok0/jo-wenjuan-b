import { siteConfig } from './site';

export interface EditableConfig {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  visibleMin: number;
  visibleMax: number;
  promiseQ: string;
  promiseA: string;
  appName: string;
  appSize: string;
  /** رابط تحميل التطبيق القابل للتعديل من لوحة التحكم */
  appDownloadUrl: string;
  deliveryDays: string;
  supportEmail: string;
  points: string[];
  faq: { q: string; a: string }[];
}

const KEY = 'rayak.config.v1';

export const defaultConfig: EditableConfig = {
  brandName: siteConfig.brandName,
  tagline: siteConfig.tagline,
  heroTitle: siteConfig.heroTitle,
  heroHighlight: siteConfig.heroHighlight,
  heroSubtitle: siteConfig.heroSubtitle,
  visibleMin: siteConfig.visibleCount.min,
  visibleMax: siteConfig.visibleCount.max,
  promiseQ: siteConfig.dataPromise.q,
  promiseA: siteConfig.dataPromise.a,
  appName: siteConfig.appName,
  appSize: siteConfig.appSize,
  appDownloadUrl: siteConfig.appDownloadUrl,
  deliveryDays: siteConfig.deliveryDays,
  supportEmail: siteConfig.supportEmail,
  points: siteConfig.points,
  faq: siteConfig.faq,
};

export function loadConfig(): EditableConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw) as Partial<EditableConfig>;
    return {
      ...defaultConfig,
      ...parsed,
      points: Array.isArray(parsed.points) && parsed.points.length ? parsed.points : defaultConfig.points,
      faq: Array.isArray(parsed.faq) && parsed.faq.length ? parsed.faq : defaultConfig.faq,
    };
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(config: EditableConfig): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('rayak:config-change'));
  } catch {
    /* تجاهل */
  }
}

export function resetConfig(): void {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent('rayak:config-change'));
  } catch {
    /* تجاهل */
  }
}
