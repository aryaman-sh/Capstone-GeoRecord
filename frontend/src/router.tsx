import React, { ReactNode } from 'react';
import { createBrowserRouter, RouteObject, Outlet, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

import Root from "./routes/root";
import ErrorPage from "./routes/error";
import Login from './routes/login.tsx';
import NavBar from './components/navbar.tsx';
import Locations from './routes/locations.tsx';
import SignUp from './routes/signup.tsx';
import Settings from './routes/settings.tsx';
import SignOut from './routes/signout.tsx';
import Profile from './routes/profile.tsx';

export function ProtectedWrapper() {
  const { user } = useAuth();
  //console.log(`Authenticated: ${user}`);

  if (!user) {
    // Redirect to login if not signed in
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AuthWrapper(props: {children: ReactNode}) {
  const { user } = useAuth();

  return user ? <Navigate to="/" replace /> : props.children;
}
const router = createBrowserRouter([
{
  path: "/login",
  element: <AuthWrapper><Login /></AuthWrapper>,
  errorElement: <ErrorPage />,
},
{
  path: "/signup",
  element: <AuthWrapper><SignUp /></AuthWrapper>,
  errorElement: <ErrorPage />,
},
{
  path: "/",
  element: <ProtectedWrapper />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: (
        <NavBar activeName='Map'>
          <Root />
        </NavBar>
      ),
    },
    {
      // open a speicfic location on the map
      path: ":location_id",
      element: (
        <NavBar activeName='Map'>
          <Root />
        </NavBar>
      ),
    },
    {
      path: "locations",
      element: (
        <NavBar activeName='Your Locations'>
          <Locations />
        </NavBar>
      ),
    },
    {
      path: "profile",
      element: <NavBar activeName="Profile"><Profile /></NavBar>,
    },
    {
      path: "settings",
      element: (
        <NavBar activeName='Settings'>
          <Settings />
        </NavBar>
      ),
    },
    {
      path: "signout",
      element: (
        <SignOut />
      ),
    },
  ],
},
]);

export default router;