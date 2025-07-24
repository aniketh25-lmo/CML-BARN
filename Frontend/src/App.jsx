import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './protectedRouteFarmer';

// Layout and Error Components
import RootLayout from './components/RootLayout';
import Error from './components/Error';
import Home from './components/Home';
import ChatStream from './components/ChatStream';
import ProtectedBothRoute from './ProtectedBothRoute';
import AdminDashboard from './components/manager/AdminDashboard';
import DeveloperTeam from './components/DeveloperTeam';
import Contact from './components/Contact';
// Manager Components
import ManagerDashboard from './components/manager/ManagerDashboard';
import ManagerRegister from './components/manager/ManagerRegister';
import ManagerLogin from './components/manager/ManagerLogin';
import AddFarmer from './components/manager/AddFarmer';
import FarmerDetails from './components/manager/FarmerDetails';
import Production from './components/manager/Production';
import ExcelUpload from './components/manager/Excel';
import MarketView from './components/manager/Market';
import DonationView from './components/manager/Donation';
import ManagerPrivateRoute from './ManagerPrivateRoute';
// Farmer Components
import FarmerLogin from './components/FarmerLogin';
import FarmerSignup from './components/FarmerSign';
// import FarmerLivestock from './components/SellProduct';
import FarmerHome from './components/FarmerDashboard';
import FarmerInsights from './components/FarmerInsights';
import FarmerProfile from './components/FarmerProfile';
import GovernmentBeneficiaries from './components/GovernmentBenficiaries';
// import Market from './components/Market';
import Sell from './components/Sell';
import Buy from './components/Buy';
// Admin Pages
// import AdminDashboard from './components/admin/admindashboard';
// import ManageDonors from './components/admin/ManageDonors';
// import ManageFarmers from './components/admin/ManageFarmers';
// import ManageManagers from './components/admin/ManageManagers';

// Payment Services
import PaymentServices from './components/PaymentServices';

// Forgot Password Components
import ForgotPassword from './components/manager/ForgotPassword';
import ResetPassword from './components/manager/ResetPassword';
import WeatherAlert from './components/WeatherAlert';
const router = createBrowserRouter([

  // Group 1: Routes with RootLayout (navbar, footer etc.)
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/manager-register', element: <ManagerRegister /> },
      { path: '/manager-login', element: <ManagerLogin /> },
      { path: '/farmer-signup', element: <FarmerSignup /> },
      { path: '/farmer-login', element: <FarmerLogin /> },
      {path: '/market', element: <Buy/>},
      {path: '/developer-team', element: <DeveloperTeam />},
      {path: '/contact', element: <Contact />},

      // Forgot & Reset Password
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },

      // ✅ Payment route (inside RootLayout so navbar/footer show up)
      { path: '/payment', element: <PaymentServices /> },
    ],
  },

  // Group 2: Protected and dashboard-only routes
  {
    path: '/farmer-dashboard',
    element: (
      <ProtectedRoute>
        <FarmerHome />
      </ProtectedRoute>
    ),
  },

  {
    path: '/farmer-profile',
    element: (
      <ProtectedRoute>
        <FarmerProfile />
      </ProtectedRoute>
    ),
  },

  {
    path: '/farmer-insights',
    element: (
      <ProtectedRoute>
        <FarmerInsights />
      </ProtectedRoute>
    ),
  },

  {
    path: '/farmer-schemes',
    element: (
      <ProtectedRoute>
        <GovernmentBeneficiaries />
      </ProtectedRoute>
    ),
  },

  {
    path: '/farmer-home',
    element: (
    <ProtectedRoute>
    <FarmerHome />
    </ProtectedRoute>
    )
  },
  
 
  {
    path: '/excel',
    element: (
      <ManagerPrivateRoute>
      <ExcelUpload />
      </ManagerPrivateRoute>
    )
  },

  {
    path: '/market-view',
    element: (
      <ManagerPrivateRoute>
      <MarketView />
      </ManagerPrivateRoute>
    )
  },

  {
    path: 'donation-view',
    element: (
      <ManagerPrivateRoute>
      <DonationView />
      </ManagerPrivateRoute>
    )
  },
  // {
  //   path: '/market',
  //   element:(
  //     <Buy/>
  //   )
  // },
  {
    path: '/manager-dashboard',
    element: (
    <ManagerPrivateRoute>
    <ManagerDashboard />
    </ManagerPrivateRoute>
    )
  },
  {
    path: '/add-farmer',
    element: (
    <ManagerPrivateRoute>
    <AddFarmer />
    </ManagerPrivateRoute>
    )
  },
  {
    path: '/weather-alert',
    element: (
    <ProtectedBothRoute>
    <WeatherAlert />
    </ProtectedBothRoute>
    )
  },

  {
    path: '/chat-stream',
    element: (
    <ProtectedBothRoute>
    <ChatStream />
    </ProtectedBothRoute>
    )
  },

  // {
  //   path: '/farmer-livestock',
  // }
  {
    path: '/production',
    element: (
    <ManagerPrivateRoute>
    <Production />
    </ManagerPrivateRoute>
    )
  },

  {
    path: '/farmer-details',
    element: 
    (
    <ManagerPrivateRoute>
    <FarmerDetails />
    </ManagerPrivateRoute>
    )
  },

  {
    path: '/sell',
    element: (
    <ProtectedRoute>
    <Sell />
    </ProtectedRoute>
  )
  },

  {
    path : 'admin-dashboard',
    element: (
    <AdminDashboard />
    )
  },
  // {
  //   path: '/farmer-login',
  //   element: <FarmerLogin />,
  // },
  // {
  //   path: '/farmer-signup',
  //   element: <FarmerSignup />,
  // },
  // {
  //   path: '/farmer-livestock',
  //   element: <FarmerLivestock />,
  // },
  
  // {
  //   path: '/farmer-profile',
  //   element: <FarmerProfile />,
  // },
  

  // Admin Routes (optional — you can enable them later)
  // { path: '/admin-dashboard', element: <AdminDashboard /> },
  // { path: '/manage-donors', element: <ManageDonors /> },
  // { path: '/manage-farmers', element: <ManageFarmers /> },
  // { path: '/manage-managers', element: <ManageManagers /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
