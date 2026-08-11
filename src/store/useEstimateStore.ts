import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EstimateState, Customer, Equipment, SelectedLabor } from '@/types';

export const useEstimateStore = create<EstimateState>()(
  persist(
    (set) => ({
      customer: null,
      equipmentList: [],
      laborList: [],
      discount: 0,
      misc: 0,
      
      setCustomer: (customer) => set({ customer }),
      
      addEquipment: (equipment) => set((state) => ({
        equipmentList: [...state.equipmentList, equipment]
      })),
      
      removeEquipment: (equipmentId) => set((state) => {
        const index = state.equipmentList.findIndex(eq => eq.id === equipmentId);
        if (index > -1) {
          const newList = [...state.equipmentList];
          newList.splice(index, 1);
          return { equipmentList: newList };
        }
        return state;
      }),
      
      addLabor: (labor) => set((state) => {
        // Check if labor already exists for this jobType and level
        const existingIndex = state.laborList.findIndex(
          l => l.rate.jobType === labor.rate.jobType && l.rate.level === labor.rate.level
        );
        
        if (existingIndex >= 0) {
          // Update hours if exists
          const newList = [...state.laborList];
          newList[existingIndex] = labor;
          return { laborList: newList };
        }
        
        return { laborList: [...state.laborList, labor] };
      }),
      
      removeLabor: (jobType, level) => set((state) => ({
        laborList: state.laborList.filter(
          l => !(l.rate.jobType === jobType && l.rate.level === level)
        )
      })),

      setDiscount: (discount) => set({ discount }),
      setMisc: (misc) => set({ misc }),
      
      reset: () => set({ customer: null, equipmentList: [], laborList: [], discount: 0, misc: 0 })
    }),
    {
      name: 'hvac-estimate-storage', // key in local storage
    }
  )
);
