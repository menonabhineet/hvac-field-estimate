'use client';

import { useMemo } from 'react';
import { Wrench, Clock, Check, Plus, Minus } from 'lucide-react';
import { LaborRate } from '@/types';
import { useEstimateStore } from '@/store/useEstimateStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';

import laborData from '@/data/labor_rates.json';

const allLabor = laborData as LaborRate[];

export function Step3Labor() {
  const { laborList, addLabor, removeLabor } = useEstimateStore();

  const groupedLabor = useMemo(() => {
    const map = new Map<string, LaborRate[]>();
    allLabor.forEach(rate => {
      if (!map.has(rate.jobType)) map.set(rate.jobType, []);
      map.get(rate.jobType)!.push(rate);
    });
    return Array.from(map.entries());
  }, []);

  const getSelectedLabor = (jobType: string, level: string) => {
    return laborList.find(l => l.rate.jobType === jobType && l.rate.level === level);
  };

  const handleAdjustHours = (rate: LaborRate, delta: number) => {
    const existing = getSelectedLabor(rate.jobType, rate.level);
    const currentHours = existing ? existing.hours : rate.estimatedHours.min;
    
    // If not selected yet and adding, start at min
    if (!existing && delta > 0) {
      addLabor({ rate, hours: rate.estimatedHours.min });
      return;
    }
    
    // If selected, adjust
    if (existing) {
      const newHours = Math.max(0.5, currentHours + delta); // allow 0.5 increments minimum
      
      // If we go below 0.5, maybe we just want to remove it, but let's just let the user hit "Remove" button
      // So minimum is 0.5
      addLabor({ rate, hours: newHours });
    }
  };

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
          Labor & Services
        </h2>
        <p className="text-slate-500">
          Estimate the time required for the job.
        </p>
      </div>

      <div className="space-y-8">
        {groupedLabor.map(([jobType, rates]) => (
          <div key={jobType} className="space-y-3">
            <h3 className="text-lg font-bold capitalize text-slate-800 flex items-center">
              <Wrench className="mr-2 h-5 w-5 text-slate-400" />
              {jobType}
            </h3>
            
            <div className="space-y-3">
              {rates.map(rate => {
                const selected = getSelectedLabor(rate.jobType, rate.level);
                const isSelected = !!selected;
                
                return (
                  <Card 
                    key={rate.level}
                    className={`transition-all duration-200 ${
                      isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'hover:border-slate-300'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-slate-900 capitalize flex items-center">
                            {rate.level}
                            {isSelected && <Check className="ml-2 h-4 w-4 text-blue-600" />}
                          </h4>
                          <div className="text-sm font-medium text-slate-600">
                            {formatCurrency(rate.hourlyRate)} <span className="font-normal text-slate-400">/ hr</span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Est. {rate.estimatedHours.min}-{rate.estimatedHours.max} hrs
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-3 bg-slate-100 rounded-full p-1">
                              <button 
                                onClick={() => handleAdjustHours(rate, -0.5)}
                                className="p-1 rounded-full bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-bold text-sm w-8 text-center tabular-nums text-slate-800">
                                {selected.hours}h
                              </span>
                              <button 
                                onClick={() => handleAdjustHours(rate, 0.5)}
                                className="p-1 rounded-full bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeLabor(rate.jobType, rate.level)}
                              className="text-xs font-semibold text-red-500 hover:text-red-600 pr-2"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => addLabor({ rate, hours: rate.estimatedHours.min })}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-4 -mb-4 px-4 pb-4">
                          <span className="text-sm text-slate-500">Labor Subtotal</span>
                          <span className="font-bold text-blue-700">
                            {formatCurrency(rate.hourlyRate * selected.hours)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
