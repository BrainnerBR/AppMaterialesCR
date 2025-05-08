import React, { useEffect, useState } from 'react';
import { TbTrash } from 'react-icons/tb';
import { db } from '../../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { Link } from 'react-router-dom';

const Dashboard = ({
  verTodas = false,
  setFacturaSeleccionada,
  eliminarFactura,
}) => {

  const [historial, setHistorial] = useState([])

  useEffect(() => {
    const facturasRef = ref(db, 'facturas');
    onValue(facturasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, factura]) => ({
          id,
          ...factura,
        }));
        setHistorial(lista.reverse()); // deja que verTodas lo controle
      } else {
        setHistorial([]);
      }
    });
  }, []);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Historial de Facturas (arriba izquierda) */}
        <Link to={'/facturacion/todas'}>
        <div className="bg-gray-50 shadow-md rounded-lg p-6 col-span-1 cursor-pointer hover:bg-gray-100">
          <h3 className="text-lg font-bold mb-4 text-primary">
            Últimas Facturas
          </h3>

          {historial.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              No hay facturas
            </div>
          ) : (
            <ul className="space-y-3 text-sm ">
              {(verTodas ? historial : historial.slice(0, 3)).map((factura) => (
                <li
                  key={factura.id}
                  className="p-3 border-b rounded transition flex justify-between items-center"
                >
                  <div
                    className="flex-1"
                  >
                    <strong>Cliente:</strong> {factura.cliente} <br />
                    <strong>Bloques:</strong>{" "}
                    {factura.cantidadBloques || "-"} ({factura.tipoBloque}){" "}
                    <br />
                    <strong>Adoquines:</strong>{" "}
                    {factura.cantidadAdoquines || "-"} ({factura.tipoAdoquin}){" "}
                    <br />
                    <strong>Recibido por:</strong>{" "}
                    {factura.recibidoPor || "-"} <br />
                    <small className="text-gray-500">
                      {factura.fecha || "Fecha no disponible"}
                    </small>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
        </Link>

        {/* Otros bloques del Dashboard */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Gráfico 1</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Gráfico 2</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
