import React, { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebaseConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
const GraficosGuias = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const facturasRef = ref(db, "facturas");
    const unsubscribe = onValue(facturasRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, factura]) => ({ id, ...factura }))
        : [];
      setFacturas(lista);
    });
    return () => unsubscribe();
  }, []);


  // ➤ Cantidad de productos vendidos por tipo
  const productosPorTipo = {};

  facturas.forEach((factura) => {
    (factura.productos || []).forEach((producto) => {
      if (producto.tipo) {
        productosPorTipo[producto.tipo] =
          (productosPorTipo[producto.tipo] || 0) + Number(producto.cantidad || 0);
      }
    });
  });

  const productosData = Object.entries(productosPorTipo).map(
    ([tipo, cantidad]) => ({
      tipo,
      cantidad,
    })
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


        {/* ➤ Gráfico de Barras de Productos por Tipo */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Cantidad de Productos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productosData}>
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#2a21da" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficosGuias;
