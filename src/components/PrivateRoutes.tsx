import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

type Props = {
  authTo?: string;
};

const PrivateRoutes: React.FC<Props> = ({ authTo = '/signin', ...props }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate replace to={authTo} />;
};

export default PrivateRoutes;
