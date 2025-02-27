import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import SignupPage from "./page/SignupPage";
import SigninPage from "./page/SigninPage";
import DonorDashboard from "./components/Dashboards/DonorDashboard";
import InstituteDashboard from "./components/Dashboards/InstituteDashboard";
import UserDashboard from "./components/Dashboards/UserDashboard";
import DashLayout from "./components/DashLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import PostSignupForm from "./components/PostSignupForm";
import RequestList from './components/RequestList';
import RequestDetail from './components/RequestDetail';
import DonationProcess from './components/DonationProcess';
import DonationDetails from './components/DonationDetails';

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
              {/* Profile routes here */}
            </Route>

            <Route
              path="/post-signup"
              element={
                <ProtectedRoute>
                  <PostSignupForm />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;