import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Se încarcă...');

  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error(err);
        setMessage('Error in getting message.');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Frontend App</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

export default App;
