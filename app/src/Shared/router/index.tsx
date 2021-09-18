import React from 'react';
import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from 'src/User/store/useUserStore';
import Index from 'src/Shared/layouts/Index';
const Home = React.lazy(() => import('src/Shared/layouts/Home'));
const Feed = React.lazy(() => import('src/Feed/pages/Feed'));
const Login = React.lazy(() => import('src/User/pages/Login'));
const Lib = React.lazy(() => import('src/Shared/pages/Lib'));
const UserProfile = React.lazy(() => import('src/User/pages/Index'));
const ProfileSettings = React.lazy(() => import('src/User/pages/ProfileSettings'));
const PasswordSettings = React.lazy(() => import('src/User/pages/PasswordSettings'));
const SettingsNav = React.lazy(() => import('src/User/pages/SettingsNav'));
const BottomNav = React.lazy(() => import('src/Shared/components/BottomNav'));
const FeedLeftNav = React.lazy(() => import('src/Feed/components/LeftNav'));
const FeedRightNav = React.lazy(() => import('src/Feed/components/RightNav'));
const PostDetails = React.lazy(() => import('src/Feed/pages/PostDetail'));

export enum JunePaths {
  Root = '/',
  Lib = '/lib',
  Login = '/login',
  User = '/home',
  Settings = '/settings',
  ProfileSettings = '/settings/profile',
  PasswordSettings = '/settings/password',
  UserProfile = '/:username',
  Post = '/:username/post/:postId',
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
  from?: string;
  search?: string;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component, isSignedIn, redirect, from, ...rest } = props;

  return isSignedIn ? component(rest) : <Navigate to={`${redirect}?r=${from}`} />;
};

const LoginRoute = (props: Omit<PrivateRouteProps, 'redirect'>) => {
  const { component, isSignedIn, from, search, ...rest } = props;

  if (isSignedIn) {
    const r = new URLSearchParams(search).get('r');
    return <Navigate to={r || JunePaths.User} />;
  }

  return component(rest);
};

function spreadPrivateRoutes(routes: RouteObject[], isLoggedin: boolean): RouteObject[] {
  return routes.map(({ path, element: Element }) => ({
    path,
    element: PrivateRoute({
      component: () => Element,
      redirect: JunePaths.Login,
      isSignedIn: isLoggedin,
      from: path,
    }),
  }));
}

export function useJuneRouter() {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

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
          path: JunePaths.Root,
          element: LoginRoute({
            component: (props: any) => <Login {...props} />,
            isSignedIn: isLoggedIn,
            search,
          }),
        },
        {
          path: JunePaths.Login,
          element: LoginRoute({
            component: (props: any) => <Login {...props} />,
            isSignedIn: isLoggedIn,
            search,
          }),
        },
        ...spreadPrivateRoutes(
          [
            {
              path: JunePaths.User,
              element: <Feed />,
            },
            {
              path: JunePaths.Settings,
              element: <SettingsNav />,
            },
            {
              path: JunePaths.ProfileSettings,
              element: <ProfileSettings />,
            },
            {
              path: JunePaths.PasswordSettings,
              element: <PasswordSettings />,
            },
          ],
          isLoggedIn,
        ),
      ],
    },
    {
      path: JunePaths.Root,
      element: (
        <Home
          leftNavSlot={<FeedLeftNav />}
          rightNavSlot={isLoggedIn ? <FeedRightNav /> : null}
          bottomNavSlot={isLoggedIn ? <BottomNav /> : null}
        />
      ),
      children: [
        {
          path: JunePaths.UserProfile,
          element: <UserProfile />,
        },
        {
          path: JunePaths.Post,
          element: <PostDetails />,
        },
      ],
    },
    {
      path: JunePaths.Lib,
      element: <Lib />,
    },
  ]);

  return {
    Routes,
  };
}
