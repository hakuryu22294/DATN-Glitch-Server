// GA
import ReactGA from 'react-ga4';

// utils
import {lazy, Suspense} from 'react';

// styles
import '@styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import ThemeStyles from '@styles/theme';

// fonts
import '@fonts/icomoon/icomoon.woff';

// contexts
import {SidebarProvider} from '@contexts/sidebarContext';
import {ThemeProvider} from 'styled-components';

// hooks
import {useTheme} from '@contexts/themeContext';
import {useEffect, useRef} from 'react';
import {useWindowSize} from 'react-use';

// components
import ScrollToTop from '@components/ScrollToTop';
import Loader from '@components/Loader';
import {Route, Routes, useLocation, Navigate} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Sidebar from '@layout/Sidebar';
import Copyright from '@components/Copyright';
import AppBar from '@layout/AppBar';

// pages
const Login  = lazy(() => import('@pages/Login'));
const SalesAnalytics = lazy(() => import('@pages/SalesAnalytics'));
const SellersList = lazy(() => import('@pages/SellersList'));
const SellersTable = lazy(() => import('@pages/SellersTable'));
const SellersGrid = lazy(() => import('@pages/SellersGrid'));
const SellerProfile = lazy(() => import('@pages/SellerProfile'));
const RevenueByPeriod = lazy(() => import('@pages/RevenueByPeriod'));
const TopProducts = lazy(() => import('@pages/TopProducts'));
const ProductsGrid = lazy(() => import('@pages/ProductsGrid'));
const ProductsManagement = lazy(() => import('@pages/ProductsManagement'));
const ProductEditor = lazy(() => import('@pages/EditProduct'));
const Banners = lazy(() => import('@pages/Banners'));
const Orders = lazy(() => import('@pages/Orders'));
const Statistics = lazy(() => import('@pages/Statistics'));
const Reviews = lazy(() => import('@pages/Reviews'));
const Customers = lazy(() => import('@pages/Customers'));
const Transactions = lazy(() => import('@pages/Transactions'));
const GeneralSettings = lazy(() => import('@pages/GeneralSettings'));
const ConnectedApps = lazy(() => import('@pages/ConnectedApps'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
