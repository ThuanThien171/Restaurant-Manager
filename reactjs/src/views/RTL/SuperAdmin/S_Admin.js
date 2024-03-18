import { Link, useHistory, Redirect } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
// Chakra imports
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Avatar,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    Tfoot,
    Td,
    TableCaption,
    useColorMode,
    useColorModeValue,
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

import { DeleteIcon } from "@chakra-ui/icons"
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

export default function SuperAdmin() {
    // Chakra Color Mode
    const textColor = useColorModeValue("gray.700", "white");
    const [user, getUser] = useState([]);
    const [pass, getPass] = useState("");
    const [stat, getStat] = useState(0);
    const history = useHistory();
    const [userUpdate, getUserUpdate] = useState({});
    const userInfo = useSelector((state) => state.reducerLogin).userInfo;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    const [newUser, setNewUser] = useState({
        restaurantID: userInfo.restaurantID,
        phone: "",
        userName: "",
        password: "",
        role: 0
    });

    const handleInput = (e) => {
        e.persist();
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleUpdateInput = (e) => {
        e.persist();
        getUserUpdate({ ...userUpdate, [e.target.name]: e.target.value });
    }

    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
        //history.push('/auth/signin/');
    }

    useEffect(() => {
        getUserData();
    }, [])
    //Get user data from database
    const getUserData = async () => {
        const res = await axios.post("/api/getAllStaff", { id: userInfo.restaurantID });
        if (res.data.errCode === 0) {
            getUser(res.data.staffs);
        }
    }



    //Handle update user


    // Handle check password
    const deleteUser = async () => {

        if (pass.trim() == "") {
            swal({
                title: "Lỗi!",
                text: "Thiếu giá trị nhập vào",
                icon: "error",
                button: "OK!",
            });
        } else {
            const data = {
                id: userInfo.id,
                resID: userInfo.restaurantID,
                password: pass,
                deleteUserID: userUpdate.id,
            };
            const res = await axios.post("/api/deleteUser", data);
            if (res.data.errCode === 0) {
                getUser(res.data.staffs);
                swal({
                    title: "Thành công!",
                    text: res.data.errMessage,
                    icon: "success",
                    button: "OK!",
                });

                getPass("");
                onClose();

            } else {
                swal({
                    title: "Lỗi!",
                    text: res.data.errMessage,
                    icon: "error",
                    button: "OK!",
                });
                getPass("");
                onClose();
            }
        }

    }

    //add new user
    const addNewUser = async () => {

        newUser.role = parseInt(newUser.role);
        if (newUser.userName.trim() == "" || newUser.phone.trim() == "" || newUser.password.trim() == "") {
            swal({
                title: "Lỗi!",
                text: "Thiếu giá trị nhập vào",
                icon: "error",
                button: "OK!",
            });
        } else {
            const res = await axios.post("/api/addNewUser", newUser);
            if (res.data.errCode === 0) {
                getUser(res.data.staffs);
                swal({
                    title: "Thành công!",
                    text: res.data.errMessage,
                    icon: "success",
                    button: "OK!",
                });

                onClose();
                setNewUser({
                    restaurantID: userInfo.restaurantID,
                    phone: "",
                    userName: "",
                    password: "",
                    role: 0
                });

            } else {
                swal({
                    title: "Lỗi!",
                    text: res.data.errMessage,
                    icon: "error",
                    button: "OK!",
                });
            }

        }
    }

    const updateUserByAdmin = async () => {
        //console.log(userUpdate);
        userUpdate.role = parseInt(userUpdate.role);
        if (userUpdate.userName.trim() == "" || userUpdate.phone.trim() == "") {
            swal({
                title: "Lỗi!",
                text: "Thiếu giá trị nhập vào",
                icon: "error",
                button: "OK!",
            });
        } else {
            const res = await axios.post("/api/updateUserByAdmin", userUpdate);
            if (res.data.errCode === 0) {
                getUser(res.data.staffs);
                swal({
                    title: "Thành công!",
                    text: "Cập nhật thành công",
                    icon: "success",
                    button: "OK!",
                });

                onClose();
                getUserUpdate({});

            } else {
                swal({
                    title: "Lỗi!",
                    text: res.data.errMessage,
                    icon: "error",
                    button: "OK!",
                });
            }

        }
    }
    return (
        <div style={{ margin: '60px 0px 0px 0px' }}>
            <Card overflowX={{ xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px" justifyContent="space-between" alignItems="Center">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Danh sách nhân viên
                    </Text>
                    <Button colorScheme="teal" onClick={(e) => { onOpen(); getStat(2) }}>Thêm nhân viên</Button>
                </CardHeader>
                <CardBody style={{ overflow: "auto" }}>
                    <Table variant="simple" color={textColor} width="100%">
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th color="gray.400">
                                    Nhân viên
                                </Th>
                                {/* <Th color="gray.400">FullName</Th> */}
                                {/* <Th color="gray.400">Phone</Th> */}
                                <Th color="gray.400">Vị trí</Th>
                                <Th color="gray.400">Cập nhật</Th>
                                <Th color="gray.400">Xóa</Th>

                            </Tr>
                        </Thead>
                        <Tbody>

                            {user.map((data, index) => {
                                return (
                                    <Tr key={index}>
                                        <Td minWidth={{ sm: "200px" }} pl="0px">
                                            <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                                <Avatar src={data.profilePic} w="50px" borderRadius="12px" me="18px" />
                                                <Flex direction="column">
                                                    <Text
                                                        m="3px 0px"
                                                        fontSize="lg"
                                                        color={textColor}
                                                        fontWeight="bold"
                                                        minWidth="100%"
                                                    >
                                                        {data.userName}
                                                    </Text>
                                                    <Text m="3px 0px" fontSize="md" color="gray.700" fontWeight="normal">
                                                        sdt: {data.phone}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Td>

                                        <Td>
                                            <Text fontSize="lg" color={textColor} fontWeight="bold">
                                                {data.role == 0 && "Nhân viên phục vụ" || data.role == 1 && "Nhân viên bếp" || data.role == 2 && "Quản lý"}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Button m="5px" colorScheme="green" size="sm" onClick={(e) => { onOpen(); getUserUpdate(data); getStat(3) }} value={data.id}>Cập nhật</Button>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="red" size="sm" onClick={(e) => { onOpen(); getUserUpdate(data); getStat(1) }} value={data.id}><DeleteIcon /></Button>
                                        </Td>
                                    </Tr>
                                );
                            })}

                            {stat == 1 &&
                                <Modal
                                    initialFocusRef={initialRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                >
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Nhập mật khẩu của bạn để xác nhận</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={6}>
                                            <Input type="password" value={pass} onChange={(e) => { getPass(e.target.value) }} />
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button onClick={deleteUser} colorScheme="blue" mr={3}>
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
                                        <ModalHeader>Nhân viên mới</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={7}>
                                            <FormControl>
                                                <FormLabel>Tên</FormLabel>
                                                <Input
                                                    ref={initialRef}
                                                    placeholder="Nhập tên nhân viên mới."
                                                    name="userName"
                                                    onChange={handleInput}
                                                    value={newUser.userName}
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Số điện thoại</FormLabel>
                                                <Input
                                                    placeholder="Nhập số điện thoại."
                                                    name="phone"
                                                    onChange={handleInput}
                                                    value={newUser.phone}
                                                    type="number"
                                                    pattern="[0-9]"
                                                    required={true}
                                                />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <Input
                                                    placeholder="Nhập mật khẩu."
                                                    name="password"
                                                    onChange={handleInput}
                                                    value={newUser.password}
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Vị trí</FormLabel>
                                                <Select
                                                    name="role"
                                                    value={newUser.role}
                                                    onChange={handleInput}
                                                >
                                                    <option value={0} >Nhân viên phục vụ</option>
                                                    <option value={1} >Nhân viên bếp</option>
                                                    <option value={2} >Quản lý</option>
                                                </Select>
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme="blue" mr={3} onClick={addNewUser}>
                                                OK
                                            </Button>
                                            <Button onClick={onClose}>Hủy</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            }
                            {stat == 3 &&
                                <Modal
                                    initialFocusRef={initialRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                >
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Cập nhật nhân viên</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={7}>
                                            <FormControl>
                                                <FormLabel>Tên</FormLabel>
                                                <Input
                                                    ref={initialRef}
                                                    placeholder="Nhập tên nhân viên mới."
                                                    name="userName"
                                                    onChange={handleUpdateInput}
                                                    value={userUpdate.userName}
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Số điện thoại</FormLabel>
                                                <Input
                                                    placeholder="Nhập số điện thoại."
                                                    name="phone"
                                                    onChange={handleUpdateInput}
                                                    value={userUpdate.phone}
                                                    type="number"
                                                    pattern="[0-9]"
                                                    required={true}
                                                />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <Input
                                                    placeholder="Nhập mới để đổi mật khẩu."
                                                    name="password"
                                                    onChange={handleUpdateInput}
                                                    value={userUpdate.password}
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Vị trí</FormLabel>
                                                <Select
                                                    name="role"
                                                    value={userUpdate.role}
                                                    onChange={handleUpdateInput}
                                                >
                                                    <option value={0} >Nhân viên phục vụ</option>
                                                    <option value={1} >Nhân viên bếp</option>
                                                    <option value={2} >Quản lý</option>
                                                </Select>
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme="blue" mr={3} onClick={updateUserByAdmin}>
                                                OK
                                            </Button>
                                            <Button onClick={onClose}>Hủy</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            }
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </div >


    );
}