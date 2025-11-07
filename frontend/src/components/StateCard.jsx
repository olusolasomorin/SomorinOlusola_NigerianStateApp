import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function StateCard() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getStates() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/states");
      if (!response.ok) {
        throw new Error("Encountered an issue while fetching states");
      }
      const data = await response.json();
      setStates(data.states || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getStates();
  }, []);
  if (loading) return <p>Loading states...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container">
      <div className="head-cont">
        <h1 className="nig">Nigerian States Card</h1>
        <button className="log-out">
            Log Out
        </button>
      </div>
      {states.length === 0 ? (
        <p>States not found.</p>
      ) : (
        <div className="state-list">
          {states.map(state => (
            <div key={state.id} className="state-card">
                <p><span>State Name:</span> {state.name}</p>
                <p><span>Capital:</span> {state.capital}</p>
                <p><span>Region:</span> {state.region}</p>
                <p><span>Slogan:</span> {state.slogan}</p>
                <p><span>Polpulation:</span> {state.population}</p>
                <p><span>Landmarks:</span> {state.landmarks}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

} 

export default StateCard;