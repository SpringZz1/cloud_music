import React from 'react';
import { Outlet } from 'react-router'

function Home(props) {
  return <div>
    <h1>Home</h1>
    <Outlet />
  </div>;
}

export default React.memo(Home);
