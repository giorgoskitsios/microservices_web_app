import React from "react";
import Header2 from "../components/Header2"; // Εισαγωγή του Header2
import Footer from "../components/Footer"; // Εισαγωγή του Footer

const StatsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header2 */}
      <Header2 />

      {/* Κεντρικό περιεχόμενο */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl text-center">Stats Page!</h1>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StatsPage;
