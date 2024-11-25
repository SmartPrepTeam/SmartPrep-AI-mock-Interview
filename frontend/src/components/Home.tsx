import React, { useContext } from 'react';
import AuthContext from '@/context/auth_context';
const Home = () => {
  const auth = useContext(AuthContext);

  return (
    <div>
      Hello
      {/* {auth?.token} {auth?.userId} */}
    </div>
  );
};

export default Home;
