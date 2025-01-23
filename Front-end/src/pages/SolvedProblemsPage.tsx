import React, { useEffect, useState } from 'react';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';

// Ορισμός τύπου για το λυμένο πρόβλημα
interface Problem {
  _id: string;
  submitId: string;
  hasSolution: boolean;
  solution: {
    objective: string;
    maxDistance: number;
    vehicles: {
      plan: number[];
      dist: number;
    }[];
  };
  duration: number;
  createdAt: string;
  updatedAt: string;
}

// Ορισμός τύπου για τα props του πλαισίου
interface SolvedProblemsPageProps {
  width?: number; // Πλάτος του πλαισίου σε pixels
  height?: number; // Ύψος του πλαισίου σε pixels
  top?: number; // Απόσταση από το πάνω μέρος της σελίδας
  left?: number; // Απόσταση από το αριστερό μέρος της σελίδας
}

const SolvedProblemsPage: React.FC<SolvedProblemsPageProps> = ({
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
      try {
        const response = await fetch('http://localhost:5007/api/completed/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch solved problems');
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
        <h1 className="text-3xl mb-4 text-center">Solved Problems</h1>
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
                  <strong>Submit ID:</strong> {problem.submitId}
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
              height: '400px',
              border: '2px solid black',
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
              <strong>Submit ID:</strong> {selectedProblem.submitId}
            </p>
            <p>
              <strong>Has Solution:</strong>{' '}
              {selectedProblem.hasSolution ? 'Yes' : 'No'}
            </p>

            {/* Εμφάνιση λεπτομερειών λύσης αν υπάρχει */}
            {selectedProblem.hasSolution && selectedProblem.solution && (
              <>
                <p>
                  <strong>Objective:</strong>{' '}
                  {selectedProblem.solution.objective}
                </p>
                <p>
                  <strong>Max Distance:</strong>{' '}
                  {selectedProblem.solution.maxDistance}
                </p>
                <p>
                  <strong>Vehicles:</strong>
                </p>
                <ul className="ml-4">
                  {selectedProblem.solution.vehicles.map((vehicle, index) => (
                    <li key={index}>
                      Plan: {vehicle.plan.join(', ')}, Distance: {vehicle.dist}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p>
              <strong>Duration:</strong> {selectedProblem.duration} minutes
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

export default SolvedProblemsPage;
