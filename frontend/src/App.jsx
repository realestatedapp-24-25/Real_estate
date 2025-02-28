import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import SignupPage from "./page/SignupPage";
import SigninPage from "./page/SigninPage";
import DonorDashboard from "./components/Dashboards/DonorDashboard";
import InstituteDashboard from "./components/Dashboards/InstituteDashboard";
import UserDashboard from "./components/Dashboards/UserDashboard";
import DashLayout from "./components/DashLayout";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import PostSignupForm from "./components/PostSignupForm";
import RequestList from './components/RequestList';
import RequestDetail from './components/RequestDetail';
import DonationProcess from './components/DonationProcess';
import DonationDetails from './components/DonationDetails';
import MyDonations from './components/MyDonations';
import RequestForm from './components/RequestForm';
import { useContext } from 'react';
import MyRequest from "./components/Myrequest";
import InstituteReviews from './components/InstituteReviews';
import Features from './components/Features';
import AboutUs from './components/AboutUs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="max-w-8xl mx-auto">
          <NavigationBar />
          <Routes>
            {/* Open Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/donate/:instituteId" element={<DonationProcess />} />
            <Route path="/donate/:instituteId/details" element={<DonationDetails />} />

            {/* Protected Routes with DashLayout */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              {/* Profile routes here */}
              <Route
                path="send-request"
                element={
                  <InstituteRoute>
                    <RequestForm />
                  </InstituteRoute>
                }
              />
              <Route
                path="requests"
                element={
                  <InstituteRoute>
                    <MyRequest />
                  </InstituteRoute>
                }
              />
              <Route
                path="my-donations"
                element={
                  <DonorRoute>
                    <MyDonations />
                  </DonorRoute>
                }
              />
            </Route>

            <Route
              path="/post-signup"
              element={
                <ProtectedRoute>
                  <PostSignupForm />
                </ProtectedRoute>
              }
            />

            <Route path="/institute-reviews" element={<InstituteReviews />} />

            {/* Add these new routes */}
            <Route path="/features" element={<Features />} />
            <Route path="/aboutus" element={<AboutUs />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Add this component to protect institute-only routes
const InstituteRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  
  if (!user || user.role !== 'institute') {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

// Add this component to protect donor-only routes
const DonorRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  
  if (!user || user.role !== 'donor') {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

export default App;