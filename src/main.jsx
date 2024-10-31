import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './pages/Homepage.jsx';
import TransactionPage from './pages/TransactionPage.jsx';
import Analytics from './pages/Analytics.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

const router = createBrowserRouter([ 
  {
  path: "/",
  element:  <Homepage/>
  },
  {
  path: "/transactions",
  element: <TransactionPage/>
  },
  {
    path: "/analytics",
    element: <Analytics/>
  },
  {
    path: "*",
    element: <ErrorPage/>
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
