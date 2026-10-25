import { useState } from 'react';
import { ClipboardList, Gift, Package, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { SURVEY_MAP } from '../../data/surveys';
import { useApp } from '../../store/AppContext';
import { cn, formatDate } from '../../lib/utils';
import { Sheet } from '../ui/Sheet';

type Tab = 'orders' | 'history';

interface WalletSheetProps {
  open: boolean;
  onClose: () => void;
  onBrowseSurveys: () => void;
}

export function WalletSheet({ open, onClose, onBrowseSurveys }: WalletSheetProps) {
  const { orders, completed, giftsAvailable, resetAll } = useApp();
  const [tab, setTab] = useState<Tab>('orders');
  const [confirming, setConfirming] = useState(false);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="هداياي وطلباتي"
      subtitle="البيانات محفوظة على جهازك فقط"
      size="lg"
      footer={
        completed.length > 0 || orders.length > 0 ? (
          <div className="flex items-center justify-between gap-3 pb-1">
            <button
              type="button"
              onClick={() => setConfirming((v) => !v)}
              className="inline-flex items-center gap-1.5 text-[12px] text-muted transition hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {confirming ? 'اضغط مرة أخرى للتأكيد' : 'حذف بياناتي'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirming) {
                  resetAll();
                  setConfirming(false);
                  onClose();
                } else {
                  onBrowseSurveys();
                }
              }}
              className={cn('h-10 px-4 text-[12.5px]', confirming ? 'btn-ghost text-danger' : 'btn-primary')}
            >
              {confirming ? 'تأكيد الحذف' : 'إكمال استبيان'}
            </button>
          </div>
        ) : null
      }
    >
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: 'استبيانات مكتملة', value: completed.length, icon: ClipboardList, tone: 'text-primary' },
          { label: 'هدايا متاحة', value: giftsAvailable, icon: Gift, tone: 'text-success' },
          { label: 'طلبات مشحونة', value: orders.length, icon: Truck, tone: 'text-secondary' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-surface/50 p-3 text-center">
            <stat.icon className={cn('mx-auto h-4 w-4', stat.tone)} />
            <p className="mt-1.5 font-display text-[16px] font-extrabold leading-none text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-1 rounded-2xl border border-line bg-deep/60 p-1">
        {[
          { id: 'orders' as Tab, label: `طلباتي (${orders.length})` },
          { id: 'history' as Tab, label: `الاستبيانات (${completed.length})` },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-[12.5px] font-bold transition',
              tab === item.id ? 'bg-surface text-white shadow-inset' : 'text-muted hover:text-white',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'orders' ? (
        <div className="mt-3.5 space-y-2.5">
          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="لا توجد طلبات بعد"
              desc="أكمل أي استبيان واختر هديتك، ثم أدخل عنوان الشحن."
              action="ابدأ استبياناً"
              onAction={onBrowseSurveys}
            />
          ) : (
            orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-line bg-surface/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                      <Package className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-white">{order.prizeName}</p>
                      <p className="text-[10.5px] text-muted">
                        {formatDate(order.createdAt)} · {order.id}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-line/80 bg-deep/60 px-3 py-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Truck className="h-3 w-3" /> {order.tracking}
                  </span>
                  <span className="font-bold text-success">شحن مجاني</span>
                </div>

                <p className="mt-2 truncate text-[10.5px] text-white/35">
                  {order.address.governorate}، {order.address.city} — {order.address.detail}
                </p>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="mt-3.5 space-y-2">
          {completed.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="لا توجد استبيانات مكتملة"
              desc="كل استبيان يستغرق 4 إلى 6 دقائق ويمنحك هدية واحدة."
              action="اختر استبياناً"
              onAction={onBrowseSurveys}
            />
          ) : (
            completed.map((record) => (
              <div
                key={`${record.surveyId}-${record.at}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-bold text-white">
                    {SURVEY_MAP[record.surveyId]?.product ?? record.product}
                  </p>
                  <p className="text-[10.5px] text-muted">
                    {formatDate(record.at)} · {Object.keys(record.answers).length} إجابة
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-bold text-success">
                  مكتمل
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </Sheet>
  );
}

function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
  onAction,
}: {
  icon: typeof Gift;
  title: string;
  desc: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/25 py-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-white/40">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-[13px] font-bold text-white">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-[11.5px] leading-relaxed text-muted">{desc}</p>
      <button type="button" onClick={onAction} className="btn-primary mt-4 h-10 px-4 text-[12.5px]">
        {action}
      </button>
    </div>
  );
}
