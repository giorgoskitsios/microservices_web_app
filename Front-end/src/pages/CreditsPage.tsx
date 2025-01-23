import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Χρησιμοποιούμε το axios για API requests
import Header2 from '../components/Header2'; // Εισαγωγή του Header2
import Footer from '../components/Footer'; // Εισαγωγή του Footer

const CreditsPage: React.FC = () => {
  // Καταστάσεις (states) για τα credits
  const [credits, setCredits] = useState<number>(0);

  // Fetch των credits από το backend κατά το άνοιγμα της σελίδας
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem('token'); // Λήψη του token από το localStorage

        const response = await axios.get('http://localhost:5006/api/balance', {
          headers: {
            Authorization: `Bearer ${token}`, // Προσθήκη του token στην κεφαλίδα Authorization
          },
        });

        setCredits(response.data.amount); // Αποθηκεύουμε τα credits από την απόκριση
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, []);

  // Λειτουργία για την αύξηση των credits
  const handleAddCredits = async () => {
    try {
      const token = localStorage.getItem('token');

      // Υποθέτοντας ότι κάθε φορά που πατάμε το κουμπί, προσθέτουμε 10 credits
      const newAmount = 10;

      const response = await axios.post(
        'http://localhost:5006/api/balance',
        { amount: newAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setCredits(response.data.amount); // Ενημερώνουμε τα credits από την απόκριση
      alert('Credits updated successfully!');
    } catch (error) {
      console.error('Error updating credits:', error);
      alert('Failed to update credits. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header2 */}
      <Header2 />

      {/* Κεντραρισμένο πλαίσιο με credits */}
      <div className="flex-grow flex items-center justify-center relative">
        <div
          style={{
            width: '400px',
            height: '300px',
            backgroundColor: 'rgba(128, 128, 128, 0.3)', // Faded grey χρώμα
            position: 'absolute',
            left: '520px', // Προσαρμόστε το με βάση τα pixels που θέλετε από τα αριστερά
            top: '230px', // Προσαρμόστε το με βάση τα pixels που θέλετε από το πάνω μέρος
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px', // Ελαφρώς στρογγυλεμένες γωνίες
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Προσθήκη σκιάς
            border: '2px solid black', // Μαύρο περίγραμμα
          }}
        >
          <h2 className="text-2xl mb-4">Credits Balance</h2>
          <p className="text-lg mb-8">{credits} Credits</p>{' '}
          {/* Εμφανίζει τα τρέχοντα credits */}
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleAddCredits} // Προσθήκη λειτουργίας για αύξηση των credits
          >
            Add Credits
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CreditsPage;
