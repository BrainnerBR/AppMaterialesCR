import React, { useState } from "react";

const FiltrosTodasLasFacturas = ({
  todasLasFacturas,
  setFacturasFiltradas,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);

  const handleChange = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusqueda(texto);

    if (texto.trim() === "") {
      setSugerencias([]);
      setFacturasFiltradas(todasLasFacturas);
      return;
    }
    const coincidenciasClientes = todasLasFacturas
      .map((factura) => factura.cliente)
      .filter(
        (cliente, index, self) =>
          cliente.toLowerCase().includes(texto) &&
          self.indexOf(cliente) === index
      );
    setSugerencias(coincidenciasClientes);

    const resultados = todasLasFacturas.filter((factura) =>
      factura.cliente.toLowerCase().includes(texto)
    );

    setFacturasFiltradas(resultados);
  };

  const seleccionarSugerencia = (cliente) => {
    setBusqueda(cliente);
    setSugerencias([]);
    const resultados = todasLasFacturas.filter(
      (factura) => factura.cliente.toLowerCase() === cliente.toLowerCase()
    );
    setFacturasFiltradas(resultados);
  };

  return (
    <div className="relative max-w-md mx-auto mb-4">
      <input
        type="text"
        placeholder="Buscar por cliente..."
        value={busqueda}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded shadow-sm"
      />
      {busqueda && (
        <button
          onClick={() => {
            setBusqueda("");
            setSugerencias([]);
            setFacturasFiltradas(todasLasFacturas);
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
      {sugerencias.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 z-10 max-h-40 overflow-y-auto">
          {sugerencias.map((cliente, idx) => (
            <li
              key={idx}
              onClick={() => seleccionarSugerencia(cliente)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {cliente}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FiltrosTodasLasFacturas;
