import { useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const PrivateRoute = (props) => {
  const { userRole } = props;
  const auth = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!auth.isAuthenticated || !auth.user || !auth.user.roles.includes(userRole)) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }
    return <Navigate to="/" />;
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  userRole: PropTypes.string,
};

export default PrivateRoute;
