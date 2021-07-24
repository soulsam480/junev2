import React from 'react';
import { Outlet } from 'react-router-dom';

interface Props {}

const Index: React.FC<Props> = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Index;
