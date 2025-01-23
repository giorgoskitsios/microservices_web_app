// AboutWindow.tsx
import React from "react";

interface AboutWindowProps {
  onClose: () => void;
}

const AboutWindow: React.FC<AboutWindowProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 1500 }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg border border-black"
        style={{ width: "400px", height: "400px", zIndex: 1550 }}
      >
        <h2 className="text-center text-lg font-bold mb-4">About SOLVE</h2>

        {/* Πρώτη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          SOLVE is an online Solving Platform for the Vehicle Routing Problem
          (VRP). You can submit various sized inputs for optimisation, manage
          your credits and view stats for past solved cases.
        </p>

        {/* Δεύτερη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          SOLVE was created as part of the Software as a Service (SaaS) Module
          of the NTUA Electrical and Computer Engineering Diploma during the
          spring semester of 2024.
        </p>

        {/* Τρίτη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          Please enter by using your Google Credentials.
        </p>

        <div className="mt-6 text-center">
          <button
            className="text-sm bg-gray-300 text-gray-700 px-4 py-2 border border-black rounded hover:bg-gray-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutWindow;
