import React from "react";
import { Tabs, Tab, Container, Table } from "react-bootstrap";

// Define a type for the weather data to use as props
interface WeatherData {
  date: string;
  status: string;
  tempHigh: number;
  tempLow: number;
  windSpeed: number;
}

interface WeatherTabsProps {
  weatherData: WeatherData[]; // Accept an array of weather data
}

const WeatherTabs: React.FC<WeatherTabsProps> = ({ weatherData }) => {
  return (
    <Container className="mt-4">
      <h3 className="mb-3">Weather Forecast</h3>
      <Tabs defaultActiveKey="dayView" id="weather-tabs" className="mb-3">
        <Tab eventKey="dayView" title="Day View">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Status</th>
                <th>Temp. High (°F)</th>
                <th>Temp. Low (°F)</th>
                <th>Wind Speed</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.length > 0 ? (
                weatherData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.date}</td>
                    <td>{data.status}</td>
                    <td>{data.tempHigh}</td>
                    <td>{data.tempLow}</td>
                    <td>{data.windSpeed}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No weather data available.
                  </td>
                </tr>
              )}
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
    </Container>
  );
};

export default WeatherTabs;
