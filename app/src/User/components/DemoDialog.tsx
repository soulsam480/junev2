import React, { useState } from 'react';
import JButton from 'src/Lib/JButton';
import JCard from 'src/Lib/JCard';
import JDialog from 'src/Lib/JDialog';

interface Props {}

const DemoDialog: React.FC<Props> = () => {
  const [isModal, setModal] = useState(false);

  return (
    <>
      {' '}
      <JDialog isModal={isModal} setModal={setModal}>
        <JCard style={{ width: '500px' }} className="p-3">
          Hii
        </JCard>
      </JDialog>
      <JButton label="toggle" onClick={() => setModal(true)} />
    </>
  );
};

export default DemoDialog;
