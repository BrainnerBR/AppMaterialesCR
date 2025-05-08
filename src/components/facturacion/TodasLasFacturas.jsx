import React, { useEffect, useState, useRef } from "react";
import FacturacionNavbar from "./FacturacionNavbar";
import { onValue, ref, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import Swal from "sweetalert2";
import {
  Printer,
  Text,
  Row,
  Line,
  Cut,
  Br,
  render,
} from "react-thermal-printer"; // Asegúrate de tener esta librería instalada
import FacturaImprimible from "./FacturaImprimible";

const TodasLasFacturas = () => {
  const [facturas, setFacturas] = useState([]);
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
    });
    return () => unsubscribe();
  }, []);

  const eliminarFactura = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar factura?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await remove(ref(db, `facturas/${id}`));
      Swal.fire("Eliminada", "Factura eliminada con éxito", "success");
    }
  };

  // Función para formatear la fecha
  const getFechaParts = (fechaString) => {
    if (!fechaString) return { dia: "", mesNombre: "", anio: "" };

    const partes = fechaString.includes("/")
      ? fechaString.split("/")
      : fechaString.includes("-")
      ? fechaString.split("-")
      : [];

    let dia, mes, anio;

    if (partes.length === 3) {
      [dia, mes, anio] = partes.map((p) => parseInt(p));
      if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
        const fecha = new Date(anio, mes - 1, dia);
        return {
          dia,
          mesNombre: fecha.toLocaleString("es-ES", { month: "long" }),
          anio,
        };
      }
    }

    const fecha = new Date(fechaString);
    if (!isNaN(fecha)) {
      return {
        dia: fecha.getDate(),
        mesNombre: fecha.toLocaleString("es-ES", { month: "long" }),
        anio: fecha.getFullYear(),
      };
    }

    return { dia: "??", mesNombre: "Inválido", anio: "??" };
  };

  // Función para manejar la impresión
  const imprimirFactura = async (factura) => {
    if (!factura) {
      Swal.fire("Error", "Factura no disponible para imprimir", "error");
      return;
    }

    const receipt = (
      <Printer type="epson" width={42} characterSet="korea">
        <Text size={{ width: 2, height: 2 }}>
          GUÍA POR ENTREGA DE MATERIALES
        </Text>
        <Text bold={true}>Adoquines y Bloques, S.A.</Text>
        <Text>Tel.: 2261-0241</Text>
        <Text>No.: {factura.numeroFactura || "N/A"}</Text>
        <Br />
        <Line />

        <Row left="CLIENTE" right={factura.cliente} />
        <Row
          left="Fecha"
          right={`${factura.dia} ${factura.mesNombre} ${factura.anio}`}
        />

        <Line />
        <Text bold={true}>BLOQUES</Text>
        {["12x20x40", "15x20x40", "20x20x40"].map((medida) =>
          factura.tipoBloque === `Bloque ${medida}` ? (
            <Row key={medida} left={medida} right={factura.cantidadBloques} />
          ) : null
        )}

        <Br />
        <Text bold={true}>ADOQUINES</Text>
        {["8x10x20", "6x10x20"].map((medida) =>
          factura.tipoAdoquin === medida ? (
            <Row key={medida} left={medida} right={factura.cantidadAdoquines} />
          ) : null
        )}

        <Br />
        <Line />
        <Row left="RECIBIDO POR" right={factura.recibidoPor} />
        <Br />
        <Text align="center">¡Gracias por su compra!</Text>
        <Cut />
      </Printer>
    );

    const data = await render(receipt);
    console.log(data); // Aquí puedes enviar `data` a tu impresora térmica.
  };

  return (
    <div>
      <FacturacionNavbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {facturas.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">
            No hay Facturas
          </div>
        ) : (
          facturas.map((factura) => {
            const { dia, mesNombre, anio } = getFechaParts(factura.fecha);
            return (
              <div
                key={factura.id}
                className="relative bg-white rounded-lg shadow-lg border border-blue-700 font-mono p-6"
              >
                {/* Factura imprimible */}
                <div ref={printRef}>
                  <div className="text-center mb-2">
                    <h2 className="text-base font-bold text-blue-800">
                      GUÍA POR ENTREGA DE MATERIALES
                    </h2>
                    <div className="text-sm font-semibold text-blue-700">
                      ADOBLOQ
                    </div>
                    <div className="text-xs">Adoquines y Bloques, S.A.</div>
                    <div className="text-xs">Tel.: 2261-0241</div>
                    <div className="text-xs">
                      No.: {factura.numeroFactura || "N/A"}
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
                    <strong>CLIENTE:</strong> {factura.cliente}
                  </div>

                  {/* Productos */}
                  <div className="border border-blue-700 mb-2">
                    {/* Bloques */}
                    <div className="grid grid-cols-2 text-xs font-bold bg-blue-100 border-b border-blue-700 text-center">
                      <div className="py-1">BLOQUES</div>
                      <div className="py-1">CANTIDAD</div>
                    </div>
                    {["12x20x40", "15x20x40", "20x20x40"].map((medida) => (
                      <div
                        key={medida}
                        className="grid grid-cols-2 text-xs text-center border-b border-blue-200"
                      >
                        <div className="py-1">
                          {medida.replace(/x/g, " x ")}
                        </div>
                        <div className="py-1">
                          {factura.tipoBloque === `Bloque ${medida}`
                            ? factura.cantidadBloques
                            : ""}
                        </div>
                      </div>
                    ))}

                    {/* Adoquines */}
                    <div className="grid grid-cols-2 text-xs font-bold bg-blue-100 border-b border-blue-700 text-center">
                      <div className="py-1">ADOQUINES</div>
                      <div className="py-1">CANTIDAD</div>
                    </div>
                    {["8x10x20", "6x10x20"].map((medida) => (
                      <div
                        key={medida}
                        className="grid grid-cols-2 text-xs text-center border-b border-blue-200"
                      >
                        <div className="py-1">
                          {medida.replace(/x/g, " x ")}
                        </div>
                        <div className="py-1">
                          {factura.tipoAdoquin === medida
                            ? factura.cantidadAdoquines
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recibido por */}
                  <div className="text-sm mt-2 mb-2">
                    <strong>RECIBIDO POR:</strong> {factura.recibidoPor}
                  </div>
                </div>

                {/* Acciones */}
                <div className="absolute bottom-1 right-3 flex gap-3 print:hidden">

                    <FacturaImprimible factura={factura}/>
                  <button
                    onClick={() => eliminarFactura(factura.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodasLasFacturas;
