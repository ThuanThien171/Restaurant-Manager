// Chakra imports
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
// assets
import moment from "moment-timezone";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { Separator } from "components/Separator/Separator";
import swal from "sweetalert";
// React, Redux
import { render } from "react-dom";
import React, { useState, useEffect, createElement } from "react";
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import actionAddMenu from "redux/actions/actionAddMenu";
import actionAddOrder from "redux/actions/actionAddOrder";

// Axios
import axios from "axios";

import { EditIcon, HamburgerIcon, CheckCircleIcon, CloseIcon } from "@chakra-ui/icons"


export default function Order() {
	// Chakra Color Mode
	const textColor = useColorModeValue("gray.700", "white");
	const [order, setOrder] = useState({});
	const [addedMenus, setAddedMenus] = useState([]);
	const [changedMenus, setChangedMenus] = useState([]);
	const [unserveItem, setUnserveItem] = useState([]);
	const history = useHistory();
	const dispatch = useDispatch();
	const [hidden, setHidden] = useState(0);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [popup1, setPopup1] = useState(0);
	const { tableID } = useParams();
	//check login
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	const orderInfo = useSelector((state) => state.reducerOrder);
	const emptyImg = "https://lh3.googleusercontent.com/proxy/KiMo8VuBj-PBx0zWRXHdrlx1Z7bqpBd4Ow2pizNOP6s4U9prV-1lyaMBVi-ESVLg7nDlZoXQdUpbOp7cSkj_CacQZD8u8s0Bot9CI0E";

	//const history = useHistory();
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}


	useEffect(() => {
		getOrderInfo();
		getUnserveItem();
		dispatch(actionAddMenu(0));

	}, []);


	const getOrderInfo = async () => {
		const res = await axios.post("/api/getOrderInfo", { id: tableID });
		if (res.data.errCode === 0) {
			setOrder(res.data.data);
			setAddedMenus(res.data.items);
		}
		//return (defaultMenu);
	};

	const cancelOrder = async () => {
		if (unserveItem[0] == undefined) {
			swal("Bạn muốn hủy đơn này?", {
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
							const res = await axios.post("/api/cancelOrder", { id: order.id, staff: userInfo.userName });
							if (res.data.errCode === 0) {
								swal({
									title: "Ok!",
									text: "Thành công",
									icon: "success",
									button: "OK!",
								}).then(() => {
									history.push('/remat/home');
								})
							}
							break;
						default:
							break;
					}
				});
		} else {
			swal({
				title: "Lỗi!",
				text: "Có món chưa giao!",
				icon: "error",
				button: "OK!",
			})
		}


	}

	const paymentOrder = async () => {
		if (unserveItem[0] == undefined) {
			swal("Bạn muốn thanh toán đơn này?", {
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
							const res = await axios.post("/api/paymentOrder", { id: order.id, staff: userInfo.userName });
							if (res.data.errCode === 0) {
								swal({
									title: "Ok!",
									text: "Thành công",
									icon: "success",
									button: "OK!",
								}).then(() => {
									history.push('/remat/home');
								})
							}
							break;
						default:
							break;
					}
				});
		} else {
			swal({
				title: "Lỗi!",
				text: "Có món chưa giao!",
				icon: "error",
				button: "OK!",
			})
		}

	}

	const handleUpdate = async () => {
		const res = await axios.post("/api/updateOrder", { orderID: order.id, menus: changedMenus, staffID: userInfo.id });
		if (res.data.errCode === 0) {
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			}).then(() => {
				history.push('/remat/home');
			})
		}
	}

	const handleAdd = (data, number, type) => {

		//console.log(number);
		let checkValue = 0;
		let a = addedMenus.filter(item => item.id == data.id);
		if (type == 0) {
			for (let i = 0; i < changedMenus.length; i++) {
				if (changedMenus[i].id == data.id) {
					if (number == -1) {
						if ((changedMenus[i].itemNumber + a[0].itemNumber) != 0)
							changedMenus[i].itemNumber += number;
					} else if (number == 1) {
						changedMenus[i].itemNumber += number;
					}
					checkValue = 1;
					if (changedMenus[i].itemNumber == 0) { changedMenus.splice(i, 1); }
				}
			}


			if (checkValue == 0) changedMenus.push({
				id: data.id,
				price: data.price,
				menuID: data.menuID,
				itemNumber: number,
			})
		} else {
			for (let i = 0; i < changedMenus.length; i++) {
				if (changedMenus[i].id == data.id) {
					if (number >= 0)
						changedMenus[i].itemNumber = number - a[0].itemNumber;
					else
						changedMenus[i].itemNumber = - a[0].itemNumber;
					checkValue = 1;
					if (changedMenus[i].itemNumber == 0) { changedMenus.splice(i, 1); }
				}
			}
			console.log(changedMenus)

			if (checkValue == 0) {
				changedMenus.push({
					id: data.id,
					price: data.price,
					menuID: data.menuID,
					itemNumber: (number >= 0) ? (number - a[0].itemNumber) : (- a[0].itemNumber),
				})
			}
		}
		///////////////////////////////////

		setChangedMenus(changedMenus);
		if (changedMenus[0]) setHidden(1); else setHidden(0);
		//setAddedMenus(addedMenus);


	}

	const handleCancel = () => {

		setChangedMenus([]);
		setHidden(0);
		addedMenus.map((data, index) => {
			document.getElementById(index).value = data.itemNumber;
			document.getElementById(index + "t2").value = Number(data.price * data.itemNumber).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });

		})

	}

	const changeValue = (data, index) => {
		const a = changedMenus.filter(item => item.id == data.id);
		let b = order.totalPrice;
		if (a[0]) {

			document.getElementById(index).value = data.itemNumber + a[0].itemNumber;
			document.getElementById(index + "t2").value = Number(data.price * (data.itemNumber + a[0].itemNumber)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });
		} else {
			document.getElementById(index).value = data.itemNumber;
			document.getElementById(index + "t2").value = Number(data.price * data.itemNumber).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });
		}
		for (let i = 0; i < changedMenus.length; i++) {
			b += changedMenus[i].itemNumber * changedMenus[i].price;
		}
		document.getElementById("total").value = Number(b).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });
	}

	const handleGoBack = () => {

		history.push('/remat/home')
	}


	const handleClick = async (number) => {
		let role = "";
		switch (number) {
			case 1:
				role = "AddNewToOrder";
				dispatch(actionAddOrder({
					orderID: order.id,
					tableID: tableID,
					action: role,
				}));

				history.push('/remat/menu');
				break;


			case 2:
				role = "changeTable";
				dispatch(actionAddOrder({
					orderID: order.id,
					tableID: tableID,
					action: role,
				}));

				history.push('/remat/table');

				break;

			case 3:
				role = "SplitOrder";
				swal({
					closeOnEsc: false,
					closeOnClickOutside: false,
					text: "Chọn bàn để tách đơn!",
					buttons: {
						cancel: "Hủy",
						catch: {
							text: "Ok",
							value: "catch",
						},
					},
				})
					.then(async (value) => {
						switch (value) {
							case "cancel":
								break;
							case "catch":
								dispatch(actionAddMenu(addedMenus));
								dispatch(actionAddOrder({
									orderID: order.id,
									tableID: tableID,
									action: role,
								}));

								history.push('/remat/table');
								break;
							default:
								break;
						}
					});


				break;
			default:
				break;
		}


	}

	const getUnserveItem = async () => {
		const res = await axios.post("/api/getUnserveItem", { id: tableID });
		if (res.data.errCode === 0) {
			setUnserveItem(res.data.data);
		}
	}

	const updateItem = async (id) => {
		const res = await axios.post("/api/updateItem", { id: id, tableID: tableID });
		if (res.data.errCode === 0) {
			setUnserveItem(res.data.data);
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			})
		}
	}

	const deleteItem = async (id, menuID, itemNumber) => {
		//document.getElementById(id).remove();

		const res = await axios.post("/api/deleteItem", { id: id, tableID: tableID });
		if (res.data.errCode === 0) {
			setUnserveItem(res.data.data);
			//ocument.getElementById(id + "-item").remove();
			getOrderInfo();
			let a = addedMenus.filter(item => item.menuID == menuID);
			let index = addedMenus.indexOf(a[0]);
			document.getElementById(index).value = a[0].itemNumber - itemNumber;
			document.getElementById(index + "t2").value = Number(a[0].price * (a[0].itemNumber - itemNumber)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });


			//window.location.reload(false);
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			})
		}else {
			setUnserveItem(res.data.data);
			swal({
				title: "Ok!",
				text: res.data.errMessage,
				icon: "error",
				button: "OK!",
			})
		}
	}

	return (
		<div style={{ margin: '60px 0px 0px 0px' }} >
			<Card overflowX={{ xl: "hidden" }} >
				<CardHeader p="6px 0px 22px 0px" alignItems="Center">
					<Popover
						placement='bottom-end'
						isOpen={popup1 == 1 && isOpen}
						onClose={popup1 == 1 && onClose}

					>
						<PopoverTrigger>
							<Flex w="100%" alignItems="Center">
								<Box mb={{ sm: "8px", md: "0px" }}>
									<Text fontSize="xl" color={textColor} fontWeight="bold">Order: {order.tableName}</Text>
									<Text fontSize="md" color={textColor} fontWeight="semibold">Nhân viên: {order.staff}</Text>
									<Text fontSize="sm" color={textColor} fontWeight="normal">Từ: {moment(order.createdAt).tz("Asia/Ho_Chi_Minh").format('D-M-YYYY, H:mm')}</Text>
								</Box>
								<Box ms="auto" w={{ sm: "unset", md: "unset" }} >
									<Button onClick={() => { setPopup1(1); onOpen() }}><HamburgerIcon /></Button>
								</Box>
							</Flex>
						</PopoverTrigger>
						<Portal>
							<PopoverContent w={"271px"}>
								{/* <PopoverHeader></PopoverHeader> */}
								<PopoverCloseButton />
								<PopoverBody flexDirection="column" display="flex" mt="15px" >
									<Button
										//hidden={{ sm: true, md: false }}
										style={{ margin: "10px 10px 10px 10px", 'borderRadius': "5px" }}
										colorScheme="twitter"
										onClick={() => { handleClick(1); }}
									>Thêm món</Button>

									<Button
										//hidden={{ sm: true, md: false }}
										style={{ margin: "10px 10px 10px 10px", 'borderRadius': "5px" }}
										colorScheme="twitter"
										onClick={() => { handleClick(2); }}
									>Chuyển bàn</Button>

									<Button
										//hidden={{ sm: true, md: false }}
										style={{ margin: "10px 10px 10px 10px", 'borderRadius': "5px" }}
										colorScheme="twitter"
										onClick={() => {
											if (unserveItem[0] != undefined) {
												swal({
													title: "Lỗi!",
													text: "Có món chưa giao!",
													icon: "error",
													button: "OK!",
												})
											} else {
												setPopup1(2);
												onOpen();
											}
										}}
									>Tách đơn</Button>
								</PopoverBody>
							</PopoverContent>
						</Portal>
					</Popover>

				</CardHeader>
				<CardBody style={{ overflow: "auto", minHeight: "300px" }} flexDirection="column">
					<Tabs size="sm" colorScheme="cyan" width="100%" variant='enclosed' isFitted >
						<TabList>
							<Tab _focus={{ boxShadow: "none", }} >Đã đặt</Tab>
							<Tab _focus={{ boxShadow: "none", }} >Đang chờ</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								{addedMenus.map((data, index) => {
									return (
										<form>
											<Flex p=".8rem" w="100%" m="4px 0px"
												flexDirection={"column"}
												alignItems={"flex-start"}
												style={{ border: "1px outset #38B2AC" }}
												borderRadius="10px"
												key={index}
												id={index + "t1"}
											>

												<Flex p="5px" w={"100%"} flexDirection={{ sm: "column", md: "row" }} alignItems="center">
													<Flex w={{ sm: "100%", md: "70%" }} alignItems="center" flexDirection={{ sm: "column", md: "row" }} m={"8px 0px"}>
														<Image src={(data.image != "") ? data.image : emptyImg} w="120px" h="120px" borderRadius="12px" m="0px 10px" style={{ border: "1px outset #A0AEC0" }} />
														<Text
															//w={{ sm: '40%', md: "50%" }}
															m={"5px 10px"}
															fontSize="lg"
															color={textColor}
															fontWeight="bold"
														>
															{data.menuName}
														</Text>
													</Flex>
													<Flex w={{ sm: "100%", md: "30%" }} alignItems="center" flexDirection={{ sm: "column", md: "row" }}>
														<Flex flexDirection="row" alignItems="center">
															<Button height="30px" width="30px" borderRadius="20px" border="1px solid #ccc" colorScheme="red"
																onClick={() => {
																	handleAdd(data, -1, 0);
																	changeValue(data, index);

																}}
															>-</Button>
															<Input defaultValue={data.itemNumber}
																id={index}
																name={"Input1-" + index}
																type="number"
																min='0'
																style={{ border: '1px #ccc solid', width: "60px", height: "30px", padding: "5px", margin: "5px" }}
																onKeyDown={(e) => {
																	if (e.key == "Enter") {
																		handleAdd(data, parseInt(e.target.value), 1);
																		changeValue(data, index);
																	}
																}}
															></Input>
															<Button height="30px" width="30px" borderRadius="20px" border="1px solid #ccc" colorScheme="green"
																onClick={() => {
																	handleAdd(data, 1, 0);
																	changeValue(data, index);

																}}
															>+</Button>
														</Flex>
													</Flex>
												</Flex>
												<Flex p="5px" flexDirection="row" alignItems="center" w={"auto"} ms={{ sm: "20%", md: "35%" }}>
													<Text

														fontSize="md"
														color={textColor}
														fontWeight="bold"
														m={"5px"}
													>Giá: </Text>
													<Input
														variant='unstyled' fontWeight="semibold"
														defaultValue={Number(data.price * data.itemNumber).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}
														//type="number"
														disabled={true}
														id={index + "t2"}
														name={"Input2-" + index}
														min={0}
														style={{ width: "100px", height: "30px", paddingLeft: "5px" }}
													/>
												</Flex>
												{/* <Flex p="5px" flexDirection="column" alignItems="left" w={{ sm: "100%", md: "100%" }}>
									<Text
										fontSize="md"
										color={textColor}
										fontWeight="semibold"
										m="5px"
									>Ghi chú: </Text>
									<Input
										defaultValue={data.note}
										type="text"
										disabled={true}
										id={index + "t3"}
										name={"Input3-" + index}
										style={{ paddingLeft: "5px", width: "100%", border: '1px #ccc solid', margin: "5px" }}

									/>
								</Flex> */}
											</Flex>
										</form>
									)
								})

								}
							</TabPanel>
							<TabPanel>
								{unserveItem.map((data, index) => {
									return (
										<Flex p=".3rem" w="100%" m="4px 0px"
											flexDirection={{ md: "row", sm: "column" }}
											alignItems={"center"}
											justifyContent={'space-between'}
											style={{ border: "1px solid #38B2AC" }}
											borderRadius="10px"
											key={index}
											id={data.id + "-item"}
										>
											<Flex flexWrap={"wrap"} alignItems={"center"} w={{sm: '100%', md: '50%'}} h="100%" paddingX={'20px'} justifyContent={'space-between'}>
												<Flex flexDirection={"column"} m="5px">
													<Text color={textColor} fontSize={"lg"} fontWeight={"semibold"}>{data.menuName}</Text>
													<Text color={textColor} fontSize={"sm"} fontWeight="thin">{moment(data.createdAt).tz("Asia/Ho_Chi_Minh").format('D-M-YYYY, H:mm:ss')}</Text>
												</Flex>
												<Flex m="5px">
													<Text color={textColor} fontSize={"md"} fontWeight={"semibold"}>Số lượng: {data.itemNumber}</Text>
												</Flex>
											</Flex>
												<Flex m="5px" ms={{ sm: "0px", md: "30px" }} >
													{data.status == 0 && <Text color={useColorModeValue("orange", "gray.700")} fontSize={"md"} fontWeight={"semibold"}>Đang duyệt</Text>}
													{data.status == 4 && <Text color={useColorModeValue("orange", "gray.700")} fontSize={"md"} fontWeight={"semibold"}>Bếp đang chuẩn bị</Text>}
													{data.status == 3 && <Text color={useColorModeValue("green", "gray.700")} fontSize={"md"} fontWeight={"semibold"}>Đã chuẩn bị xong</Text>}
												</Flex>
											
											<Flex m={"5px"} w="unset" me={{ sm: "5px", md: "25px" }}>
												<Button colorScheme="green"
													hidden={(data.status == 3) ? false : true}
													onClick={() => { updateItem(data.id); }}
												><CheckCircleIcon mr={"3px"} />Đã giao</Button>

												<Button colorScheme="red"
													hidden={(data.status == 0) ? false : true}
													onClick={() => { deleteItem(data.id, data.menuID, data.itemNumber); }}
												><CloseIcon mr={"3px"} />Hủy</Button>
											</Flex>
										</Flex>
									);
								})}
							</TabPanel>
						</TabPanels>
					</Tabs>



				</CardBody>
			</Card>
			<Flex
				mt="20px"
				h="auto"
				w={{ sm: "100%", xl: "calc(100% - 275px)" }}
				position="fixed"
				left={{ sm: "0px", xl: "275px" }}
				right="0px"
				bottom="0px"
				border="1px solid #000000"
				bg={"white"}
				flexDirection={"column"}
			>
				<Flex m="5px" color={textColor} fontSize={"lg"} fontWeight={"semibold"}>
					<Flex w="100%" alignItems={"center"} justifyContent={"center"}>
						<Text >
							Tổng giá:
						</Text>
						<Text hidden={hidden} ms="5px">
							{Number(order.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', })}
						</Text>
					</Flex>
					<form>
						<Input
							color={textColor} fontSize={"lg"} fontWeight={"semibold"}
							variant='unstyled'
							//value={Number(order.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', })}
							hidden={!hidden}
							disabled={true}
							id={"total"}
							style={{ width: "100px", height: "27px", paddingLeft: "5px" }}
						/>
					</form>
				</Flex>
				<Separator />
				<Flex flexDirection={"row-reverse"} justifyContent={"space-evenly"}>
					<Button
						m="5px"
						h="40px"
						w="auto"
						bg={"blue.500"}
						variant="no-hover"
						borderRadius="50px"
						hidden={hidden}
						border="1px outset #000000"
						color={"white"}
						onClick={() => { paymentOrder(); }}
					>
						Thanh toán
					</Button >

					<Button
						m="5px"
						h="40px"
						w="auto"
						bg={"red.500"}
						variant="no-hover"
						borderRadius="50px"
						hidden={hidden}
						border="1px outset #000000"
						color={"white"}
						onClick={() => { cancelOrder(); }}
					>
						Hủy đơn
					</Button >

					<Button
						m="5px"
						h="40px"
						w="120.22px"
						bg={"green.500"}
						variant="no-hover"
						borderRadius="50px"
						hidden={!hidden}
						border="1px outset #000000"
						color={"white"}
						onClick={() => { handleUpdate(); }}
					>
						Xác nhận
					</Button >

					<Button
						m="5px"
						h="40px"
						w="99.6px"
						bg={"red.500"}
						variant="no-hover"
						borderRadius="50px"
						hidden={!hidden}
						border="1px outset #000000"
						color={"white"}
						onClick={() => { handleCancel(); }}
					>
						Hủy
					</Button >
				</Flex>
			</Flex>
			<Drawer

				isOpen={popup1 == 2 && isOpen}
				onClose={popup1 == 2 && onClose}
				//placement={document.documentElement.dir === "rtl" ? "left" : "right"}
				placement="bottom"

				blockScrollOnMount={true}
				size="xs"
			>
				<DrawerOverlay />
				<DrawerContent style={{ border: "1px outset #A0AEC0", markerStart: "125px" }}>
					<DrawerHeader pt="24px" px="24px" >
						<DrawerCloseButton />
						<Text fontSize="xl" fontWeight="bold" mt="16px">
							Chọn món để tách bàn:
						</Text>
						<Separator />
					</DrawerHeader>
					<DrawerBody width="100%">
						<Flex flexDirection="column" width="100%">
							{addedMenus.map((data, index) => {

								return (
									<Flex p=".8rem" w="100%" m="4px 0px"
										flexDirection={{
											sm: "column",
											md: "row",
										}}
										alignItems={{ sm: "flex-start", md: "center" }}
										style={{ border: "1px outset #38B2AC" }}
										borderRadius="10px"
										key={index}
										id={index + "t1"}
									>
										<Flex p="5px" w={{ sm: "100%", md: "75%" }} style={{ flexDirection: "row" }} alignItems="center">
											<EditIcon />
											<Text
												ms="5px"
												w={{ sm: '100%', md: "100%" }}
												fontSize="lg"
												color={textColor}
												fontWeight="bold"
											>
												{data.menuName}
											</Text>
											<Text
												ms="5px"
												w={{ sm: '100%', md: "100%" }}
												fontSize="md"
												color={textColor}
												fontWeight="normal"
											>
												Số lượng: {data.itemNumber}
											</Text>
										</Flex>
										<Flex
											w={{ sm: "100%", md: "auto" }}
											justifyContent={{ sm: "center", md: "right" }}
										>
											<Button
												onClick={() => {
													document.getElementById("split-" + index).stepDown();
													data.splitNumber = document.getElementById("split-" + index).value;

												}}
											>-</Button>
											<Input
												id={"split-" + index}
												p="5px" m="5px"
												h="30px" w="60px"
												type="number"
												//value={data.splitNumber}
												defaultValue={0}
												max={data.itemNumber}
												min={0}
												step={1}
												onChange={(e) => {
													if (e.target.value >= data.itemNumber)
														document.getElementById("split-" + index).value = data.itemNumber;
													data.splitNumber = e.target.value ? e.target.value : 0;

												}}
											></Input>
											<Button
												onClick={() => {
													document.getElementById("split-" + index).stepUp();
													data.splitNumber = document.getElementById("split-" + index).value;

												}}
											>+</Button>
										</Flex>

									</Flex>
								)
							})

							}

						</Flex>
					</DrawerBody>
					<DrawerFooter>
						<Button colorScheme="facebook" onClick={() => { handleClick(3); }}>Xác nhận</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

		</div >
	);

}
