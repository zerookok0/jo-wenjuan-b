import { CalendarDays, Mail, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { TOPICS } from '../../data/topics';
import { totalSurveys } from '../../data/surveys';

export function Footer() {
  const today = new Date().toLocaleDateString('ar-JO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <footer className="relative overflow-hidden border-t border-line/80 pb-10 pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"
      />
      <div className="container-page relative">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-[15px] font-extrabold text-[#141218]">
                ر
              </span>
              <span className="font-display text-[16px] font-extrabold text-white">
                {siteConfig.brandName}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-[1.95] text-muted">
              منصة استبيانات أردنية عن المنتجات والخدمات المحلية. {totalSurveys} استبياناً مرتبطاً
              بمنتجات حقيقية، ومقابل كل استبيان مكتمل هدية تُشحن إلى عنوانك.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> بدون أي رسوم
              </span>
              <span className="chip">
                <Truck className="h-3.5 w-3.5 text-secondary" /> توصيل داخل الأردن
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-white/70">القطاعات</h3>
            <ul className="mt-4 space-y-2.5">
              {TOPICS.map((topic) => (
                <li key={topic.id}>
                  <a
                    href="#surveys"
                    className="text-[13.5px] text-muted transition hover:text-white"
                  >
                    {topic.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-white/70">معلومات مهمة</h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-muted">
              <li>لا نطلب بطاقة بنكية أو عنوان فوترة</li>
              <li>الهدية تُمنح لكل استبيان مكتمل</li>
              <li>التوصيل {siteConfig.deliveryDays}</li>
              <li>العنوان يُستخدم للشحن فقط</li>
              <li className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {siteConfig.supportEmail}
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline my-9" />

        <div className="flex flex-col gap-3 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" /> {today} · جميع الحقوق محفوظة {siteConfig.brandName}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> عمّان، المملكة الأردنية الهاشمية
          </p>
        </div>
      </div>
    </footer>
  );
}
