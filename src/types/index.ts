export interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: [
    {
      path: string;
      element: React.ReactNode;
    }
  ];
}


interface Appliance {
  name: string;
  watts: number;
  quantity: number;
}

export interface SelectedAppliance extends Appliance {
  selected: boolean;
}

interface InverterPackage {
  title: string;
  slug: string;
  inverterCapacity: number;
  batteryCapacity: number;
  batteryType: string;
  backupTime: number;
  cost: number;
  description: string;
  image: string;
  defaultAppliances?: Appliance[];
  appliances?: Appliance[];
  moreAppliances?: Appliance[];
}

export interface AppliancesListProps {
  inverterPackage: InverterPackage;
}