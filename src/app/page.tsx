'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEstimateStore } from '@/store/useEstimateStore';
import { Button } from '@/components/ui/Button';

import { Step1Customer } from '@/components/estimate/Step1Customer';
import { Step2Equipment } from '@/components/estimate/Step2Equipment';
import { Step3Labor } from '@/components/estimate/Step3Labor';
import { Step4Summary } from '@/components/estimate/Step4Summary';
import { LiveTotalBanner } from '@/components/estimate/LiveTotalBanner';
import { Stepper } from '@/components/estimate/Stepper';

const TOTAL_STEPS = 4;

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const { customer, equipmentList, laborList } = useEstimateStore();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (isDesktop && currentStep === 3) {
      if (equipmentList.length === 0 && laborList.length === 0) {
         alert('Please add at least one equipment or labor item before generating an invoice.');
         return;
      }
      window.print();
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!customer;
    // Step 2 can be skipped (e.g. labor only job)
    // But on Step 3, before finalizing, they must have at least one item
    if (currentStep === 3) return equipmentList.length > 0 || laborList.length > 0;
    return true;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState([1, 0]);

  useEffect(() => {
    setPage([currentStep, currentStep > page ? 1 : -1]);
  }, [currentStep]);

  // Edge case: if on mobile step 4, and user resizes to desktop, move back to step 3
  useEffect(() => {
    if (isDesktop && currentStep === 4) {
      setCurrentStep(3);
    }
  }, [isDesktop, currentStep]);

  return (
    <>
      <main className="md:grid md:h-screen md:grid-cols-[1fr_minmax(280px,320px)] lg:grid-cols-[1fr_minmax(350px,450px)] md:overflow-hidden bg-slate-50 print:hidden">
        
        {/* LEFT PANE: Interactive Steps */}
        <div className="relative flex flex-col md:h-screen md:overflow-y-auto bg-white shadow-xl z-10">
          <div className="sticky top-0 z-40 bg-white/95 pb-2 pt-6 backdrop-blur-md border-b border-slate-100">
            <Stepper currentStep={currentStep} totalSteps={isDesktop ? 3 : TOTAL_STEPS} />
          </div>

          <div className="flex-1 px-4 md:px-8 py-6 pb-32 overflow-x-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full"
              >
                {currentStep === 1 && <Step1Customer />}
                {currentStep === 2 && <Step2Equipment />}
                {currentStep === 3 && <Step3Labor />}
                {currentStep === 4 && !isDesktop && <Step4Summary onEditStep={setCurrentStep} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Bar (Mobile Bottom / Desktop Bottom-Left) */}
          {(!isDesktop || currentStep <= 3) && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] md:absolute md:shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] border-t border-slate-100 flex flex-col">
              {!isDesktop && currentStep < 4 && <LiveTotalBanner />}
              
              <div className="flex items-center gap-3 p-4 bg-white">
                {currentStep > 1 && (
                  <Button variant="outline" className="flex-1" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                {((isDesktop && currentStep <= 3) || (!isDesktop && currentStep < TOTAL_STEPS)) && (
                  <Button 
                    className="flex-1" 
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    {isDesktop && currentStep === 3 ? 'Generate Invoice' : 'Continue'} 
                    {!(isDesktop && currentStep === 3) && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Sticky Summary (Tablet/Desktop Only) */}
        <div className="hidden md:flex md:flex-col md:h-screen md:overflow-y-auto bg-slate-50 border-l border-slate-200">
          <div className="p-6">
            <Step4Summary onEditStep={setCurrentStep} />
          </div>
        </div>
      </main>

      {/* PRINT LAYOUT: Only visible during window.print() */}
      <div className="hidden print:block bg-white text-black p-8 max-w-4xl mx-auto">
        <div className="mb-8 border-b-2 border-slate-900 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">INVOICE</h1>
            <p className="text-slate-500 mt-1">Official Estimate</p>
          </div>
          <div className="text-right text-slate-600 text-sm">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Est ID:</strong> #EST-{Math.floor(1000 + Math.random() * 9000)}</p>
          </div>
        </div>
        <Step4Summary onEditStep={setCurrentStep} isPrintMode={true} />
      </div>
    </>
  );
}
