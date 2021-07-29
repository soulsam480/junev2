import React, { Suspense } from 'react';
import AppNavbar from 'src/Shared/components/AppNavbar';
import { auth, useAuthRedirect } from 'src/utils/auth';
import { useJuneRouter } from 'src/Shared/router';

interface Props {}

auth();

const App: React.FC<Props> = () => {
  const { Routes } = useJuneRouter();
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
