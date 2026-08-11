import { useEstimateStore } from '@/store/useEstimateStore';
import { formatCurrency } from '@/lib/format';

export function LiveTotalBanner() {
  const { equipmentList, laborList, discount, misc } = useEstimateStore();

  const equipmentTotal = equipmentList.reduce(
    (total, item) => total + (item.baseCost || item.base_cost || 0),
    0
  );

  const laborTotal = laborList.reduce(
    (total, item) => total + item.rate.hourlyRate * item.hours,
    0
  );

  const maxDiscount = equipmentTotal + laborTotal + (misc || 0);
  const effectiveDiscount = Math.min((discount || 0), maxDiscount);

  const subtotal = maxDiscount - effectiveDiscount;
  const total = subtotal + (subtotal * 0.07);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 px-4 py-3 backdrop-blur-md">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Estimated Total
        </span>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-500 leading-none mt-0.5">
          {formatCurrency(total)}
        </span>
      </div>
      <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
        <p>Eq: {formatCurrency(equipmentTotal)}</p>
        <p>Lab: {formatCurrency(laborTotal)}</p>
      </div>
    </div>
  );
}
