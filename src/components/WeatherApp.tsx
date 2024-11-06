import React, { useState } from "react";
import { Tabs, Tab, Container, Spinner, Alert } from "react-bootstrap";
import WeatherSearchForm from "./WeatherSearchForm";
import WeatherTabs from "./WeatherTabs";
import WeatherDetails from "./WeatherDetails";

interface WeatherData {
  date: string;
  status: string;
  maxTemp: string;
  minTemp: string;
  apparentTemp: string;
  sunrise: string;
  sunset: string;
  humidity: string;
  windSpeed: string;
  visibility: string;
  cloudCover: string;
}

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);
  const [selectedData, setSelectedData] = useState<WeatherData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [favorites, setFavorites] = useState<WeatherData[]>([]); // New state for favorites

  // Reset function to clear all data across components
  const handleResetAll = () => {
    setWeatherData([]);
    setLoading(false);
    setError(null);
    setCoordinates(null);
    setSelectedData(null);
    setHasSearched(false);
    setActiveTab("results");
  };

  const handleSearchSubmit = async (data: {
    street: string;
    city: string;
    state: string;
    latitude?: string;
    longitude?: string;
  }) => {
    const lat = coordinates?.latitude || data.latitude;
    const long = coordinates?.longitude || data.longitude;

    if (lat && long) {
      setLoading(true);
      setError(null);
      try {
        const apiKey = "hLW5w3nqhwrbf2YT6IZVsUHNvrkoz90Z";
        const response = await fetch(
          `https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,humidity,sunriseTime,sunsetTime,visibility,cloudCover&units=imperial&timesteps=1d&apikey=${apiKey}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const weatherData = await response.json();

        const formattedData = weatherData.data.timelines[0].intervals.map(
          (item: any) => ({
            date: item.startTime,
            status: item.values.weatherCode,
            maxTemp: `${item.values.temperatureMax}°F`,
            minTemp: `${item.values.temperatureMin}°F`,
            apparentTemp: `${item.values.temperatureApparent}°F`,
            sunrise: new Date(item.values.sunriseTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sunset: new Date(item.values.sunsetTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            humidity: `${item.values.humidity}%`,
            windSpeed: `${item.values.windSpeed} mph`,
            visibility: `${item.values.visibility} mi`,
            cloudCover: `${item.values.cloudCover}%`,
          })
        );

        setWeatherData(formattedData);
        setCoordinates({ latitude: lat, longitude: long });
        setHasSearched(true);
        setActiveTab("results");
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Latitude and longitude must be provided.");
    }
  };

  const handleLocationFetch = (lat: string, long: string) => {
    setCoordinates({ latitude: lat, longitude: long });
  };

  // Function to add selected data to favorites
  const handleFavoriteClick = () => {
    if (selectedData && !favorites.some(fav => fav.date === selectedData.date)) {
      setFavorites([...favorites, selectedData]);
      console.log("Added to favorites!");
    }
  };

  return (
    <Container className="mt-5">
      <WeatherSearchForm
        onSubmit={handleSearchSubmit}
        onLocationFetch={handleLocationFetch}
      />

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "results")}
        className="mt-4"
      >
        <Tab eventKey="results" title="Results">
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : !hasSearched ? (
            <div className="text-center p-3">No results yet. Please search for a location.</div>
          ) : (
            <WeatherTabs
              weatherData={weatherData}
              coordinates={coordinates}
              onDateClick={setSelectedData}
              onFavoriteClick={handleFavoriteClick} // Pass the handleFavoriteClick function here
            />
          )}
        </Tab>

        <Tab eventKey="favorites" title="Favorites">
          {favorites.length === 0 ? (
            <div className="text-center p-3">No favorites added yet.</div>
          ) : (
            <div>
              <h3 className="text-center mt-3">Favorite Weather Data</h3>
              <ul className="list-group">
                {favorites.map((fav, index) => (
                  <li key={index} className="list-group-item">
                    {fav.date} - {fav.status}, Max Temp: {fav.maxTemp}, Min Temp: {fav.minTemp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default WeatherApp;
