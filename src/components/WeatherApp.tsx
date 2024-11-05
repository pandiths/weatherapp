import React, { useState } from "react";
import WeatherSearchForm from "./WeatherSearchForm";
import WeatherTabs from "./WeatherTabs";

const WeatherApp: React.FC = () => {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearchSubmit = (data: any) => {
    // Update searchParams state with form data, which could trigger a data fetch
    setSearchParams(data);
    console.log("Received search parameters:", data);
    // Fetch weather data based on search parameters here (if needed)
  };

  return (
    <div>
      <WeatherSearchForm onSubmit={handleSearchSubmit} />
      <WeatherTabs />
    </div>
  );
};

export default WeatherApp;
