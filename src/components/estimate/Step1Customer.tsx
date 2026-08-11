'use client';

import { useState, useMemo } from 'react';
import { Search, User, MapPin, Building, Home, CheckCircle2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { Customer } from '@/types';
import { useEstimateStore } from '@/store/useEstimateStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

import customersData from '@/data/customers.json';

const customers = customersData as unknown as Customer[];
const fuse = new Fuse(customers, {
  keys: ['name', 'address'],
  threshold: 0.4, // Lower threshold means more strict matching
});

export function Step1Customer() {
  const [searchQuery, setSearchQuery] = useState('');
  const { customer: selectedCustomer, setCustomer } = useEstimateStore();

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery]);

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Select Customer
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Search for a customer to start the estimate.
        </p>
      </div>

      <Input
        type="text"
        placeholder="Search by name or address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="h-5 w-5" />}
      />

      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
            No customers found.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const isSelected = selectedCustomer?.id === cust.id;
            const propType = cust.propertyType || cust.property_type;

            return (
              <Card
                key={cust.id}
                className={`cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'border-blue-500 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-500 dark:ring-blue-500/50'
                    : 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
                onClick={() => isSelected ? setCustomer(null) : setCustomer(cust)}
              >
                <CardContent className="flex items-start p-5">
                  <div className="mr-4 mt-1 rounded-full bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500 dark:text-slate-400">
                    {propType === 'commercial' ? (
                      <Building className="h-5 w-5" />
                    ) : (
                      <Home className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{cust.name}</h3>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="flex items-start text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="mr-1 mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-2 leading-snug">{cust.address}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="neutral" className="capitalize">
                        {propType}
                      </Badge>
                      <Badge variant="default" className="capitalize">
                        {cust.systemType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
