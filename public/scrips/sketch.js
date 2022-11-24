// Crear objeto para almacenar las graficas y el contador para diferenciarlas
let charts = {};
let chartsCounter = 0;

// Funcion para cargar la informacion de los csv
const loadData = async (filename) => {
  
  let data = [];
  let labels = [];
  
  const info = await d3.csv(filename)
  
  for ( let i=0; i < info.length; i++ ) {
    // Dejar solo dos decimales para mejorar experiencia del usuario
    const tiempo = parseFloat(info[i].tiempo).toFixed(2);
    const amplitud = info[i].amplitud; 
    labels.push(tiempo);
    data.push(amplitud)
  };

  return { data, labels }
  
}

// Funcion para generar las graficas a partir de la informacion cargada
const generateGraph = ( signal , configInfo , canvas ) => {
  let signalLabels = signal.labels;
  let signalData = signal.data;
  let index = 1;
  
  const config = {     
    type: 'line',
    responsive: 'true',     
    data: {
      labels: signalLabels.slice(0,200),
      datasets: [{
        label: configInfo.title,
        data: signalData.slice(0,200),
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderColor: configInfo.color,
        tension: 0.1,
      }]
    },options: { 
      animation: {
        duration: 0
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'xy',
          }
        },
        legend: {
          labels: {
              color: "rgb(161, 161, 161)",
          }
        },
      },
      scales: {
        y: {
          grid: { 
            borderColor: 'rgb(161, 161, 161)',
            color: 'rgb(161, 161, 161)' 
          },
          ticks: { 
            stepSize: 0.1,
            color: 'rgb(161, 161, 161)e', 
            beginAtZero: true }
        },
        x: {
          grid: { 
            borderColor: 'rgb(161, 161, 161)',
            color: 'rgb(161, 161, 161)' 
          },
          ticks: { 
            stepSize: 0.5,
            color: 'rgb(161, 161, 161)', 
            beginAtZero: true, 
            callback: function(value, index, values) {
              if (index % 2 === 0) {
                return Math.round(value);
              }
              return null;
            }

          }
        }
      }
  }
  };
  
  const chartName = 'chart' + chartsCounter;
  charts[chartName] = new Chart(canvas, config);

  chartsCounter++

  setInterval(() => {
    index+200 > signalLabels.length ? index = 0 : null
    charts[chartName].data.labels = signalLabels.slice(index,index+200)
    charts[chartName].data.datasets.forEach((dataset) => {
      dataset.data = signalData.slice(index,index+200);
    });
    charts[chartName].update();
    index++
  }, 50);

}
const $ = (id) => document.getElementById(id);

//Seleccionar los canvas para graficar
const canvasECG = $('canvas1')
const canvasSPO2 = $('canvas2')
const canvasFLUJOMETRO = $('canvas3')
const canvasCUATRO = $('canvas4')
const canvasCINCO = $('canvas5')

const getInfo = async () => {
  const ECG = await loadData(`/data/${id}ECG.csv`)
  const SPO2 = await loadData(`/data/${id}SPO2.csv`)
  const FLUJOMETRO = await loadData(`/data/${id}FLUJOMETRO.csv`)
  const CUATRO = await loadData(`/data/${id}SPO2.csv`)
  const CINCO = await loadData(`/data/${id}ECG.csv`)
  return {
    ECG:ECG,
    SPO2:SPO2,
    FLUJOMETRO:FLUJOMETRO,
    CUATRO:CUATRO,
    CINCO:CINCO  
  }
}

const showGraphs = (data) => {

  // Crear archivos de configuracion
  const configECG = {title: 'ECG' , color : '#00ff00' }
  const configSPO2 = {title: 'SPO2' , color : '#0023FF' }
  const configFLUJOMETRO = {title: 'FLUJOMETRO' , color : '#F4D03F' }
  const configCUATRO = {title: 'CUATRO' , color : '#FF2F2F' }
  const configCINCO = {title: 'CINCO' , color : '#8E44AD'}

  // Generar graficas
  generateGraph(data.ECG, configECG , canvasECG )
  generateGraph(data.SPO2, configSPO2 , canvasSPO2 )
  generateGraph(data.FLUJOMETRO, configFLUJOMETRO , canvasFLUJOMETRO )
  generateGraph(data.CUATRO, configCUATRO , canvasCUATRO )
  generateGraph(data.CINCO, configCINCO , canvasCINCO )

}

const buildGraphs = async () => {
  const data = await getInfo()
  showGraphs(data)
}

buildGraphs()