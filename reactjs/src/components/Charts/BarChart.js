import Card from "components/Card/Card";
import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";
import { barChartData, barChartOptions } from "variables/charts";
import axios from "axios";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  ButtonGroup,
  Flex,
  Select,
  Avatar,
  Table,
  Tbody,
  Grid,
  Text,
  Th,
  Thead,
  Tr,
  Tfoot,
  Td,
  TableCaption,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export default function BarChart(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const listYear = Array.from(Array(6).keys())
  let date = new Date();
  let year = date.getFullYear();

  //const [barChartData, setBarChartData] = useState({});

  const [state, setState] = useState({
    chartData: [],
    chartOptions: {},
  });

  useEffect(() => {
    getBarChartData(year);
  }, []);
  const getBarChartData = async (yearIn) => {
    const res = await axios.post("/api/getBarChartData", {
      resID: props.restaurantID,
      year: yearIn,
    });
    if (res.data.errCode === 0) {
      setState({
        chartData: [{
          name: "Doanh thu",
          group: "sale",
          data: res.data.data.saleData,
        }, {
          name: "Chi phí nguyên liệu",
          group: "Cost",
          data: res.data.data.materialData
        }, {
          name: "Chi phí khác",
          group: "Cost",
          data: res.data.data.costData,
        }],
        chartOptions: barChartOptions,
      });
    }
  }
  // const getChartData = () => {

  //   setState({
  //     chartData: [{
  //       name: "Doanh thu",
  //       group: "sale",
  //       data: barChartData.saleData,
  //     }, {
  //       name: "Chi phí nguyên liệu",
  //       group: "Cost",
  //       data: barChartData.materialData
  //     }, {
  //       name: "Chi phí khác",
  //       group: "Cost",
  //       data: barChartData.costData,
  //     }],
  //     chartOptions: barChartOptions,
  //   });
  // }

  return (


    <Card
      //py="1rem"
      p="0px"
      height={{ sm: "600px", md: "400px" }}
      width="100%"
    //bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
    //position="relative"
    >
      <Chart
        options={barChartOptions}
        series={props.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    </Card>


  );
}



