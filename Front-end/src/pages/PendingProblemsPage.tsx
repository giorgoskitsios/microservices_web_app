import React, { useEffect, useState } from 'react';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';

// Ορισμός τύπου για το πρόβλημα
interface Problem {
  _id: string;
  userId: string;
  name: string;
  price: number;
  locations: {
    latitude: number;
    longitude: number;
  }[];
  numVehicles: number;
  depot: number;
  maxDistance: number;
  createdAt: string;
  updatedAt: string;
}

// Ορισμός τύπου για τα props του πλαισίου
interface PendingProblemsPageProps {
  width?: number; // Πλάτος του πλαισίου σε pixels
  height?: number; // Ύψος του πλαισίου σε pixels
  top?: number; // Απόσταση από το πάνω μέρος της σελίδας
  left?: number; // Απόσταση από το αριστερό μέρος της σελίδας
}

const PendingProblemsPage: React.FC<PendingProblemsPageProps> = ({
  width = 800, // Default πλάτος
  height = 450, // Default ύψος
  top = 150, // Default top position
  left = 350, // Default left position
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  // Φόρτωση δεδομένων από το back-end
  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      try {
        const response = await fetch('http://localhost:5005/api/problems', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Κλείσιμο του modal
  const closeModal = () => {
    setSelectedProblem(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header2 */}
      <Header2 />

      {/* Περιεχόμενο της σελίδας */}
      <div
        className="absolute"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          top: `${top}px`,
          left: `${left}px`,
          border: '2px solid gray',
          backgroundColor: 'white',
          borderRadius: '1 rem',
          boxShadow: '0 0 10px rgba(0, 0, 0, 2)',
          overflowY: 'auto',
          padding: '1rem',
        }}
      >
        <h1 className="text-3xl mb-4 text-center">Submitted Problems</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul>
            {problems.map((problem) => (
              <li
                key={problem._id}
                className="cursor-pointer border p-2 mb-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200"
                onClick={() => setSelectedProblem(problem)}
              >
                <p>
                  <strong>ID:</strong> {problem._id}
                </p>
                <p>
                  <strong>Name:</strong> {problem.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal για εμφάνιση λεπτομερειών */}
      {selectedProblem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg relative overflow-y-auto"
            style={{
              width: '800px',
              height: '450px',
              border: '2px solid black', // Προσθέτουμε το μαύρο περίγραμμα εδώ
            }}
            onClick={(e) => e.stopPropagation()} // Αποτρέψτε το κλείσιμο του modal όταν κάνετε κλικ μέσα του
          >
            <h2 className="text-2xl mb-4 text-center">Problem Details</h2>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              X
            </button>
            <p>
              <strong>ID:</strong> {selectedProblem._id}
            </p>
            <p>
              <strong>Name:</strong> {selectedProblem.name}
            </p>
            <p>
              <strong>Price:</strong> ${selectedProblem.price}
            </p>
            <p>
              <strong>Number of Vehicles:</strong> {selectedProblem.numVehicles}
            </p>
            <p>
              <strong>Depot:</strong> {selectedProblem.depot}
            </p>
            <p>
              <strong>Max Distance:</strong> {selectedProblem.maxDistance}
            </p>
            <p>
              <strong>Locations:</strong>
            </p>
            <ul className="ml-4">
              {selectedProblem.locations.map((loc, index) => (
                <li key={index}>
                  Latitude: {loc.latitude}, Longitude: {loc.longitude}
                </li>
              ))}
            </ul>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(selectedProblem.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(selectedProblem.updatedAt).toLocaleString()}
            </p>

            {/* Κουμπί Close */}
            <div className="flex justify-center mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PendingProblemsPage;
