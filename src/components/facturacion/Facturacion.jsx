import React, { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ref, push, onValue, set, get, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import FacturacionNavbar from "./FacturacionNavbar";
import UltimasFacturas from "./UltimasFacturas";

const Facturacion = () => {
  const [cliente, setCliente] = useState("");
  const [recibidoPor, setRecibidoPor] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoTipo, setProductoTipo] = useState("");
  const [productoDetalle, setProductoDetalle] = useState("");
  const [productoCantidad, setProductoCantidad] = useState("");

  const handleSubmit = async () => {
    if (!cliente || !recibidoPor || productos.length === 0) {
      toast.error("Completa todos los campos y agrega al menos un producto.");
      return;
    }

    try {
      // Obtener el último número de factura
      const numeroRef = ref(db, "ultimoNumeroFactura");
      const snapshot = await get(numeroRef);
     let numeroActual = snapshot.val() || 0; // <-- 0 para que empiece desde 1 si no existe

const siguienteNumero = numeroActual + 1;

      // Crear objeto de factura
      const nuevaFactura = {
        numeroFactura: numeroActual,
        cliente,
        recibidoPor,
        fecha: new Date().toLocaleString(),
        productos,
      };

      // Guardar en Firebase
      await push(ref(db, "facturas"), nuevaFactura);
      await set(numeroRef, siguienteNumero);

      toast.success("Factura guardada correctamente");

      // Limpiar formulario
      setCliente("");
      setRecibidoPor("");
      setProductos([]);
    } catch (error) {
      console.error("Error al guardar la factura:", error);
      toast.error("Error al guardar la factura.");
    }
  };

  return (
    <div>
      <FacturacionNavbar />
      <div className="flex p-2 gap-5 ">
        {/* Formulario */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-1/3 bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-primary">Registrar Nueva Guías</h2>

          {/* Cliente */}
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

          {/* Selección de producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Producto
            </label>
            <select
              value={productoTipo}
              onChange={(e) => {
                setProductoTipo(e.target.value);
                setProductoDetalle("");
                setProductoCantidad("");
              }}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccionar</option>
              <option value="Bloque">Bloque</option>
              <option value="Adoquín">Adoquín</option>
            </select>
          </div>

          {/* Tipo específico de producto */}
          {productoTipo && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {productoTipo === "Bloque"
                  ? "Tipo de Bloque"
                  : "Tipo de Adoquín"}
              </label>
              <select
                value={productoDetalle}
                onChange={(e) => setProductoDetalle(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccionar</option>
                {productoTipo === "Bloque" &&
                  ["12x20x40 A", "15x20x40 A", "20x20x40 A", "12x20x40 Especial", "15x20x40 Especial", "20x20x40 Especial"].map(
                    (bloque) => (
                      <option key={bloque} value={bloque}>
                        {bloque}
                      </option>
                    )
                  )}
                {productoTipo === "Adoquín" &&
                  ["8x10x20 A", "6x10x20 A","8x10x20 Especial", "6x10x20 Especial"].map((adoquin) => (
                    <option key={adoquin} value={adoquin}>
                      {adoquin}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Cantidad */}
          {productoTipo && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                value={productoCantidad}
                onChange={(e) => setProductoCantidad(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          )}

          {/* Realizado por */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Realizado por
            </label>
            <input
              required
              type="text"
              value={recibidoPor}
              onChange={(e) => setRecibidoPor(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Botón para agregar al resumen */}
          {cliente && productoTipo && productoDetalle && productoCantidad && recibidoPor &&(
            <button
              onClick={() => {
                const nuevoProducto = {
                  tipo: productoTipo,
                  detalle: productoDetalle,
                  cantidad: productoCantidad,
                };
                setProductos((prev) => [...prev, nuevoProducto]);
                setProductoTipo("");
                setProductoDetalle("");
                setProductoCantidad("");
              }}
              className="bg-primary text-text py-2 px-4 rounded hover:bg-hover hover:text-text transition-all"
            >
              Agregar Producto
            </button>
          )}
        </form>

        <div className="w-1/3 bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-primary mb-4">
            Resumen de la Guía
          </h2>

          <div className="text-sm mb-2">
            <strong>Cliente:</strong>{" "}
            {cliente || <span className="text-gray-400">No ingresado</span>}
          </div>

          <div className="text-sm mb-2">
            <strong>Fecha:</strong> {new Date().toLocaleDateString()} <br />
          </div>

          <div className="text-sm mb-2">
            <strong>Realizado por:</strong>{" "}
            {recibidoPor || <span className="text-gray-400">No ingresado</span>}
          </div>

          <div className="mt-3 border-t pt-3 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-primary mb-2">
              Productos:
            </h3>
            {productos.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay productos seleccionados
              </p>
            ) : (
              <ul className="space-y-2">
                {productos.map((prod, i) => (
                  <li
                    key={i}
                    className="bg-gray-100 p-2 rounded shadow-sm flex justify-between items-center text-sm"
                  >
                    <div>
                      <strong>{prod.tipo}</strong>: {prod.detalle} <br />
                      <span className="text-gray-600">
                        Cantidad: {prod.cantidad}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-primary text-text py-2 px-4 rounded hover:bg-primary/70 hover:text-text transition-all"
          >
            Guardar Guías
          </button>
        </div>

        <div className="w-1/3">
          <UltimasFacturas />
        </div>
      </div>
    </div>
  );
};

export default Facturacion;
