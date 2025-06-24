import React, { useEffect, useState, useRef } from "react";
import FacturacionNavbar from "./FacturacionNavbar";
import { onValue, ref, remove, update } from "firebase/database";
import { db } from "../../firebaseConfig";
import Swal from "sweetalert2";
import FacturaImprimible from "./FacturaImprimible";
import FiltrosTodasLasFacturas from "./FiltrosTodasLasFacturas";

const TodasLasFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturasMostradas, setFacturasMostradas] = useState(20);
  const [todasLasFacturas, setTodasLasFacturas] = useState([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [anulada, setAnulada] = useState(false);
  const printRef = useRef();

  // Obtener las facturas desde la base de datos de Firebase
  useEffect(() => {
    const facturasRef = ref(db, "facturas");
    const unsubscribe = onValue(facturasRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, factura]) => ({ id, ...factura }))
        : [];
      setFacturas(lista.reverse());
      setTodasLasFacturas(lista.reverse());
      setFacturasFiltradas(lista.reverse());
    });
    return () => unsubscribe();
  }, []);

  const anularFactura = async (id) => {
    const result = await Swal.fire({
      title: "¿Anular factura?",
      text: "Puedes reactivarla manualmente si es necesario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded",
      },
    });

    if (result.isConfirmed) {
      await update(ref(db, `facturas/${id}`), { anulada: true });
      await Swal.fire({
        title: "Anulada",
        text: "Factura marcada como anulada.",
        icon: "info",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2",
        },
      });
    }
  };

  const toggleAnulacion = async (factura) => {
    const nuevaAnulacion = !factura.anulada;
    await update(ref(db, `facturas/${factura.id}`), {
      anulada: nuevaAnulacion,
    });
  };

  const eliminarFactura = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar factura?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded",
      },
    });

    if (result.isConfirmed) {
      await remove(ref(db, `facturas/${id}`));
      await Swal.fire({
        title: "Eliminada",
        text: "Factura eliminada con éxito",
        icon: "success",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2",
        },
      });
    }
  };

  const calcularCantidadTotal = (productos = []) => {
    return productos.reduce((total, p) => (total = Number(p.cantidad || 0)), 0);
  };

  return (
    <div className="p-4">
      <FacturacionNavbar />
      <FiltrosTodasLasFacturas
        todasLasFacturas={todasLasFacturas}
        setFacturasFiltradas={setFacturasFiltradas}
      />

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-md border border-gray-300">
          <thead className="text-md uppercase bg-gray-100 text-primary">
            <tr className="text-lg">
              <th className="border px-2 py-1 text-left">No.</th>
              <th className="border px-2 py-1 text-left">Cliente</th>
              <th className="border px-2 py-1 text-left">Tipo de Producto</th>
              <th className="border px-2 py-1 text-center">Cantidad</th>
              <th className="border px-2 py-1 text-left">Recibido por</th>
              <th className="border px-2 py-1 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hay Guías registradas
                </td>
              </tr>
            ) : (
              facturasFiltradas
                .slice(0, facturasMostradas)
                .map((factura, index) => {
                  const textClass = factura.anulada
                    ? "line-through text-gray-500"
                    : "";
                  return (
                    <tr
                      key={factura.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } border-b border-gray-300`}
                    >
                      <td className={`px-3 py-3 ${textClass}`}>
                        {factura.numeroFactura}
                      </td>
                      <td className={`px-3 py-3 ${textClass}`}>
                        {factura.cliente}
                      </td>
                      <td className={`px-3 py-3 ${textClass}`}>
                        {(factura.productos || [])
                          .map((p) => `${p.tipo} - ${p.detalle}`)
                          .join(" |----| ")}
                      </td>
                      <td className={`px-3 py-3 text-center ${textClass}`}>
                        {calcularCantidadTotal(factura.productos)}
                      </td>
                      <td className={`px-3 py-3 ${textClass}`}>
                        {factura.recibidoPor}
                      </td>
                      <td className="px-3 py-3 text-center flex gap-2 justify-center">
                        <FacturaImprimible factura={factura} />
                        <button
                          onClick={() => toggleAnulacion(factura)}
                          className={`${
                            factura.anulada
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white px-2 py-1 rounded text-xs`}
                        >
                          {factura.anulada ? "Quitar nulo" : "Anular"}
                        </button>
                        {/* <button
                          onClick={() => eliminarFactura(factura.id)}
                          className="bg-black hover:bg-red-900 text-white px-2 py-1 rounded text-xs"
                        >
                          Eliminar
                        </button> */}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
        {facturasMostradas < facturas.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setFacturasMostradas(facturasMostradas + 20)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ver más Guías
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodasLasFacturas;
