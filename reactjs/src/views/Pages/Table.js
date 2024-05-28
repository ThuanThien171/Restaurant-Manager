// Chakra imports
import { Box, Flex, Grid, Text, useColorModeValue, Avatar, Button, } from "@chakra-ui/react";
// assets
import moment from "moment-timezone";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { Separator } from "components/Separator/Separator";

// React, Redux
import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import actionAddOrder from "redux/actions/actionAddOrder";
import actionAddMenu from "redux/actions/actionAddMenu";

// Axios
import axios from "axios";


export default function Genres() {
	// Chakra Color Mode
	const textColor = useColorModeValue("gray.700", "white");
	const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2Ftable.PNG?alt=media&token=5c49e9ba-9df2-4a03-94a8-b1aed269d10b";
	const [areas, setAreas] = useState([]);
	const [hidden, setHidden] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	//check login
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	const orderInfo = useSelector((state) => state.reducerOrder);
	const menuInfo = useSelector((state) => state.reducerMenu);
	let role = (orderInfo.action != undefined) ? orderInfo.action : "addNewOrder"
	//const history = useHistory();
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}


	useEffect(() => {
		if (orderInfo.action == "AddNewToOrder") {
			dispatch(actionAddMenu(0));
			dispatch(actionAddOrder(0));
		}
		if (orderInfo.action == "changeTable" || orderInfo.action == "SplitOrder") setHidden(true);
		getAvailableTable();
	}, []);

	const getAvailableTable = async () => {
		const res = await axios.post("/api/getAvailableTable", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setAreas(res.data.areas);
		}
	};

	const handleClick = async (id, status) => {
		if (status != 0) {
			if (menuInfo[0] != undefined) {
				const res = await axios.post('/api/addMenuToOrder', {
					tableID: id,
					userID: userInfo.id,
					menus: menuInfo,
				});
				if (res.data.errCode === 0) {
					swal({
						title: "Ok!",
						text: "Thành công",
						icon: "success",
						button: "OK!",
					}).then(() => {
						history.push('/resmat/home');
					})
				} else {
					swal({
						title: "Lỗi!",
						text: res.data.errMessage,
						icon: "error",
						button: "OK!",
					})
				}
			} else {
				history.push('/resmat/order/' + id);
			}
		} else {
			let role = (orderInfo.action != undefined) ? orderInfo.action : "addNewOrder"
			switch (role) {
				case "addNewOrder":

					if (menuInfo[0] == undefined) {
						dispatch(actionAddOrder({
							orderID: (orderInfo.orderID != undefined) ? orderInfo.orderID : undefined,
							tableID: id,
							action: role,
						}));
						history.push('/resmat/menu');
					} else {
						const res = await axios.post('/api/addNewOrder', {
							resID: userInfo.restaurantID,
							tableID: id,
							staff: userInfo.userName,
							userID: userInfo.id,
							menus: menuInfo ? menuInfo : "",
						});
						if (res.data.errCode === 0) {
							dispatch(actionAddMenu(0));
							dispatch(actionAddOrder(0));
							swal({
								title: "Ok!",
								text: "Thành công",
								icon: "success",
								button: "OK!",
							}).then(() => {
								history.push('/resmat/home');
							})
						} else {
							swal({
								title: "Lỗi!",
								text: res.data.errMessage,
								icon: "error",
								button: "OK!",
							})
						}
					}

					break;

				case "changeTable":
					const res = await axios.post('/api/changeTable', { tableID: id, orderID: orderInfo.orderID, oldTable: orderInfo.tableID });
					if (res.data.errCode === 0) {
						swal({
							title: "Ok!",
							text: "Thành công",
							icon: "success",
							button: "OK!",
						}).then(() => {
							history.push('/resmat/home');
						})
					} else {
						swal({
							title: "Lỗi!",
							text: res.data.errMessage,
							icon: "error",
							button: "OK!",
						}).then(() => {
							window.location.reload(false);
						})
					}
					break;

				case "SplitOrder":
					const res1 = await axios.post('/api/splitOrder', {
						newTableID: id,
						orderID: orderInfo.orderID,
						menu: menuInfo,
						resID: userInfo.restaurantID,
						staff: userInfo.userName,
						userID: userInfo.id,
					});
					if (res1.data.errCode === 0) {
						swal({
							title: "Ok!",
							text: "Thành công",
							icon: "success",
							button: "OK!",
						}).then(() => {
							history.push('/resmat/home');
						})
					} else {
						swal({
							title: "Lỗi!",
							text: res1.data.errMessage,
							icon: "error",
							button: "OK!",
						}).then(() => {
							window.location.reload(false);
						})
					}
					break;

				// case value:

				// 	break;
				default:
					break;
			}

		}

	}

	const handleGoBack = () => {
		dispatch(actionAddOrder(0));

		history.push('/resmat/home')
	}

	return (
		<div style={{ margin: '60px 0px 0px 0px' }} >
			<Card overflowX={{ xl: "hidden" }} >
				<CardHeader p="6px 0px 22px 0px" alignItems="Center">
					<Box mb={{ sm: "8px", md: "0px" }}>
						<Text fontSize="xl" color={textColor} fontWeight="bold">Bàn</Text>
					</Box>
					{/* <Box ms="auto" w={{ sm: "unset", md: "unset" }} >
						<Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={() => { handleGoBack() }}>Trở lại</Button>
					</Box> */}
				</CardHeader>
				<CardBody style={{ "flex-wrap": "wrap" }}
				//flexDirection="row"
				>
					<Separator />
					{areas.map((data, index) => {
						return (
							<>
								<Flex w="100%" mt="15px" p="0px 20px">
									<Text fontSize="md" color={textColor} fontWeight="semibold">{data.areaName}</Text>
								</Flex>
								{data.tables.map((table, i) => {
									return (
										<Flex m="5px 5px"
											//p=".8rem"
											w={{
												md: "calc(20% - 10px)",
												sm: "calc(33% - 10px)",
											}}
											style={{ border: "1px outset #38B2AC" }}
											borderRadius="10px"
											bgColor={table.status == 1 && "gray.200" ||
												table.status == 2 && "green.100"
											}
											_hover={{
												"box-shadow": "0px 5px 10px -5px",
												transform: "scale(1.03)",
											}}
											_active={{
												"box-shadow": "0px 4px 8px",
												transform: "scale(.98)",
											}}
											as="button"
											hidden={hidden ? ((table.status != 0) && true):((userInfo.role == 0 && userInfo.id != table.StaffTask.userID) ? true : false)}
											//{(table.status != 0 && hidden) && true}
											//((userInfo.role == 0 && userInfo.id != table.StaffTask.userID) ? true : false)
											//|| (userInfo.role == 0 && userInfo.id != table.StaffTask.userID)
											onClick={() => { handleClick(table.id, table.status) }}
										>

											<Flex
												w="100%"
												mt={"calc(50% - 30px)"}
												mb={"calc(50% - 30px)"}
												h="60px"
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												flexDirection={"column"}

											>
												<Text
													fontSize="md"
													color={textColor}
													fontWeight="semibold"
												>{table.tableName}</Text>
												<Text
													fontSize="sm"
													color={table.status == 1 && "green.700" ||
														table.status == 2 && "yellow.700"}
													fontWeight="thin"
												>{table.status == 1 && "đang dùng" ||
													table.status == 2 && "đặt trước"}</Text>

											</Flex>



										</Flex >
									);
								})
								}
							</>
						)
					})
					}

				</CardBody>
			</Card>
		</div >
	);

}
