import { useState, useEffect, useRef } from 'react';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import warning from '../../../assets/icons/warning.svg';
import packageWorksIcon from '../../../assets/icons/packageWorks.svg';
import { BatteryType, SelectedAppliance } from '../../../types';

// Updated props interface
interface AppliancesListProps {
  inverterPackage: {
    title: string;
    inverterCapacity: string;
    cost: number;
    batteryCapacity: number;
    batteryType: BatteryType;
    backupTime?: number;
    defaultAppliances?: any[];
    appliances?: any[];
    moreAppliances?: any[];
    slug?: string;
  };
  allPackages?: any[];
}

// Battery efficiency constants by type
const BATTERY_EFFICIENCY: Record<BatteryType, number> = {
  lithiumBattery: 0.9, // 90% efficiency for lithium-ion
  leadAcidBattery: 0.75, // 75% efficiency for lead-acid
};

// Default depth of discharge by battery type
const DEPTH_OF_DISCHARGE: Record<BatteryType, number> = {
  lithiumBattery: 0.9, // Can use up to 90% of lithium-ion capacity
  leadAcidBattery: 0.5, // Can use up to 50% of lead-acid capacity
};

/**
 * Calculate backup time based on selected appliances and battery capacity
 *
 * @param selectedAppliances - List of all selected appliances
 * @param batteryCapacityKwh - Battery capacity in kWh
 * @param batteryType - Type of battery
 * @returns Object with min and max backup time in hours
 */
const calculateBackupTime = (
  selectedAppliances: SelectedAppliance[],
  batteryCapacityKwh: number,
  batteryType: BatteryType
): { min: number; max: number } => {
  // Filter for selected appliances
  const activeAppliances = selectedAppliances.filter((app) => app.selected);

  if (activeAppliances.length === 0 || batteryCapacityKwh <= 0) {
    return { min: 0, max: 0 };
  }

  // Calculate total watt-hours required
  const totalWatts = activeAppliances.reduce((total, app) => {
    return total + app.watts * app.quantity;
  }, 0);

  // Convert watts to kilowatts
  const totalKilowatts = totalWatts / 1000;

  // If there's no load, prevent division by zero
  if (totalKilowatts === 0) {
    return { min: 24, max: 24 }; // If no load, battery will last maximum time
  }

  // Calculate usable battery capacity based on battery type
  const usableBatteryCapacity = batteryCapacityKwh * DEPTH_OF_DISCHARGE[batteryType];

  // Factor in battery efficiency
  const efficiency = BATTERY_EFFICIENCY[batteryType];

  // Calculate actual backup time (hours) = usable battery capacity (kWh) / total load (kW)
  const calculatedBackupTime = (usableBatteryCapacity * efficiency) / totalKilowatts;

  // Provide a range (±10% variance to account for real-world variations)
  const minBackupTime = Math.max(Math.round(calculatedBackupTime * 0.9), 0);
  const maxBackupTime = Math.round(calculatedBackupTime * 1.1);

  // If min and max are the same, add 1 to max
  if (minBackupTime === maxBackupTime) {
    return { min: minBackupTime, max: maxBackupTime + 1 };
  }

  return { min: minBackupTime, max: maxBackupTime };
};

const AppliancesList: React.FC<AppliancesListProps> = ({ inverterPackage, allPackages = [] }) => {
  const navigate = useNavigate();
  const { title, inverterCapacity, cost, batteryCapacity, batteryType } = inverterPackage;

  // Handle both defaultAppliances and appliances properties
  const defaultAppliancesArray = inverterPackage.defaultAppliances || inverterPackage.appliances || [];
  const moreAppliancesArray = inverterPackage.moreAppliances || [];

  const [showMoreAppliances, setShowMoreAppliances] = useState<boolean>(false);
  const [selectedAppliances, setSelectedAppliances] = useState<SelectedAppliance[]>([]);
  const [additionalAppliances, setAdditionalAppliances] = useState<SelectedAppliance[]>([]);
  const [totalLoad, setTotalLoad] = useState<string>('0'); // Will be calculated after initialization

  // New state for backup time
  const [backupTime, setBackupTime] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  // Flag to skip initial calculation
  const isInitialRender = useRef<boolean>(true);

  // Flag to track if user is intentionally navigating to payment or upgrade flow
  const isNavigatingIntentionally = useRef<boolean>(false);

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOverCapacity, setIsOverCapacity] = useState<boolean>(false);

  // Add state for recommended package
  const [recommendedPackage, setRecommendedPackage] = useState<any>(null);

  // Helper function to calculate total load
  const calculateTotalLoad = (appliancesToCalculate: SelectedAppliance[]): string => {
    const selectedWithQuantity = appliancesToCalculate.filter((app) => app.selected);

    const totalWatts = selectedWithQuantity.reduce((total, app) => {
      return total + app.watts * app.quantity;
    }, 0);

    // Convert watts to kVa (assuming power factor of 0.8)
    return (totalWatts / 1000 / 0.8).toFixed(2);
  };

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Only clear selections if we're not intentionally navigating
      // to the payment form or recommended package
      if (!isNavigatingIntentionally.current) {
        localStorage.removeItem('SELECTED_APPLIANCES');
      }
    };
  }, []);

  // Initialize the component - check for stored appliances or use defaults
  useEffect(() => {
    // Reset when inverterPackage changes
    isInitialRender.current = true;
    isNavigatingIntentionally.current = false;

    // Try to get stored selections from localStorage
    const storedSelectionsJSON = localStorage.getItem('SELECTED_APPLIANCES');

    if (storedSelectionsJSON) {
      try {
        const storedSelections = JSON.parse(storedSelectionsJSON);

        // Map default appliances with stored selections
        const mappedDefaultAppliances = defaultAppliancesArray.map((defaultApp: any) => {
          // Try to find this appliance in stored selections
          const storedApp = storedSelections.find(
            (stored: any) => stored.name === defaultApp.name && stored.watts === defaultApp.watts
          );

          if (storedApp) {
            // Use stored selection and quantity if found
            return {
              ...defaultApp,
              selected: storedApp.selected,
              quantity: storedApp.quantity,
            };
          } else {
            // Use default values if not found in stored selections
            return {
              ...defaultApp,
              selected: true,
            };
          }
        });

        // For additional appliances, do the same mapping
        const mappedAdditionalAppliances = moreAppliancesArray.map((additionalApp: any) => {
          const storedApp = storedSelections.find(
            (stored: any) => stored.name === additionalApp.name && stored.watts === additionalApp.watts
          );

          if (storedApp) {
            return {
              ...additionalApp,
              selected: storedApp.selected,
              quantity: storedApp.quantity,
            };
          } else {
            return {
              ...additionalApp,
              selected: false,
            };
          }
        });

        // If there are any stored additional appliances that aren't in our defaults, we should show that panel
        const hasSelectedAdditionalAppliances = storedSelections.some(
          (app: any) =>
            !defaultAppliancesArray.some(
              (defaultApp: any) => defaultApp.name === app.name && defaultApp.watts === app.watts
            ) && app.selected
        );

        if (hasSelectedAdditionalAppliances) {
          setShowMoreAppliances(true);
        }

        setSelectedAppliances(mappedDefaultAppliances);
        setAdditionalAppliances(mappedAdditionalAppliances);

        // Calculate initial total load after appliances are set
        setTimeout(() => {
          const allAppliances = [...mappedDefaultAppliances, ...mappedAdditionalAppliances];
          const initialTotalLoad = calculateTotalLoad(allAppliances);
          setTotalLoad(initialTotalLoad);

          // Calculate initial backup time
          setBackupTime(calculateBackupTime(allAppliances, batteryCapacity, batteryType));

          // Check if initial load exceeds capacity
          const isOver = parseFloat(initialTotalLoad) >= parseFloat(inverterCapacity) * 0.8;
          setIsOverCapacity(isOver);

          // Find recommended package if over capacity
          if (isOver && allPackages.length > 0) {
            const totalLoadValue = parseFloat(initialTotalLoad);

            // Sort packages by inverter capacity in ascending order
            const sortedPackages = [...allPackages].sort(
              (a, b) => parseFloat(a.inverterCapacity) - parseFloat(b.inverterCapacity)
            );

            // Find the next package whose 80% inverter capacity is greater than totalLoad
            const nextPackage = sortedPackages.find(
              (pkg) =>
                parseFloat(pkg.inverterCapacity) * 0.8 > totalLoadValue &&
                parseFloat(pkg.inverterCapacity) > parseFloat(inverterCapacity)
            );

            // If no suitable package is found, use the highest inverter capacity one
            setRecommendedPackage(nextPackage || sortedPackages[sortedPackages.length - 1]);

            // Show the modal immediately if over capacity
            setShowModal(true);
          }

          isInitialRender.current = false;
        }, 0);
      } catch (error) {
        console.error('Error parsing stored appliances:', error);
        // Fall back to defaults if there's any error
        initializeDefaultAppliances();
      }
    } else {
      // No stored selections, use defaults
      initializeDefaultAppliances();
    }
  }, [inverterPackage, inverterCapacity, batteryCapacity, batteryType, allPackages]); // Re-run when inverterPackage changes

  // Helper function to initialize default appliances
  const initializeDefaultAppliances = () => {
    const defaultAppliances = defaultAppliancesArray.map((appliance: any) => ({
      ...appliance,
      selected: true,
    }));

    const additionalAppliances = moreAppliancesArray.map((appliance: any) => ({
      ...appliance,
      selected: false,
    }));

    setSelectedAppliances(defaultAppliances);
    setAdditionalAppliances(additionalAppliances);

    // Calculate initial total load
    setTimeout(() => {
      const initialTotalLoad = calculateTotalLoad(defaultAppliances);
      setTotalLoad(initialTotalLoad);

      // Calculate initial backup time
      setBackupTime(calculateBackupTime(defaultAppliances, batteryCapacity, batteryType));

      // Check if initial load exceeds capacity
      const isOver = parseFloat(initialTotalLoad) >= parseFloat(inverterCapacity) * 0.8;
      setIsOverCapacity(isOver);

      // Find recommended package if over capacity
      if (isOver && allPackages.length > 0) {
        const totalLoadValue = parseFloat(initialTotalLoad);

        // Sort packages by inverter capacity in ascending order
        const sortedPackages = [...allPackages].sort(
          (a, b) => parseFloat(a.inverterCapacity) - parseFloat(b.inverterCapacity)
        );

        // Find the next package whose 80% inverter capacity is greater than totalLoad
        const nextPackage = sortedPackages.find(
          (pkg) =>
            parseFloat(pkg.inverterCapacity) * 0.8 > totalLoadValue &&
            parseFloat(pkg.inverterCapacity) > parseFloat(inverterCapacity)
        );

        // If no suitable package is found, use the highest inverter capacity one
        setRecommendedPackage(nextPackage || sortedPackages[sortedPackages.length - 1]);

        // Show the modal immediately if over capacity
        setShowModal(true);
      }

      isInitialRender.current = false;
    }, 0);
  };

  // Calculate the total load based on selected appliances
  useEffect(() => {
    // Skip the first calculation right after initialization
    if (isInitialRender.current) {
      return;
    }

    const allAppliances = [...selectedAppliances, ...additionalAppliances];
    const newTotalLoad = calculateTotalLoad(allAppliances);
    setTotalLoad(newTotalLoad);

    // Calculate backup time with the updated appliances
    setBackupTime(calculateBackupTime(allAppliances, batteryCapacity, batteryType));

    // Check if total load exceeds 80% of inverter capacity
    const isOver = parseFloat(newTotalLoad) >= parseFloat(inverterCapacity) * 0.8;

    // Only update state and trigger modal if the status has changed
    if (isOver !== isOverCapacity) {
      setIsOverCapacity(isOver);

      // Immediately show modal if capacity is exceeded
      if (isOver) {
        // Find recommended package when over inverter capacity
        if (allPackages.length > 0) {
          const totalLoadValue = parseFloat(newTotalLoad);

          // Sort packages by inverter capacity in ascending order
          const sortedPackages = [...allPackages].sort(
            (a, b) => parseFloat(a.inverterCapacity) - parseFloat(b.inverterCapacity)
          );

          // Find the next package whose 80% inverter capacity is greater than totalLoad
          const nextPackage = sortedPackages.find(
            (pkg) =>
              parseFloat(pkg.inverterCapacity) * 0.8 > totalLoadValue &&
              parseFloat(pkg.inverterCapacity) > parseFloat(inverterCapacity)
          );

          // If no suitable package is found, use the highest inverter capacity one
          setRecommendedPackage(nextPackage || sortedPackages[sortedPackages.length - 1]);
        }

        // Show the modal immediately
        setShowModal(true);
      }
    }
  }, [
    selectedAppliances,
    additionalAppliances,
    inverterCapacity,
    batteryCapacity,
    batteryType,
    allPackages,
    isOverCapacity,
  ]);

  // Toggle selection status of an appliance
  const toggleSelection = (index: number, isDefault: boolean): void => {
    if (isDefault) {
      const updatedAppliances = [...selectedAppliances];
      updatedAppliances[index].selected = !updatedAppliances[index].selected;
      setSelectedAppliances(updatedAppliances);
    } else {
      const updatedAppliances = [...additionalAppliances];
      updatedAppliances[index].selected = !updatedAppliances[index].selected;
      setAdditionalAppliances(updatedAppliances);
    }
  };

  // Increase quantity of an appliance
  const increaseQuantity = (index: number, isDefault: boolean): void => {
    if (isDefault) {
      const updatedAppliances = [...selectedAppliances];
      updatedAppliances[index].quantity += 1;
      setSelectedAppliances(updatedAppliances);
    } else {
      const updatedAppliances = [...additionalAppliances];
      updatedAppliances[index].quantity += 1;
      setAdditionalAppliances(updatedAppliances);
    }
  };

  // Decrease quantity of an appliance
  const decreaseQuantity = (index: number, isDefault: boolean): void => {
    if (isDefault) {
      const updatedAppliances = [...selectedAppliances];
      if (updatedAppliances[index].quantity > 1) {
        updatedAppliances[index].quantity -= 1;
        setSelectedAppliances(updatedAppliances);
      }
    } else {
      const updatedAppliances = [...additionalAppliances];
      if (updatedAppliances[index].quantity > 1) {
        updatedAppliances[index].quantity -= 1;
        setAdditionalAppliances(updatedAppliances);
      }
    }
  };

  // Handle Start Over button click
  const handleStartOver = (): void => {
    // Reset to default state
    initializeDefaultAppliances();
    setShowMoreAppliances(false);

    // Clear stored selections
    localStorage.removeItem('SELECTED_APPLIANCES');
  };

  // Close the modal
  const closeModal = (): void => {
    setShowModal(false);
  };

  // Store current selections to localStorage
  const storeSelections = () => {
    // Combine all selected appliances from both default and additional lists
    const allSelections = [...selectedAppliances, ...additionalAppliances];
    localStorage.setItem('SELECTED_APPLIANCES', JSON.stringify(allSelections));
  };

  // Handle upgrade to recommended package
  const handleUpgradePackage = () => {
    if (recommendedPackage) {
      // Set flag that we're intentionally navigating
      isNavigatingIntentionally.current = true;

      // Store current selections before navigating
      storeSelections();

      // Navigate to the recommended package
      navigate(`/solar-packages/${recommendedPackage.slug}`);
      closeModal();
    }
  };

  const handlePaymentClick = () => {
    if (isOverCapacity) {
      setShowModal(true);
    } else {
      // Set flag that we're intentionally navigating
      isNavigatingIntentionally.current = true;

      // Store current selections before navigating
      storeSelections();

      // Pass the current inverterPackage information via state
      navigate(`/solar-packages/${inverterCapacity}kVa/installmental-form`, {
        state: {
          selectedPackage: title || `${inverterCapacity}kVa Package`,
          packageCost: cost,
          packageSlug: inverterPackage.slug,
        },
      });
    }
  };

  return (
    <div className="mt-10">
      <h4 className="text-2xl text-[#101928] font-medium my-4">Appliances it can Power</h4>

      {/* Default Appliances List */}
      <div className="space-y-4">
        {selectedAppliances.map((appliance, index) => (
          <div key={`default-${index}`} className="flex items-center gap-3 justify-between md:w-[50%] lg:w-[80%]">
            <div className="flex items-top">
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-3 cursor-pointer ${
                  appliance.selected ? 'bg-[#F7F9FC] border-[#475367]' : 'border-[#475367]'
                }`}
                onClick={() => toggleSelection(index, true)}
              >
                {appliance.selected && (
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="text-[#414651]">
                {appliance.name} - <span className="font-medium">{appliance.watts}watts</span>
              </span>
            </div>

            <div className="flex items-center">
              <button
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => decreaseQuantity(index, true)}
                disabled={!appliance.selected}
              >
                <HiMinus className={`${!appliance.selected ? 'text-gray-300' : 'text-[#313144]'}`} />
              </button>
              <span className="mx-3 w-4 text-center text-[#313144]">{appliance.quantity}</span>
              <button
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => increaseQuantity(index, true)}
                disabled={!appliance.selected}
              >
                <HiPlus className={`${!appliance.selected ? 'text-gray-300' : 'text-[#313144]'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Appliances */}
      {showMoreAppliances && (
        <div className="space-y-4 border-t pt-4 mt-4">
          {additionalAppliances.map((appliance, index) => (
            <div key={`additional-${index}`} className="flex items-center justify-between gap-3 md:w-[50%] lg:w-[80%]">
              <div className="flex items-top">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-3 cursor-pointer ${
                    appliance.selected ? 'bg-[#F7F9FC] border-[#475367]' : 'border-[#475367]'
                  }`}
                  onClick={() => toggleSelection(index, false)}
                >
                  {appliance.selected && (
                    <svg
                      className="w-4 h-4 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className="text-[#414651]">
                  {appliance.name} - <span className="font-medium">{appliance.watts}watts</span>
                </span>
              </div>

              <div className="flex items-center">
                <button
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                  onClick={() => decreaseQuantity(index, false)}
                  disabled={!appliance.selected}
                >
                  <HiMinus className={`${!appliance.selected ? 'text-gray-300' : 'text-gray-700'}`} />
                </button>
                <span className="mx-3 w-4 text-center">{appliance.quantity}</span>
                <button
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                  onClick={() => increaseQuantity(index, false)}
                  disabled={!appliance.selected}
                >
                  <HiPlus className={`${!appliance.selected ? 'text-gray-300' : 'text-gray-700'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Load Information */}
      <div className="space-y-4 mt-10">
        <p className="text-lg text-[#414651]">
          Total load <span className="font-medium text-xl">{totalLoad}kVa</span> of{' '}
          <span className="text-[#1671D9] font-medium text-xl">{inverterCapacity}kVa</span>
        </p>
        <p className="text-lg">
          Estimated Backup Time:{' '}
          <span className="text-purple-600 font-medium text-xl">
            {backupTime.min}-{backupTime.max} hrs
          </span>
        </p>
        <p className="italic text-sm">
          (Estimated Backup Time is the approximate duration the battery can supply power when solar input or power from
          the grid is insufficient or unavailable)
        </p>
      </div>

      {/* Add More Appliances Button */}
      {!showMoreAppliances && (
        <button
          className="flex items-center border border-[#D0D5DD] rounded-xl px-4 py-2 mt-8"
          onClick={() => setShowMoreAppliances(true)}
        >
          <FaPlus className="mr-2" />
          <p>Add More Appliances</p>
        </button>
      )}

      {/* Done or Start Over buttons */}
      {showMoreAppliances && (
        <div className="flex items-center space-x-3 mt-8">
          <button
            onClick={handleStartOver}
            className="text-sm border border-[#D0D5DD] rounded-lg py-2 text-center w-28"
          >
            Start Over
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {isOverCapacity ? (
              <>
                <img className="mx-auto" src={warning} alt="warning icon" />
                <h3 className="text-xl font-medium text-center text-[#181D27] mb-4">Wattage Limit Exceeded!</h3>
                <p className="text-[#535862] text-center font-light">
                  Your selected appliances exceed this inverter's capacity. Upgrade to ensure uninterrupted power.
                </p>
                <p className="text-center text-[#414651] font-medium text-lg mt-5">Recommended Setup:</p>

                {recommendedPackage ? (
                  <div className="mx-auto lg:w-[80%] mt-6">
                    <img
                      className="rounded-lg"
                      src={recommendedPackage.imageUrl}
                      alt={`${recommendedPackage.inverterCapacity}kVa inverter`}
                    />
                    <div className="flex justify-between items-center mt-4 text-lg">
                      <h4>{recommendedPackage.title}</h4>
                      <h4>₦{recommendedPackage.cost.toLocaleString()}</h4>
                    </div>
                    <p className="line-clamp-2 text-[#667185] text-sm mt-3">{recommendedPackage.description}</p>
                  </div>
                ) : (
                  <p className="text-center my-4">No suitable package found. Please contact support.</p>
                )}

                <div className="flex items-center justify-between gap-3 mt-8">
                  <button
                    onClick={closeModal}
                    className="border border-[#D5D7DA] w-full text-center text-[#414651] rounded-lg py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgradePackage}
                    className="w-full text-center border border-[#7F56D9] bg-[#7F56D9] text-white rounded-lg py-2 text-sm font-semibold"
                  >
                    Upgrade Setup
                  </button>
                </div>
              </>
            ) : (
              <>
                <img className="mx-auto" src={packageWorksIcon} alt="" />
                <h3 className="text-xl font-medium mb-4 text-center mt-5">Package Works!</h3>
                <p className="text-[#535862] text-center">
                  Great! This package can handle your selected appliances with a total load of {totalLoad}kVa. You can
                  proceed with your selection.
                </p>
                <div className="flex ">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 mt-10 bg-[#7F56D9] w-full text-white rounded-lg text-sm"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <h2 className="text-[#5228CC] font-semibold text-2xl mt-10">₦{(cost * 0.3).toLocaleString()} deposit </h2>
      <p className="text-[#667185] mt-2 font-light">
        Spread the balance over 3-12 months or pay <span className="font-semibold">₦{cost.toLocaleString()}</span>{' '}
        upfront.
      </p>

      <div className="flex space-x-3 items-center mt-10">
        <button
          onClick={handlePaymentClick}
          className="text-white bg-[#201E1F] py-2 px-3 rounded-lg border-2 text-sm border-[#4F986A] hover:cursor-pointer"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default AppliancesList;
