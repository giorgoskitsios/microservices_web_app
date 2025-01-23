// Header2.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SolveLogo from "../assets/Solve_Logo_OnlyLetters3.png";
import InstructionsWindow from "./InstructionsWindow"; // Εισαγωγή του InstructionsWindow component

const Header2: React.FC = () => {
  const navigate = useNavigate();

  // State για την εμφάνιση του InstructionsWindow
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Λειτουργίες για άνοιγμα/κλείσιμο του InstructionsWindow
  const handleInstructionsClick = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructionsWindow = () => {
    setIsInstructionsOpen(false);
  };

  // Λειτουργία για το logout
  const handleLogout = () => {
    // Αφαίρεση του token από το localStorage ή sessionStorage
    localStorage.removeItem("token"); // Ή sessionStorage.removeItem("token");

    // Ανακατεύθυνση στη σελίδα "/"
    navigate("/");
  };

  return (
    <div
      className="w-full bg-gray-100 absolute top-0 left-0 flex items-center justify-between"
      style={{
        height: "15vh",
        boxShadow: "0 15px 20px rgba(128, 128, 128, 0.5)",
      }}
    >
      {/* Λογότυπο Solve */}
      <img
        src={SolveLogo}
        alt="Solve Logo"
        style={{
          height: "95px",
          width: "auto",
          marginLeft: "50px",
          marginTop: "15px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/user")}
      />

      {/* Κουμπί Instructions */}
      <button
        className="bg-gray-200 text-black px-2 py-2 rounded drop-shadow-md border border-black"
        style={{
          marginRight: "130px", // Adjusted position for Instructions
          position: "absolute",
          right: "130px", // Distance from the right (adjust as needed)
          top: "35%", // Distance from the top (adjust as needed)
        }}
        onClick={handleInstructionsClick}
      >
        INSTRUCTIONS
      </button>

      {/* Κουμπί Logout */}
      <button
        className="bg-gray-200 text-black px-8 py-2 rounded drop-shadow-md border border-black"
        style={{
          marginRight: "50px", // Adjusted position for Logout
          position: "absolute",
          right: "50px", // Distance from the right (adjust as needed)
          top: "35%", // Distance from the top (adjust as needed)
        }}
        onClick={handleLogout}
      >
        LOGOUT
      </button>

      {/* Εμφάνιση του InstructionsWindow όταν είναι ανοιχτό */}
      {isInstructionsOpen && (
        <InstructionsWindow onClose={handleCloseInstructionsWindow} />
      )}
    </div>
  );
};

export default Header2;
