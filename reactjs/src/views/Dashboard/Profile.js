import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actionLogin from "redux/actions/actionLogin";
import actionLogout from "redux/actions/actionLogout";
import actionUpdateSidebar from "redux/actions/actionUpdateSidebar";
// Chakra imports
import {
	Avatar,
	Box,
	Button,
	Flex,
	Icon,
	Text,
	useColorModeValue,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	FormControl,
	FormLabel,
	Input,
	ModalFooter,
	Textarea,
} from "@chakra-ui/react";
// Custom components
import { Separator } from "components/Separator/Separator";
// Assets
import ProfileBgImage from "assets/img/ProfileBackground.png";
import { FaRegEdit, FaUserEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import swal from "sweetalert";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

function Profile() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [resInfo, setResInfo] = useState({});
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = useRef();
	const [stat, setStat] = useState(0);
	const userInfo = useSelector((state) => state.reducerLogin).userInfo;
	const [inputPass, setInputPass] = useState({
		currentPass: "",
		newPass: "",
	});

	const [newUserInfo, setNewUserInfo] = useState({
		resID: userInfo.restaurantID,
		id: userInfo.id,
		userName: userInfo.userName,
		phone: userInfo.phone,
	})

	const [newName, setNewName] = useState("");
	const [address, setAddress] = useState("");
	const [description, setDescription] = useState("");

	// Chakra color mode
	const textColor = useColorModeValue("gray.700", "white");
	const bgProfile = useColorModeValue(
		"hsla(0,0%,100%,.8)",
		"linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
	);
	const borderProfileColor = useColorModeValue(
		"white",
		"rgba(255, 255, 255, 0.31)"
	);
	const emailColor = useColorModeValue("gray.400", "gray.300");

	if (userInfo === undefined)
		return (
			<Flex direction="column">
				<Box
					mb={{ sm: "205px", md: "75px", xl: "70px" }}
					borderRadius="15px"
					px="0px"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					align="center"
				>
					<Box
						bgImage={ProfileBgImage}
						w="100%"
						h="300px"
						borderRadius="25px"
						bgPosition="50%"
						bgRepeat="no-repeat"
						position="relative"
						display="flex"
						justifyContent="center"
					>
						<Flex
							direction={{ sm: "column", md: "row" }}
							mx="1.5rem"
							maxH="330px"
							w={{ sm: "90%", xl: "95%" }}
							justifyContent={{
								sm: "center",
								md: "space-between",
							}}
							align="center"
							backdropFilter="saturate(200%) blur(50px)"
							position="absolute"
							boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
							border="2px solid"
							borderColor={borderProfileColor}
							bg={bgProfile}
							p="24px"
							borderRadius="20px"
							transform={{
								sm: "translateY(45%)",
								md: "translateY(110%)",
								lg: "translateY(160%)",
							}}
						>
							<Flex
								align="center"
								mb={{ sm: "10px", md: "0px" }}
								direction={{ sm: "column", md: "row" }}
								w={{ sm: "100%" }}
								textAlign={{ sm: "center", md: "start" }}
							>
								<Flex
									direction="column"
									maxWidth="100%"
									my={{ sm: "14px" }}
								>
									<Text
										fontSize={{ sm: "lg", lg: "xl" }}
										color={textColor}
										fontWeight="bold"
										ms={{ sm: "8px", md: "0px" }}
									>
										You are not logged in
									</Text>
								</Flex>
							</Flex>
						</Flex>
					</Box>
				</Box>
			</Flex>
		);


	useEffect(() => {
		getResInfo();

	}, []);


	const getResInfo = async () => {
		const res = await axios.post("/api/getResInfo", { id: userInfo.restaurantID });
		if (res.data.errCode === 0) {
			setResInfo({
				restaurantName: res.data.resData.restaurantName,
				address: res.data.resData.address ? res.data.resData.address : "",
				description: res.data.resData.description ? res.data.resData.description : "",
			});
			setAddress(res.data.resData.address);
			setNewName(res.data.resData.restaurantName);
			setDescription(res.data.resData.description);
		}
		//return (defaultMenu);
	};

	const handleInputChangePass = (e) => {
		e.persist();
		setInputPass({ ...inputPass, [e.target.name]: e.target.value });
	};

	const handleInputChangeProfile = (e) => {
		e.persist();
		setNewUserInfo({ ...newUserInfo, [e.target.name]: e.target.value });
	};

	const changePassword = async () => {
		const data = {
			userId: userInfo.id,
			password: inputPass.currentPass,
			newPassword: inputPass.newPass,
		};
		if (data.password.trim() == "" || data.newPassword.trim() == "") {
			swal({
				title: "Lỗi!",
				text: "Thiếu giá trị nhập vào!",
				icon: "error",
				button: "OK!",
			})
		} else {
			const res = await axios.post("/api/changePass", data);
			if (res.data.errCode === 0) {
				setInputPass({
					currentPass: "",
					newPass: "",
				});
				swal("Thành công!", "Cập nhật thành công!", "success").then(() => onClose());
			} else {
				swal({
					title: "Lỗi!",
					text: res.data.errMessage,
					icon: "error",
					button: "OK!",
				})
			}
		}
	};


	const handleUpdateRes = async () => {
		if (resInfo.restaurantName == newName.trim() && resInfo.address == address.trim() && resInfo.description == description.trim()) {
			swal({
				title: "Lỗi!",
				text: "Không có gì thay đổi!",
				icon: "error",
				button: "OK!",
			})
		} else if (newName.trim() == "") {
			swal({
				title: "Lỗi!",
				text: "Thiếu giá trị nhập vào!",
				icon: "error",
				button: "OK!",
			})
		} else {

			const res = await axios.post("/api/updateRes", {
				id: userInfo.restaurantID,
				newName: newName,
				address: address,
				description: description,
			});
			if (res.data.errCode === 0) {
				setResInfo({
					restaurantName: newName,
					address: address ? address : "",
					description: description ? description : "",
				});
				swal("Thành công!", "Cập nhật thành công!", "success").then(() => onClose());
			} else {
				swal({
					title: "Lỗi!",
					text: res.data.errMessage,
					icon: "error",
					button: "OK!",
				})
			}
		}
	}

	const updateProfile = async () => {
		if (userInfo.userName == newUserInfo.userName.trim() && userInfo.phone == newUserInfo.phone) {
			swal({
				title: "Lỗi!",
				text: "Không có gì thay đổi!",
				icon: "error",
				button: "OK!",
			})
		} else if (newUserInfo.userName.trim() == "" || newUserInfo.phone == "") {
			swal({
				title: "Lỗi!",
				text: "Thiếu giá trị nhập vào!",
				icon: "error",
				button: "OK!",
			})
		} else {

			const res = await axios.post("/api/updateProfile", newUserInfo);
			if (res.data.errCode === 0) {
				dispatch(actionLogin(res.data.user));
				swal("Thành công!", "Cập nhật thành công!", "success")
					.then(() => {
						onClose();
						//window.location.reload(false); 
					});
			} else {
				swal({
					title: "Lỗi!",
					text: res.data.errMessage,
					icon: "error",
					button: "OK!",
				})
			}
		}
	}

	const logout = () => {
		dispatch(actionUpdateSidebar("logout"));
		dispatch(actionLogout());
		history.push("/resmat/home");
	};

	return (
		<>
			<Flex direction="column" mb={{ sm: "60px", md: "20px" }}>
				<Box
					mb={{ sm: "150px", md: "75px", xl: "70px" }}
					borderRadius="15px"
					px="0px"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					align="center"
				>
					<Box
						bgImage={ProfileBgImage}
						w="100%"
						h="300px"
						borderRadius="25px"
						bgPosition="50%"
						bgRepeat="no-repeat"
						position="relative"
						display="flex"
						justifyContent="center"
					>
						<Flex
							direction={{ sm: "column", md: "row" }}
							mx="1.5rem"
							maxH="330px"
							w={{ sm: "90%", xl: "95%" }}
							justifyContent={{
								sm: "center",
								md: "space-between",
							}}
							align="center"
							backdropFilter="saturate(200%) blur(50px)"
							position="absolute"
							boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
							border="2px solid"
							borderColor={borderProfileColor}
							bg={bgProfile}
							p="24px"
							borderRadius="20px"
							transform={{
								sm: "translateY(45%)",
								md: "translateY(110%)",
								lg: "translateY(160%)",
							}}
						>
							<Flex
								align="center"
								mb={{ sm: "10px", md: "0px" }}
								direction={{ sm: "column", md: "row" }}
								w={{ sm: "100%" }}
								textAlign={{ sm: "center", md: "start" }}
							>
								<Avatar
									me={{ md: "22px" }}
									src={userInfo.profilePic}
									w="80px"
									h="80px"
									borderRadius="15px"
								/>
								<Flex
									direction="column"
									maxWidth="100%"
									my={{ sm: "14px" }}
								>
									<Text
										fontSize={{ sm: "lg", lg: "xl" }}
										color={textColor}
										fontWeight="bold"
										ms={{ sm: "8px", md: "0px" }}
									>
										{userInfo.userName}
									</Text>
									<Text
										fontSize={{ sm: "sm", md: "md" }}
										color={emailColor}
										fontWeight="semibold"
									>
										{userInfo.phone}
									</Text>
								</Flex>
							</Flex>
							<Flex
								direction={{ sm: "column", md: "row" }}
								w={{ sm: "100%", md: "50%", lg: "auto" }}
							>
								<Flex direction="column" mx="10px">
									<Button
										onClick={() => { onOpen(); setStat(1); }}
										p="0px"
										bg="transparent"
										variant="ghost"
										hidden={userInfo.role != 3 && true}
									>
										<Flex
											align="center"
											w={{ lg: "135px" }}
											borderRadius="15px"
											justifyContent="center"
											py="10px"
											mx={{ lg: "1rem" }}
											cursor="pointer"
										>
											<Icon as={FaRegEdit} me="6px" />
											<Text
												fontSize="xs"
												color={textColor}
												fontWeight="bold"
											>
												Cập nhật nhà hàng
											</Text>
										</Flex>
									</Button>

									<Button
										onClick={() => { onOpen(); setStat(3); }}
										p="0px"
										bg="transparent"
										variant="ghost"
									>
										<Flex
											align="center"
											w={{ lg: "135px" }}
											borderRadius="15px"
											justifyContent="center"
											py="10px"
											mx={{ lg: "1rem" }}
											cursor="pointer"
										>
											<Icon as={FaRegEdit} me="6px" />
											<Text
												fontSize="xs"
												color={textColor}
												fontWeight="bold"
											>
												Cập nhật Profile
											</Text>
										</Flex>
									</Button>
								</Flex>
								<Flex direction={"column"} mx="10px">
									<Button
										onClick={() => { onOpen(); setStat(2); }}
										p="0px"
										bg="transparent"
										variant="ghost"
									>
										<Flex
											align="center"
											w={{ lg: "135px" }}
											borderRadius="15px"
											justifyContent="center"
											py="10px"
											mx={{ lg: "1rem" }}
											cursor="pointer"
										>
											<Icon as={FaRegEdit} me="6px" />
											<Text
												fontSize="xs"
												color={textColor}
												fontWeight="bold"
											>
												Đổi mật khẩu
											</Text>
										</Flex>
									</Button>

									<Button
										onClick={logout}
										p="0px"
										bg="transparent"
										variant="ghost"
									>
										<Flex
											align="center"
											w={{ lg: "135px" }}
											borderRadius="15px"
											justifyContent="center"
											py="10px"
											cursor="pointer"
										>
											<Icon as={FiLogOut} me="6px" />
											<Text
												fontSize="xs"
												color={textColor}
												fontWeight="bold"
											>
												LOGOUT
											</Text>
										</Flex>
									</Button>
								</Flex>
							</Flex>
						</Flex>
					</Box>
				</Box>


				{/* <MyPlaylist userId={userInfo.userId} />
				<Separator h="5px" />
				<PlaylistSharedWithMe userId={userInfo.userId} /> */}
			</Flex>
			<Card overflowX={{ xl: "hidden" }} >
				<CardBody >
					<Flex flexDirection={"column"} >
						<Flex m="0px 20px" alignItems="baseline">
							<Text color={useColorModeValue("black", "white")} fontSize="md" m={"0px 5px"}>Nhà hàng: </Text>
							<Text color={useColorModeValue("black", "white")} fontSize="xl" fontWeight={"bold"}>{resInfo.restaurantName}</Text>
						</Flex>

						<Flex alignItems={"center"} m="0px 20px">
							<Text color={useColorModeValue("black", "white")} fontSize="md" m={"0px 5px"}>Địa chỉ:</Text>
							<Text color={useColorModeValue("gray", "white")} fontSize="md">{resInfo.address}</Text>
						</Flex>
						<Separator m="10px" />
						<Flex m="10px">
							<Text color={useColorModeValue("black", "white")} fontSize="md" m={"0px 5px"}>Mô tả:</Text>
							<Text color={useColorModeValue("gray", "white")} fontSize="md">{resInfo.description}</Text>
						</Flex>

					</Flex>

				</CardBody>
			</Card>
			{stat == 3 &&
				<Modal
					initialFocusRef={initialRef}
					isOpen={isOpen}
					onClose={onClose}
					isCentered
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Cập nhật Profile</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb={6}>
							<FormControl>
								<FormLabel>Tên</FormLabel>
								<Input
									//ref={initialRef}
									name="userName"
									placeholder="Nhập tên mới."
									value={newUserInfo.userName}
									onChange={handleInputChangeProfile}
									type="text"
								/>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel>Số điện thoại</FormLabel>
								<Input
									placeholder="Nhập số điện thoại mới."
									name="phone"
									value={newUserInfo.phone}
									onChange={handleInputChangeProfile}
									type="number"
									pattern="[0-9]"
									required={true}
								/>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={updateProfile}>
								Xác nhận
							</Button>
							<Button onClick={onClose}>Hủy</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			}
			{stat == 2 &&
				<Modal
					initialFocusRef={initialRef}
					isOpen={isOpen}
					onClose={onClose}
					isCentered
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Đổi mật khẩu</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb={6}>
							<FormControl>
								<FormLabel>Mật khẩu hiện tại</FormLabel>
								<Input
									ref={initialRef}
									placeholder="Nhập mật khẩu hiện tại."
									name="currentPass"
									value={inputPass.currentPass}
									onChange={handleInputChangePass}
									type="password"
								/>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel>Mật khẩu mới</FormLabel>
								<Input
									placeholder="Nhập mật khẩu mới."
									name="newPass"
									value={inputPass.newPass}
									onChange={handleInputChangePass}
									type="password"
								/>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={changePassword}>
								Xác nhận
							</Button>
							<Button onClick={onClose}>Hủy</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			}
			{stat == 1 &&
				<Modal
					initialFocusRef={initialRef}
					isOpen={isOpen}
					onClose={onClose}
					isCentered
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Cập nhật thông tin nhà hàng</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb={6}>
							<FormControl>
								<FormLabel>Tên nhà hàng</FormLabel>
								<Input
									name="restaurantName"
									value={newName}
									//defaultValue={resInfo.restaurantName}
									onChange={(e) => { setNewName(e.target.value) }}
									type="text"
								/>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel>Địa chỉ</FormLabel>
								<Textarea
									name="address"
									value={address}
									//defaultValue={resInfo.address}
									onChange={(e) => { setAddress(e.target.value) }}
									type="text"
								/>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel>Mô tả</FormLabel>
								<Textarea
									name="description"
									value={description}
									//defaultValue={resInfo.description}
									onChange={(e) => { setDescription(e.target.value) }}
									type="text"
								/>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={() => { handleUpdateRes(); }}>
								Xác nhận
							</Button>
							<Button onClick={onClose}>Hủy</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			}
		</>
	);
}

export default Profile;
