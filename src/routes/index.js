import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../application/Home';
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      // 默认跳转到推荐列表
      {
        index: true,
        element: <Navigate to="/recommend" />,
      },
      {
        path: '/singers',
        element: <Singers />,
      },
      {
        path: 'rank',
        element: <Rank />,
      },
      {
        path: '/recommend',
        element: <Recommend />,
      },
    ],
  },
]);

export default router;
