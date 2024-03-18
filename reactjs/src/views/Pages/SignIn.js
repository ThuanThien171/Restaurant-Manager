import React, { useEffect } from "react";
// Chakra imports
import {
	Box,
	Flex,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Switch,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

// Assets
import signInImage from "assets/img/signInImage.png";

//Redux
import { useDispatch } from "react-redux";
import actionLogin from "redux/actions/actionLogin";
import actionUpdateSidebar from "redux/actions/actionUpdateSidebar";

function SignIn() {
	const dispatch = useDispatch();
	// Chakra color mode
	const titleColor = useColorModeValue("teal.300", "teal.200");
	const textColor = useColorModeValue("gray.400", "white");
	const history = useHistory();

	const [state, setState] = useState({
		phone: "",
		password: "",
	});


	const handleInput = (e) => {
		e.persist();
		setState({ ...state, [e.target.name]: e.target.value });
	};

	const login = async (e) => {
		e.preventDefault();
		const data = {
			phone: state.phone,
			password: state.password,
		};
		const res = await axios.post("/api/login", data);
		//console.log(res);
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
				history.push("/resmat");
			} catch (err) {
				swal("Error", err.message, "error");
			}
			setState({
				phone: "",
				password: "",
			});
		} else {
			swal("Lỗi!", res.data.errMessage, "error");
			setState({
				phone: "",
				password: "",
			});
		}
	};

	return (
		<Flex position="relative" mb="40px">
			<Flex
				h={{ sm: "initial", md: "75vh", lg: "85vh" }}
				w="100%"
				maxW="1044px"
				mx="auto"
				justifyContent="center"
				mb="30px"
				pt={{ sm: "100px", md: "100px" }}
			>
				<Flex
					alignItems="center"
					justifyContent="start"
					style={{ userSelect: "none" }}
					w={{ base: "100%", md: "50%", lg: "42%" }}
				>
					<Flex
						direction="column"
						w="100%"
						background="transparent"
						p="48px"
						mt={{ md: "150px", lg: "80px" }}
					>
						<Heading color={titleColor} fontSize="32px" mb="10px">
							Chào mừng trở lại
						</Heading>
						<Text
							mb="36px"
							ms="4px"
							color={textColor}
							fontWeight="bold"
							fontSize="14px"
						>
							Nhập sdt và mật khẩu để đăng nhập
						</Text>
						<FormControl onSubmit={login}>
							<FormLabel
								ms="4px"
								fontSize="sm"
								fontWeight="normal"
							>
								Số điện thoại
							</FormLabel>
							<Input
								name="phone"
								borderRadius="15px"
								mb="24px"
								fontSize="sm"
								type="number"
								pattern="[0-9]"
								required={true}
								placeholder="Số điện thoại người dùng"
								size="lg"
								onChange={handleInput}
								value={state.phone}
							/>
							<FormLabel
								ms="4px"
								fontSize="sm"
								fontWeight="normal"
							>
								Mật khẩu
							</FormLabel>
							<Input
								name="password"
								borderRadius="15px"
								mb="36px"
								fontSize="sm"
								type="password"
								placeholder="Nhập mật khẩu"
								size="lg"
								onChange={handleInput}
								value={state.password}
							/>
							{/* <FormControl display="flex" alignItems="center">
								<Switch
									id="remember-login"
									colorScheme="teal"
									me="10px"
								/>
								<FormLabel
									htmlFor="remember-login"
									mb="0"
									ms="1"
									fontWeight="normal"
								>
									Remember me
								</FormLabel>
							</FormControl> */}
							<Button
								onClick={login}
								fontSize="10px"
								type="submit"
								bg="teal.300"
								w="100%"
								h="45"
								mb="20px"
								color="white"
								mt="20px"
								_hover={{
									bg: "teal.200",
								}}
								_active={{
									bg: "teal.400",
								}}
							>
								Đăng nhập
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
								Không có tài khoản?
								<Link
									color={titleColor}
									as="span"
									ms="5px"
									fontWeight="bold"
								>
									Đăng ký
								</Link>
							</Text>
						</Flex>
					</Flex>
				</Flex>
				{/* <Box
					display={{ base: "none", md: "block" }}
					overflowX="hidden"
					h="100%"
					w="40vw"
					position="absolute"
					right="0px"
				>
					<Box
						bgImage={signInImage}
						w="100%"
						h="100%"
						bgSize="cover"
						bgPosition="50%"
						position="absolute"
						borderBottomLeftRadius="20px"
					></Box>
				</Box> */}
			</Flex>
		</Flex>
	);
}

export default SignIn;
