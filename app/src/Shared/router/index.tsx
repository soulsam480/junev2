import React from 'react';
import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import Index from 'src/Shared/layouts/Index';
const Home = React.lazy(() => import('src/Shared/layouts/Home'));
const Feed = React.lazy(() => import('src/Feed/pages/Feed'));
const Login = React.lazy(() => import('src/User/pages/Login'));
const Lib = React.lazy(() => import('src/Shared/pages/Lib'));
const UserProfile = React.lazy(() => import('src/User/pages/Index'));
const Settings = React.lazy(() => import('src/User/pages/Settings'));
const BottomNav = React.lazy(() => import('src/Shared/components/BottomNav'));
const TopNav = React.lazy(() => import('src/Shared/components/TopNav'));
const FeedLeftNav = React.lazy(() => import('src/Feed/components/LeftNav'));
const FeedRightNav = React.lazy(() => import('src/Feed/components/RightNav'));
import { useUserStore } from 'src/User/store/useUserStore';
import { useScreenWidth } from 'src/utils/hooks';

interface PrivateRouteProps extends Record<string, any> {
  component: (props: any) => React.ReactNode;
  isSignedIn: boolean;
  redirect: string;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component, isSignedIn, redirect, ...rest } = props;

  return isSignedIn ? component(rest) : <Navigate to={redirect} />;
};

export enum JunePaths {
  Root = '/',
  Lib = '/lib',
  Login = '/login',
  User = 'u',
  Feed = '/feed',
  Settings = '/settings',
  UserProfile = '/:username',
}

export function useJuneRouter() {
  const { isLoggedIn } = useUserStore();
  const { pathname } = useLocation();
  const { width } = useScreenWidth();

  const Routes = useRoutes([
    {
      path: JunePaths.Root,
      element: <Index />,
      children: [
        {
          path: JunePaths.Root,
          element: PrivateRoute({
            component: (props) => <Login {...props} />,
            isSignedIn: !isLoggedIn,
            redirect: `/${JunePaths.User}${JunePaths.Feed}`,
          }),
        },
        {
          path: JunePaths.Lib,
          element: <Lib />,
        },
        {
          path: JunePaths.Login,
          element: PrivateRoute({
            component: (props) => <Login {...props} />,
            isSignedIn: !isLoggedIn,
            redirect: `/${JunePaths.User}${JunePaths.Feed}`,
          }),
        },
      ],
    },
    {
      path: JunePaths.User,
      element: PrivateRoute({
        component: (props) => (
          <Home
            leftNavSlot={<FeedLeftNav />}
            rightNavSlot={<FeedRightNav />}
            bottomNavSlot={<BottomNav />}
            {...props}
          />
        ),
        isSignedIn: isLoggedIn,
        redirect: JunePaths.Root,
      }),
      children: [
        {
          path: JunePaths.Root,
          element: <Feed />,
        },
        {
          path: JunePaths.Feed,
          element: <Feed />,
        },
        {
          path: JunePaths.Settings,
          element: <Settings />,
        },
        {
          path: JunePaths.UserProfile,
          element: <UserProfile />,
        },
      ],
    },
  ]);

  return {
    Routes,
  };
}
