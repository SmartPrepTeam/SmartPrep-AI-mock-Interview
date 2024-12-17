import React, { useContext } from 'react';
import AuthContext from '@/context/auth_context';
import { SidebarDemo } from './SidebarDemo';
const Home = () => {
  const auth = useContext(AuthContext);

  return (
    <div>
      <SidebarDemo />
      {/* {auth?.token} {auth?.userId} */}
    </div>
  );
};

export default Home;
