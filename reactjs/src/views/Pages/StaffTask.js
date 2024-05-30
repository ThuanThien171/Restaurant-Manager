// Chakra imports
import { Box, Flex, Grid, Text, useColorModeValue, Avatar, Button, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Center,
    Select,
} from "@chakra-ui/react";
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
import swal from "sweetalert";


export default function StaffTask() {
	// Chakra Color Mode
	const textColor = useColorModeValue("gray.700", "white");
	const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2Ftable.PNG?alt=media&token=5c49e9ba-9df2-4a03-94a8-b1aed269d10b";
	const [areas, setAreas] = useState([]);
	const [staffs, setStaffs] = useState([]);
	const [check, setCheck] = useState(true);
	const [inUsed, setInUsed] = useState(false);
	const [staffTask, setStaffTask] = useState({
		userID: null,
		tableID: null,
	});
	const { isOpen, onOpen, onClose } = useDisclosure();
	const history = useHistory();
	const dispatch = useDispatch();
	//check login
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	//const history = useHistory();
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}
	const initialRef = React.useRef();

	useEffect(() => {
		getAvailableTable();
		getUserData();
	}, []);

	const getAvailableTable = async () => {
		const res = await axios.post("/api/getAvailableTable", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setAreas(res.data.areas)
		}
	};

	const getUserData = async () => {
        const res = await axios.post("/api/getAllStaff", { id: userInfo.restaurantID });
        if (res.data.errCode === 0) {
			const filterStaff = res.data.staffs.filter(data => data.role === 0);
            setStaffs(filterStaff);
        }
    }

	const handleClick = (tableID, StaffTask, status) => {
		setStaffTask({
			userID: StaffTask.userID,
			tableID,
		})
		if(StaffTask.userID != null) setCheck(false);
		else setCheck(true);

		if(status === 1) setInUsed(true);
		else setInUsed(false);

		onOpen();
	}

	const updateStaftTask = async () => {
		if(inUsed) {
			return swal({
				title: "Lỗi!",
				text: "Bàn đang được dùng!",
				icon: "error",	
				button: "OK!",
			})	
		}
		if(!staffTask.userID) {
			return swal({
				title: "Lỗi!",
				text: "Chưa chọn nhân viên",
				icon: "error",	
				button: "OK!",
			})	
		}
		if(staffTask.userID === -1) {
			const res = await axios.post("/api/deleteStaffTask", {resID: userInfo.restaurantID, tableID: staffTask.tableID});
			if (res.data.errCode === 0) {
				setAreas(res.data.areas);
				onClose();
				return swal({
					title: "OK!",
					text: "Xóa nhiệm vụ thành công",
					icon: "success",	
					button: "OK!",
				})
			}
		}else {
			const res = await axios.post("/api/updateStaffTask", {resID: userInfo.restaurantID,  staffTask});
			if (res.data.errCode === 0) {
				setAreas(res.data.areas);
				onClose();
				return swal({
					title: "OK!",
					text: "Thêm nhiệm vụ thành công",
					icon: "success",	
					button: "OK!",
				})
			}
		}
	}

	return (
		<div style={{ margin: '60px 0px 0px 0px' }} >
			<Card overflowX={{ xl: "hidden" }}>
				<CardHeader mt={{sm: '40px', md: 0}}>
					<Box mb={{ sm: "8px", md: "0px" }} w="100%">
						<Text fontSize="xl" color={textColor} fontWeight="bold">Danh sách bàn</Text>
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
												md: "calc(50% - 10px)",
												sm: "calc(100% - 10px)",
											}}
                                            h={{sm:"20vw", md:"10vw"}}
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

											onClick={() => { handleClick(table.id,table.StaffTask,table.status) }}
										>

											<Flex
												w="100%"
												h="100%"
												display={"flex"}
												justifyContent="space-evenly"
												alignItems={"center"}
												flexDirection={"column"}

											>
												<Text
													fontSize="md"
													color={textColor}
													fontWeight="semibold"
												>
                                                    {table.tableName}
                                                </Text>
                                                <Text
                                                    w={"100%"}
                                                    paddingInline={"10%"}
													fontSize="md"
													color={textColor}
													fontWeight="semibold"
                                                    textAlign={"left"}
												>
                                                    Nhân viên: {table.StaffTask.User.userName || ''}
                                                </Text>
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
				<Modal
                                    initialFocusRef={initialRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                >
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Nhân viên phụ trách</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={7}>
                                            <FormControl mt={4}>
                                                <Select
                                                    name="role"
                                                    value={staffTask.userID}
                                                    onChange={(e)=> {
														setStaffTask({...staffTask, userID: parseInt(e.target.value)})
													}}
													placeholder={'Chọn nhân viên phụ trách'}
                                                >
													<option value={-1} hidden={check}>{'>>> Hủy <<<'}</option>
													{staffs.map(data => {
														return (
															<option value={data.id} >{data.userName}</option>
														)
													})}
                                                </Select>
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme="blue" mr={3} 
												onClick={updateStaftTask}
											>
                                                OK
                                            </Button>
                                            <Button onClick={()=> {
												onClose();
												setStaffTask({
													userID: null,
													userName: null,
													tableID: null,
												});
												}}>Hủy</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
			</Card>
		</div >
	);

}
