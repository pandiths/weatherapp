// @ts-nocheck
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
import HC_data from "highcharts/modules/data";
import HighchartsMore from "highcharts/highcharts-more";

// Initialize modules
HighchartsMore(Highcharts); // Initializes highcharts-more

HC_exporting(Highcharts);
HC_data(Highcharts);

const TemperatureChart: React.FC<{
  data: { date: string; maxTemp: string; minTemp: string }[];
}> = ({ data }) => {
  const chartsData = data.map(({ date, minTemp, maxTemp }) => [
    date,
    minTemp,
    maxTemp,
  ]);
  console.log(chartsData);
  const options: Highcharts.Options = {
    data: chartsData,
    chart: {
      type: "arearange",
      zooming: {
        type: "x",
      },
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: "Temperature variation by day",
      align: "left",
    },
    subtitle: {
      text:
        "Source: " +
        '<a href="https://veret.gfi.uib.no/"' +
        'target="_blank">Universitetet i Bergen</a>',
      align: "left",
    },
    xAxis: {
      type: "datetime",
      crosshair: true,
      accessibility: {
        rangeDescription: "Range: Jan 1st 2023 to Jan 1st 2024.",
      },
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: "°C",
      xDateFormat: "%A, %b %e",
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "arearange",
        name: "Temperatures",
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, "#ff0000"],
            [1, "#0000ff"],
          ],
        },
        data: chartsData
          ? chartsData.map((point) => ({
              x: point[0],
              low: point[1],
              high: point[2],
              color: "#0000ff",
            }))
          : [], // Leave data empty, as it will load from the CSV URL
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TemperatureChart;
