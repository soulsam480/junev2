import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Index from 'src/layouts/Index';
const Home = React.lazy(() => import('src/layouts/Home'));
const Feed = React.lazy(() => import('src/pages/Feed'));
const Login = React.lazy(() => import('src/pages/Login'));
const Lib = React.lazy(() => import('src/pages/Lib'));
import AppNavbar from 'src/components/AppNavbar';

interface Props {}

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