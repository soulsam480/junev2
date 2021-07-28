import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Index from 'src/Shared/layouts/Index';
const Home = React.lazy(() => import('src/Feed/layouts/Home'));
const Feed = React.lazy(() => import('src/Feed/pages/Feed'));
const Login = React.lazy(() => import('src/User/pages/Login'));
const Lib = React.lazy(() => import('src/Shared/pages/Lib'));
import AppNavbar from 'src/Shared/components/AppNavbar';
import { auth, useAuthRedirect } from 'src/utils/auth';

interface Props {}

auth();
const App: React.FC<Props> = () => {
  const Routes = useRoutes([
    {
      path: '/',
      element: <Index />,
      children: [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/lib',
          element: <Lib />,
        },
        {
          path: '/login',
          element: <Login />,
        },
      ],
    },
    {
      path: 'u',
      element: <Home />,
      children: [
        {
          path: '/',
          element: <Feed />,
        },
      ],
    },
  ]);

  useAuthRedirect();

  return (
    <div>
      <AppNavbar />
      <Suspense fallback={<span></span>}>
        <div className="px-2 py-1 sm:max-w-7xl mx-auto">{Routes}</div>
      </Suspense>
    </div>
  );
};

export default App;
