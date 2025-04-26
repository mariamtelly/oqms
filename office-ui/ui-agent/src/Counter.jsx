import { useState } from 'react';
import axios from 'axios';

const Counter = ({ counterId }) => {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isServing, setIsServing] = useState(false);

  const callNext = async () => {
    if(isServing) return;
    setIsServing(true);
    try {
      const response = await axios.get(`http://localhost:8001/api/queues/${counterId}`);
      console.log(response.data);
      if (response.data.number) setCurrentTicket(response.data);
      else {
        setIsServing(false);
      }
    } catch (error) {
      console.error('Error calling next ticket:', error);
      alert('Failed to call the next ticket. Try again.');
    }
  };

  const markServed = async () => {
    if (!isServing) return;
    try {
      await axios.post(`http://localhost:8001/api/db/tickets`, {
        ...currentTicket,
        counter_id: counterId,
        served_at: Date.now(),
      });
      setIsServing(false)
      setCurrentTicket(null);
    } catch (error) {
      console.error('Error marking ticket as served:', error);
      alert('Failed to mark ticket as served.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded-2xl shadow-xl text-center">
      <h2 className="text-2xl font-bold mb-4">Counter #{counterId}</h2>

      <div className="text-xl mb-6 text-gray-700">
        {currentTicket ? (
          <>
            <p>
              Currently Serving: <span className="font-bold text-blue-600">{currentTicket.number}</span>
            </p>
          </>
        ) : (
          <p>No ticket currently being served</p>
        )}
      </div>

      <div className="space-x-4">
        <button
          onClick={callNext}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          disabled={isServing}
        >
          Call Next Ticket
        </button>

        <button
          onClick={markServed}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          disabled={!isServing}
        >
          Client Served
        </button>
      </div>
    </div>
  );
};

export default Counter;