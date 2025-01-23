// InstructionsWindow.tsx
import React from "react";

interface InstructionsWindowProps {
  onClose: () => void;
}

const InstructionsWindow: React.FC<InstructionsWindowProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 1500 }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg border border-black"
        style={{ width: "500px", height: "500px", zIndex: 1550 }}
      >
        <h2 className="text-center text-lg font-bold mb-4">About SOLVE</h2>

        {/* Πρώτη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          Please choose the Submit a Problem icon to upload a tsv file with your
          preferred data or choose an already existing dataset. Please fill in
          the input parameters and click submit to begin the solving process.
        </p>

        {/* Δεύτερη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          You can monitor your pending problems by clicking the Pending Problems
          Icon or you can view the results by clicking the solved problems icon.
        </p>
        {/* Τρίτη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          By clicking the Credits icon, you can view your existing credits or
          buy new ones.
        </p>

        {/* Τέταρτη παράγραφος */}
        <p className="text-justify text-sm mb-4">
          You can view stats of your past solved cases by clicking the Show
          Stats icon.
        </p>

        <div className="mt-6 text-center">
          <button
            className="text-sm bg-gray-300 text-gray-700 px-4 py-2 border border-gray-500 rounded hover:bg-gray-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsWindow;
