import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

type Props = {
  authTo?: string;
};

const PublicRoutes: React.FC<Props> = ({ authTo = '/home', ...props }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate replace to={authTo} />;
};

export default PublicRoutes;
