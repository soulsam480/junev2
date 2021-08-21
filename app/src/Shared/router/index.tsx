import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Index from 'src/Shared/layouts/Index';
const Home = React.lazy(() => import('src/Feed/layouts/Home'));
const Feed = React.lazy(() => import('src/Feed/pages/Feed'));
const Login = React.lazy(() => import('src/User/pages/Login'));
const Lib = React.lazy(() => import('src/Shared/pages/Lib'));
const UserProfile = React.lazy(() => import('src/User/pages/Index'));
import { useUserStore } from 'src/User/store/useUserStore';

interface PrivateRouteProps extends Record<string, any> {
  component: React.FC<any>;
  isSignedIn: boolean;
  redirect: string;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, isSignedIn, redirect, ...rest } = props;

  return isSignedIn ? <Component {...rest} /> : <Navigate to={redirect} />;
};

export function useJuneRouter() {
  const { isLoggedIn } = useUserStore();

  const Routes = useRoutes([
    {
      path: '/',
      element: <Index />,
      children: [
        {
          path: '/',
          element: PrivateRoute({ component: Login, isSignedIn: !isLoggedIn, redirect: '/u/feed' }),
        },
        {
          path: '/lib',
          element: <Lib />,
        },
        {
          path: '/login',
          element: PrivateRoute({ component: Login, isSignedIn: !isLoggedIn, redirect: '/u/feed' }),
        },
      ],
    },
    {
      path: 'u',
      element: PrivateRoute({ component: Home, isSignedIn: isLoggedIn, redirect: '/' }),
      children: [
        {
          path: '/',
          element: <Feed />,
        },
        {
          path: '/feed',
          element: <Feed />,
        },
        {
          path: '/:username',
          element: <UserProfile />,
        },
      ],
    },
  ]);

  return {
    Routes,
  };
}
