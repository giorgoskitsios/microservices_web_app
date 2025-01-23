// main.tsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LoginWindow from "./components/LoginWindow";
import UserPage from "./pages/UserPage";
import SubmitProblemPage from "./pages/SubmitProblemsPage"; // Εισαγωγή του SubmitProblemPage
import PendingProblemsPage from "./pages/PendingProblemsPage"; // Εισαγωγή της σελίδας
import SolvedProblemsPage from "./pages/SolvedProblemsPage"; // Εισαγωγή του SolvedProblemsPage
import CreditsPage from "./pages/CreditsPage"; // Εισαγωγή του CreditsPage
import StatsPage from "./pages/StatsPage"; // Εισαγωγή του StatsPage
import ProtectedRoute from "./components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // Εισαγωγή του index.css

const clientId =
  "1073639812037-prhnipfac9ku831ruj1huft8tqqmdo6r.apps.googleusercontent.com";

const router = createBrowserRouter([
  {
    index: true,
    element: <App />,
  },
  {
    path: "login",
    element: <LoginWindow onClose={() => {}} />,
  },
  {
    path: "user",
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "submit-problem",
    element: (
      <ProtectedRoute>
        <SubmitProblemPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "pending-problems", // Διορθωμένο path
    element: (
      <ProtectedRoute>
        <PendingProblemsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "solved-problems",
    element: (
      <ProtectedRoute>
        <SolvedProblemsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "credits",
    element: (
      <ProtectedRoute>
        <CreditsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "stats",
    element: (
      <ProtectedRoute>
        <StatsPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
