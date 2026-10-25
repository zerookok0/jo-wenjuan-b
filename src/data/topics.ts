import type { Topic, TopicId } from './types';

export const TOPICS: Topic[] = [
  { id: 'electronics', name: 'إلكترونيات', accent: '#38bdf8', icon: 'Smartphone' },
  { id: 'food', name: 'أغذية ومشروبات', accent: '#f59e0b', icon: 'CupSoda' },
  { id: 'beauty', name: 'عناية شخصية', accent: '#f472b6', icon: 'Sparkles' },
  { id: 'home', name: 'المنزل', accent: '#93A97E', icon: 'Home' },
  { id: 'telecom', name: 'اتصالات', accent: '#9E7FFF', icon: 'Signal' },
  { id: 'retail', name: 'تسوق وخدمات', accent: '#E4C88A', icon: 'ShoppingBag' },
];

export const TOPIC_MAP = Object.fromEntries(TOPICS.map((t) => [t.id, t])) as Record<
  TopicId,
  Topic
>;
