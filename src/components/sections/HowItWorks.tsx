import {
  BadgeCheck,
  Ban,
  Check,
  ClipboardList,
  CreditCard,
  Gift,
  Lock,
  MapPin,
  Smartphone,
  Truck,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Reveal } from '../ui/Reveal';

const STEPS = [
  {
    title: 'اختر استبياناً',
    desc: 'كل استبيان مرتبط بمنتج واحد. اختر المنتج الذي تعرفه أو تستخدمه فعلاً.',
    icon: ClipboardList,
    accent: '#9E7FFF',
  },
  {
    title: 'أجب بصراحة',
    desc: '4 إلى 6 دقائق فقط. لا توجد إجابات صحيحة أو خاطئة، رأيك هو المهم.',
    icon: Check,
    accent: '#38bdf8',
  },
  {
    title: 'اختر هديتك',
    desc: 'بعد إكمال الاستبيان تظهر لك الهدايا المتاحة، تختار واحدة منها.',
    icon: Gift,
    accent: '#f472b6',
  },
  {
    title: 'أدخل العنوان واستلم',
    desc: `اسم المستلم، رقم الهاتف، والعنوان. التوصيل ${siteConfig.deliveryDays} داخل الأردن.`,
    icon: Truck,
    accent: '#10b981',
  },
];

const NOT_NEEDED = ['بطاقة بنكية', 'رقم CVV', 'تاريخ الانتهاء', 'عنوان فوترة', 'أي مبلغ أو تأمين', 'كلمة سر البنك'];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="text-center">
          <span className="chip border-secondary/30 text-secondary">
            <Smartphone className="h-3.5 w-3.5" /> كيف تعمل
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-[28px] font-extrabold leading-snug text-white sm:text-[36px]">
            أربع خطوات،
            <span className="text-brand"> ولا خطوة واحدة تدفع فيها</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-[1.9] text-muted">
            لا توجد رسوم ولا اشتراك ولا رسوم توصيل. العملية كلها: استبيان، ثم عنوان، ثم هدية.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface/80">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-2 font-display text-[54px] font-extrabold leading-none text-white/[0.045]"
                >
                  {i + 1}
                </span>
                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl border"
                  style={{
                    borderColor: `${step.accent}33`,
                    background: `${step.accent}14`,
                    color: step.accent,
                  }}
                >
                  <step.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.85] text-muted">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-12">
          <div className="relative overflow-hidden rounded-[32px] border border-line bg-gradient-to-bl from-surface/90 via-deep to-[#1a1522] p-6 sm:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[90px]"
            />
            <div className="relative grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <span className="chip border-success/30 text-success">
                  <Lock className="h-3.5 w-3.5" /> الوعد الأساسي
                </span>
                <h3 className="mt-4 font-display text-[26px] font-extrabold leading-snug text-white sm:text-[32px]">
                  لا نطلب عنوان فوترة،
                  <br />
                  فقط عنوان الشحن
                </h3>
                <p className="mt-4 max-w-lg text-[14px] leading-[1.95] text-white/65">
                  كثير من إعلانات «الهدية المجانية» تنتهي بطلب بطاقة بنكية. نحن لا نفعل ذلك:
                  الموقع بالكامل لا يحتوي على أي بوابة دفع، والمعلومة الوحيدة التي تحتاجها هي اسمك
                  ورقم هاتفك وعنوان الشحن.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Ban, title: 'صفر رسوم', desc: 'لا رسوم توصيل ولا تأمين.' },
                    { icon: CreditCard, title: 'لا بطاقة بنكية', desc: 'لا حقول دفع في أي صفحة.' },
                    { icon: Lock, title: 'العنوان للشحن فقط', desc: 'لا نشارك بياناتك مع طرف ثالث.' },
                    { icon: BadgeCheck, title: 'بيانات حقيقية', desc: 'نجمع رأي المستهلك الأردني فعلاً.' },
                  ].map((g) => (
                    <div
                      key={g.title}
                      className="flex items-start gap-3 rounded-2xl border border-line/80 bg-white/[0.03] p-3.5"
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success/12 text-success">
                        <g.icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-white">{g.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{g.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-deep/80 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-white/50">ما تحتاجه فعلاً</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    <BadgeCheck className="h-2.5 w-2.5" /> بسيط
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {['اسم المستلم', 'رقم الهاتف', 'المحافظة والمدينة والعنوان'].map((row) => (
                    <div
                      key={row}
                      className="flex items-center justify-between rounded-xl border border-success/20 bg-success/[0.06] px-3 py-2.5"
                    >
                      <span className="text-[12.5px] text-white/85">{row}</span>
                      <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-[10px] text-white/30">لا نحتاج أي مما يلي</span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {NOT_NEEDED.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/35 line-through decoration-danger/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/[0.08] px-3 py-2.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <p className="text-[11.5px] leading-relaxed text-white/75">
                    التوصيل داخل الأردن فقط، خلال {siteConfig.deliveryDays}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
