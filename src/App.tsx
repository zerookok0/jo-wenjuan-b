import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Database, ShieldCheck, Truck, UserCheck } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { SurveysSection } from './components/sections/SurveysSection';
import { HowItWorks } from './components/sections/HowItWorks';
import { GiftsSection } from './components/sections/GiftsSection';
import { Testimonials } from './components/sections/Testimonials';
import { Faq } from './components/sections/Faq';
import { CtaSection } from './components/sections/CtaSection';
import { QuizRunner } from './components/survey/QuizRunner';
import { RewardScreen } from './components/survey/RewardScreen';
import { ClaimFlow } from './components/claim/ClaimFlow';
import { AddressPage } from './components/claim/AddressPage';
import { isAddressRoute, isAdminRoute, clearAdminRoute } from './lib/route';
import { WalletSheet } from './components/wallet/WalletSheet';
import { AdminPanel } from './components/admin/AdminPanel';
import { AppProvider, useApp } from './store/AppContext';
import { SURVEY_MAP, totalSurveys } from './data/surveys';
import { PRIZES } from './data/prizes';
import { buildSurveyQuestions } from './data/quizBuilder';
import { useConfig } from './config/useConfig';
import type { Answers, PrizeProduct, Question } from './data/types';
import { Reveal } from './components/ui/Reveal';

type View = 'home' | 'quiz' | 'reward' | 'claim' | 'address';

function Site() {
  const app = useApp();
  const config = useConfig();
  const [view, setView] = useState<View>(() => (isAddressRoute() ? 'address' : 'home'));
  const [activeSurveyId, setActiveSurveyId] = useState<string | null>(null);
  /* أسئلة الجلسة الحالية: تُولَّد عشوائياً (15–20 سؤالاً) عند كل بدء */
  const [activeQuestions, setActiveQuestions] = useState<Question[] | null>(null);
  const [claimPrize, setClaimPrize] = useState<PrizeProduct | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const activeSurvey = activeSurveyId ? SURVEY_MAP[activeSurveyId] : null;
  const prizes = useMemo(() => PRIZES, []);

  const TRUST = [
    { icon: ShieldCheck, label: 'بدون أي رسوم', sub: 'ولا رسوم توصيل' },
    { icon: Truck, label: 'توصيل داخل الأردن', sub: config.deliveryDays },
    { icon: Database, label: 'بيانات حقيقية', sub: 'آراء مستهلكين فعليين' },
    { icon: UserCheck, label: 'بدون بطاقة بنكية', sub: 'ولا عنوان فوترة' },
  ];

  useEffect(() => {
    /* لوحة التحكم تُفتح بـ #admin أو Ctrl+Alt+A.
       مهم: عند كتابة #admin في شريط العنوان والمتصفح مفتوح مسبقاً
       لا تُعاد الصفحة، فلا يُطلق هذا الـ effect مرة أخرى.
       لذلك نستمع أيضاً لحدث hashchange و popstate. */
    const openIfAdminRoute = () => {
      if (isAdminRoute()) {
        setAdminOpen(true);
        /* نزيل ?admin أو #admin من الرابط بعد الفتح
           حتى لا تعود اللوحة للظهور عند إعادة التحميل أو التنقل. */
        clearAdminRoute();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen((v) => !v);
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', openIfAdminRoute);
    window.addEventListener('popstate', openIfAdminRoute);

    // فحص أولي عند تحميل الصفحة
    openIfAdminRoute();

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', openIfAdminRoute);
      window.removeEventListener('popstate', openIfAdminRoute);
    };
  }, []);

  // مزامنة التوجيه مع عنوان المتصفح: /dizhi أو #dizhi تفتح صفحة العنوان مباشرة
  useEffect(() => {
    const syncFromPath = () => {
      setView(isAddressRoute() ? 'address' : 'home');
    };
    window.addEventListener('popstate', syncFromPath);
    window.addEventListener('hashchange', syncFromPath);
    return () => {
      window.removeEventListener('popstate', syncFromPath);
      window.removeEventListener('hashchange', syncFromPath);
    };
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const backHome = useCallback(() => {
    setView('home');
    setActiveSurveyId(null);
    setActiveQuestions(null);
    setClaimPrize(null);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
  }, []);

  const jumpToSurveys = useCallback(() => {
    setView('home');
    setWalletOpen(false);
    window.setTimeout(() => scrollTo('surveys'), 40);
  }, [scrollTo]);

  const startSurvey = useCallback((id: string) => {
    const survey = SURVEY_MAP[id];
    if (!survey) return;
    // توليد 15–20 سؤالاً عشوائياً في كل مرة يبدأ فيها المستخدم الاستبيان
    setActiveQuestions(buildSurveyQuestions(survey));
    setActiveSurveyId(id);
    setView('quiz');
  }, []);

  const handleComplete = useCallback(
    (answers: Answers) => {
      if (!activeSurvey) return;
      app.addCompletion(activeSurvey.id, activeSurvey.product, answers);
      setView('reward');
    },
    [activeSurvey, app],
  );

  const openClaim = useCallback((prize: PrizeProduct | null) => {
    setClaimPrize(prize);
    setView('claim');
  }, []);

  // الشاشات المتراكبة تمنع تمرير الخلفية، أما صفحة /dizhi فتمرّر بشكل طبيعي
  const locksBackground = view === 'quiz' || view === 'reward' || view === 'claim';

  useEffect(() => {
    document.body.style.overflow = locksBackground ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [locksBackground]);

  const exitAddressPage = useCallback(() => {
    window.history.pushState({}, '', '/');
    backHome();
  }, [backHome]);

  // مسار /dizhi يعرض صفحة العنوان وحدها بدون بقية الموقع
  if (view === 'address') {
    return <AddressPage onExit={exitAddressPage} />;
  }

  return (
    <div className="relative min-h-screen">
      <a
        href="#surveys"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#141218]"
      >
        انتقل إلى الاستبيانات
      </a>

      <Header
        giftsAvailable={app.giftsAvailable}
        onOpenWallet={() => setWalletOpen(true)}
        onStart={jumpToSurveys}
      />

      <main>
        <Hero onStart={jumpToSurveys} giftsAvailable={app.giftsAvailable} />

        <div className="border-y border-line/70 bg-surface/25">
          <div className="container-page grid grid-cols-2 gap-px py-1 sm:grid-cols-4">
            {TRUST.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 px-1 py-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-primary">
                  <item.icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-bold text-white">{item.label}</p>
                  <p className="truncate text-[10.5px] text-muted">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SurveysSection completedIds={app.completedIds} onStart={startSurvey} />
        <HowItWorks />
        <GiftsSection
          prizes={prizes}
          giftsAvailable={app.giftsAvailable}
          onClaim={() => openClaim(null)}
          onStart={jumpToSurveys}
        />

        {/* وعد البيانات */}
        <section className="py-4">
          <div className="container-page">
            <Reveal>
              <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-bl from-surface/90 to-deep p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[90px]"
                />
                <div className="relative flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <Database className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-bold text-primary">سؤال يهم الجميع</p>
                    <h3 className="mt-1 text-[17px] font-extrabold text-white sm:text-[19px]">
                      {config.promiseQ}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-[13px] leading-[1.95] text-white/70">
                      {config.promiseA}
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-[11.5px] font-bold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> نعم، حقيقية
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <Testimonials />
        <Faq />
        <CtaSection
          giftsAvailable={app.giftsAvailable}
          onStart={jumpToSurveys}
          onOpenWallet={() => setWalletOpen(true)}
        />
      </main>

      <Footer />

      {/* شريط سفلي للجوال */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-bg/90 px-4 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-3 pb-1">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-muted">
              {app.giftsAvailable > 0 ? 'لديك هدية جاهزة' : `${totalSurveys} استبياناً · بدون رسوم`}
            </p>
            <p className="truncate text-[13.5px] font-extrabold text-white">
              {app.giftsAvailable > 0 ? 'اختر هديتك الآن' : 'ابدأ استبياناً قصيراً'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (app.giftsAvailable > 0 ? setWalletOpen(true) : jumpToSurveys())}
            className="btn-primary h-11 shrink-0 px-4 text-[13px]"
          >
            {app.giftsAvailable > 0 ? 'هداياي' : 'ابدأ'}
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="h-20 sm:hidden" aria-hidden="true" />

      {view === 'quiz' && activeSurvey && activeQuestions ? (
        <QuizRunner
          survey={activeSurvey}
          questions={activeQuestions}
          onExit={backHome}
          onComplete={handleComplete}
        />
      ) : null}

      {view === 'reward' && activeSurvey ? (
        <RewardScreen
          survey={activeSurvey}
          prizes={prizes}
          answeredCount={activeQuestions?.length}
          onClaim={(prize) => openClaim(prize)}
          onBackHome={backHome}
        />
      ) : null}

      {view === 'claim' ? (
        <ClaimFlow prizes={prizes} initialPrize={claimPrize} onClose={backHome} />
      ) : null}

      <WalletSheet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        onBrowseSurveys={jumpToSurveys}
      />

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Site />
    </AppProvider>
  );
}
