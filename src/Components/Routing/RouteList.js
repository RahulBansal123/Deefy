import React, { lazy } from 'react';

const Dashboard = lazy(() => import('../Dashboard'));
const Auth = lazy(() => import('../Auth'));
const NotFound = lazy(() => import('../NotFound'));
const Explorer = lazy(() => import('../Explorer'));
const Pools = lazy(() => import('../Pools'));
// private => Route requires authentication
// layout => header should be visible or not
// restricted => authenticated user cannot visit login type restriction

export const RouteList = [
  {
    link: '/dashboard',
    private: true,
    layout: true,
    render: () => <Dashboard />,
  },
  {
    link: '/explorer',
    private: true,
    layout: true,
    render: () => <Explorer />,
  },
  {
    link: '/pools',
    private: true,
    layout: true,
    render: () => <Pools />,
  },
  {
    link: '/login',
    private: false,
    restricted: true,
    layout: false,
    render: (props) => <Auth {...props} />,
  },
  {
    link: '/404',
    private: false,
    layout: false,
    render: () => <NotFound />,
  },
  {
    link: '/500',
    private: false,
    layout: false,
    render: () => <h1>Server error occured</h1>,
  },

  {
    link: '/',
    private: false,
    layout: false,
    restricted: true,
    render: (props) => <Auth {...props} />,
  },
];
