import React, { useState } from "react";

function App() {
  const [matricula, setMatricula] = useState("");
  const [data, setData] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!matricula) {
      setError("Por favor, insira a matrícula");
      setSearchResults([]);
      return;
    }

    try {
      setError(null);
      const queryParams = new URLSearchParams();
      queryParams.append("matricula", matricula);
      if (data) queryParams.append("data", data);

      const response = await fetch(
        `https://egar-app.onrender.com/pesquisar/?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error("Não encontrado");

      const dataResponse = await response.json();

      if (dataResponse.resultados.length === 0) {
        setError("Não encontrado");
        setSearchResults([]);
      } else {
        setSearchResults(dataResponse.resultados);
      }
    } catch (e) {
      setError("Não encontrado");
      setSearchResults([]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Pesquisar Documentos</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Matrícula:</label>
        <input
          type="text"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Ex: AB-12-CD"
          style={{ marginLeft: 10 }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Data (YYYY-MM-DD):</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </div>
      <button onClick={handleSearch}>Pesquisar</button>

      <div style={{ marginTop: 20 }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!error && searchResults.length > 0 && (
          <ul>
            {searchResults.map((doc, idx) => (
              <li key={idx}>
                <strong>{doc.nome}</strong> - Tipo: {doc.tipo}, Matrícula:{" "}
                {doc.matricula}, Data: {doc.data}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
