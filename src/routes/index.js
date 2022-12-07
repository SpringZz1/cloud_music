import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../application/Home';
const Recommend = lazy(() => import('../application/Recommend'));
const Singers = lazy(() => import('../application/Singers'));
const Rank = lazy(() => import('../application/Rank'));
const Singer = lazy(() => import('../application/Singer'));
const Album = lazy(() => import('../application/Album'));
const Search = lazy(() => import('../application/Search'));
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
          <Suspense>
            <Recommend />
          </Suspense>
        ),
        children: [
          {
            path: ':id',
            element: (
              <Suspense>
                <Album />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/singers',
        element: (
          <Suspense>
            <Singers />
          </Suspense>
        ),
        children: [
          {
            path: '/singers/:id',
            element: (
              <Suspense>
                <Singer />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'rank',
        element: (
          <Suspense>
            <Rank />
          </Suspense>
        ),
        children: [
          {
            path: ':id',
            element: (
              <Suspense>
                <Album />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'search',
        element: (
          <Suspense>
            <Search />
          </Suspense>
        ),
      },
      // 添加album路由, 用来显示歌单
      {
        path: '/album/:id',
        element: (
          <Suspense>
            <Album />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
