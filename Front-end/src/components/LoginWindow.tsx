// LoginWindow.tsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

interface LoginWindowProps {
  onClose: () => void;
}

const LoginWindow: React.FC<LoginWindowProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    const authorizationToken = credentialResponse.credential;

    // Αποστολή του Google OAuth token στο backend
    fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: authorizationToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Διαχείριση του response από το backend server
        console.log('Login successful, backend response:', data);

        // Αποθήκευση του JWT token στο localStorage
        const token = data.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token:', token);

          // Ανακατεύθυνση στη σελίδα UserPage
          navigate('/user');
          onClose(); // Κλείστε το παράθυρο σύνδεσης
        } else {
          console.error('Token not received from the backend server.');
        }
      })
      .catch((error) => {
        console.error('Exchange authorization code error:', error);
      });
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 1500 }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg border border-black" // Προσθέσαμε τις κλάσεις border και border-black
        style={{ width: '300px', height: '300px', zIndex: 1550 }}
      >
        <h2 className="text-center text-lg mb-4">
          Please login using your Google account
        </h2>
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
        <div className="mt-4 text-center">
          <button
            className="text-sm bg-gray-300 text-gray-700 px-4 py-2 border border-black rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginWindow;
