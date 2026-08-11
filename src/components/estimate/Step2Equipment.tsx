'use client';

import { useState, useMemo, useRef } from 'react';
import { Search, Plus, Minus, Package, Star, ScanLine, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useZxing } from 'react-zxing';
import { toast } from 'sonner';
import { Equipment } from '@/types';
import { useEstimateStore } from '@/store/useEstimateStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';

import equipmentData from '@/data/equipment.json';

const allEquipment = equipmentData as Equipment[];

// Define some favorites for quick add
const FAVORITE_IDS = ['EQ018', 'EQ019', 'EQ016', 'EQ023'];
const favoriteEquipment = allEquipment.filter(eq => FAVORITE_IDS.includes(eq.id));

function BarcodeScannerModal({ onClose, onResult }: { onClose: () => void, onResult: (text: string) => void }) {
  const { ref } = useZxing({
    onDecodeResult(result: any) {
      onResult(result.getText());
    },
    onError(error: any) {
      if (error?.name === 'NotAllowedError') {
        alert('Camera access denied. Please enable camera permissions in your browser to use the scanner.');
        onClose();
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-black shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <Button variant="secondary" size="icon" className="rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-4 left-4 z-10 text-white font-semibold">
          Scan Barcode
        </div>
        <video ref={ref} className="w-full h-[400px] object-cover" />
        <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
           <div className="w-full h-full border-2 border-green-500 rounded-lg"></div>
        </div>
      </div>
      <p className="text-slate-400 mt-6 text-sm">Align barcode within the frame to scan.</p>
    </div>
  );
}

export function Step2Equipment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  const { equipmentList, addEquipment, removeEquipment } = useEstimateStore();

  const categories = useMemo(() => {
    const cats = new Set(allEquipment.map(e => e.category));
    return Array.from(cats).sort();
  }, []);

  const filteredEquipment = useMemo(() => {
    let result = allEquipment;
    if (selectedCategory) {
      result = result.filter(e => e.category === selectedCategory);
    }
    if (searchQuery) {
      const fuse = new Fuse(result, {
        keys: ['name', 'brand', 'modelNumber', 'id'],
        threshold: 0.3,
      });
      result = fuse.search(searchQuery).map(res => res.item);
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const isSelected = (id: string) => equipmentList.some(e => e.id === id);

  const handleScanResult = (text: string) => {
    // In a real app, you might look up the exact UPC or model number.
    // Here we'll just drop the text into the search bar and close the scanner.
    setSearchQuery(text);
    setIsScannerOpen(false);
  };

  const handleAddEquipment = (eq: Equipment) => {
    addEquipment(eq);
    toast.success(`Added ${eq.name}`);
  };

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Equipment & Parts
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Add necessary systems, parts, and materials.
        </p>
      </div>

      {/* Quick Add Favorites Row */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
          <Star className="mr-1.5 h-4 w-4 text-amber-400 fill-amber-400" /> Quick Add
        </h3>
        <div className="-mx-4 flex overflow-x-auto px-4 pb-4 scrollbar-hide space-x-3">
          {favoriteEquipment.map(eq => {
            const selected = isSelected(eq.id);
            return (
              <div 
                key={eq.id}
                onClick={() => selected ? removeEquipment(eq.id) : handleAddEquipment(eq)}
                className={`flex-shrink-0 w-40 cursor-pointer rounded-xl border p-3 transition-all active:scale-[0.97] ${
                  selected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight h-8">
                  {eq.name}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {formatCurrency(eq.baseCost || eq.base_cost || 0)}
                  </span>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${selected ? 'bg-red-500 dark:bg-red-600' : 'bg-blue-600 dark:bg-blue-700'}`}>
                    {selected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search equipment, brand or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-14 w-14 shrink-0 border-slate-200 text-slate-600"
          onClick={() => setIsScannerOpen(true)}
          title="Scan Barcode"
        >
          <ScanLine className="h-6 w-6" />
        </Button>
      </div>

      {isScannerOpen && (
        <BarcodeScannerModal 
          onClose={() => setIsScannerOpen(false)} 
          onResult={handleScanResult} 
        />
      )}

      <div className="-mx-4 flex overflow-x-auto px-4 pb-2 scrollbar-hide">
        <div className="flex space-x-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'neutral'}
            className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'neutral'}
              className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm capitalize"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredEquipment.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No equipment found.
          </div>
        ) : (
          <AnimatePresence>
            {filteredEquipment.map((eq) => {
              const selected = isSelected(eq.id);
              const cost = eq.baseCost || eq.base_cost || 0;

              return (
                <motion.div
                  key={eq.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`transition-all duration-200 ${
                      selected ? 'border-blue-500 dark:border-blue-500/50 ring-1 ring-blue-500 dark:ring-blue-500/50 shadow-md bg-blue-50/10' : 'hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <CardContent className="flex items-center p-4">
                      <div className="mr-4 rounded-full bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500 dark:text-slate-400 shrink-0">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                          {eq.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium">{eq.brand}</span>
                          <span>•</span>
                          <span className="truncate font-mono">{eq.modelNumber}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                          {formatCurrency(cost)}
                        </div>
                      </div>
                      <div className="ml-4 shrink-0">
                        {selected ? (
                          <Button
                            size="icon"
                            variant="danger"
                            onClick={() => removeEquipment(eq.id)}
                            className="h-10 w-10 rounded-full"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="primary"
                            onClick={() => handleAddEquipment(eq)}
                            className="h-10 w-10 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
