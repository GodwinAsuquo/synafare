// backupTimeUtils.ts
export type BatteryType = 'lithiumBattery' | 'leadAcidBattery';

export interface SelectedAppliance {
  name: string;
  watts: number;
  quantity: number;
  selected: boolean;
}

/**
 * Calculates the backup time based on battery type, capacity, and load
 * The backup time will gradually change based on the current load
 * Ensures backup time doesn't go below 8 hours or above the API-provided default time
 *
 * @param batteryType - The type of battery ('lithiumBattery' or 'leadAcidBattery')
 * @param batteryCapacity - The capacity of the battery in kWh
 * @param totalLoadKva - The total load in kVA as a string
 * @param defaultBackupTime - The default backup time from API data
 * @returns Backup time in hours as a number
 */
export const calculateBackupTime = (
  batteryType: BatteryType,
  batteryCapacity: number,
  totalLoadKva: string,
  defaultBackupTime: number
): number => {
  // Ensure defaultBackupTime is within valid range (8-24 hours)
  const apiBackupTime = Math.min(Math.max(defaultBackupTime, 8), 24);

  // Convert kVA to kW using power factor of 0.8
  const loadInKW = parseFloat(totalLoadKva) * 0.8;

  // If load is zero or very small, return the default backup time
  if (loadInKW <= 0.1) {
    return apiBackupTime;
  }

  // Set Depth of Discharge based on battery type
  // Lithium batteries can discharge more deeply than lead-acid
  const depthOfDischarge = batteryType === 'lithiumBattery' ? 0.8 : 0.5;

  // Calculate theoretical backup time based on battery specs and current load
  // This gives us a smooth, gradually changing value based on physics
  const calculatedBackupTime = (batteryCapacity * depthOfDischarge) / loadInKW;

  // Cap the backup time:
  // - Maximum: The API-provided default time
  // - Minimum: 8 hours
  const adjustedBackupTime = Math.min(Math.max(calculatedBackupTime, 8), apiBackupTime);

  // Round to 1 decimal place for display
  return Math.round(adjustedBackupTime * 10) / 10;
};
