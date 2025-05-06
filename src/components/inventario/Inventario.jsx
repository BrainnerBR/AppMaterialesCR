import { useState, useEffect, useRef } from "react";
import { FaPen } from "react-icons/fa";
import { getDatabase, ref, set, get } from "firebase/database";
import { db } from '../../firebaseConfig'; // Asegúrate de estar exportando la configuración correcta
import {toast} from 'react-hot-toast';

const productos = [
  "Repello Grueso", 
  "Repello Fino",
  "PegaBlock",
  "Pega Piso",
  "Concreto Seco",
  "Calcio",
];
const sucursales = [
  "Virilla",
  "Coris",
  "Rio Frios",
  "Aranjuez",
];

export default function Inventario() {
  const [sucursal, setSucursal] = useState("Virilla");
  const [cantidades, setCantidades] = useState({});
  const [editando, setEditando] = useState({});  // Producto que se está editando
  const [nuevaCantidad, setNuevaCantidad] = useState({});  // Nueva cantidad para editar
  const productoEditando = editando[sucursal];
  const cantidadEditando = nuevaCantidad[sucursal];


  const editarRef = useRef(null);

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (productoEditando && editarRef.current && !editarRef.current.contains(e.target)) {
        setEditando((prev) => ({ ...prev, [sucursal]: null }));
        setNuevaCantidad((prev) => ({ ...prev, [sucursal]: "" }));
      }
    };
  
    const manejarEscape = (e) => {
      if (e.key === "Escape") {
        setEditando((prev) => ({ ...prev, [sucursal]: null }));
        setNuevaCantidad((prev) => ({ ...prev, [sucursal]: "" }));
      }
    };
  
    document.addEventListener("mousedown", manejarClickFuera);
    document.addEventListener("keydown", manejarEscape);
  
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [productoEditando, sucursal]);
  


  const cargarDatos = async () => {
    const db = getDatabase();
    const sucursalRef = ref(db, "morteros/" + sucursal); // Ruta en la base de datos
    const snapshot = await get(sucursalRef); // Obtener datos de la sucursal
    if (snapshot.exists()) {
      setCantidades(snapshot.val());
    } else {
      setCantidades({});
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [sucursal]);

  const manejarEdicion = (producto) => {
    setEditando((prev) => ({...prev, [sucursal]: producto}));
    setNuevaCantidad((prev => ({...prev, [sucursal] : cantidades[producto] ?? 0 }))); // Cargar la cantidad actual
  };



  const guardarEdicion = async (producto) => {
    try {
      const db = getDatabase();
      const sucursalRef = ref(db, "morteros/" + sucursal);
      const nuevosDatos = { ...cantidades, [producto]: nuevaCantidad[sucursal] };
      await set(sucursalRef, nuevosDatos);
      await cargarDatos();
      setEditando((prev) => ({ ...prev, [sucursal]: null }));
      setNuevaCantidad((prev) => ({ ...prev, [sucursal]: "" }));
  
      toast.success('Cantidad actualizada con éxito');
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      toast.error('Error al guardar la cantidad');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-lg">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {sucursales.map((key) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-lg transition ${
              sucursal === key
                ? "bg-primary text-white"
                : "bg-gray-200 text-primary hover:bg-primary hover:text-white"
            }`}
            onClick={() => setSucursal(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <table className="w-full text-lg text-left text-text bg-white rounded-2xl shadow-lg overflow-hidden">
        <thead className="text-xs uppercase bg-primary text-white">
          <tr>
            <th className="px-6 py-4">PRODUCTO</th>
            <th className="px-6 py-4">CANTIDAD</th>
            <th className="px-6 py-4">ESTADO</th>
            <th className="px-6 py-4 text-center">ACCIÓN</th>
          </tr>
        </thead>
        <tbody ref={editarRef}>
          {productos.map((producto, i) => {
            const cantidad = cantidades?.[producto] ?? 0;
            const estado = cantidad <= 10 ? "Bajo" : cantidad <= 30 ? "Medio" : "Alto";

            return (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-secondary" : "bg-white"
                } border-b border-gray-300`}
              >
                <td className="px-6 py-4 font-medium text-text whitespace-nowrap">
                  {producto}
                </td>
                <td className="px-6 py-4">
                  {productoEditando === producto ? (
                    <input
                      type="number"
                      value={cantidadEditando}
                      onChange={(e) => {
                        const valor = e.target.value;
                        if (/^\d*$/.test(valor)) {
                          setNuevaCantidad((prev => ({...prev, [sucursal] :valor })));
                        }
                      }}

                      className="w-20 p-2 border rounded-lg"
                    />
                  ) : (
                    cantidad
                  )}
                </td>
                <td className="px-6 py-4">{estado}</td>
                <td className="px-6 py-4 text-center">
                  {productoEditando === producto ? (
                    <button
                      onClick={() => guardarEdicion(producto)}
                      className="inline-flex items-center justify-center gap-2 text-primary hover:underline hover:text-hover transition"
                    >
                      Guardar
                    </button>
                  ) : (
                    <a
                      href="#"
                      onClick={() => manejarEdicion(producto)}
                      className="inline-flex items-center justify-center gap-2 text-primary hover:underline hover:text-hover transition"
                    >
                      Editar
                      <FaPen className="w-4 h-4" />
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
