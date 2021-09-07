import React, { Suspense, useEffect } from 'react';
import AppNavbar from 'src/Shared/components/AppNavbar';
import { useAuth, useAuthRedirect } from 'src/utils/auth';
import { useJuneRouter } from 'src/Shared/router';
import * as JAlert from 'src/Lib/JAlerts';
import FloatingLoader from 'src/Shared/components/FloatingLoader';
// import { Dialog, DialogAPI } from './Lib/context/dialog';

interface Props {}

const App: React.FC<Props> = () => {
  const { Routes } = useJuneRouter();
  const { isLoading, auth } = useAuth();
  const { isLoading: isCatchLoading } = useAuthRedirect();

  // const Dialogs = useRef<Dialog[]>([]);

  // function addToDialog(dialog: Dialog) {
  //   const isDialog = Dialogs.current.findIndex((el) => el.id === dialog.id);

  //   if (isDialog === -1) {
  //     //TODO: improve this
  //     if (!!Dialogs.current.length) Dialogs.current = [];
  //     Dialogs.current.push({ ...dialog });
  //   }
  // }

  // function removeFromDialog(id: string) {
  //   const isDialog = Dialogs.current.findIndex((el) => el.id === id);
  //   if (isDialog !== -1) {
  //     Dialogs.current.splice(isDialog, 1);
  //   }
  // }

  useEffect(() => {
    (async () => await auth())();
  }, []);

  return (
    <>
      {!isLoading && !isCatchLoading && (
        <div>
          {/* <DialogAPI.Provider value={{ dialogs: Dialogs.current, addToDialog, removeFromDialog }}> */}
          <FloatingLoader />
          <JAlert.JAlertGroup />
          <AppNavbar />
          <Suspense fallback={<span />}>
            <div className="px-2 py-1 sm:max-w-7xl mx-auto">{Routes}</div>
          </Suspense>{' '}
          {/* </DialogAPI.Provider> */}
        </div>
      )}
    </>
  );
};

export default App;
