<template>
    <div :class="['saved-locations', darkMode ? 'dark-mode' : '']">
      <div class="mode-toggle" @click="toggleDarkMode">
        <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </div>
      <h1 class="title">Saved Locations Weather Data</h1>
      <div v-for="location in locations" :key="location.id" class="location-weather">
        <h3 class="city-name">{{ location.city }}</h3>
        <div class="charts">
          <div class="chart-container">
            <h4 class="chart-title">Daily Temperature</h4>
            <line-chart
              :chart-data="generateChartData(location.weatherData.daily)"
              :line-color="lineColor"
              :text-color="textColor"
            />
          </div>
          <div class="chart-container">
            <h4 class="chart-title">Weekly Temperature</h4>
            <line-chart
              :chart-data="generateChartData(location.weatherData.weekly)"
              :line-color="lineColor"
              :text-color="textColor"
            />
          </div>
          <div class="chart-container">
            <h4 class="chart-title">Monthly Temperature</h4>
            <line-chart
              :chart-data="generateChartData(location.weatherData.monthly)"
              :line-color="lineColor"
              :text-color="textColor"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import LineChart from './LineChart.vue'; 
  
  export default {
    name: 'SavedLocations',
    components: {
      LineChart,
    },
    setup() {
      const locations = ref([]);
      const darkMode = ref(false);
  
      const lineColor = computed(() => (darkMode.value ? '#ffffff' : '#f87979'));
      const textColor = computed(() => (darkMode.value ? '#ffffff' : '#000000'));
  
      onMounted(async () => {
        try {
          const response = await axios.get('http://localhost:3000/locations');
          locations.value = response.data;
        } catch (error) {
          console.error('Error fetching saved locations:', error);
        }
      });
  
      const generateChartData = (weatherData) => {
        return {
          labels: weatherData.map(data => data.date),
          datasets: [
            {
              label: 'Temperature',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderColor: lineColor.value,
              data: weatherData.map(data => data.temperature),
            },
          ],
        };
      };
  
      const toggleDarkMode = () => {
        darkMode.value = !darkMode.value;
      };
  
      return {
        locations,
        generateChartData,
        darkMode,
        toggleDarkMode,
        lineColor,
        textColor,
      };
    },
  };
  </script>
  
  <style scoped>
  .saved-locations {
    padding: 20px;
    position: relative;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .saved-locations {
    background-color: #ffffff;
    color: #333333;
    font-family: 'Arial', sans-serif;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #2c3e50;
    text-align: center;
  }
  
  .location-weather {
    margin-bottom: 40px;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .city-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #555555;
  }
  
  .charts {
    display: flex;
    justify-content: space-between;
    
  }
  
  .chart-container {
    width: 30%;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: #f9f9f9;
  }
  
  .chart-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #555555;
  }

  .saved-locations.dark-mode {
    background-color: #1e1e1e;
    color: #e0e0e0;
  }
  
  .saved-locations.dark-mode .title {
    color: #e0e0e0;
  }
  
  .saved-locations.dark-mode .location-weather {
    background: #2c2c2c;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .saved-locations.dark-mode .city-name {
    color: #cccccc;
  }
  
  .saved-locations.dark-mode .chart-container {
    background: #3a3a3a;
  }
  
  .saved-locations.dark-mode .chart-title {
    color: #cccccc;
  }
  
  .mode-toggle {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
    color: #333333;
    transition: color 0.3s;
  }
  
  .saved-locations.dark-mode .mode-toggle {
    color: #e0e0e0;
  }
  </style>
  