import React, { useEffect, useState, useContext } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {
	Box, Flex, Grid, Text, useColorModeValue, Avatar, Button, Image, useDisclosure, Portal, Input,
	Drawer,
	DrawerOverlay,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	PopoverCloseButton,
	PopoverAnchor,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Center,

} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { Separator } from "components/Separator/Separator";
import "assets/css/popup.css";
import axios from "axios";
import swal from "sweetalert";
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import moment from "moment-timezone";
import { EditIcon, HamburgerIcon, CheckCircleIcon, CloseIcon, } from "@chakra-ui/icons"


export default function OrderHistory() {
	const textColor = useColorModeValue("gray.700", "white");
	const textColor2 = useColorModeValue("red", "red");
	const history = useHistory();
	const { id } = useParams();
	const [order, setOrder] = useState({});
	const [addedMenus, setAddedMenus] = useState([]);
	const [orderHistory, setOrderHistory] = useState([]);
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	let duration = moment.duration(moment(order.updatedAt).diff(moment(order.createdAt)));
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}

	useEffect(() => {
		getOrderInfo();
		getOrderHistory();
	}, []);


	const getOrderInfo = async () => {
		const res = await axios.post("/api/getOrderInfo", { orderID: id });
		if (res.data.errCode === 0) {
			setOrder(res.data.data);
			setAddedMenus(res.data.items);
		}

		//return (defaultMenu);
	};

	const getOrderHistory = async () => {
		const res = await axios.post("/api/getOrderHistory", { orderID: id });
		if (res.data.errCode === 0) {
			setOrderHistory(res.data.data);
		}
	}

	const handleDelete = async () => {
		swal("Bạn muốn xóa đơn này?", {
			buttons: {
				cancel: "Không",
				catch: {
					text: "Đúng",
					value: "catch",
				},
			},
		})
			.then(async (value) => {
				switch (value) {
					case "cancel":
						break;
					case "catch":
						const res = await axios.post("/api/deleteOrder", { id: order.id });
						if (res.data.errCode === 0) {
							swal({
								title: "Ok!",
								text: "Thành công",
								icon: "success",
								button: "OK!",
							}).then(() => {
								history.push('/remat/history');
							})
						}
						break;
					default:
						break;
				}
			});
	}


	return (
		<div style={{ margin: '60px 0px 0px 0px' }} >
			<Card overflowX={{ xl: "hidden" }} >
				<CardHeader p="6px 0px 15px 0px" alignItems="Center" >
					<Flex flexDirection={"column"} w={"100%"}>
						<Flex w="100%" alignItems="Center" flexDirection={{ sm: "column", md: "row" }} mb={"5px"}>
							<Flex w={{ sm: "100%", md: "40%" }} flexDirection={"column"}>
								<Text fontSize="xl" color={textColor} fontWeight="bold">Bàn: {order.tableName}</Text>
								<Text fontSize="md" color={textColor} fontWeight="normal">Nhân viên: {order.staff}</Text>

							</Flex>
							<Flex w={{ sm: "100%", md: "60%" }} flexDirection={"column"}>
								<Text fontSize="sm" color={textColor} fontWeight="normal">Từ: {moment(order.createdAt).tz("Asia/Ho_Chi_Minh").format('D/M/YYYY, H:mm:ss ')}</Text>
								<Text fontSize="sm" color={textColor} fontWeight="normal">Đến: {moment(order.updatedAt).tz("Asia/Ho_Chi_Minh").format('D/M/YYYY, H:mm:ss ')}</Text>
								<Text fontSize="sm" color={textColor} fontWeight="normal">Thời gian phục vụ: {duration.hours() > 0 && (duration.days() + " ngày ")} {duration.hours() > 0 && (duration.hours() + " giờ ")} {duration.minutes()} phút</Text>
							</Flex>
						</Flex>
						<Separator />
						<Flex w="100%" mt="15px" alignItems={"center"} justifyContent={"space-around"}>
							<Text fontSize="lg" color={textColor} fontWeight="Bold">Hóa đơn: {Number(order.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}</Text>
							<Button h="30px" colorScheme={"red"}
								hidden={userInfo.role != 3 && true}
								onClick={() => { handleDelete(); }}
								leftIcon={<i className="fa fa-trash fa-sm" ></i>}
							> Xóa</Button>
						</Flex>
					</Flex>
				</CardHeader>
				<CardBody style={{ overflow: "auto", minHeight: "300px" }} flexDirection="column">
					<Tabs size="sm" colorScheme="cyan" width="100%" variant='enclosed' isFitted >
						<TabList>
							<Tab _focus={{ boxShadow: "none", }} >Chi tiết</Tab>
							<Tab _focus={{ boxShadow: "none", }} >Lịch sử cập nhật</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								{addedMenus.map((data, index) => {
									return (
										<form>
											<Flex px=".8rem" w="100%" m="4px 0px"
												flexDirection={"column"}
												alignItems={"flex-start"}
												style={{ border: "1px outset #38B2AC" }}
												borderRadius="10px"
												key={index}
												id={index + "t1"}
											>

												<Flex p="5px" w={"100%"} flexDirection={"row"} alignItems="center">
													<Text
														w={"45%"}
														fontSize="md"
														color={textColor}
														fontWeight="bold"
													>
														{data.menuName}
													</Text>

													<Flex flexDirection={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }} w={"55%"} justifyContent={"space-evenly"}>
														<Text

															fontSize="sm"
															color={textColor}
															fontWeight="semibold"
															m={"5px"}
														>Số lượng: {data.itemNumber || 0}</Text>

														<Text

															fontSize="sm"
															color={textColor}
															fontWeight="semibold"
															m={"5px"}
														>Giá: {Number(data.price * data.itemNumber).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}
														</Text>
													</Flex>


												</Flex>


											</Flex>
										</form>
									)
								})

								}
							</TabPanel>
							<TabPanel>
								{orderHistory.map((data, index) => {
									return (
										<form>
											<Flex px=".8rem" w="100%" m="4px 0px"
												flexDirection={"column"}
												alignItems={"flex-start"}
												style={{ border: "1px outset #38B2AC" }}
												borderRadius="10px"
												key={index}
												bgColor={data.status == 2 && "gray.50"}
												id={index + "t2"}
											>

												<Flex p="5px" w={"100%"} flexDirection={{ sm: "column", md: "row" }} alignItems="center">
													<Text
														w={{ sm: "100%", md: "30%" }}
														fontSize="md"
														color={textColor}
														fontWeight="normal"
														fontStyle={"italic"}
													>
														{moment(data.createdAt).tz("Asia/Ho_Chi_Minh").format('D/M/YYYY, H:mm:ss ')}
													</Text>

													<Flex flexDirection={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }} w={{ sm: "100%", md: "70%" }} justifyContent={"space-evenly"}>
														<Text
															w={{ sm: "100%", md: "30%" }}
															fontSize="md"
															color={textColor}
															fontWeight="normal"
															m={"5px"}
														>
															Món: {data.menuName}
														</Text>
														<Flex w={{ sm: "100%", md: "30%" }} alignItems={"center"}>
															<Text

																fontSize="sm"
																color={textColor}
																fontWeight="normal"
																m={"5px"}
															>Số lượng: </Text>
															<Text

																fontSize="sm"
																color={data.status == 2 ? textColor2 : textColor}
																fontWeight="normal"
															>
																{data.itemNumber || 0}</Text>
														</Flex>
														<Text
															w={{ sm: "100%", md: "40%" }}
															fontSize="sm"
															color={textColor}
															fontWeight="normal"
															m={"5px"}
														>Nhân viên: {data.staff}
														</Text>
													</Flex>


												</Flex>
												<Flex p="5px" w={"100%"}>
													<Text fontSize={"md"} color={textColor}>Ghi chú: {data.note ? data.note : "..."}</Text>
												</Flex>

											</Flex>
										</form>
									)
								})

								}
							</TabPanel>
						</TabPanels>
					</Tabs>



				</CardBody>
			</Card>



		</div >
	);
}
