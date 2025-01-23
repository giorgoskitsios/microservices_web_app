import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SolveLogoWhite4 from "./assets/Solve_Logo_White_4.png"; // Εισαγωγή του λογότυπου
import LoginWindow from "./components/LoginWindow"; // Εισαγωγή του LoginWindow

const App: React.FC = () => {
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false); // Διαχείριση του παραθύρου login

  // Λειτουργία για το άνοιγμα του LoginWindow
  const handleLoginClick = () => {
    setIsLoginWindowOpen(true); // Άνοιγμα του παραθύρου
  };

  // Λειτουργία για το κλείσιμο του LoginWindow
  const handleCloseWindow = () => {
    setIsLoginWindowOpen(false); // Κλείσιμο του παραθύρου
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header onLoginClick={handleLoginClick} />

      {/* Κεντρικό μέρος με το λογότυπο */}
      <div className="flex-grow flex items-center justify-center bg-white relative">
        <img
          src={SolveLogoWhite4}
          alt="Solve Logo"
          style={{
            height: "400px",
            width: "auto",
            position: "fixed", // Χρήση fixed για να παραμένει το λογότυπο πάντα στη θέση του
            top: "50%", // Κεντραρισμένο κατακόρυφα
            left: "50%", // Κεντραρισμένο οριζόντια
            transform: "translate(-50%, -50%)", // Κεντράρισμα ακριβώς στο κέντρο
            //zIndex: 1100, // Πολύ υψηλό z-index για να είναι σίγουρα ορατό
          }}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Εμφάνιση του LoginWindow όταν είναι ανοιχτό */}
      {isLoginWindowOpen && <LoginWindow onClose={handleCloseWindow} />}
    </div>
  );
};

export default App;
