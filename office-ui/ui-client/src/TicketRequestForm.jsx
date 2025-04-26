import { useState, useEffect } from 'react';
import axios from 'axios';

const TicketRequestForm = () => {
  const [selectedServiceID, setSelectedServiceID] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [services, setServices] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedServiceID) return;
    
    try {
      const response = await axios.post('http://localhost:8001/api/tickets', {
        id: selectedServiceID,
      });
      setTicketInfo(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      alert('Failed to get a ticket. Try again.');
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/db/services');
        setServices(response.data); 
      } catch (error) {
        console.error('Error fetching services:', error);
        alert('Failed to fetch services. Try again.');
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Request a Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {services.map((service) => (
          <label key={service.id} className="flex items-center space-x-3">
            <input
              type="radio"
              name="service"
              value={service.name}
              onChange={(e) => setSelectedServiceID(service.id)}
              className="accent-blue-600"
            />
            <span>{service.name}</span>
          </label>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Get Ticket
        </button>
      </form>

      {ticketInfo !== null && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
          <p className="text-lg font-medium">Your ticket number:</p>
          <p className="text-2xl font-bold">{ticketInfo.number}</p>
          <p className="text-xl font-bold">{ticketInfo.estimated_wait_time} mns</p>
        </div>
      )}
    </div>
  );
};

export default TicketRequestForm;