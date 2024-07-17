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
