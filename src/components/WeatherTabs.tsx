import React from "react";
import { Tabs, Tab, Container, Table } from "react-bootstrap";

const WeatherTabs: React.FC = () => {
  return (
    <Container className="mt-4">
      <h3 className="mb-3">Forecast at Shanghai, Shanghai</h3>
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
              {/* Example rows */}
              <tr>
                <td>1</td>
                <td>Tuesday, Oct. 8, 2024</td>
                <td>Clear</td>
                <td>72.28</td>
                <td>53.32</td>
                <td>4.44</td>
              </tr>
              {/* Add more rows as needed */}
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
