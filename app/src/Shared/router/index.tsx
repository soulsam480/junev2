import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { useUserStore } from 'src/User/store/useUserStore';
import Index from 'src/Shared/layouts/Index';
const Home = React.lazy(() => import('src/Shared/layouts/Home'));
const Feed = React.lazy(() => import('src/Feed/pages/Feed'));
const Login = React.lazy(() => import('src/User/pages/Login'));
const Lib = React.lazy(() => import('src/Shared/pages/Lib'));
const UserProfile = React.lazy(() => import('src/User/pages/Index'));
const Settings = React.lazy(() => import('src/User/pages/Settings'));
const BottomNav = React.lazy(() => import('src/Shared/components/BottomNav'));
const FeedLeftNav = React.lazy(() => import('src/Feed/components/LeftNav'));
const FeedRightNav = React.lazy(() => import('src/Feed/components/RightNav'));
const PostDetails = React.lazy(() => import('src/Feed/pages/Post'));

export enum JunePaths {
  Root = '/',
  Lib = '/lib',
  Login = '/login',
  User = '/home',
  Settings = '/settings',
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
      redirect: JunePaths.Login,
      isSignedIn: isLoggedin,
    }),
  }));
}

export function useJuneRouter() {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

  const Routes = useRoutes([
    {
      path: JunePaths.Root,
      element: !isLoggedIn ? (
        <Index />
      ) : (
        <Home
          leftNavSlot={<FeedLeftNav />}
          rightNavSlot={<FeedRightNav />}
          bottomNavSlot={<BottomNav />}
        />
      ),
      children: [
        //TODO: replace this with landing page
        {
          path: JunePaths.Root,
          element: PrivateRoute({
            component: (props) => <Login {...props} />,
            isSignedIn: !isLoggedIn,
            redirect: JunePaths.User,
          }),
        },
        {
          path: JunePaths.Login,
          element: PrivateRoute({
            component: (props) => <Login {...props} />,
            isSignedIn: !isLoggedIn,
            redirect: JunePaths.User,
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
              element: <Settings />,
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
