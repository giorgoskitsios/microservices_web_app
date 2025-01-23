import React from "react";
import Team23Logo from "../assets/Team23_Logo.png"; // Εισαγωγή του λογότυπου

const Footer: React.FC = () => {
  return (
    <div
      className="w-full bg-gray-100 absolute bottom-0 left-0 flex items-center justify-between"
      style={{
        height: "10vh",
        boxShadow: "0 -15px 20px rgba(128, 128, 128, 0.5)", // Σκιά προς τα πάνω
      }}
    >
      {/* Προσθέτουμε το λογότυπο Team23 κάτω δεξιά */}
      <div className="flex-grow"></div>{" "}
      {/* Κενό για να σπρώξουμε το logo δεξιά */}
      <img
        src={Team23Logo}
        alt="Team23 Logo"
        style={{ height: "35px", width: "auto", marginRight: "50px" }} // Προσαρμογή μεγέθους
      />
    </div>
  );
};

export default Footer;
