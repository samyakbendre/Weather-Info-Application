<template>
  <div class="page-wrapper">
    <div class="main-content">
      <div :style="weatherContainerStyle" class="weather-container">
        <div class="input-card">
          <input v-model="city" @keyup.enter="fetchWeatherData" placeholder="Enter city name" class="city-input" />
          <button @click="fetchWeatherData" class="fetch-button">Get Weather</button>
        </div>
        <div v-if="error" class="error-badge">{{ error }}</div>
        <div class="weather-forecast">
          <div v-if="weather" :class="['weather-card', weatherCardClass]">
            <div class="weather-temp">
              <img :src="iconUrl" :alt="weather.weather[0].description" class="weather-icon" />
              <p class="temperature">{{ weather.main.temp }}°C</p>
            </div>
            <p class="description">{{ capitalizedDescription }}</p>
            <h2 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h2>
            <p class="date">{{ formattedDate }}</p>
            <p class="feels-like">Feels like {{ weather.main.feels_like }}°C</p>
          </div>
          <div class="right-wrapper">
            <div class="hourly-forecast">
              <div class="hourly-forecast-row">
                <div v-for="(hour, index) in hourlyForecast.slice(0, 5)" :key="index" class="hourly-forecast-item">
                  <p class="hour">{{ hour.hour }}</p>
                  <div class="icon-temp">
                    <img :src="hour.icon" alt="weather icon" class="hourly-icon" />
                    <p class="hourly-temp">{{ hour.temp }}°C</p>
                  </div>
                </div>
              </div>

              <div class="separator"></div>

              <div class="hourly-forecast-row">
                <div v-for="(hour, index) in hourlyForecast.slice(5, 10)" :key="index" class="hourly-forecast-item">
                  <p class="hour">{{ hour.hour }}</p>
                  <div class="icon-temp">
                    <img :src="hour.icon" alt="weather icon" class="hourly-icon" />
                    <p class="hourly-temp">{{ hour.temp }}°C</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="dailyForecast.length" class="forecast-card">
              <h3 class="forecast-title">5-Day Forecast</h3>
              <div v-for="(day, index) in dailyForecast" :key="index" class="forecast-item">
                <p class="forecast-date">{{ day.date }}</p>
                <img :src="`https://api.openweathermap.org/img/w/${day.weather.icon}.png`"
                  :alt="day.weather.description" class="forecast-icon" />
                <p class="forecast-temp">{{ day.temp }}°C</p>
                <p class="forecast-description">{{ day.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="floating-action-button" @click="toggleButtons">
      <span class="plus-icon">+</span>
    </div>
    <div class="action-buttons" :class="{ 'show': showButtons }">
      <button @click="saveLocation" class="save-location-button">Click here to save Location</button>
      <button @click="viewSavedLocations" class="view-saved-locations-button">View Saved Locations</button>
      <button @click="viewWeatherHistory" class="weather-history-button">View Weather History</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

hourlyForecast

<script>
import axios from 'axios';
import { Chart } from 'chart.js/auto';


export default {
  data() {
    return {
      city: '',
      weather: null,
      forecast: null,
      iconUrl: '',
      formattedDate: '',
      dailyForecast: [],
      hourlyForecast: [],
      savedLocations: [],
      selectedLocation: null,
      locationWeatherData: [],
      chart: null,
      dailyData: [],
      weeklyData: [],
      monthlyData: [],
      error: '',
      showButtons: false,
      currentCity: 'Los Santos',
    };
  },
  computed: {
    weatherCardClass() {
      if (!this.weather) return '';

      const mainWeather = this.weather.weather[0].main.toLowerCase();
      if (mainWeather === 'clear') {
        return 'sunny';
      } else if (mainWeather === 'rain' || mainWeather === 'drizzle' || mainWeather === 'thunderstorm') {
        return 'rainy';
      } else if (mainWeather === 'clouds') {
        return 'cloudy';
      } else {
        return 'default-weather';
      }
    },
    capitalizedDescription() {
      if (this.weather && this.weather.weather && this.weather.weather[0] && this.weather.weather[0].description) {
        const description = this.weather.weather[0].description;
        return description.charAt(0).toUpperCase() + description.slice(1);
      }
      return '';
    },
    formattedDate() {
      if (!this.weather) return '';

      const date = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-GB', options);
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    },
    weatherContainerStyle() {
      if (!this.weather) return {};

      const mainWeather = this.weather.weather[0].main.toLowerCase();
      let backgroundImage = '';

      if (mainWeather === 'clear') {
        backgroundImage = "url('src/assets/sunny.jpg')";
      } else if (mainWeather === 'rain' || mainWeather === 'drizzle' || mainWeather === 'thunderstorm') {
        backgroundImage = "url('src/assets/rainy.jpg')";
      } else if (mainWeather === 'clouds') {
        backgroundImage = "url('src/assets/cloudy.jpg')";
      } else {
        backgroundImage = "url('src/assets/sunny.jpg')";
      }

      return {
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
  },
  mounted() {
    this.fetchWeatherByLocation();
  },
  methods: {
    async fetchWeatherByLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = '5bc67e503602126f4d306834cdab5c42';

            try {
              const weatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
              );
              this.weather = weatherResponse.data;
              this.currentCity = this.weather.name
              this.iconUrl = `https://api.openweathermap.org/img/w/${this.weather.weather[0].icon}.png`;
              this.formattedDate = new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
              );
              this.forecast = forecastResponse.data;
              this.processForecastData();
            } catch (error) {
              console.error('Error fetching weather data by location:', error);
              alert('Error fetching weather data. Please try again later.');
            }
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('User denied the request for Geolocation.');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
              case error.UNKNOWN_ERROR:
                alert('An unknown error occurred.');
                break;
              default:
                alert('Error retrieving location. Please enter your city manually.');
                break;
            }
            console.error('Geolocation error:', error);
          },
          {
            timeout: 30000,
            maximumAge: 0,
            enableHighAccuracy: true,
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    },

    createChart(data, labels, chartTitle) {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById('weatherChart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: chartTitle,
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    processLocationWeatherData() {
      if (!this.selectedLocation) return;
      this.dailyData = this.selectedLocation.main.temp;
      this.weeklyData = this.selectedLocation.main.temp;
      this.monthlyData = this.selectedLocation.main.temp;
      const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
      this.createChart(this.dailyData, labels, 'Daily Temperature');
    },
    async fetchWeatherData() {


      const apiKey = '5bc67e503602126f4d306834cdab5c42';
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}`
        );
        this.weather = weatherResponse.data;
        this.currentCity = this.weather.name
        this.iconUrl = `https://api.openweathermap.org/img/w/${this.weather.weather[0].icon}.png`;
        this.formattedDate = new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        //5-day forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${apiKey}`
        );
        this.forecast = forecastResponse.data;
        this.processForecastData();
        this.error = '';
      } catch (error) {
        console.error('Error fetching weather data:', error);
        this.error = 'Error fetching weather data. Please try again later or check the city name.';
        setTimeout(() => {
          this.error = '';
        }, 5000);
      }
    },
    processForecastData() {
      if (!this.forecast) return;
      const dailyForecasts = {};
      this.hourlyForecast = [];

      this.forecast.list.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString('en-GB');
        const hour = new Date(entry.dt * 1000).getHours();


        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temp: entry.main.temp,
            weather: entry.weather[0],
            description: entry.weather[0].description,
          };
        }

        if (hour >= 2 && hour <= 10) {
          this.hourlyForecast.push({
            hour: `${hour}:00`,
            temp: entry.main.temp,
            icon: `https://api.openweathermap.org/img/w/${entry.weather[0].icon}.png`,
          });
        }
      });

      this.dailyForecast = Object.values(dailyForecasts).slice(0, 5);
    },
    saveLocation() {
      const newLocation = {
        id: Math.random().toString(36).substring(2, 6), // Generate a random ID
        city: this.currentCity,
        weatherData: {
          daily: [
            { date: "2024-08-20", temperature: 25 },
            { date: "2024-08-21", temperature: 27 },
            { date: "2024-08-22", temperature: 26 },
          ],
          weekly: [
            { date: "Week 1", temperature: 24 },
            { date: "Week 2", temperature: 26 },
            { date: "Week 3", temperature: 25 },
          ],
          monthly: [
            { date: "August", temperature: 26 },
            { date: "July", temperature: 24 },
            { date: "June", temperature: 27 },
          ],
        }
      };

      fetch('http://localhost:3000/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
      })
        .then(response => response.json())
        .then(data => {
          alert("Location has been saved")
        })
        .catch(error => {
          console.error('Error saving location:', error);
        });
    },

    viewSavedLocations() {
      this.$router.push({ name: 'SavedLocations' });
    },

    toggleButtons() {
      this.showButtons = !this.showButtons;
    },

    viewWeatherHistory() {
      this.$router.push({ name: 'WeatherHistory' });
    },


    async fetchSavedLocations() {
      try {
        const response = await axios.get('http://localhost:3000/locations');
        this.savedLocations = response.data;
      } catch (error) {
        console.error('Error fetching saved locations:', error);
      }
    },

    async fetchLocationWeather(location) {
      const apiKey = '5bc67e503602126f4d306834cdab5c42';
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.city}&units=metric&appid=${apiKey}`
        );
        this.selectedLocation = weatherResponse.data;
        console.log(this.selectedLocation)
        this.processLocationWeatherData();
      } catch (error) {
        console.error('Error fetching location weather:', error);
      }
    },

    processLocationWeatherData() {
      if (!this.selectedLocation) return;

      this.dailyData = [15, 18, 22, 21, 20];
      const dailyLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];

      this.weeklyData = [17, 19, 21, 20, 22];
      const weeklyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

      this.monthlyData = [20, 22, 21];
      const monthlyLabels = ['Month 1', 'Month 2', 'Month 3'];

      this.createChart(this.dailyData, dailyLabels, 'Daily Temperature');
    },


    processLocationWeatherData() {
      if (!this.selectedLocation) return;
    },
    formatDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

.weather-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  background-image: url('src/assets/galaxy.jpg');
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: auto;
}

.input-card {
  backdrop-filter: blur(30px);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.city-input {
  backdrop-filter: blur(30px);
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 0.5rem;
}

.fetch-button {
  backdrop-filter: blur(30px);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #ffffff;
  color: black;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.fetch-button:hover {
  background-color: #0056b3;
  backdrop-filter: blur(30px);
  color: white;
}

.weather-card {
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 100%;
  transition: background-color 0.5s ease;
  justify-content: center;
  align-items: center;
}

.sunny {
  background-color: #c0b57b;
}

.rainy {
  background-color: #778899;
}

.cloudy {
  background-color: #B0C4DE;
}

.default-weather {
  background-color: #87CEEB;
}

.city-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.date {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.weather-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.3rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.weather-temp {
  display: flex;
  align-items: center;
  justify-content: center;
}

.forecast-card {
  background: rgba(56, 53, 6, 0.1);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  padding: 1rem;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 626px;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: rgb(255, 255, 255);
  width: 100%
}

.forecast-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  width: 100%;
}

.forecast-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(20% - 10px);
  padding: 1rem;
  border-radius: 5px;
  flex-direction: column;
  color: white;
  background: rgba(65, 61, 7, 0.1);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.forecast-date {
  font-size: 0.8rem;
  font-weight: bold;
}

.forecast-icon {
  width: 50px;
  height: 50px;
}

.forecast-temp {
  font-size: 1.25rem;
  font-weight: bold;
}

.forecast-description {
  font-size: 0.7rem;
  color: white;
  text-align: center;
}

.weather-forecast {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.location-button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
}

.location-button:hover {
  background-color: #218838;
}

.feels-like {
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
  font-weight: 600;
}

.hourly-forecast {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 100%;
  margin-top: 1rem;
}

.hourly-forecast-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.hourly-forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 18%;
  padding: 0.5rem;
  border-radius: 5px;
  color: white;
  flex-wrap: wrap;
}

.hourly-icon {
  width: 40px;
  height: 40px;
}

.hourly-temp {
  font-size: 1rem;
  font-weight: bold;
}

.hour {
  font-size: 0.8rem;
}

.icon-temp {
  display: flex;
  justify-content: center;
  align-items: center
}

.hourly-forecast {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
  margin-top: 1rem;
  background: rgba(65, 61, 7, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  flex-wrap: wrap;
}



.hourly-forecast-row {
  display: flex;
  justify-content: space-between;
}

.hourly-forecast-item {
  /* other styles */
}

.saved-locations {
  color: white;
  font-weight: bold
}

.separator {
  height: 1.5px;
  background-color: rgb(180, 180, 180);
  margin: 10px 0;
  border-radius: 1px;
}

.location-weather {
  margin-top: 2rem;
  text-align: center;
}

.chart-buttons {
  margin-bottom: 1rem;
}

.chart-buttons button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.chart-buttons button:hover {
  background-color: #0056b3;
}

canvas {
  max-width: 100%;
  margin: auto;
}

.home-container {
  color: white;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  gap: 1rem;
  max-width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
}

.save-location-button,
.view-saved-locations-button,
.weather-history-button,
.logout-button {
  width: 100%;
  padding: 0.75rem;
  text-align: center;
}

.right-wrapper {
  margin: 1rem
}

.save-location-button,
.view-saved-locations-button,
.weather-history-button,
.logout-button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: rgb(0, 0, 0);
  color: #ffffff;
  border: 1px solid #000000;
  cursor: pointer;
  font-size: 1rem;
}

.error-badge {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


.save-location-button:hover,
.view-saved-locations-button:hover,
.weather-history-button:hover,
.logout-button:hover {
  background-color: #000000;
  border-color: #ffffff;
  color: #ffffff;
}

.home-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

.save-location-button,
.view-saved-locations-button,
.weather-history-button,
.logout-button {
  padding: 10px 15px;
  font-size: 14px;
}

html,
body {
  height: 100%;
  margin: 0;
}

.page-wrapper {
  min-height: 100vh;
  position: relative;
}

.main-content {
  padding-bottom: 70px;
}

.floating-action-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #378ae2;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
}

.floating-action-button:hover {
  background-color: #0056b3;
}

.plus-icon {
  font-size: 24px;
  line-height: 1;
}

.action-buttons {
  position: fixed;
  bottom: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.action-buttons.show {
  opacity: 1;
  visibility: visible;
}

.save-location-button,
.view-saved-locations-button,
.weather-history-button,
.logout-button {
  padding: 10px 15px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-location-button:hover,
.view-saved-locations-button:hover,
.weather-history-button:hover,
.logout-button:hover {
  background-color: #0056b3;
}



.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}


@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .forecast-item {
    width: calc(50% - 10px);
  }
}

@media (max-width: 480px) {
  .forecast-item {
    width: calc(100% - 10px);
  }
}

@media (max-width: 600px) {
  .weather-container {
    background-size: cover;
    background-position: center;
    height: 100vh;
  }
}

@media (max-width : 940px) {
  .icon-temp {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}


@media (max-width: 400px) {
  .hourly-forecast {
    width: calc(100% - 10px);
    margin-left: 10px;
    display: flex;
    flex-wrap: wrap;
  }
}

@media(max-width : 540px) {
  .right-wrapper {
    width: 90%;
  }

  .hourly-temp {
    font-size: 0.8rem
  }
}

@media (min-width: 768px) {
  .home-container {
    width: auto;
    left: auto;
    right: 20px;
    bottom: 20px;
  }
}

@media (max-width: 767px) {
  .weather-container {
    background-size: cover;
  }
}

@media (max-width: 768px) {
  .weather-container {
    height: 100vh;
  }
}

@media(max-width: 380px) {
  .weather-container {
    height: 100vh
  }
}
</style>
