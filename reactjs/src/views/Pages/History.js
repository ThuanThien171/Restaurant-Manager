// Chakra imports
import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, Text, useColorModeValue, Avatar, Button, } from "@chakra-ui/react";
// assets
import moment from "moment-timezone";
import "moment/locale/vi";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

// React, Redux
import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import actionAddOrder from "redux/actions/actionAddOrder";
import actionAddMenu from "redux/actions/actionAddMenu";

// Axios
import axios from "axios";
//import { render } from "node-sass";

export default function History() {
  // Chakra Color Mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2Ftable.PNG?alt=media&token=5c49e9ba-9df2-4a03-94a8-b1aed269d10b";
  const [orderHistory, setHistory] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  //check login
  const userInfo = useSelector((state) => state.reducerLogin).userInfo;

      let date = new Date();
    let month = date.getMonth()+1;
    let day = date.getDate();
    const [fromDate,setFromDate] = useState(`${date.getFullYear()}-${month<10?`0${month}`: month}-01`)
    const [toDate,setToDate] = useState(`${date.getFullYear()}-${month<10?`0${month}`: month}-${day<10?`0${day}`: day}`)

  //const history = useHistory();
  if (userInfo === undefined) {
    return (<Redirect to={'/auth/signin/'} />);
    // history.push('/auth/signin/');
  }

  useEffect(() => {
    dispatch(actionAddMenu(0));
    dispatch(actionAddOrder(0));
    getHistoryInfo();

  }, []);

  const getHistoryInfo = async (start,end) => {
    const res = await axios.post("/api/getHistoryInfo", { 
      id: userInfo.restaurantID,
      fromDate: start?start:fromDate,
      toDate: end?end:toDate
    });
    if (res.data.errCode === 0) {
      setHistory(res.data.data);
    }
  };

  const handleClick = (id) => {
    history.push('/remat/order-history/' + id);
  }

  return (
    <div style={{ margin: '60px 0px 0px 0px' }} >
      <Card overflowX={{ xl: "hidden" }} >
        <CardHeader p="6px 0px 22px 0px" alignItems="base-line" style={{display: 'flex', 'flex-direction': 'column','flex-wrap': 'wrap'}}>
          <Text fontSize="xl" marginRight={'5px'} color={textColor} fontWeight="bold">Lịch sử order</Text>
          <Flex flexWrap={'wrap'} alignItems={'center'}>
            <Text
                color={"gray.500"}
                fontSize={"md"}
                fontWeight={"normal"}
                marginRight={'5px'}
            >từ </Text>
            <input type='date' value={fromDate} 
            style={{'margin-right': '5px', width: '120px'}}
            onChange={ async (e)=> {
                setFromDate(e.target.value);
                getHistoryInfo(e.target.value,null)
            }}/>
            <Text
                color={"gray.500"}
                fontSize={"md"}
                fontWeight={"normal"}
                marginRight={'5px'}
            > đến</Text>
            <input type='date' value={toDate} 
            style={{width: '120px'}}
            onChange={(e)=> {
                setToDate(e.target.value);
                getHistoryInfo(null,e.target.value)
            }}/>
            </Flex>
        </CardHeader>
        <CardBody style={{ overflow: "auto", minHeight: "300px" }} flexDirection="column">

          {orderHistory.map((data, index) => {
            let duration = moment.duration(moment(data.updatedAt).diff(moment(data.createdAt)));
            return (

              <Flex p=".8rem" w="100%"
                flexDirection={{
                  sm: "column",
                  md: "row",
                }}
                bgColor={data.status == 2 && "gray.100"}
                alignItems={{ sm: "flex-start", md: "center" }}
                style={{ border: "1px outset #38B2AC" }}
                borderRadius="10px"
                as="button"
                key={index}
                m={"5px 0px"}
                onClick={() => { handleClick(data.id) }}
              >
                <Flex p="2px" w={{ sm: "100%", md: "30%" }} style={{ flexDirection: "row" }}>
                  <Flex direction="column" alignItems="flex-start">
                    <Text
                      fontSize="lg"
                      color={textColor}
                      fontWeight="bold"
                    >
                      {data.tableName}
                    </Text>
                    <Text fontSize="sm" color={textColor} fontWeight="semibold">
                      {moment(data.updatedAt).tz("Asia/Ho_Chi_Minh").format('ddd, D-M-YYYY, H:mm:ss')}
                    </Text>
                  </Flex>
                </Flex>
                <Flex p="2px" flexDirection="column" alignItems="flex-start" w={{ sm: "100%", md: "40%" }}>
                  <Text fontSize="md" color={textColor} m="3px" fontStyle={"italic"}>Thu ngân: {data.staff}</Text>
                  <Text fontSize="md" color={textColor} m="3px" fontStyle={"italic"}>Thời gian phục vụ: {duration.hours() > 0 && (duration.days() + " ngày ")} {duration.hours() > 0 && (duration.hours() + " giờ ")} {duration.minutes()} phút</Text>
                </Flex>
                <Flex p="2px" flexDirection="column" alignItems="flex-start">
                  <Text fontSize="md" color={"green"} m="3px">{data.status == 1 && "Đã thanh toán"}</Text>
                  <Text fontSize="md" color={"red"} m="3px">{data.status == 2 && "Đã hủy"}</Text>
                  <Text fontSize="md" color={textColor} m="3px">Hóa đơn: {Number(data.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}</Text>
                </Flex>
              </Flex>


            )
          })
          }

        </CardBody>
      </Card>
    </div>
  );

}
