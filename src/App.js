import React, { useState } from 'react';

const backendUrl = 'https://egar-app.onrender.com';

function App() {
  const [files, setFiles] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [matricula, setMatricula] = useState('');
  const [data, setData] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Por favor, seleciona ficheiros para enviar.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const res = await fetch(`${backendUrl}/upload/`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
    } catch (error) {
      alert('Erro no upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!matricula) {
      alert('Por favor, insere uma matrícula para pesquisa.');
      return;
    }
    setLoading(true);
    try {
      let url = `${backendUrl}/pesquisar/?matricula=${encodeURIComponent(matricula)}`;
      if (data) {
        url += `&data=${encodeURIComponent(data)}`;
      }
      const res = await fetch(url);
      const dataRes = await res.json();
      setSearchResults(dataRes.resultados);
    } catch (error) {
      alert('Erro na pesquisa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>EGAR - Upload e Pesquisa</h1>

      <div>
        <label>Seleciona ficheiros PDF para upload:</label>
        <input type="file" multiple onChange={handleFileChange} accept=".pdf" />
        <button onClick={handleUpload} disabled={loading}>Enviar</button>
      </div>

      {uploadResult && (
        <div className="result">
          <h2>Upload Resultado</h2>
          <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}

      <hr />

      <div>
        <h2>Pesquisar documentos</h2>
        <label>Matrícula:</label>
        <input type="text" value={matricula} onChange={e => setMatricula(e.target.value)} />
        <label>Data (YYYY-MM-DD):</label>
        <input type="date" value={data} onChange={e => setData(e.target.value)} />
        <button onClick={handleSearch} disabled={loading}>Pesquisar</button>
      </div>

      {searchResults.length === 0 ? (
  <p>Nenhum documento encontrado.</p>
) : (
  <ul>
    {searchResults.map((doc, idx) => (
      <li key={idx}>
        <strong>{doc.nome}</strong> - Tipo: {doc.tipo}, Matrícula: {doc.matricula}, Data: {doc.data}
      </li>
    ))}
  </ul>
)}

}

export default App;
