import React, { useState } from "react";
import WeatherSearchForm from "./WeatherSearchForm";
import WeatherTabs from "./WeatherTabs";

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);

  const handleSearchSubmit = async (data: {
    street: string;
    city: string;
    state: string;
    latitude?: string;
    longitude?: string;
  }) => {
    console.log("Received search parameters:", data);

    // Use latitude and longitude from coordinates if autodetected; else, use manually entered data
    const lat = coordinates?.latitude || data.latitude;
    const long = coordinates?.longitude || data.longitude;

    if (lat && long) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,cloudCover,moonPhase&units=imperial&timesteps=1d&timezone=America/Los_Angeles&apikey=IwirFsfNeFFrYvEzjinyRBEF6BSmxRH6`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const weatherData = await response.json();

        const formattedData = weatherData.data.timelines[0].intervals.map(
          (item: any) => ({
            date: item.startTime,
            status: item.values.weatherCode,
            tempHigh: item.values.temperatureMax,
            tempLow: item.values.temperatureMin,
            windSpeed: item.values.windSpeed,
          })
        );

        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Latitude and longitude must be provided.");
    }
  };

  const handleLocationFetch = (lat: string, long: string) => {
    console.log("Location fetched:", lat, long);
    setCoordinates({ latitude: lat, longitude: long });
  };

  return (
    <div>
      <WeatherSearchForm
        onSubmit={handleSearchSubmit}
        onLocationFetch={handleLocationFetch}
      />
      {loading ? (
        <p>Loading weather data...</p>
      ) : (
        <WeatherTabs weatherData={weatherData} />
      )}
    </div>
  );
};

export default WeatherApp;
