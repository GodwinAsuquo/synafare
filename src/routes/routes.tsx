import { PATHS } from '../utils/enum';
import { AppRoute } from '../types/route';
import { Navigate } from 'react-router-dom';
import LandingPage from '../pages/landingPage';

const { ROOT, HOME } = PATHS;

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
    path: '*',
    element: <Navigate to={ROOT} replace />,
  },
];
