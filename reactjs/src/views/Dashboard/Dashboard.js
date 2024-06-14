// Chakra imports
import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, Text, useColorModeValue, Avatar, Button, } from "@chakra-ui/react";
// assets
import moment from "moment-timezone";
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

export default function Dashboard() {
	// Chakra Color Mode
	const textColor = useColorModeValue("gray.700", "white");
	const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2Ftable.PNG?alt=media&token=5c49e9ba-9df2-4a03-94a8-b1aed269d10b";
	const [orderNow, setOrderNow] = useState([]);
	const [task, setTask] = useState([]);
	const history = useHistory();
	const dispatch = useDispatch();
	//check login
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;

	//const history = useHistory();
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}
	if (userInfo.role == 1) {
		return (<Redirect to={'/remat/kitchen'} />);
		// history.push('/auth/signin/');
	}

	useEffect(() => {

		getOrderRealTime();

	}, []);

	const getOrderRealTime = async () => {
		dispatch(actionAddMenu(0));
		dispatch(actionAddOrder(0));
		const res = await axios.post("/api/getOrderRealTime", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setOrderNow(res.data.data);
		}
		const res2 = await axios.post("/api/getAllStaffTask", { id: userInfo.id });
		if (res2.data.errCode === 0) {
			setTask(res2.data.areas);
		}
	};

	const handleClick = (id) => {
		history.push('/remat/order/' + id);
	}

	const handleAddOrder = () => {
		//return (<Redirect to={'/remat/genres/' + 1} />);
		history.push('/remat/table')
	}

	return (
		<div style={{ margin: '60px 0px 0px 0px' }} >
			<Card overflowX={{ xl: "hidden" }} >
				<CardHeader p="6px 0px 22px 0px" alignItems="Center">
					<Box mb={{ sm: "8px", md: "0px" }}>
						<Text fontSize="xl" color={textColor} fontWeight="bold">Order</Text>
					</Box>
					<Box ms="auto" w={{ sm: "unset", md: "unset" }} >
						<Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={() => { handleAddOrder() }}>Thêm order</Button>
					</Box>
				</CardHeader>
				<CardBody style={{ overflow: "auto", minHeight: "300px" }} flexDirection="column">

					{orderNow.map((data, index) => {
						return (

							<Flex p=".8rem" w="100%"
								flexDirection={{
									sm: "column",
									md: "row",
								}}
								alignItems={{ sm: "flex-start", md: "center" }}
								style={{ border: "1px outset #38B2AC" }}
								borderRadius="10px"
								as="button"
								key={index}
								hidden={(task.find(task => task.areaID == data.Table.areaID) === undefined && userInfo.role ===0) && true}
								m={"5px 0px"}
								onClick={() => { handleClick(data.tableID) }}
							>
								<Flex p="5px" w={{ sm: "100%", md: "50%" }} style={{ flexDirection: "row" }}>
									<Avatar src={iconUrl} w="50px" borderRadius="12px" me="18px" />
									<Flex direction="column" alignItems="flex-start">
										<Text
											fontSize="lg"
											color={textColor}
											fontWeight="bold"
										>
											{data.tableName}
										</Text>
										<Text fontSize="sm" color="gray.400" fontWeight="normal">
											{moment(data.createdAt).tz("Asia/Ho_Chi_Minh").format('D-M-YYYY, h:mm a')}
										</Text>
									</Flex>
								</Flex>
								<Flex p="5px" flexDirection="column" alignItems="flex-start">
									<Text fontSize="md" color={textColor} m="3px">Nhân viên phục vụ: {data.staff}</Text>
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
