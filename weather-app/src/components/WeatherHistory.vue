<template>
  <div class="weather-history">
    <h1>Weather History</h1>

    <div class="filters">
      <label for="location-filter">Location:</label>
      <select v-model="selectedLocation" id="location-filter">
        <option value="">All Locations</option>
        <option v-for="location in locations" :key="location.id" :value="location.id">
          {{ location.city }}
        </option>
      </select>

      <label for="date-filter">Date:</label>
      <input type="date" v-model="selectedDate" id="date-filter" />

      <button @click="applyFilters">Apply Filters</button>
    </div>

    <table class="table-values">
      <thead>
        <tr>
          <th>Location</th>
          <th>Date</th>
          <th>Temperature (°C)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in filteredWeatherHistory" :key="entry.id">
          <td>{{ getLocation(entry.locationId) }}</td>
          <td>{{ formatDate(entry.date) }}</td>
          <td>{{ entry.temperature }}°C</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      locations: [], 
      weatherHistory: [],
      selectedLocation: '',
      selectedDate: '',
    };
  },
  computed: {
    filteredWeatherHistory() {
      return this.weatherHistory.filter(entry => {
        const matchesLocation = this.selectedLocation ? entry.locationId === this.selectedLocation : true;
        const matchesDate = this.selectedDate ? new Date(entry.date).toISOString().slice(0, 10) === this.selectedDate : true;
        return matchesLocation && matchesDate;
      });
    }
  },
  methods: {
    async fetchWeatherHistory() {
      try {
        const response = await axios.get('http://localhost:3000/weatherHistory');
        this.weatherHistory = response.data;
      } catch (error) {
        console.error('Error fetching weather history:', error);
      }
    },
    async fetchLocations() {
      try {
        const response = await axios.get('http://localhost:3000/locations');
        this.locations = response.data;
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    },
    getLocation(locationId) {
      const location = this.locations.find(loc => loc.id === locationId);
      return location ? location.city : 'Unknown';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    applyFilters() {

    }
  },
  mounted() {
    this.fetchWeatherHistory();
    this.fetchLocations();
  }
};
</script>

<style scoped>
.weather-history {
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #2c3e50; 
  font-weight: 700; 
  text-align: center;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  text-align: center
}

.filters label {
  margin-right: 10px;
  font-size: 1rem;
  color: #2c3e50; 
}

.filters select, .filters input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.filters button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.filters button:hover {
  background-color: #2980b9;
}

.filters button:active {
  transform: scale(0.98);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th, table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center
}

table th {
  background-color: #f4f4f4;
  color: #2c3e50; 
  text-align: center;
  font-weight: bold;
}

table td {
  text-align: center;
}
</style>
