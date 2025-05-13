import { onValue, ref, remove } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../firebaseConfig";
import { TbTrash } from "react-icons/tb";
import toast from "react-hot-toast";
import { prodErrorMap } from "firebase/auth";

const UltimasFacturas = () => {
  const [numeroFactura, setNumeroFactura] = useState("");
  const [historial, setHistorial] = useState([]);
  const [verTodas, setVerTodas] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const today = new Date();
  const dia = today.getDate();
  const mes = today.getMonth();
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const mesNombre = meses[mes];
  const anio = today.getFullYear();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setFacturaSeleccionada(null);
      }
    };

    if (facturaSeleccionada) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [facturaSeleccionada]);

  useEffect(() => {
    const numeroRef = ref(db, "ultimoNumeroFactura");
    onValue(numeroRef, (snapshot) => {
      const numero = snapshot.val();
      if (numero) {
        setNumeroFactura(numero);
      }
    });
  }, []);

  useEffect(() => {
    const facturasRef = ref(db, "facturas");
    onValue(facturasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, factura]) => ({
          id,
          ...factura,
        }));
        setHistorial(lista.reverse().slice(0, 5));
      }
    });
  }, []);


  return (
    <div className="bg-white h-full shadow-md rounded-lg p-6">
      {/* Historial */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-primary">
          Últimas Guías
        </h3>

        {historial.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No hay Guías
          </div>
        ) : (
          <>
            <ul className="space-y-3 text-sm">
              {(verTodas ? historial : historial.slice(0, 4)).map((factura) => (
                <li
                  key={factura.id}
                  className="p-3 border-b rounded hover:bg-gray-100 transition flex justify-between items-center"
                >
                  <div
                    onClick={() => setFacturaSeleccionada(factura)}
                    className="flex-1 cursor-pointer"
                  >
                    <strong>Cliente:</strong> {factura.cliente} <br />
                    {factura.productos && factura.productos.length > 0 && (
                      <>
                        {factura.productos.map((producto, index) => (
                          <div key={index}>
                            <strong>{producto.tipo}:</strong> {producto.detalle}{" "}
                            - {producto.cantidad}
                          </div>
                        ))}
                      </>
                    )}
                    <strong>Realizado por:</strong> {factura.recibidoPor || "-"}{" "}
                    <br />
                    <small className="text-gray-500">
                      {factura.fecha || "NaN"}
                    </small>
                  </div>

                </li>
              ))}
            </ul>

            {historial.length > 4 && (
              <div className="mt-4 text-center">
                <Link
                  to="/facturacion/todas"
                  className="text-blue-600 underline text-sm hover:text-blue-800"
                >
                  Ver todas las facturas
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {facturaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white p-6 w-[400px] rounded-lg shadow-lg relative border border-blue-700 font-mono"
          >
            <button
              onClick={() => setFacturaSeleccionada(null)}
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>

            {/* Encabezado */}
            <div className="text-center mb-2">
              <h2 className="text-base font-bold text-blue-800">
                GUÍA POR ENTREGA DE MATERIALES
              </h2>
              <div className="text-sm font-semibold text-blue-700">ADOBLOQ</div>
              <div className="text-xs">Adoquines y Bloques, S.A.</div>
              <div className="text-xs">Tel.: 2261-0241</div>
              <div className="text-xs">
                No.:{facturaSeleccionada.numeroFactura}
              </div>
            </div>

            {/* Fecha */}
            <div className="flex justify-between text-xs mb-1">
              <span>
                <strong>Día:</strong> {dia}
              </span>
              <span>
                <strong>Mes:</strong> {mesNombre}
              </span>
              <span>
                <strong>Año:</strong> {anio}
              </span>
            </div>

            {/* Cliente */}
            <div className="text-sm mb-2">
              <strong>CLIENTE:</strong> {facturaSeleccionada.cliente}
            </div>

            {/* Tabla */}
            <div className="border border-blue-700 mb-2">
              <div className="grid grid-cols-2 text-xs font-bold bg-blue-100 border-b border-blue-700 text-center">
                <div className="py-1">PRODUCTO</div>
                <div className="py-1">CANTIDAD</div>
              </div>
              {facturaSeleccionada.productos?.map((prod, index) => (
                <div key={index} className="grid grid-cols-2 text-xs text-center border-b border-blue-200">
                    <div className="py-1">{prod.detalle}</div>
                    <div className="py-1">{prod.cantidad}</div>
                </div>
              ))}
            </div>

            {/* Recibido por */}
            <div className="text-sm mt-2">
              <strong>Realizado POR:</strong> {facturaSeleccionada.recibidoPor}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimasFacturas;
