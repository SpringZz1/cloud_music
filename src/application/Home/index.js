import React from 'react';
import { Outlet } from 'react-router';
import { Top, Tab, TabItem } from './style';
import { NavLink } from 'react-router-dom';

function Home(props) {
  return (
    <div>
      <Top>
        <span className="iconfonr menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/" activeclassname="selected">
          <TabItem>
            <span>推荐</span>
          </TabItem>
        </NavLink>
        <NavLink to="/singers" activeclassname="selected">
          <TabItem>
            <span>歌手</span>
          </TabItem>
        </NavLink>
        <NavLink to="/rank" activeclassname="selected">
          <TabItem>
            <span>排行</span>
          </TabItem>
        </NavLink>
      </Tab>
      <Outlet />
    </div>
  );
}

export default React.memo(Home);
