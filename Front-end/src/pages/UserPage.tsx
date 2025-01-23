import React from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
import SubmitIcon from "../assets/Submit.png";
import SolvedIcon from "../assets/Solved.png";
import CreditsIcon from "../assets/Credits.png";
import PendingIcon from "../assets/Pending.png"; // Προσθέστε το νέο εικονίδιο
import StatsIcon from "../assets/Stats.png";

const UserPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header2 */}
      <Header2 />

      {/* Το κείμενο μέσα σε μετακινούμενο πλαίσιο */}
      <div
        className="bg-gray-100 p-4 rounded-lg drop-shadow-xl absolute border border-black"
        style={{
          top: "21%",
          left: "40%",
          width: "auto",
        }}
      >
        <h1 className="text-3xl text-center"> Welcome to SOLVE!</h1>
        <p className="text-2xl text-center mt-2">Please choose an option.</p>
      </div>

      {/* Κεντρικό περιεχόμενο */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Εικονίδια με μετακίνηση 100px δεξιά */}
        <div
          className="flex justify-center items-center mt-10"
          style={{ transform: "translateX(+100px)" }}
        >
          {/* Submit Icon */}
          <img
            src={SubmitIcon}
            alt="Submit"
            className="mx-12"
            style={{ width: "160px", height: "160px", cursor: "pointer" }}
            onClick={() => navigate("/submit-problem")}
          />

          {/* Pending Problems Icon */}
          <img
            src={PendingIcon}
            alt="Pending"
            className="mx-12"
            style={{ width: "160px", height: "160px", cursor: "pointer" }}
            onClick={() => navigate("/pending-problems")}
          />

          {/* Solved Problems */}
          <img
            src={SolvedIcon}
            alt="Solved"
            className="mx-12"
            style={{ width: "160px", height: "160px", cursor: "pointer" }}
            onClick={() => navigate("/solved-problems")}
          />

          {/* Credits */}
          <img
            src={CreditsIcon}
            alt="Credits"
            className="mx-12"
            style={{ width: "160px", height: "160px", cursor: "pointer" }}
            onClick={() => navigate("/credits")}
          />

          {/* Stats */}
          <img
            src={StatsIcon}
            alt="Stats"
            className="mx-12"
            style={{ width: "160px", height: "160px", cursor: "pointer" }}
            onClick={() => navigate("/stats")}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserPage;
