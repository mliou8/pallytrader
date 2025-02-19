import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Providers from "./providers/PrivyProvider.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import MyPositions from "./pages/MyPositions.tsx";
import PallyReports from "./pages/Assistant.tsx";
import Profile from "./pages/Profile.tsx";
import Referrals from "./pages/Referrals.tsx";
import TrackWallets from "./pages/TrackWallets.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          {/* Wrap Dashboard in ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested routes for the dashboard */}
            <Route index element={<MyPositions />} /> {/* Default page */}
            <Route path="mypositions" element={<MyPositions />} />
            <Route path="pallyreports" element={<PallyReports />} />
            <Route path="trackwallets" element={<TrackWallets />} />
            <Route path="profile" element={<Profile />} />
            {/* <Route path="referrals" element={<Referrals />} /> */}
          </Route>

          {/* Catch-all route to redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </Providers>
  </StrictMode>,
);
