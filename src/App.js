import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [files, setFiles] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [matricula, setMatricula] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    setLoading(true);
    try {
      const response = await axios.post("https://egar-app.onrender.com/upload/", formData);
      setResultados(response.data.transportes);
    } catch (error) {
      alert("Erro ao carregar os ficheiros");
    }
    setLoading(false);
  };

  const handlePesquisar = async () => {
    try {
      const response = await axios.get("https://egar-app.onrender.com/pesquisar/", {
        params: {
          matricula,
          data,
        },
      });
      setResultados([{
        transporte_id: "pesquisa",
        documentos: response.data.resultados,
      }]);
    } catch (error) {
      alert("Erro na pesquisa");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 EGAR - Gestor de Documentos</h1>

      <div className="mb-4">
        <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
        <button
          onClick={handleUpload}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "A carregar..." : "Carregar Ficheiros"}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Matrícula (ex: AB-12-CD)"
          className="border px-2 py-1 mr-2"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        <input
          type="date"
          className="border px-2 py-1 mr-2"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button
          onClick={handlePesquisar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Pesquisar
        </button>
      </div>

      {resultados.map((transporte, idx) => (
        <div key={idx} className="mb-6 border p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">🛻 Transporte {transporte.transporte_id}</h2>
          <ul>
            {transporte.documentos.map((doc, i) => (
              <li key={i} className="text-sm mb-1">
                📄 <strong>{doc.tipo}</strong> - {doc.nome} ({doc.data || "sem data"})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}