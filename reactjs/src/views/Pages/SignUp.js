// Chakra imports
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	Input,
	Link,
	Switch,
	Text,
	useColorModeValue, Textarea,
} from "@chakra-ui/react";

import { useState, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

//Redux
import { useDispatch } from "react-redux";
import actionLogin from "redux/actions/actionLogin";
import actionUpdateSidebar from "redux/actions/actionUpdateSidebar";

// Assets
import BgSignUp from "assets/img/BgSignUp.png";
import React from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

function SignUp() {
	const dispatch = useDispatch();
	const titleColor = useColorModeValue("teal.300", "teal.200");
	const textColor = useColorModeValue("gray.700", "white");
	const bgColor = useColorModeValue("white", "gray.700");
	const bgIcons = useColorModeValue("teal.200", "rgba(255, 255, 255, 0.5)");
	const history = useHistory();
	const passRef = useRef();
	const phoneRef = useRef();
	const resNameRef = useRef();

	const [state, setState] = useState({
		userName: "",
		phone: "",
		password: "",
		confirmPass: "",
		restaurantName: "",
		address: "",
		description: "",
	});

	const handleInput = (e) => {
		e.persist();
		setState({ ...state, [e.target.name]: e.target.value });
	};

	const preSignup = async () => {
		if (state.userName.trim() == "" || state.phone.trim() == "" || state.password.trim() == "" || state.confirmPass.trim() == "" || state.restaurantName.trim() == "") {
			swal("Opps!", "Thiếu giá trị nhập vào", "warning")

		} else if (state.password !== state.confirmPass)
			swal("Opps!", "Mật khẩu khồng khớp", "warning").then(() => { passRef.current.focus() });
		else signup();
	};

	const signup = async () => {
		state.role = 3;
		const res = await axios.post("/api/signup", state);

		if (res.data.errCode === 0) {
			try {
				if (res.data.user.role === 0)
					dispatch(actionUpdateSidebar("user"));
				else if (res.data.user.role === 1)
					dispatch(actionUpdateSidebar("chef"));
				else if (res.data.user.role === 2)
					dispatch(actionUpdateSidebar("admin"));
				else if (res.data.user.role === 3)
					dispatch(actionUpdateSidebar("superAdmin"));
				dispatch(actionLogin(res.data.user));
				swal(
					"Thành công!",
					"Chào mừng tới ReMaT, " + res.data.user.userName + "!",
					"success"
				).then(() => history.push("/remat"));
			} catch (err) {
				swal("Error", err.message, "error");
			}
			setState({
				userName: "",
				phone: "",
				password: "",
				confirmPass: "",
				restaurantName: "",
				address: "",
				description: "",
			});
		} else if (res.data.errCode === 1) {
			swal("Opps!", "Số điện thoại đã được dùng", "warning").then(() => { phoneRef.current.focus() });
		} else if (res.data.errCode === 2) {
			swal("Opps!", "Tên nhà hàng đã tồn tại", "warning").then(() => { resNameRef.current.focus() });
		}
	};

	return (
		<Flex
			direction="column"
			alignSelf="center"
			justifySelf="center"
			overflow="hidden"
		>
			<Box
				position="absolute"
				minH={{ base: "70vh", md: "50vh" }}
				w={{ md: "calc(100vw - 50px)" }}
				borderRadius={{ md: "15px" }}
				left="0"
				right="0"
				bgRepeat="no-repeat"
				overflow="hidden"
				zIndex="-1"
				top="0"
				bgImage={BgSignUp}
				bgSize="cover"
				mx={{ md: "auto" }}
				mt={{ md: "14px" }}
			></Box>
			<Flex
				direction="column"
				textAlign="center"
				justifyContent="center"
				align="center"
				mt="6.5rem"
				mb="30px"
			>
				<Text fontSize="4xl" color="white" fontWeight="bold">
					Chào mừng!
				</Text>
				<Text
					fontSize="md"
					color="white"
					fontWeight="normal"
					mt="10px"
					mb="26px"
					w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
				>
					Tạo và quản lý nhà hàng của riêng bạn!
				</Text>
			</Flex>
			<Flex
				alignItems="center"
				justifyContent="center"
				mb="60px"
				mt="20px"
			>
				<Flex
					direction="column"
					w="445px"
					background="transparent"
					borderRadius="15px"
					p="40px"
					mx={{ sm: "0px", base: "100px" }}
					bg={bgColor}
					boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
				>
					<Text
						fontSize="xl"
						color={textColor}
						fontWeight="bold"
						textAlign="center"
						mb="22px"
					>
						Thông tin đăng ký
					</Text>
					<FormControl>

						<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
							Tên người dùng
						</FormLabel>
						<Input
							name="userName"
							fontSize="sm"
							ms="4px"
							borderRadius="15px"
							type="text"
							placeholder="Tên người dùng"
							mb="24px"
							size="lg"
							onChange={handleInput}
							value={state.userName}
						/>
						<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
							Số điện thoại
						</FormLabel>
						<Input
							name="phone"
							pattern="[0-9]"
							required={true}
							fontSize="sm"
							ms="4px"
							borderRadius="15px"
							type="number"
							placeholder="Số điện thoại người dùng"
							mb="24px"
							size="lg"
							onChange={handleInput}
							value={state.phone}
							ref={phoneRef}
						/>

						<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
							Mật khẩu
						</FormLabel>
						<Input
							name="password"
							fontSize="sm"
							ms="4px"
							borderRadius="15px"
							type="password"
							placeholder="Nhập mật khẩu"
							mb="24px"
							size="lg"
							onChange={handleInput}
							value={state.password}
							ref={passRef}
						/>
						<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
							Nhập lại mật khẩu
						</FormLabel>
						<Input
							name="confirmPass"
							fontSize="sm"
							ms="4px"
							borderRadius="15px"
							type="password"
							placeholder="Nhập lại mật khẩu"
							mb="24px"
							size="lg"
							onChange={handleInput}
							value={state.confirmPass}
						/>
						<FormControl>
							<Text
								fontSize="xl"
								color={textColor}
								fontWeight="bold"
								textAlign="center"
								mb="22px"
							>
								Thông tin nhà hàng
							</Text>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
								Tên nhà hàng
							</FormLabel>
							<Input
								name="restaurantName"
								fontSize="sm"
								ms="4px"
								borderRadius="15px"
								type="text"
								placeholder="Tên nhà hàng"
								mb="24px"
								size="lg"
								onChange={handleInput}
								value={state.restaurantName}
								ref={resNameRef}
							/>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
								Địa chỉ
							</FormLabel>
							<Textarea
								name="address"
								fontSize="sm"
								ms="4px"
								borderRadius="15px"
								type="text"
								placeholder="Nhập địa chỉ nhà hàng"
								mb="24px"
								size="lg"
								onChange={handleInput}
								value={state.address}
							/>
							<FormLabel ms="4px" fontSize="sm" fontWeight="normal">
								Mô tả
							</FormLabel>
							<Textarea

								wordBreak={"break-all"}
								name="description"
								fontSize="sm"
								ms="4px"
								borderRadius="15px"
								type="text"
								placeholder="Mô tả nhà hàng"
								mb="24px"
								size="lg"
								onChange={handleInput}
								value={state.description}
							/>
						</FormControl>

						<Button
							onClick={preSignup}
							type="submit"
							bg="teal.300"
							fontSize="10px"
							color="white"
							fontWeight="bold"
							w="100%"
							h="45"
							mb="24px"
							_hover={{
								bg: "teal.200",
							}}
							_active={{
								bg: "teal.400",
							}}
						>
							Đăng ký
						</Button>
					</FormControl>
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						maxW="100%"
						mt="0px"
					>
						<Text color={textColor} fontWeight="medium">
							Bạn đã có sẵn tài khoản?
							<Link
								color={titleColor}
								as="span"
								ms="5px"
								href="#"
								fontWeight="bold"
							>
								Đăng nhập
							</Link>
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default SignUp;
