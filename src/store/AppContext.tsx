import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Address, Answers, CompletedSurvey, Order } from '../data/types';
import { makeOrderId, makeTrackingNo } from '../lib/utils';
import { computeEta } from '../lib/delivery';

const STORAGE_KEY = 'rayak.jo.v1';

interface PersistedState {
  completed: CompletedSurvey[];
  orders: Order[];
  /** أول مرة فُتحت فيها صفحة العنوان — تُحفظ مرة واحدة ولا تتغيّر */
  addressOpenedAt: number | null;
}

interface AppState extends PersistedState {
  completedIds: string[];
  giftsAvailable: number;
  addCompletion: (surveyId: string, product: string, answers: Answers) => void;
  markAddressOpened: () => number;
  createOrder: (prizeId: string, prizeName: string, address: Address) => Order | null;
  /** صفحة /dizhi — تُستخدم عند وصول المستخدم لإدخال عنوانه دون المرور باستبيان */
  submitAddressOrder: (prizeId: string, prizeName: string, address: Address) => Order;
  resetAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

const emptyState: PersistedState = { completed: [], orders: [], addressOpenedAt: null };

const readState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const addressOpenedAt =
      typeof parsed.addressOpenedAt === 'number' && Number.isFinite(parsed.addressOpenedAt)
        ? parsed.addressOpenedAt
        : null;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      addressOpenedAt,
    };
  } catch {
    return emptyState;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => readState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* تجاهل أخطاء التخزين */
    }
  }, [state]);

  const addCompletion = useCallback((surveyId: string, product: string, answers: Answers) => {
    setState((prev) => ({
      ...prev,
      completed: [
        { surveyId, product, at: Date.now(), answers },
        ...prev.completed.filter((c) => c.surveyId !== surveyId),
      ],
    }));
  }, []);

  /**
   * يُسجّل أول فتح لصفحة العنوان (/dizhi) ويعيد الطابع الزمني.
   * الموعد المتوقع للوصول يُحسب دائماً من هذا الوقت: اليوم الثالث بعده.
   */
  const markAddressOpened = useCallback((): number => {
    const existing = readState().addressOpenedAt;
    if (existing) return existing;
    const now = Date.now();
    setState((prev) => (prev.addressOpenedAt ? prev : { ...prev, addressOpenedAt: now }));
    return now;
  }, []);

  const createOrder = useCallback(
    (prizeId: string, prizeName: string, address: Address): Order | null => {
      const available = state.completed.length - state.orders.length;
      if (available <= 0) return null;

      const createdAt = Date.now();
      const addressOpenedAt = state.addressOpenedAt ?? createdAt;

      const order: Order = {
        id: makeOrderId(),
        prizeId,
        prizeName,
        createdAt,
        address,
        status: 'قيد التجهيز',
        tracking: makeTrackingNo(),
        addressOpenedAt,
        eta: computeEta(addressOpenedAt),
      };
      setState((prev) => ({ ...prev, orders: [order, ...prev.orders] }));
      return order;
    },
    [state.completed.length, state.orders.length, state.addressOpenedAt],
  );

  const resetAll = useCallback(() => setState(emptyState), []);

  /**
   * إدخال العنوان من صفحة /dizhi لا يشترط استبياناً مكتملاً في نفس المتصفح،
   * لأن المستخدم قد يفتح الصفحة من رابط التطبيق مباشرة.
   */
  const submitAddressOrder = useCallback(
    (prizeId: string, prizeName: string, address: Address): Order => {
      const addressOpenedAt = state.addressOpenedAt ?? Date.now();
      const order: Order = {
        id: makeOrderId(),
        prizeId,
        prizeName,
        createdAt: Date.now(),
        address,
        status: 'قيد التجهيز',
        tracking: makeTrackingNo(),
        addressOpenedAt,
        eta: computeEta(addressOpenedAt),
      };
      setState((prev) => ({
        ...prev,
        addressOpenedAt: prev.addressOpenedAt ?? addressOpenedAt,
        orders: [order, ...prev.orders],
      }));
      return order;
    },
    [state.addressOpenedAt],
  );

  const value = useMemo<AppState>(
    () => ({
      ...state,
      completedIds: state.completed.map((c) => c.surveyId),
      giftsAvailable: Math.max(0, state.completed.length - state.orders.length),
      addCompletion,
      markAddressOpened,
      createOrder,
      submitAddressOrder,
      resetAll,
    }),
    [state, addCompletion, markAddressOpened, createOrder, submitAddressOrder, resetAll],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
