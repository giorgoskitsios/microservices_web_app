// Header.tsx
import React, { useState } from 'react';
import SolveLogo from '../assets/Solve_Logo_OnlyLetters3.png';
import AboutWindow from './AboutWindow'; // Εισαγωγή του AboutWindow component

interface HeaderProps {
  onLoginClick: () => void; // Event για το κλικ στο login
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isAboutWindowOpen, setIsAboutWindowOpen] = useState(false);

  // Λειτουργία για το άνοιγμα του AboutWindow
  const handleLearnAboutClick = () => {
    setIsAboutWindowOpen(true);
  };

  // Λειτουργία για το κλείσιμο του AboutWindow
  const handleCloseAboutWindow = () => {
    setIsAboutWindowOpen(false);
  };

  return (
    <div
      className="w-full bg-gray-100 absolute top-0 left-0 flex items-center justify-between"
      style={{
        height: '15vh',
        boxShadow: '0 15px 20px rgba(128, 128, 128, 0.5)',
      }}
    >
      {/* Λογότυπο Solve */}
      <img
        src={SolveLogo}
        alt="Solve Logo"
        style={{
          height: '95px',
          width: 'auto',
          marginLeft: '50px',
          cursor: 'pointer',
        }}
      />

      {/* Κουμπιά Learn About και Login */}
      <div className="flex items-center" style={{ marginRight: '50px' }}>
        {/* Learn About Button */}
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded drop-shadow-md border border-black"
          style={{
            marginRight: '20px',
            cursor: 'pointer',
            position: 'absolute',
            right: '150px', // Ρυθμίστε την οριζόντια θέση (προσαρμόστε το αν χρειαστεί)
            top: '37%', // Ρυθμίστε την κάθετη θέση (προσαρμόστε το αν χρειαστεί)
            width: '130px', // Ορίστε ένα σταθερό πλάτος
          }}
          onClick={handleLearnAboutClick}
        >
          Learn About
        </button>

        {/* Login Button */}
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded drop-shadow-md border border-black"
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '20px', // Ρυθμίστε την οριζόντια θέση (προσαρμόστε το αν χρειαστεί)
            top: '37%', // Ρυθμίστε την κάθετη θέση (προσαρμόστε το αν χρειαστεί)
            width: '130px', // Ορίστε το ίδιο σταθερό πλάτος με το κουμπί "Learn About"
          }}
          onClick={onLoginClick}
        >
          Login
        </button>
      </div>

      {/* Εμφάνιση του AboutWindow όταν είναι ανοιχτό */}
      {isAboutWindowOpen && <AboutWindow onClose={handleCloseAboutWindow} />}
    </div>
  );
};

export default Header;
