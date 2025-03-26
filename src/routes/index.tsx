import AppLayout from '../layouts/AppLayout';
import { ROUTES } from './routes';
import { useRoutes, useLocation } from 'react-router-dom';

const RouteWrapper = () => {
  const routes = useRoutes(ROUTES);
  return routes;
};

const Pages = () => {
  const location = useLocation();
  return (
    <AppLayout>
      <RouteWrapper key={location.pathname} />
    </AppLayout>
  );
};

export default Pages;
