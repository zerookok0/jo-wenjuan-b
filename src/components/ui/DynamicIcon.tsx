import {
  Backpack,
  BatteryCharging,
  Cable,
  CupSoda,
  Fan,
  Headphones,
  Home,
  Lamp,
  Scissors,
  ShoppingBag,
  Signal,
  Smartphone,
  Sparkles,
  Speaker,
  Watch,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Backpack,
  BatteryCharging,
  Cable,
  CupSoda,
  Fan,
  Headphones,
  Home,
  Lamp,
  Scissors,
  ShoppingBag,
  Signal,
  Smartphone,
  Sparkles,
  Speaker,
  Watch,
  Zap,
};

export function DynamicIcon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
