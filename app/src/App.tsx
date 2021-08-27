import React, { Suspense, useEffect } from 'react';
import AppNavbar from 'src/Shared/components/AppNavbar';
import { useAuth, useAuthRedirect } from 'src/utils/auth';
import { useJuneRouter } from 'src/Shared/router';
import * as JAlert from 'src/Lib/JAlerts';
import FloatingLoader from 'src/Shared/components/FloatingLoader';

interface Props {}

const App: React.FC<Props> = () => {
  const { Routes } = useJuneRouter();
  const { isLoading, auth } = useAuth();

  const { isLoading: isCatchLoading } = useAuthRedirect();

  useEffect(() => {
    (async () => await auth())();
  }, []);

  return (
    <>
      {!isLoading && !isCatchLoading && (
        <div>
          <FloatingLoader />
          <JAlert.JAlertGroup />
          <AppNavbar />
          <Suspense fallback={<span />}>
            <div className="px-2 py-1 sm:max-w-7xl mx-auto">{Routes}</div>
          </Suspense>{' '}
        </div>
      )}
    </>
  );
};

export default App;
