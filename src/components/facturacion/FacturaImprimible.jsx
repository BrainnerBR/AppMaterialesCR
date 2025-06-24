import React, { useRef } from "react";
import Logo from '../../assets/logoBYN.png';

const FacturaImprimible = ({ factura }) => {
  const printAreaRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Guia</title>
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
            .line { border-top: 1px dashed #000; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .section-title {
              margin-top: 15px;
              font-weight: bold;
              text-decoration: underline;
            }
            .signature {
              margin-top: 40px;
              border-top: 1px solid #000;
              text-align: center;
              padding-top: 10px;
              font-size: 14px;
            }
            .logo {
              width: 100px;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .producto {
              flex: 1;
              text-align: left;
              word-break: break-word;
            }
            .cantidad {
              width: 30px;
              text-align: right;
              flex-shrink: 0;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${Logo}" alt="Logo" class="logo" style="margin-bottom: 5rem;" />
          <div class="center bold" style="margin-bottom: 2rem;">GUÍA POR ENTREGA DE MATERIALES</div>
          <div class="center">Tel.: 2261-0241</div>
          <div class="center">No.: ${factura.numeroFactura || "N/A"}</div>
          <div class="line"></div>

          <div class="row"><span>FECHA:</span><span>${factura.fecha}</span></div>
          <div class="row"><span>CLIENTE:</span><span>${factura.cliente}</span></div>

          <div class="line"></div>

          <div class="row bold">
            <span>PRODUCTOS</span>
            <span>CANTIDAD</span>
          </div>
          ${
            factura.productos && factura.productos.length > 0
              ? factura.productos
                  .map(
                    (producto) =>
                      `<div class="row">
                        <div class="producto">${producto.tipo} - ${producto.detalle}</div>
                        <div class="cantidad">${producto.cantidad}</div>
                      </div>`
                  )
                  .join("")
              : "<div class='row'><span>Sin productos</span></div>"
          }

          <div class="line"></div>
          <div class="row" style="margin-bottom: 5rem;"><span>REALIZADO POR:</span><span>${factura.recibidoPor}</span></div>
          <div class="row"><span>RECIBIDO POR:</span><span></span></div>

          <div class="signature">Firma</div>
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
