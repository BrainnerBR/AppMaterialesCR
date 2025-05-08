import React, { useRef } from 'react';
import { Printer, Text, Row, Line, Cut, Br, render } from 'react-thermal-printer';

const FacturaImprimible = ({ factura }) => {
    const printAreaRef = useRef();

    const handlePrint = () => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Factura</title>
            <style>
              body {
                font-family: monospace;
                width: 58mm;
                margin: 0 auto;
                padding: 10px;
                font-size: 12px;
                color: #000;
              }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .line { border-top: 1px dashed #000; margin: 5px 0; }
              .row { display: flex; justify-content: space-between; }
              .section-title { margin-top: 10px; font-weight: bold; text-decoration: underline; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="center bold">GUÍA POR ENTREGA DE MATERIALES</div>
            <div class="center">Adoquines y Bloques, S.A.</div>
            <div class="center">Tel.: 2261-0241</div>
            <div class="center">No.: ${factura.numeroFactura || "N/A"}</div>
            <div class="line"></div>
  
            <div class="row"><span>CLIENTE:</span><span>${factura.cliente}</span></div>
            <div class="row"><span>Fecha:</span><span>${factura.fecha}</span></div>
  
            <div class="section-title">BLOQUES</div>
            ${
              ["12x20x40", "15x20x40", "20x20x40"]
                .map((medida) =>
                  factura.tipoBloque === `Bloque ${medida}`
                    ? `<div class="row"><span>${medida}</span><span>${factura.cantidadBloques}</span></div>`
                    : ""
                )
                .join("")
            }
  
            <div class="section-title">ADOQUINES</div>
            ${
              ["8x10x20", "6x10x20"]
                .map((medida) =>
                  factura.tipoAdoquin === medida
                    ? `<div class="row"><span>${medida}</span><span>${factura.cantidadAdoquines}</span></div>`
                    : ""
                )
                .join("")
            }
  
            <div class="line"></div>
            <div class="row"><span>RECIBIDO POR:</span><span>${factura.recibidoPor}</span></div>
            <div class="center" style="margin-top: 10px;">¡Gracias por su compra!</div>
          </body>
        </html>
      `);
      printWindow.document.close();
    };
  
    return (
      <button
        onClick={handlePrint}
        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
      >
        Imprimir
      </button>
    );
};

export default FacturaImprimible;
