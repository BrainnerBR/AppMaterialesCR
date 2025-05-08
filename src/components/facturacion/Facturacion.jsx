import React, { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ref, push, onValue, set, get, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import FacturacionNavbar from "./FacturacionNavbar";
import { TbTrash } from "react-icons/tb";
import UltimasFacturas from "./UltimasFacturas";


const Facturacion = () => {
  const [cliente, setCliente] = useState("");
  const [tipoBloque, setTipoBloque] = useState("");
  const [cantidadBloques, setCantidadBloques] = useState("");
  const [tipoAdoquin, setTipoAdoquin] = useState("");
  const [cantidadAdoquines, setCantidadAdoquines] = useState("");
  const [recibidoPor, setRecibidoPor] = useState("");
  const [productoTipo, setProductoTipo] = useState("");
  const [productoDetalle, setProductoDetalle] = useState("");
  const [productoCantidad, setProductoCantidad] = useState("");
  const [productos, setProductos] = useState([]);

  const agregarProducto = () => {
    if (!productoTipo || !productoDetalle || !productoCantidad) {
      toast.error("Complete todos los campos del producto");
      return;
    }
  
    const nuevoProducto = {
      tipo: productoTipo,
      detalle: productoDetalle,
      cantidad: productoCantidad,
    };
  
    setProductos([...productos, nuevoProducto]);
  
    // Limpiar inputs del producto
    setProductoTipo("");
    setProductoDetalle("");
    setProductoCantidad("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (productos.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }
  
    const numeroRef = ref(db, "ultimoNumeroFactura");
    const snapshot = await get(numeroRef);
    let numeroActual = snapshot.val() || "011111";
    const siguienteNumero = String(parseInt(numeroActual, 10) + 1).padStart(6, "0");
  
    const nuevaFactura = {
      numeroFactura: numeroActual,
      cliente,
      recibidoPor,
      productos,
      fecha: new Date().toLocaleString(),
    };
  
    try {
      await push(ref(db, "facturas"), nuevaFactura);
      await set(numeroRef, siguienteNumero);
      toast.success("Factura guardada");
  
      // Limpiar formulario
      setCliente("");
      setRecibidoPor("");
      setProductos([]);
    } catch (error) {
      toast.error("Error al guardar");
      console.error(error);
    }
  };

  return (
    <div>
      <FacturacionNavbar />
      <div className="flex p-2 gap-5">
        <form
          onSubmit={handleSubmit}
          className="w-1/2 bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-primary">Registrar Factura</h2>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
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
            <label className="block text-sm font-medium text-gray-700">Agregar Producto</label>
            <select
              value={productoTipo}
              onChange={(e) => {
                setProductoTipo(e.target.value);
                setProductoDetalle(""); // reset tipo específico
              }}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Bloque">Bloque</option>
              <option value="Adoquín">Adoquín</option>
            </select>
          </div>

          {/* Detalles del producto */}
          {productoTipo && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {productoTipo === "Bloque" ? "Tipo de Bloque" : "Tipo de Adoquín"}
              </label>
              <select
                value={productoDetalle}
                onChange={(e) => setProductoDetalle(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccionar</option>
                {productoTipo === "Bloque" &&
                  ["Bloque 12x20x40", "Bloque 15x20x40", "Bloque 20x20x40"].map((bloque) => (
                    <option key={bloque} value={bloque}>{bloque}</option>
                  ))}
                {productoTipo === "Adoquín" &&
                  ["8x10x20", "6x10x20"].map((adoquin) => (
                    <option key={adoquin} value={adoquin}>{adoquin}</option>
                  ))}
              </select>
              
            </div>
          )}

          {/* Cantidad */}
          {productoTipo && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                value={productoCantidad}
                onChange={(e) => setProductoCantidad(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          )}
          <div>
          <button
  type="button"
  onClick={agregarProducto}
  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
>
  Agregar Producto
</button>
          </div>
          


          {/* Lista de productos añadidos */}
          {productos.length > 0 && (
            <div className="border p-3 rounded bg-gray-100 mt-4">
              <strong>Productos agregados:</strong>
              <ul className="list-disc pl-4 mt-2">
                {productos.map((prod, i) => (
                  <li key={i}>
                    {prod.tipo}: {prod.detalle} - {prod.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recibido por */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Realizado por</label>
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
            className="bg-primary text-text py-2 px-4 rounded hover:bg-hover hover:text-text transition-all"
          >
            Guardar Factura
          </button>
        </form>

        <UltimasFacturas />
      </div>
    </div>
  );
};

export default Facturacion;
