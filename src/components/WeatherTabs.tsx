import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container, Table, Button, Row, Col } from "react-bootstrap";
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

interface WeatherTabsProps {
  weatherData: WeatherData[];
  coordinates?: { latitude: string; longitude: string } | null;
  onDateClick: (data: WeatherData) => void;
  onFavoriteClick: () => void;
}

const WeatherTabs: React.FC<WeatherTabsProps> = ({
  weatherData,
  coordinates,
  onDateClick,
  onFavoriteClick,
}) => {
  const [selectedData, setSelectedData] = useState<WeatherData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [cityName, setCityName] = useState<string>("");

  useEffect(() => {
    const fetchCityName = async () => {
      if (coordinates) {
        const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`;

        try {
          const response = await fetch(geocodingUrl);
          const data = await response.json();
          if (data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            const cityComponent = addressComponents.find((component: any) =>
              component.types.includes("locality")
            );
            if (cityComponent) {
              setCityName(cityComponent.long_name);
            } else {
              setCityName("City Not Found");
            }
          }
        } catch (error) {
          console.error("Error fetching city name:", error);
        }
      }
    };
    fetchCityName();
  }, [coordinates]);

  const handleMoreDetailsClick = () => {
    if (!selectedData && weatherData.length > 0) {
      setSelectedData(weatherData[0]);
      onDateClick(weatherData[0]);
    }
    setShowDetails(true);
    setTimeout(() => setHideTable(true), 300); // Hide table after the transition
  };

  const handleRowClick = (data: WeatherData) => {
    setSelectedData(data);
    onDateClick(data);
    setShowDetails(true);
    setTimeout(() => setHideTable(true), 300); // Hide table after the transition
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setHideTable(false); // Reset table visibility when going back
  };

  return (
    <Container className={`mt-4 container-slide ${showDetails ? "show-details" : ""}`}>
      <div className={`tab-content ${hideTable ? "hidden" : ""}`}>
        <h3 className="mb-3">
          Weather Forecast {cityName ? `for ${cityName}` : ""}
        </h3>
        <Row className="mb-3">
          <Col xs="auto">
            <Button variant="primary" onClick={onFavoriteClick}>
              Favorite
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={handleMoreDetailsClick}>
              More Details
            </Button>
          </Col>
        </Row>
    
        <Tabs defaultActiveKey="dayView" id="weather-tabs" className="mt-3">
          <Tab eventKey="dayView" title="Day View">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Max Temp</th>
                  <th>Min Temp</th>
                  <th>Wind Speed</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.map((data, index) => (
                  <tr key={index} onClick={() => handleRowClick(data)}>
                    <td>{index + 1}</td>
                    <td>
                      <Button variant="link" onClick={() => handleRowClick(data)}>
                        {new Intl.DateTimeFormat("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(data.date))}
                      </Button>
                    </td>
                    <td>{data.status}</td>
                    <td>{data.maxTemp}</td>
                    <td>{data.minTemp}</td>
                    <td>{data.windSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="dailyTempChart" title="Daily Temp. Chart">
            <div>Temperature chart will be displayed here.</div>
          </Tab>
          <Tab eventKey="meteogram" title="Meteogram">
            <div>Meteogram data will be displayed here.</div>
          </Tab>
        </Tabs>
      </div>
  
      {showDetails && hideTable && selectedData && coordinates && (
        <div className="details-content">
          <WeatherDetails
            date={selectedData.date}
            weatherData={selectedData}
            latitude={parseFloat(coordinates.latitude)}
            longitude={parseFloat(coordinates.longitude)}
            googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
            onBackToList={handleBackToList}
          />
        </div>
      )}
    </Container>
  );
};

export default WeatherTabs;
