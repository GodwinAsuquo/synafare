import { PATHS } from '../utils/enum';
import { AppRoute } from '../types';
import { Navigate } from 'react-router-dom';
import LandingPage from '../pages/landingPage';
import Packages from '../pages/packages';
import Package from '../pages/packages/package';
import InstallmentalPayment from '../pages/packages/package/installmentalPayment';
import PartnerRegistrationForm from '../pages/PartnerRegistrationForm';

const { ROOT, HOME, PACKAGES, PACKAGE, INSTALLMENTAL_FORM, PARTNER_REGISTRATION_FORM} = PATHS;

export const ROUTES: AppRoute[] = [
  {
    path: ROOT,
    element: <LandingPage />,
  },
  {
    path: HOME,
    element: <LandingPage />,
  },
  {
    path: PACKAGES,
    element: <Packages />,
  },
  {
    path: PACKAGE,
    element: <Package />,
  },
  {
    path: INSTALLMENTAL_FORM,
    element: <InstallmentalPayment />,
  },
  {
    path: INSTALLMENTAL_FORM,
    element: <InstallmentalPayment />,
  },
  {
    path: PARTNER_REGISTRATION_FORM,
    element: <PartnerRegistrationForm />,
  },
  {
    path: '*',
    element: <Navigate to={ROOT} replace />,
  },
];
