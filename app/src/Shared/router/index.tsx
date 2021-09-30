import React from 'react';
import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import Index from 'src/Shared/layouts/Index';
const Home = React.lazy(() => import('src/Shared/layouts/Home'));
const Feed = React.lazy(() => import('src/Feed/pages/Feed'));
const Login = React.lazy(() => import('src/User/pages/Login'));
const Lib = React.lazy(() => import('src/Shared/pages/Lib'));
const UserProfile = React.lazy(() => import('src/User/pages/Index'));
const ProfileSettings = React.lazy(() => import('src/User/pages/settings/ProfileSettings'));
const PasswordSettings = React.lazy(() => import('src/User/pages/settings/PasswordSettings'));
const Settings = React.lazy(() => import('src/User/pages/Settings'));
const FeedLeftNav = React.lazy(() => import('src/Feed/components/LeftNav'));
const FeedRightNav = React.lazy(() => import('src/Feed/components/RightNav'));
const PostDetails = React.lazy(() => import('src/Feed/pages/PostDetail'));

import BottomNav from 'src/Shared/components/BottomNav';
import { getToken } from 'src/utils/helpers';

export enum JunePaths {
  Root = '/',
  Lib = 'lib',
  Login = 'login',
  User = 'home',
  Settings = 'settings',
  ProfileSettings = 'settings/profile',
  PasswordSettings = 'settings/password',
  UserProfile = ':username/',
  Post = ':username/post/:postId',
}

interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element: React.ReactNode;
  path: string;
}
interface PrivateRouteProps extends Record<string, any> {
  component: (props: any) => React.ReactNode;
  isSignedIn: boolean;
  redirect: string;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component, isSignedIn, redirect, ...rest } = props;

  return isSignedIn ? component(rest) : <Navigate to={redirect} />;
};

function spreadPrivateRoutes(routes: RouteObject[], isLoggedin: boolean): RouteObject[] {
  return routes.map(({ path, element: Element }) => ({
    path,
    element: PrivateRoute({
      component: () => Element,
      redirect: `/${JunePaths.Login}`,
      isSignedIn: isLoggedin,
    }),
  }));
}

export function useJuneRouter() {
  const isLoggedIn = !!getToken();

  const { search } = useLocation();

  const Routes = useRoutes([
    {
      path: JunePaths.Root,
      element: isLoggedIn ? (
        <Home
          leftNavSlot={<FeedLeftNav />}
          rightNavSlot={<FeedRightNav />}
          bottomNavSlot={<BottomNav />}
        />
      ) : (
        <Index />
      ),
      children: [
        //TODO: replace this with landing page
        {
          path: '',
          element: PrivateRoute({
            component: (props: any) => <Login {...props} />,
            isSignedIn: !isLoggedIn,
            redirect: `/${JunePaths.User}`,
          }),
        },
        {
          path: JunePaths.Login,
          element: PrivateRoute({
            component: (props: any) => <Login {...props} />,
            isSignedIn: !isLoggedIn,
            redirect: `/${JunePaths.User}`,
          }),
        },
        ...spreadPrivateRoutes(
          [
            {
              path: JunePaths.UserProfile,
              element: <UserProfile />,
            },
            {
              path: JunePaths.User,
              element: <Feed />,
            },
            {
              path: JunePaths.Settings,
              element: <Settings />,
            },
            {
              path: JunePaths.ProfileSettings,
              element: <ProfileSettings />,
            },
            {
              path: JunePaths.PasswordSettings,
              element: <PasswordSettings />,
            },
            {
              path: JunePaths.Post,
              element: <PostDetails />,
            },
          ],
          isLoggedIn,
        ),
      ],
    },
    //TODO: fix this
    // {
    //   path: JunePaths.Root,
    //   element: (
    //     <Home
    //       leftNavSlot={<FeedLeftNav />}
    //       rightNavSlot={isLoggedIn ? <FeedRightNav /> : null}
    //       bottomNavSlot={isLoggedIn ? <BottomNav /> : null}
    //     />
    //   ),
    //   children: [
    //     {
    //       path: JunePaths.UserProfile,
    //       element: <UserProfile />,
    //     },
    //     {
    //       path: JunePaths.Post,
    //       element: <PostDetails />,
    //     },
    //   ],
    // },
    {
      path: JunePaths.Lib,
      element: <Lib />,
    },
  ]);

  return {
    Routes,
  };
}
