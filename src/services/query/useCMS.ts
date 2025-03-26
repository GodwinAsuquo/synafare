import { useQuery } from "react-query";
import { fetchInverterPackages } from "../api/cms.service";


export const useFetchInverterPackages = () => {
  return useQuery({
    queryKey: ['inverterPackages'],
    queryFn: fetchInverterPackages,
  });
};