import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
   const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);

  const handleAdd = async () => {
    const res = await fetch(`http://localhost:8080/api/add?a=${a}&b=${b}`);
    const sum = await res.text();
    setResult(sum);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Two Numbers</h1>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
        placeholder="Number A"
      />
      <input
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
        placeholder="Number B"
      />
      <button onClick={handleAdd}>Add</button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

export default App;
