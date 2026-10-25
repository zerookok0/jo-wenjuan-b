import { MapPin, Quote, Star, Truck } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const REVIEWS = [
  {
    name: 'أحمد العبداللات',
    city: 'عمّان · الجبيهة',
    text: 'أكملت استبيان الباور بانك بصراحة، وصلتني الهدية خلال يومين وما حد طلب مني أي دفع.',
    gift: 'باور بانك',
    stars: 5,
  },
  {
    name: 'لينا أبو زيد',
    city: 'إربد · الحصن',
    text: 'الأسئلة عن المنتجات اللي نستعملها فعلاً، مش أسئلة عشوائية. أخذت فرشاة أسنان كهربائية.',
    gift: 'فرشاة أسنان كهربائية',
    stars: 5,
  },
  {
    name: 'محمد الزعبي',
    city: 'الزرقاء · الرصيفة',
    text: 'أهم شي عندي إنهم ما طلبوا بطاقة بنكية. بس عنوان الشحن، وخلص الموضوع.',
    gift: 'شاحن سريع',
    stars: 5,
  },
  {
    name: 'رهام القضاة',
    city: 'العقبة · المدينة',
    text: 'عملت ثلاث استبيانات وطلبت هدية وحدة. رقم التتبع ظهر مباشرة على الصفحة.',
    gift: 'كوب حفظ حرارة',
    stars: 4,
  },
  {
    name: 'خالد بني هاني',
    city: 'جرش · سوف',
    text: 'التوصيل تأخر يوم عن المتوقع لكن وصلني نفس المنتج بدون أي مشكلة.',
    gift: 'مروحة مكتب',
    stars: 4,
  },
  {
    name: 'سمر الرواشدة',
    city: 'الكرك · الثنية',
    text: 'حبيت إنه في استبيانات عن منتجات بنستعملها بالبيت، مش بس إلكترونيات.',
    gift: 'مكبر صوت',
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="chip border-success/30 text-success">
              <Star className="h-3.5 w-3.5" /> من المشاركين
            </span>
            <h2 className="mt-4 max-w-xl font-display text-[28px] font-extrabold leading-snug text-white sm:text-[34px]">
              تجارب من محافظات المملكة
            </h2>
            <p className="mt-3 max-w-lg text-[14px] leading-[1.9] text-muted">
              آراء مشاركين من عمّان وإربد والزرقاء والعقبة ومحافظات أخرى.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface/40 px-4 py-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
              ))}
            </div>
            <div className="text-[12px] text-muted">
              <span className="font-bold text-white">4.6</span> من 5
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 55}>
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-surface/45 p-5 transition hover:border-white/20 hover:bg-surface/70">
                <Quote className="h-5 w-5 text-primary/60" />
                <blockquote className="mt-3 flex-1 text-[13px] leading-[1.95] text-white/80">
                  {review.text}
                </blockquote>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={
                        s < review.stars ? 'h-3 w-3 fill-warning text-warning' : 'h-3 w-3 text-white/15'
                      }
                    />
                  ))}
                </div>
                <figcaption className="mt-3 border-t border-line/70 pt-3">
                  <p className="text-[12.5px] font-bold text-white">{review.name}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] text-muted">
                    <MapPin className="h-2.5 w-2.5" /> {review.city}
                  </p>
                  <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold text-primary">
                    <Truck className="h-2.5 w-2.5" /> {review.gift}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
