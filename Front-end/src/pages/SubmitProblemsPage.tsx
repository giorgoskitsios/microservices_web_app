import React, { useState, useEffect } from 'react';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';
import axios from 'axios'; // Για να κάνουμε τα API requests

// Ορισμός του τύπου Location
interface Dataset {
  _id: string;
  filename: string;
  userId: string;
  originalname: string;
  createdAt: string;
}

// Τύπος για το request body που θα στείλουμε στο backend
interface RequestBody {
  fileId: string;
  num_vehicles: number;
  depot: number;
  max_distance: number;
}

const SubmitProblemsPage: React.FC = () => {
  const [vehicleNumber, setVehicleNumber] = useState<number>(0);
  const [depot, setDepot] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(100000);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null
  );
  const [credits, setCredits] = useState<number>(0);

  // Fetch των datasets από το backend
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/datasets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDatasets(response.data.datasets);
      } catch (error) {
        console.error('Error fetching datasets:', error);
      }
    };

    fetchDatasets();
  }, [selectedFile]);

  // Fetch των credits από το backend
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5006/api/balance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCredits(response.data.credits);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      alert(`File ${file.name} selected for upload`);
    }
  };

  const handleDatasetClick = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
  };

  const handleFileUpload = async () => {
    const token = localStorage.getItem('token');
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDatasetId && !selectedFile) {
      alert('Please select or upload a dataset first.');
      return;
    }
    if (vehicleNumber <= 0 || depot < 0 || maxDistance <= 0) {
      alert('Please enter valid values for all fields.');
      return;
    }
    if (credits < 2) {
      alert('You do not have enough credits to submit a problem.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!selectedDatasetId) {
        alert('File ID is missing. Please select or upload a dataset.');
        return;
      }
      const requestBody: RequestBody = {
        fileId: selectedDatasetId,
        num_vehicles: vehicleNumber,
        depot: depot,
        max_distance: maxDistance,
      };
      console.log('Sending problem data:', requestBody);
      await axios.post('http://localhost:5001/api/problem', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Problem submitted successfully!');
      setCredits((prevCredits) => prevCredits - 10);
    } catch (error) {
      console.error('Error submitting problem:', error);
      alert('There was an error submitting your problem. Please try again.');
    }
  };

  // Στυλ για τα κουμπιά
  const buttonStyle: React.CSSProperties = {
    width: '160px',
    padding: '10px',
    backgroundColor: 'grey',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'border 0.3s ease',
  };

  const hoverButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    border: '2px solid blue',
  };

  const selectedStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    border: '2px solid blue',
    padding: '5px',
    borderRadius: '5px',
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header2 />

      <div
        className="flex flex-col items-center justify-center border border-black"
        style={{
          width: '900px',
          height: '100px',
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          position: 'absolute',
          left: '50%',
          top: '320px',
          transform: 'translateX(-50%)',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 5)',
          padding: '20px',
        }}
      >
        <h3 className="text-xl mb-4">Upload New Dataset</h3>
        <div>
          <input
            id="uploadDataset"
            type="file"
            accept=".json"
            onChange={handleFileChange}
          />
          <button onClick={handleFileUpload}>Upload</button>
        </div>
      </div>

      <div
        className="flex flex-col items-center justify-center border border-black"
        style={{
          width: '900px',
          height: '150px',
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          position: 'absolute',
          left: '50%',
          top: '150px',
          transform: 'translateX(-50%)',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 5)',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <h3 className="text-xl mb-4">Available Datasets</h3>
        <ul className="list-disc list-inside w-full">
          {datasets.length > 0 ? (
            datasets.map((dataset) => (
              <li
                key={dataset._id}
                className="text-sm cursor-pointer"
                style={
                  dataset._id === selectedDatasetId ? selectedStyle : undefined
                }
                onClick={() => handleDatasetClick(dataset._id)}
              >
                {dataset.originalname} (Created on:{' '}
                {new Date(dataset.createdAt).toDateString()})
              </li>
            ))
          ) : (
            <li className="text-sm">No datasets available.</li>
          )}
        </ul>
      </div>

      <div
        className="flex flex-col items-center justify-center border border-black"
        style={{
          width: '900px',
          height: '170px',
          backgroundColor: 'rgba(128, 128, 128, 0.3)',
          position: 'absolute',
          left: '50%',
          top: '450px',
          transform: 'translateX(-50%)',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 5)',
          padding: '20px',
        }}
      >
        <h2 className="text-2xl mb-4">Submit Your VRP Problem</h2>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <label htmlFor="vehicleNumber">Vehicle Number</label>
            <input
              id="vehicleNumber"
              type="number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(parseInt(e.target.value) || 0)}
              className="border rounded px-2 py-1"
              required
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="depot">Depot</label>
            <input
              id="depot"
              type="number"
              value={depot}
              onChange={(e) => setDepot(parseInt(e.target.value) || 0)}
              className="border rounded px-2 py-1"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="maxDistance">Max Distance</label>
            <input
              id="maxDistance"
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value) || 0)}
              className="border rounded px-2 py-1"
              placeholder="15000"
            />
          </div>

          <div className="flex flex-col items-center space-y-4">
            <button
              type="submit"
              style={
                hoveredButton === 'submit' ? hoverButtonStyle : buttonStyle
              }
              onMouseEnter={() => setHoveredButton('submit')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitProblemsPage;
