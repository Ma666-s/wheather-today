// Constants
const API_KEY = 'f6bf9e4774974e62934134851241312';
const API_BASE_URL = 'http://api.weatherapi.com/v1/forecast.json';
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
  }
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
    const response = await fetch(
      `${API_BASE_URL}?key=${API_KEY}&q=${cityName}&days=3&aqi=yes&alerts=yes`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
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

// Main Function
async function updateWeather(cityName = DEFAULT_CITY) {
  try {
    const weatherData = await fetchWeatherData(cityName);
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
  } catch (error) {
    console.error('Error updating weather:', error);
    // You might want to display an error message to the user here
  }
}

// Event Listeners
function setupEventListeners() {
  elements.search.addEventListener('input', (e) => {
    const searchValue = e.target.value.trim();
    if (searchValue) {
      updateWeather(searchValue);
    }
  });
}

// Initialize App
function init() {
  initializeDates();
  setupEventListeners();
  updateWeather();
}

// Start the application
init();