// Constants
const API_KEY = 'f6bf9e4774974e62934134851241312';
const API_BASE_URL = 'https://api.weatherapi.com/v1/forecast.json'; // Changed to https
const DEFAULT_CITY = 'Cairo';
const PATH_PREFIX = 'https:';

// DOM Elements
const elements = {
  date: {
    today: document.getElementById('dateIdToDay'),
    month: document.getElementById('dateIdMonth'),
    tomorrow: document.getElementById('dateIdTomorrow'),
    afterTomorrow: document.getElementById('dateIdAfterTomorrow')
  },
  search: document.getElementById('searchId'),
  currentWeather: {
    location: document.getElementById('locationId'),
    temp: document.getElementById('tempId'),
    status: document.getElementById('weatherStatusId'),
    icon: document.getElementById('iconImgId'),
    humidity: document.getElementById('humindityId'),
    windDir: document.getElementById('windDirId'),
    windSpeed: document.getElementById('windKphId')
  },
  forecast: {
    nextDay: {
      maxTemp: document.getElementById('maxTempNextId'),
      minTemp: document.getElementById('minTempNextId'),
      icon: document.getElementById('iconImgNextId'),
      status: document.getElementById('statusWNextId')
    },
    afterNextDay: {
      maxTemp: document.getElementById('maxTempAfterNextId'),
      minTemp: document.getElementById('minTempAfterNextId'),
      icon: document.getElementById('iconImgAfterNextId'),
      status: document.getElementById('statusWAfterNextId')
    }
  },
  loadingSpinner: document.getElementById('loadingSpinner'),
  errorMessage: document.getElementById('errorMessage')
};

// Initialize Date Display
function initializeDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(today.getDate() + 2);

  const options = { weekday: 'long' };
  const monthOptions = { month: 'long' };

  elements.date.today.textContent = today.toLocaleString('en-US', options);
  elements.date.month.textContent = `${today.getDate()} ${today.toLocaleString('en-US', monthOptions)}`;
  elements.date.tomorrow.textContent = tomorrow.toLocaleString('en-US', options);
  elements.date.afterTomorrow.textContent = afterTomorrow.toLocaleString('en-US', options);
}

// API Functions
async function fetchWeatherData(cityName) {
  try {
    showLoading(true);
    const response = await fetch(
      `${API_BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(cityName)}&days=3&aqi=yes&alerts=yes`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    showError('Failed to fetch weather data. Please try again.');
    throw error;
  } finally {
    showLoading(false);
  }
}

// Display Functions
function displayCurrentWeather(data) {
  const { current, location } = data;
  
  elements.currentWeather.location.textContent = location.name;
  elements.currentWeather.temp.textContent = current.temp_c;
  elements.currentWeather.icon.src = PATH_PREFIX + current.condition.icon;
  elements.currentWeather.status.textContent = current.condition.text;
  elements.currentWeather.humidity.textContent = `${current.humidity}%`;
  elements.currentWeather.windSpeed.textContent = `${current.wind_kph} km/h`;
  elements.currentWeather.windDir.textContent = current.wind_dir;
}

function displayForecast(data) {
  const [todayForecast, tomorrowForecast, afterTomorrowForecast] = data.forecast.forecastday;

  // Tomorrow's forecast
  elements.forecast.nextDay.maxTemp.textContent = tomorrowForecast.day.maxtemp_c;
  elements.forecast.nextDay.minTemp.textContent = tomorrowForecast.day.mintemp_c;
  elements.forecast.nextDay.icon.src = PATH_PREFIX + tomorrowForecast.day.condition.icon;
  elements.forecast.nextDay.status.textContent = tomorrowForecast.day.condition.text;

  // After tomorrow's forecast
  elements.forecast.afterNextDay.maxTemp.textContent = afterTomorrowForecast.day.maxtemp_c;
  elements.forecast.afterNextDay.minTemp.textContent = afterTomorrowForecast.day.mintemp_c;
  elements.forecast.afterNextDay.icon.src = PATH_PREFIX + afterTomorrowForecast.day.condition.icon;
  elements.forecast.afterNextDay.status.textContent = afterTomorrowForecast.day.condition.text;
}

// UI Helpers
function showLoading(show) {
  if (elements.loadingSpinner) {
    elements.loadingSpinner.style.display = show ? 'block' : 'none';
  }
}

function showError(message) {
  if (elements.errorMessage) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
    setTimeout(() => {
      elements.errorMessage.style.display = 'none';
    }, 5000);
  }
}

// Main Function
async function updateWeather(cityName = DEFAULT_CITY) {
  try {
    const weatherData = await fetchWeatherData(cityName);
    if (weatherData) {
      displayCurrentWeather(weatherData);
      displayForecast(weatherData);
    }
  } catch (error) {
    console.error('Error updating weather:', error);
  }
}

// Event Listeners
function setupEventListeners() {
  let searchTimeout;
  
  elements.search.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const searchValue = e.target.value.trim();
    
    if (searchValue.length > 2) { // Only search if input has at least 3 characters
      searchTimeout = setTimeout(() => {
        updateWeather(searchValue);
      }, 500); // Add slight delay to reduce API calls
    }
  });
}

// Initialize App
function init() {
  initializeDates();
  setupEventListeners();
  updateWeather();
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);