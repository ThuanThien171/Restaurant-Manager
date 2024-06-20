import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
// Chakra imports
import {
	Flex,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	Button,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from "@chakra-ui/react";
import { EditIcon, HamburgerIcon, CheckCircleIcon, CloseIcon } from "@chakra-ui/icons"
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import swal from "sweetalert";
import moment from "moment-timezone";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import actionAddMenu from "redux/actions/actionAddMenu";
import actionAddOrder from "redux/actions/actionAddOrder";
function Kitchen() {
	const [items, setItems] = useState([]);
	const [processItem,setProcessItem] = useState([]);
	const [menu, setMenu] = useState([]);
	const history = useHistory();
	const dispatch = useDispatch();
	const textColor = useColorModeValue("gray.700", "white");

	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}

	useEffect(() => {
		dispatch(actionAddMenu(0));
		dispatch(actionAddOrder(0));
		getKitchenInfo();
		getAllMenuData();
		getProcessingItem();
	}, [])
	const getKitchenInfo = async () => {
		const res = await axios.post("/api/getKitchenInfo", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setItems(res.data.data);
		}
	}
	const getProcessingItem = async () => {
		const res = await axios.post("/api/getProcessingItem", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setProcessItem(res.data.data);
		}
	}
	const getAllMenuData = async () => {
		const res = await axios.post("/api/getAllMenu", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setMenu(res.data.menus);
		}
	}

	const updateItem = async (id) => {
		const res = await axios.post("/api/updateItem", { id: id });
		if (res.data.errCode === 0) {
			getKitchenInfo();
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			})
		}else {
			getKitchenInfo();
			swal({
				title: "Lỗi!",
				text: res.data.errMessage,
				icon: "error",
				button: "OK!",
			})
		}
	}

	const deleteItem = async (id) => {
		//document.getElementById(id).remove();
		const res = await axios.post("/api/deleteItem", { id: id });
		if (res.data.errCode === 0) {
			getKitchenInfo();
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			})
		}
	}

	const changeStatusMenu = async (id) => {
		const res = await axios.post("/api/changeStatusMenu", { id: id });
		if (res.data.errCode === 0) {
			getAllMenuData();
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			})
		}
	}

	const updateProcessItem = async(data = []) => {
		let promis = data.map(async (i) => {
			await axios.post("/api/updateItem", { id: i.id });
		})
		await Promise.all(promis);
		getProcessingItem();
		swal({
			title: "Ok!",
			text: "Thành công",
			icon: "success",
			button: "OK!",
		})
	}

	return (
		<Flex direction="column" pt={{ base: "120px", md: "75px" }}>
			<Card overflowX={{ xl: "hidden" }}>
				<CardHeader p="6px 0px 22px 0px">
					<Text fontSize="xl" color={textColor} fontWeight="bold">
						Bếp
					</Text>
				</CardHeader>
				<CardBody flexWrap="wrap">
					<Tabs size="sm" colorScheme="cyan" width="100%" variant='enclosed' isFitted >
						<TabList>
							<Tab _focus={{ boxShadow: "none", }} onClick={()=>{	getProcessingItem();}}>Đang chờ</Tab>
							<Tab _focus={{ boxShadow: "none", }} onClick={()=>{	getKitchenInfo();}}>Đơn</Tab>
							<Tab _focus={{ boxShadow: "none", }} onClick={()=>{	getAllMenuData();}}>Menu</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
							{processItem.map((data,index) => {
												return (
													<Flex p=".3rem" w="100%" m="4px 0px"
														flexWrap={'wrap'}
														alignItems={"center"}
														justifyContent={"space-between"}
														style={{ border: "1px solid #38B2AC" }}
														borderRadius="10px"
														gap={'20px'}
														key={index}
														id={data.id}
													>
			
														<Text color={textColor} fontSize={"lg"} fontWeight={"semibold"}>Món: {data.menuName}</Text>	
														<Text color={textColor} fontSize={"md"} fontWeight={"hairlight"}>Số lượng: {data.totalItem}</Text>
													
														<Button colorScheme="green" 
															onClick={() => {updateProcessItem(data.Items)}}
														><CheckCircleIcon mr={"3px"} />Hoàn thành</Button>
														
													</Flex>
												);
											})
								}
							</TabPanel>
							<TabPanel>
								{items.map((data) => {
									if (data.item[0] != undefined) {

										return (
											data.item.map((item, index) => {

												return (
													<Flex p=".3rem" w="100%" m="4px 0px"
														flexDirection={{ md: "row", sm: "column" }}
														alignItems={"center"}
														justifyContent={"space-between"}
														style={{ border: "1px solid #38B2AC" }}
														borderRadius="10px"
														key={index}
														id={item.id}
													>
														<Flex flexWrap={"wrap"} alignItems={"center"} h="100%" w={{sm:'100%', md:'60%'}}>
															
															<Flex flexDirection={"column"} w='100%' p="5px 20px">
																<Text color={textColor} fontSize={"sm"} fontWeight="thin">{moment(item.createdAt).tz("Asia/Ho_Chi_Minh").format('D-M-YYYY, h:mm:ss a')}</Text>													
																															
															</Flex>
															<Flex flexDirection={{sm: "column", md: 'row'}} p="5px 20px" w='100%' justifyContent={'space-between'} alignItems={'center'} me="40px">
															<Text color={textColor} fontSize={"lg"} fontWeight={"semibold"}>Món: {item.menuName}</Text>	
															<Text color={textColor} fontSize={"md"} fontWeight={"hairlight"}>Số lượng: {item.itemNumber}</Text>
															</Flex>
															<Flex m="5px 20px" w="100%">
																<Text color={textColor} fontSize={"md"} fontWeight={"hairlight"}>Ghi chú: {item.note || "..."}</Text>
															</Flex>

														</Flex>
														<Flex m={"10px"} w={{sm: '100%', md:'40%'}} justifyContent={'space-between'} paddingX={'10px'}>
															<Button colorScheme="green" mr="5px"
																onClick={() => { updateItem(item.id); }}
															><CheckCircleIcon mr={"3px"} />Nhận đơn</Button>
															<Button colorScheme="red" ml={"5px"}
																onClick={() => { deleteItem(item.id); }}
															><CloseIcon mr={"3px"} />Hủy</Button>

														</Flex>
													</Flex>
												);
											})
										);
									}
								})}
							</TabPanel>
							
							<TabPanel>
								{menu.map((data, index) => {
									return (

										<Flex p=".3rem" w="100%" m="4px 0px"
											flexDirection={{ md: "row", sm: "column" }}
											alignItems={"center"}
											justifyContent={"space-between"}
											style={{ border: "1px solid #38B2AC" }}
											borderRadius="10px"
											key={index}
											hidden={data.status == 0 && true}
											id={data.id + "-menu"}
										>
											<Flex flexWrap={"wrap"} alignItems={"center"} h="100%" m="0px 20px">
												<Flex flexDirection={"column"} m="5px 20px" w="150px">
													<Text color={textColor} fontSize={"lg"} fontWeight={"semibold"}>{data.menuName}</Text>
												</Flex>
												<Flex flexDirection={"column"} m="5px 20px">
													{data.status == 1 &&
														<Text color={"green"} fontSize={"md"} fontWeight={"nomal"}>Đang kích hoạt</Text>
														||
														<Text color={"red"} fontSize={"md"} fontWeight={"nomal"}>Hết món</Text>
													}
												</Flex>
											</Flex>
											<Flex m={"5px"} w="unset" me={{ sm: "5px", md: "25px" }}>
												<Button colorScheme="green" m="0px 5px" w="110px"
													hidden={data.status == 1 && true}
													onClick={() => { changeStatusMenu(data.id); }}
												><CheckCircleIcon mr={"3px"} />Kích hoạt</Button>
												<Button colorScheme="red" m={"0px 5px"} w="110px"
													hidden={data.status == 2 && true}
													onClick={() => { changeStatusMenu(data.id); }}
												><CloseIcon mr={"3px"} />Hết món</Button>

											</Flex>
										</Flex>

									);

								})}
							</TabPanel>
						</TabPanels>
					</Tabs>



				</CardBody>
			</Card>
		</Flex>
	);
}

export default Kitchen;
