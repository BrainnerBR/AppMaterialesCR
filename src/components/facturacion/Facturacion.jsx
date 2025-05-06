import React, { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ref, push, onValue, set, get, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import jsPDF from "jspdf";
import { Link, useNavigate } from "react-router-dom";
import FacturacionNavbar from "./FacturacionNavbar";
import { TbTrash } from "react-icons/tb";
import Swal from "sweetalert2";


const Facturacion = () => {
  const [cliente, setCliente] = useState("");
  const [tipoBloque, setTipoBloque] = useState("");
  const [cantidadBloques, setCantidadBloques] = useState("");
  const [tipoAdoquin, setTipoAdoquin] = useState("");
  const [cantidadAdoquines, setCantidadAdoquines] = useState("");
  const [recibidoPor, setRecibidoPor] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [historial, setHistorial] = useState([]);
  const [verTodas, setVerTodas] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const modalRef = useRef(null);
  const printRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numeroRef = ref(db, "ultimoNumeroFactura");
    const snapshot = await get(numeroRef);
    let numeroActual = snapshot.val() || "011111";
    const siguienteNumero = String(parseInt(numeroActual, 10) + 1).padStart(
      6,
      "0"
    );

    const nuevaFactura = {
      numeroFactura: numeroActual, // Se guarda el número actual aquí
      cliente,
      tipoBloque,
      cantidadBloques,
      tipoAdoquin,
      cantidadAdoquines,
      recibidoPor,
      fecha: new Date().toLocaleString(),
      productos: {}
    };

    if(cantidadBloques) {
      nuevaFactura.productos.bloques = {
        tipoBloque,cantidad: parseInt(cantidadBloques, 10)
      }
    }
    if (cantidadAdoquines) {
      nuevaFactura.productos.adoquines = {
        tipoAdoquin,
        cantidad: parseInt(cantidadAdoquines, 10)
      };
    }

    try {
      await push(ref(db, "facturas"), nuevaFactura); // Se guarda junto con el número
      await set(numeroRef, siguienteNumero); // Se actualiza el número para la siguiente factura
      toast.success("Factura guardada");

      // Limpiar el formulario
      setCliente("");
      setTipoBloque("");
      setCantidadBloques("");
      setTipoAdoquin("");
      setCantidadAdoquines("");
      setRecibidoPor("");
    } catch (error) {
      toast.error("Error al guardar");
      console.error(error);
    }
  };

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

  const eliminarFactura = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Confirmar eliminar factura?",
        text: "¡No podrás revertir los cambios!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
  
      if (result.isConfirmed) {
        await remove(ref(db, `facturas/${id}`));
        setHistorial((prev) => prev.filter((factura) => factura.id !== id));
  
        await Swal.fire({
          title: "Eliminada",
          text: "Factura eliminada con éxito.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error eliminando la factura", error);
      toast.error("Error al eliminar");
    }
  };
  
  return (
    <div>
      <FacturacionNavbar />
      <div className="flex p-4 gap-8">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-1/2 bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-primary">Registrar Factura</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Bloques */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Bloque
            </label>
            <select
              value={tipoBloque}
              onChange={(e) => setTipoBloque(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Bloque 12x20x40">Bloque 12x20x40</option>
              <option value="Bloque 15x20x40">Bloque 15x20x40</option>
              <option value="Bloque 20x20x40">Bloque 20x20x40</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de Bloques
            </label>
            <input
              type="number"
              value={cantidadBloques}
              onChange={(e) => setCantidadBloques(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Adoquines */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Adoquín
            </label>
            <select
              value={tipoAdoquin}
              onChange={(e) => setTipoAdoquin(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccionar tipo</option>
              <option value="8x10x20">8x10x20</option>
              <option value="6x10x20">6x10x20</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de Adoquines
            </label>
            <input
              type="number"
              value={cantidadAdoquines}
              onChange={(e) => setCantidadAdoquines(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recibido por
            </label>
            <input
              type="text"
              value={recibidoPor}
              onChange={(e) => setRecibidoPor(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
          >
            Guardar Factura
          </button>
        </form>

        {/* Historial */}
        <div className="w-1/2 bg-gray-50 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-primary">
            Últimas Facturas
          </h3>

          {historial.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              No hay Facturas
            </div>
          ) : (
            <>
              <ul className="space-y-3 text-sm">
                {(verTodas ? historial : historial.slice(0, 4)).map(
                  (factura) => (
                    <li
                      key={factura.id}
                      className="p-3 border-b rounded hover:bg-gray-100 transition flex justify-between items-center"
                    >
                      {/* Parte izquierda: datos de la factura */}
                      <div
                        onClick={() => setFacturaSeleccionada(factura)}
                        className="flex-1 cursor-pointer"
                      >
                        <strong>Cliente:</strong> {factura.cliente} <br />
                        <strong>Bloques:</strong>{" "}
                        {factura.cantidadBloques || "-"} ({factura.tipoBloque}){" "}
                        <br />
                        <strong>Adoquines:</strong>{" "}
                        {factura.cantidadAdoquines || "-"} (
                        {factura.tipoAdoquin}) <br />
                        <strong>Recibido por:</strong>{" "}
                        {factura.recibidoPor || "-"} <br />
                        <small className="text-gray-500">
                          {factura.fecha || "NaN"}
                        </small>
                      </div>

                      {/* Parte derecha: ícono de basurero */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // evita abrir la factura al hacer click en el ícono
                          eliminarFactura(factura.id)
                        }}
                        className="ml-4 text-red-500 hover:text-red-700"
                        title="Eliminar factura"
                      >
                        <TbTrash size={28} /> {/* Cambia el tamaño aquí */}
                      </button>
                    </li>
                  )
                )}
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
              <div className="text-center mb-2" ref={printRef}>
                <h2 className="text-base font-bold text-blue-800">
                  GUÍA POR ENTREGA DE MATERIALES
                </h2>
                <div className="text-sm font-semibold text-blue-700">
                  ADOBLOQ
                </div>
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
                  <div className="py-1">BLOQUES</div>
                  <div className="py-1">CANTIDAD</div>
                </div>
                {/* Tipos de bloque */}
                <div className="grid grid-cols-2 text-xs text-center border-b border-blue-200">
                  <div className="py-1">12 x 20 x 40</div>
                  <div className="py-1">
                    {facturaSeleccionada.tipoBloque === "Bloque 12x20x40"
                      ? facturaSeleccionada.cantidadBloques
                      : ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 text-xs text-center border-b border-blue-200">
                  <div className="py-1">15 x 20 x 40</div>
                  <div className="py-1">
                    {facturaSeleccionada.tipoBloque === "Bloque 15x20x40"
                      ? facturaSeleccionada.cantidadBloques
                      : ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 text-xs text-center border-b border-blue-700">
                  <div className="py-1">20 x 20 x 40</div>
                  <div className="py-1">
                    {facturaSeleccionada.tipoBloque === "Bloque 20x20x40"
                      ? facturaSeleccionada.cantidadBloques
                      : ""}
                  </div>
                </div>

                {/* Adoquines */}
                <div className="grid grid-cols-2 text-xs font-bold bg-blue-100 border-b border-blue-700 text-center">
                  <div className="py-1">ADOQUINES</div>
                  <div className="py-1">CANTIDAD</div>
                </div>
                <div className="grid grid-cols-2 text-xs text-center border-b border-blue-200">
                  <div className="py-1">8 x 10 x 20</div>
                  <div className="py-1">
                    {facturaSeleccionada.tipoAdoquin === "8x10x20"
                      ? facturaSeleccionada.cantidadAdoquines
                      : ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 text-xs text-center">
                  <div className="py-1">6 x 10 x 20</div>
                  <div className="py-1">
                    {facturaSeleccionada.tipoAdoquin === "6x10x20"
                      ? facturaSeleccionada.cantidadAdoquines
                      : ""}
                  </div>
                </div>
              </div>

              {/* Recibido por */}
              <div className="text-sm mt-2">
                <strong>RECIBIDO POR:</strong> {facturaSeleccionada.recibidoPor}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facturacion;
