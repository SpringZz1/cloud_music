import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../application/Home';
const Recommend = React.lazy(() => import('../application/Recommend'));
const Singers = React.lazy(() => import('../application/Singers'));
const Rank = React.lazy(() => import('../application/Rank'));
const Singer = React.lazy(() => import('../application/Singer'));
const Album = React.lazy(() => import('../application/Album'));
const Search = React.lazy(() => import('../application/Search'));
// import Singers from '../application/Singers';
// import Rank from '../application/Rank';
// import Album from '../application/Album';
// import Singer from '../application/Singer';
// import Search from '../application/Search';
// const RecommendComponent = React.lazy(() =>
//   import('../application/Recommend/')
// );

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      // 默认跳转到推荐列表
      {
        // index: true,
        path: '/',
        element: <Navigate to="/recommend" />,
      },
      {
        path: '/recommend',
        // element: <Recommend />,
        element: (
          <React.Suspense>
            <Recommend />
          </React.Suspense>
        ),
        children: [
          {
            path: ':id',
            element: (
              <React.Suspense>
                <Album />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: '/singers',
        element: (
          <React.Suspense>
            <Singers />
          </React.Suspense>
        ),
        children: [
          {
            path: '/singers/:id',
            element: (
              <React.Suspense>
                <Singer />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: 'rank',
        element: (
          <React.Suspense>
            <Rank />
          </React.Suspense>
        ),
        children: [
          {
            path: ':id',
            element: (
              <React.Suspense>
                <Album />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: 'search',
        element: (
          <React.Suspense>
            <Search />
          </React.Suspense>
        ),
      },
      // 添加album路由, 用来显示歌单
      {
        path: '/album/:id',
        element: (
          <React.Suspense>
            <Album />
          </React.Suspense>
        ),
      },
    ],
  },
]);

export default router;
