'use client';

import { FileText, Download, Edit2, RefreshCcw } from 'lucide-react';
import { useEstimateStore } from '@/store/useEstimateStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';

export function Step4Summary({ onEditStep, isPrintMode = false }: { onEditStep: (step: number) => void, isPrintMode?: boolean }) {
  const { customer, equipmentList, laborList, discount, misc, setDiscount, setMisc, reset } = useEstimateStore();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear the current estimate and start a new one?")) {
      reset();
      onEditStep(1);
    }
  };

  const equipmentTotal = equipmentList.reduce(
    (total, item) => total + (item.baseCost || item.base_cost || 0),
    0
  );

  const laborTotal = laborList.reduce(
    (total, item) => total + item.rate.hourlyRate * item.hours,
    0
  );

  const subtotal = equipmentTotal + laborTotal + misc - discount;
  const taxRate = 0.07; // 7% tax for example
  const tax = subtotal * taxRate;
  const finalTotal = subtotal + tax;

  const handleExport = () => {
    if (equipmentList.length === 0 && laborList.length === 0) return;
    window.print();
  };

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No customer selected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Review Estimate
          </h2>
          <p className="text-slate-500">Final review before showing the customer.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-slate-500 hover:text-red-600 border-slate-200">
            <RefreshCcw className="mr-2 h-4 w-4" />
            New Estimate
          </Button>
          <FileText className="h-8 w-8 text-blue-500 opacity-20 hidden md:block" />
        </div>
      </div>

      {/* Customer Info */}
      <Card className="print:shadow-none print:border-slate-300">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-slate-500 uppercase tracking-wider font-semibold print:text-slate-900">Bill To</CardTitle>
          {!isPrintMode && (
            <button onClick={() => onEditStep(1)} className="text-slate-400 hover:text-blue-600 transition-colors print:hidden">
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg text-slate-900">{customer.name}</h3>
          <p className="text-slate-600 mt-1">{customer.address}</p>
          {customer.phone && <p className="text-slate-600">{customer.phone}</p>}
        </CardContent>
      </Card>

      {/* Equipment List */}
      <Card className="print:shadow-none print:border-slate-300">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-slate-500 uppercase tracking-wider font-semibold print:text-slate-900">Equipment & Parts</CardTitle>
          {!isPrintMode && (
            <button onClick={() => onEditStep(2)} className="text-slate-400 hover:text-blue-600 transition-colors print:hidden">
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {equipmentList.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No equipment added.</p>
          ) : (
            equipmentList.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="pr-4 text-slate-700">
                  <span className="font-medium text-slate-900">{item.name}</span>
                  <div className="text-xs text-slate-500">Model: {item.modelNumber}</div>
                </div>
                <div className="font-medium whitespace-nowrap text-slate-900">
                  {formatCurrency(item.baseCost || item.base_cost || 0)}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Labor List */}
      <Card className="print:shadow-none print:border-slate-300">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-slate-500 uppercase tracking-wider font-semibold print:text-slate-900">Labor</CardTitle>
          {!isPrintMode && (
            <button onClick={() => onEditStep(3)} className="text-slate-400 hover:text-blue-600 transition-colors print:hidden">
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {laborList.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No labor added.</p>
          ) : (
            laborList.map(item => (
              <div key={`${item.rate.jobType}-${item.rate.level}`} className="flex justify-between items-start text-sm">
                <div className="pr-4 text-slate-700">
                  <span className="font-medium text-slate-900 capitalize">{item.rate.jobType} - {item.rate.level}</span>
                  <div className="text-xs text-slate-500">
                    {item.hours} hrs @ {formatCurrency(item.rate.hourlyRate)}/hr
                  </div>
                </div>
                <div className="font-medium whitespace-nowrap text-slate-900">
                  {formatCurrency(item.rate.hourlyRate * item.hours)}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Adjustments (Discount & Misc) */}
      {!isPrintMode && (
        <Card className="print:hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Adjustments</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Misc Charges ($)</label>
                <Input 
                  type="number" 
                  min="0"
                  value={misc || ''}
                  onChange={(e) => setMisc(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount ($)</label>
                <Input 
                  type="number"
                  min="0"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Totals */}
      <Card className="bg-slate-50 border-slate-200 print:bg-white print:border-slate-300 print:shadow-none">
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between text-sm text-slate-600 print:text-slate-800">
            <span>Subtotal (Eq + Labor)</span>
            <span>{formatCurrency(equipmentTotal + laborTotal)}</span>
          </div>
          {(misc > 0 || isPrintMode) && misc > 0 && (
            <div className="flex justify-between text-sm text-slate-600 print:text-slate-800">
              <span>Misc Charges</span>
              <span>{formatCurrency(misc)}</span>
            </div>
          )}
          {(discount > 0 || isPrintMode) && discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 print:text-green-700 font-medium">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-slate-600 print:text-slate-800">
            <span>Estimated Tax (7%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 print:border-slate-300 flex justify-between items-center">
            <span className="font-bold text-lg text-slate-900">Total Estimate</span>
            <span className="font-bold text-2xl text-blue-600 print:text-slate-900">{formatCurrency(finalTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {!isPrintMode && (
        <Button 
          className="w-full h-14 text-lg shadow-lg print:hidden" 
          size="lg" 
          onClick={handleExport}
          disabled={equipmentList.length === 0 && laborList.length === 0}
        >
          <Download className="mr-2 h-5 w-5" />
          Generate & Save Invoice
        </Button>
      )}
    </div>
  );
}
