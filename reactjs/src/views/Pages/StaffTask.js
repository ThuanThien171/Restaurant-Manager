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
} from "@chakra-ui/react";
import Select, { MultiValue } from 'react-select';
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
	const [defaultTask, setDefaultTask]= useState([]);
	const [updateTask, setUpdateTask]= useState([]);
	const [hidden,setHidden] = useState(true);

	const history = useHistory();
	const dispatch = useDispatch();
	//check login
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	//const history = useHistory();
	if (userInfo === undefined) {
		return (<Redirect to={'/auth/signin/'} />);
		// history.push('/auth/signin/');
	}

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
			const filterStaff = await res.data.staffs.filter(data => data.role === 0);
			const convertStaff = []
			for(let i = 0; i< filterStaff.length; i ++) {
				convertStaff.push({
					label: filterStaff[i].userName,
					value: filterStaff[i].id
				})
			}
            setStaffs(convertStaff);
        }
    }

	const handleUpdate = async () => {
		let data = updateTask.slice(0,areas.length)
		for(let i=0;i<data.length;i++) {
			data[i].userID = [];
			for(let j=0;j<data[i].user.length;j++){
				data[i].userID.push(data[i].user[j].value)
			}
		}
		console.log(data)
		const res = await axios.post("/api/updateStaffTask", data);
		if (res.data.errCode === 0) {
			swal({
				title: "Ok!",
				text: "Thành công",
				icon: "success",
				button: "OK!",
			})
		}
		
		getAvailableTable();
	}

	return (
		<div style={{ margin: '60px 0px 0px 0px' }} >
			<Card overflowX={{ xl: "hidden" }}>
				<CardHeader mt={{sm: '40px', md: 0}} style={{display: 'flex', alignItems: 'center'}}>
					<Box mb={{ sm: "8px", md: "0px" }} w="100%">
						<Text fontSize="xl" color={textColor} fontWeight="bold">Danh sách khu</Text>
					</Box>
					<Box ms="auto" w={{ sm: "unset", md: "unset" }} >
						<Button 
						style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} 
						colorScheme="blue" 
						onClick={() => {handleUpdate();}}
						hidden={hidden}
						>Xác nhận</Button>
					</Box>
				</CardHeader>
				<CardBody style={{ "flex-wrap": "wrap" }}
				//flexDirection="row"
				>
					<Separator />
					{areas.map((data, index) => {
						data.staffs = [];
						for(let i = 0; i< data.StaffTask.length; i ++) {
							data.staffs.push({
								label: data.StaffTask[i].userName,
								value: data.StaffTask[i].userID
							})
						}
						defaultTask.push({
							areaID: data.id,
							user: data.staffs
						})

						updateTask.push({
							areaID: data.id,
							user: data.staffs
						})

						return (
							<>
								<Flex m="5px 5px"
									key={index}
									w={{
										md: "calc(50% - 10px)",
										sm: "calc(100% - 10px)",
									}}
                                    h={{sm:"20vw", md:"10vw"}}
									style={{ border: "1px outset #38B2AC" }}
									borderRadius="10px"
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
                                                {data.areaName}
                                            </Text>
											<form style={{width : '90%'}}>
											<label>Nhân viên phụ trách:</label>
											<Select
												className="basic-multi-select"
												classNamePrefix="select"
												
												isMulti
												isClearable
												defaultValue={data.staffs}
												isSearchable
												onChange={(e) => {
													let i = updateTask.map(e=>e.areaID).indexOf(data.id)
													updateTask[i].user = e;
													JSON.stringify(defaultTask) === JSON.stringify(updateTask) ? setHidden(true) : setHidden(false)
												}}
												placeholder="Chọn nhân viên"
												options={staffs}
											></Select>
											</form>
										</Flex>
									</Flex >
								
							</>
						)
					})
					}

				</CardBody>
			</Card>
		</div >
	);

}
