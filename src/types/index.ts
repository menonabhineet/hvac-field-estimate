export interface Customer {
  id: string;
  name: string;
  address: string;
  phone?: string;
  propertyType: string;
  property_type?: string;
  squareFootage?: number;
  sqft?: number;
  systemType: string;
  systemAge?: number;
  lastServiceDate?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  modelNumber: string;
  baseCost?: number;
  base_cost?: number;
}

export interface LaborRate {
  jobType: string;
  level: string;
  hourlyRate: number;
  estimatedHours: {
    min: number;
    max: number;
  };
}

export interface SelectedLabor {
  rate: LaborRate;
  hours: number;
}

export interface EstimateState {
  customer: Customer | null;
  equipmentList: Equipment[];
  laborList: SelectedLabor[];
  discount: number;
  misc: number;
  setCustomer: (customer: Customer | null) => void;
  addEquipment: (equipment: Equipment) => void;
  removeEquipment: (equipmentId: string) => void;
  addLabor: (labor: SelectedLabor) => void;
  removeLabor: (jobType: string, level: string) => void;
  setDiscount: (val: number) => void;
  setMisc: (val: number) => void;
  reset: () => void;
}
