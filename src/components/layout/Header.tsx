import { useEffect, useState } from 'react';
import { Gift, Menu, Wallet, X } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { cn } from '../../lib/utils';

const NAV = [
  { href: '#surveys', label: 'الاستبيانات' },
  { href: '#how', label: 'كيف تعمل' },
  { href: '#gifts', label: 'الهدايا' },
  { href: '#faq', label: 'أسئلة شائعة' },
];

interface HeaderProps {
  giftsAvailable: number;
  onOpenWallet: () => void;
  onStart: () => void;
}

export function Header({ giftsAvailable, onOpenWallet, onStart }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-500',
        scrolled
          ? 'border-b border-line/80 bg-bg/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex h-[70px] items-center justify-between gap-3">
        <a href="#top" className="group flex items-center gap-2.5" aria-label={siteConfig.brandName}>
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-brand shadow-glow-sm">
            <span className="font-display text-[17px] font-extrabold text-[#141218]">ر</span>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[16px] font-extrabold text-white">
              {siteConfig.brandName}
            </span>
            <span className="block text-[10.5px] text-muted">{siteConfig.tagline}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenWallet}
            className="flex items-center gap-2 rounded-full border border-line bg-surface/70 py-2 pe-3.5 ps-2 text-[12.5px] font-bold text-white transition hover:border-primary/50 hover:bg-surface"
            aria-label={`هداياي، ${giftsAvailable} هدية جاهزة`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
              <Wallet className="h-3.5 w-3.5" />
            </span>
            <span>{giftsAvailable > 0 ? `${giftsAvailable} هدية` : 'هداياي'}</span>
          </button>

          <button type="button" onClick={onStart} className="btn-primary hidden h-10 px-4 text-[13px] sm:flex">
            <Gift className="h-4 w-4" />
            ابدأ الآن
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-white lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-line bg-bg/97 backdrop-blur-xl lg:hidden">
          <nav className="container-page grid gap-1 py-3" aria-label="تنقل الجوال">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-muted transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
