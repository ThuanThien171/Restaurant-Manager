import React, { useState, useEffect } from "react";
import Card from "components/Card/Card";
import ReactApexChart from "react-apexcharts";
import { lineChartData, lineChartOptions } from "variables/charts";
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

export default function LineChart(props) {
  const textColor = useColorModeValue("gray.700", "white");


  //const [barChartData, setBarChartData] = useState({});

  const [state, setState] = useState({
    chartData: [],
    chartOptions: {},
  });

  useEffect(() => {
    getLineChartData();
  }, []);
  const getLineChartData = async () => {
    const res = await axios.post("/api/getLineChartData", {
      resID: props.restaurantID,
    });
    if (res.data.errCode === 0) {
      setState({
        chartData: res.data.data,
        chartOptions: lineChartOptions,
      });
    }
  }


  return (
    <Flex w="100%" alignItems={"center"} flexDirection={"column"} my="30px">
      <Text
        color={textColor}
        fontSize={"lg"}
        fontWeight={"semibold"}
      >Biểu đồ 3 món bán chạy nhất trong vòng 7 ngày</Text>
      <Card
        //py="1rem"
        p="0px"
        height={{ sm: "600px", md: "400px" }}
        width="100%"
      //bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
      //position="relative"
      >
        <ReactApexChart
          options={state.chartOptions}
          series={state.chartData}
          type="area"
          width="100%"
          height="100%"
        />
      </Card>
    </Flex>


  );
}

