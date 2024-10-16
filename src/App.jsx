import React, { useState } from "react";
// Función para obtener los límites de crédito dependiendo de los parámetros
function obtenerLimitesDeCredito(
  mesesTranscurridos,
  categoriaNomina,
  sexo,
  tablasMinimos,
  tablasMaximos
) {
  const tablaMinimos =
    sexo === "m" ? tablasMinimos.masculino : tablasMinimos.femenino;
  const tablaMaximos =
    sexo === "m" ? tablasMaximos.masculino : tablasMaximos.femenino;

  const montoMinimo = tablaMinimos[categoriaNomina].find(
    (rango) => mesesTranscurridos >= rango[0] && mesesTranscurridos <= rango[1]
  )[2];
  const montoMaximo = tablaMaximos[categoriaNomina].find(
    (rango) => mesesTranscurridos >= rango[0] && mesesTranscurridos <= rango[1]
  )[2];

  return { montoMinimo, montoMaximo };
}

// Función principal para calcular el crédito óptimo
function calcularCreditoOptimo(categoriaNomina, fechaIngresoLaboral, sexo) {
  const fechaActual = new Date();
  const mesesTranscurridos = Math.floor(
    (fechaActual.getFullYear() - fechaIngresoLaboral.getFullYear()) * 12 +
      (fechaActual.getMonth() - fechaIngresoLaboral.getMonth())
  );

  // Tablas de montos mínimos y máximos
  const tablasDeMontosMinimos = {
    masculino: {
      A: [
        [0, 26, 100],
        [27, 27, 400],
        [28, 28, 900],
        [29, 29, 100],
        [30, Infinity, 600],
      ],
      B: [
        [0, 26, 1000],
        [27, 27, 600],
        [28, 28, 1000],
        [29, 29, 1000],
        [30, Infinity, 1000],
      ],
      C: [
        [0, 26, 400],
        [27, 27, 200],
        [28, 28, 200],
        [29, 29, 1000],
        [30, Infinity, 600],
      ],
      D: [
        [0, 26, 400],
        [27, 27, 300],
        [28, 28, 500],
        [29, 29, 900],
        [30, Infinity, 1000],
      ],
    },
    femenino: {
      A: [
        [0, 24, 800],
        [25, 25, 800],
        [26, 26, 800],
        [27, 27, 600],
        [28, Infinity, 200],
      ],
      B: [
        [0, 24, 800],
        [25, 25, 700],
        [26, 26, 100],
        [27, 27, 600],
        [28, Infinity, 700],
      ],
      C: [
        [0, 24, 200],
        [25, 25, 900],
        [26, 26, 700],
        [27, 27, 800],
        [28, Infinity, 100],
      ],
      D: [
        [0, 24, 500],
        [25, 25, 1000],
        [26, 26, 600],
        [27, 27, 400],
        [28, Infinity, 700],
      ],
    },
  };

  const tablasDeMontosMaximos = {
    masculino: {
      A: [
        [0, 26, 4900],
        [27, 27, 4700],
        [28, 28, 4600],
        [29, 29, 4600],
        [30, Infinity, 4500],
      ],
      B: [
        [0, 26, 4700],
        [27, 27, 4400],
        [28, 28, 5000],
        [29, 29, 4400],
        [30, Infinity, 4900],
      ],
      C: [
        [0, 26, 5000],
        [27, 27, 4700],
        [28, 28, 5000],
        [29, 29, 4200],
        [30, Infinity, 4600],
      ],
      D: [
        [0, 26, 4400],
        [27, 27, 4700],
        [28, 28, 4300],
        [29, 29, 4900],
        [30, Infinity, 4300],
      ],
    },
    femenino: {
      A: [
        [0, 24, 4000],
        [25, 25, 4200],
        [26, 26, 4100],
        [27, 27, 4200],
        [28, Infinity, 4500],
      ],
      B: [
        [0, 24, 4700],
        [25, 25, 4200],
        [26, 26, 4500],
        [27, 27, 4300],
        [28, Infinity, 4400],
      ],
      C: [
        [0, 24, 4600],
        [25, 25, 4900],
        [26, 26, 4600],
        [27, 27, 4700],
        [28, Infinity, 4000],
      ],
      D: [
        [0, 24, 5000],
        [25, 25, 4900],
        [26, 26, 4700],
        [27, 27, 5000],
        [28, Infinity, 4300],
      ],
    },
  };

  // Obtener montos
  const { montoMinimo, montoMaximo } = obtenerLimitesDeCredito(
    mesesTranscurridos,
    categoriaNomina,
    sexo,
    tablasDeMontosMinimos,
    tablasDeMontosMaximos
  );

  // Calcular línea de crédito óptima
  const lineaCredito1 = montoMinimo + Math.sqrt(montoMaximo - montoMinimo);
  const lineaCredito2 = montoMinimo + 0.0175 * (montoMaximo - montoMinimo);
  const lineaOptima = Math.max(lineaCredito1, lineaCredito2);

  return {
    montoMinimo,
    montoMaximo,
    recomendacionLinea: lineaOptima.toFixed(2),
  };
}

function MotorCreditoApp() {
  const [categoriaNomina, setCategoriaNomina] = useState("A");
  const [fechaIngresoLaboral, setFechaIngresoLaboral] = useState("");
  const [sexo, setSexo] = useState("m");
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fechaIngreso = new Date(fechaIngresoLaboral);
    const resultadoCalculo = calcularCreditoOptimo(
      categoriaNomina,
      fechaIngreso,
      sexo
    );
    setResultado(resultadoCalculo);
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center mt-10">
      <h1 className="font-bold text-[20px]">Motor de Crédito</h1>
      <form
        className="flex flex-col gap-2 border-2 border-black rounded-md p-3"
        onSubmit={handleSubmit}
      >
        <div className="border-b">
          <label>Tipo de Nómina: </label>
          <select
            value={categoriaNomina}
            onChange={(e) => setCategoriaNomina(e.target.value)}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="border-b">
          <label>Fecha de Ingreso Laboral: </label>
          <input
            type="date"
            value={fechaIngresoLaboral}
            onChange={(e) => setFechaIngresoLaboral(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Sexo: </label>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
            <option value="m">Masculino</option>
            <option value="f">Femenino</option>
          </select>
        </div>

        <button className="bg-black text-white p-1" type="submit">
          Calcular
        </button>
      </form>

      {resultado && (
        <div className="flex flex-col gap-2 border-2 border-black p-3 rounded-md">
          <h2>Montos aprobados:</h2>
          <p>Monto Mínimo: ${resultado.montoMinimo}</p>
          <p>Monto Máximo: ${resultado.montoMaximo}</p>
          <p>Línea de Crédito Óptima: ${resultado.recomendacionLinea}</p>
          <button onClick={()=>{
            window.location.reload()
          }} className="bg-red-500 text-white p-1">
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}

export default MotorCreditoApp;
