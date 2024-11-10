import React from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface WeatherData {
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

interface WeatherDetailsProps {
  date: string;
  weatherData: WeatherData;
  latitude: number;
  longitude: number;
  googleMapsApiKey: string;
  onBackToList: () => void;
  cityName: string;
  regionName: string;
  temperature: string;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  date,
  weatherData,
  latitude,
  longitude,
  googleMapsApiKey,
  onBackToList,
  cityName,
  regionName,
  temperature,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
  });

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const tweetWeatherDetails = () => {
    const tweetText = `Weather Details for ${cityName}, ${regionName}: Status: ${weatherData.status}, Temperature: ${temperature}°C, Humidity: ${weatherData.humidity}%, Wind Speed: ${weatherData.windSpeed} km/h.`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&hashtags=Weather,Forecast`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-between align-items-center mb-3">
        <Col xs="auto">
          <Button
            className="d-flex align-items-center justify-content-center"
            variant="outline-secondary"
            onClick={onBackToList}
          >
            <span className="material-symbols-outlined">chevron_left</span>
            Back to List
          </Button>
        </Col>
        <Col xs="auto" className="text-center">
          <h4 className="m-0">
            {formatDate(date)}
            <Button onClick={tweetWeatherDetails} variant="light">
              X
            </Button>
          </h4>
        </Col>
      </Row>

      <div className="bg-light rounded-3 p-3 shadow-sm w-100">
        <Table borderless className="text-center w-100">
          <tbody>
            <tr>
              <th>Status</th>
              <td>{weatherData.status || "N/A"}</td>
            </tr>
            <tr>
              <th>Max Temperature</th>
              <td>{weatherData.maxTemp || "N/A"}</td>
            </tr>
            <tr>
              <th>Min Temperature</th>
              <td>{weatherData.minTemp || "N/A"}</td>
            </tr>
            <tr>
              <th>Apparent Temperature</th>
              <td>{weatherData.apparentTemp || "N/A"}</td>
            </tr>
            <tr>
              <th>Sunrise Time</th>
              <td>{weatherData.sunrise || "N/A"}</td>
            </tr>
            <tr>
              <th>Sunset Time</th>
              <td>{weatherData.sunset || "N/A"}</td>
            </tr>
            <tr>
              <th>Humidity</th>
              <td>{weatherData.humidity || "N/A"}</td>
            </tr>
            <tr>
              <th>Wind Speed</th>
              <td>{weatherData.windSpeed || "N/A"}</td>
            </tr>
            <tr>
              <th>Visibility</th>
              <td>{weatherData.visibility || "N/A"}</td>
            </tr>
            <tr>
              <th>Cloud Cover</th>
              <td>{weatherData.cloudCover || "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      {isLoaded ? (
        <div className="mt-4 border rounded-3 shadow-sm">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            <Marker position={center} />
          </GoogleMap>
        </div>
      ) : (
        <p className="text-center p-3">Loading map...</p>
      )}
    </Container>
  );
};

export default WeatherDetails;
