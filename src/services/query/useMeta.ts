import { useMutation } from 'react-query';
import metaService, { UserData } from '../api/meta.service';

export const useMetaEvents = () => {
  // Mutation for Complete Registration
  const completeRegistrationMutation = useMutation({
    mutationFn: ({ userData, customData }: { userData: Partial<UserData>; customData?: Record<string, any> }) =>
      metaService.trackCompleteRegistration(userData, customData),
  });

  // Mutation for Contact
  const contactMutation = useMutation({
    mutationFn: ({ userData, customData }: { userData: Partial<UserData>; customData?: Record<string, any> }) =>
      metaService.trackContact(userData, customData),
  });

  // Mutation for View Content
  const viewContentMutation = useMutation({
    mutationFn: ({ userData, customData }: { userData: Partial<UserData>; customData?: Record<string, any> }) =>
      metaService.trackViewContent(userData, customData),
  });

  return {
    trackCompleteRegistration: completeRegistrationMutation.mutate,
    isCompleteRegistrationLoading: completeRegistrationMutation.isLoading,
    completeRegistrationError: completeRegistrationMutation.error,

    trackContact: contactMutation.mutate,
    isContactLoading: contactMutation.isLoading,
    contactError: contactMutation.error,

    trackViewContent: viewContentMutation.mutate,
    isViewContentLoading: viewContentMutation.isLoading,
    viewContentError: viewContentMutation.error,
  };
};

export default useMetaEvents;
