<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, watch } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'LineChart',
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      lineColor: {
        type: String,
        default: '#f87979', // Default color if not provided
      },
    },
    setup(props) {
      const chartCanvas = ref(null);
      let chartInstance = null;
  
      onMounted(() => {
        chartInstance = new Chart(chartCanvas.value, {
          type: 'line',
          data: props.chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `Temperature: ${tooltipItem.raw}°C`;
                  },
                },
              },
            },
            elements: {
              line: {
                borderColor: props.lineColor, 
              },
            },
          },
        });
      });
  
      watch(() => props.chartData, (newData) => {
        if (chartInstance) {
          chartInstance.data = newData;
          chartInstance.update();
        }
      });
  
      watch(() => props.lineColor, (newColor) => {
        if (chartInstance) {
          chartInstance.data.datasets[0].borderColor = newColor;
          chartInstance.update();
        }
      });
  
      return {
        chartCanvas,
      };
    },
  };
  </script>
  
  <style scoped>
  </style>
  