import { Redirect, Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import React from 'react';
import axios from "axios";
import swal from "sweetalert";
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    FormControl,
    FormLabel
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

export default function Dashboard() {
    // Chakra Color Mode
    const textColor = useColorModeValue("gray.700", "white");
    const history = useHistory();
    const [area, setArea] = useState([]);
    const userInfo = useSelector((state) => state.reducerLogin).userInfo;

    //popup setup
    const [newName, setNewName] = useState('');
    const [number, setNumber] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2Farea.png?alt=media&token=0b46f61f-e5ce-4661-b7e1-cbe364f1d133";

    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
        // history.push('/auth/signin/');
    }
    useEffect(() => {
        getAllAreaData();
    }, [])
    //Get area data from database
    const getAllAreaData = async () => {
        const res = await axios.post("/api/getAllArea", { id: userInfo.restaurantID });
        // const res1 = await axios.post("api/getAreaTable");
        if (res.data.errCode === 0) {
            setArea(res.data.areas);
        }
    }

    //Handle add new area
    const HandleAddNewArea = async () => {
        if (!newName.trim() || number < 0 || number > 20) {
            swal({
                title: "Lỗi!",
                text: "Giá trị nhập vào thiếu hoặc không hợp lệ",
                icon: "warning",
                button: "OK!",
            });
        } else {
            const res = await axios.post('/api/postNewArea', { name: newName, number: number, resID: userInfo.restaurantID });
            if (res.data.errCode === 0) {
                setArea(res.data.areas);
                swal({
                    title: "Success!",
                    text: res.data.errMessage,
                    icon: "success",
                    button: "OK!",
                })
            }
            else {
                swal({
                    title: "Fail!",
                    text: res.data.errMessage,
                    icon: "warning",
                    button: "OK!",
                });
            }
        }
        onClose();
    }
    //Handle update area
    const goToUpdateAreaPage = (areaCurrentId) => {
        // const areaCurrentId = event.target.value;
        history.push('/resmat/area-detail/' + areaCurrentId);
    }
    //Handle delete area
    const handleDeleteArea = (id) => {

        swal("Bạn muốn xóa khu này?", {
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
                        const res = await axios.post("/api/deleteOneArea", { id: id, resID: userInfo.restaurantID });
                        if (res.data.errCode === 0) {
                            setTimeout(function () {
                                swal({
                                    title: "Thành công!",
                                    text: "Xóa thành công",
                                    icon: "success",
                                    button: "OK!",
                                })
                            }, 200);
                            setArea(area.filter((item) => item.id != id));
                        } else {
                            setTimeout(function () {
                                swal({
                                    title: "Lỗi!",
                                    text: res.data.errMessage,
                                    icon: "warning",
                                    button: "OK!",
                                })
                            }, 200);
                        }

                        break;
                    default:
                        break;
                }
            });
    }
    return (
        <div style={{ margin: '60px 0px 0px 0px' }}>
            <Card overflowX={{ xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px" alignItems="Center">
                    <Box mb={{ sm: "8px", md: "0px" }}>
                        <Text fontSize="xl" color={textColor} fontWeight="bold">Khu</Text>
                    </Box>
                    <Box ms="auto" w={{ sm: "unset", md: "unset" }} >
                        <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={(e) => { onOpen(); setNewName(""); setNumber(0); }}>Thêm khu</Button>
                    </Box>

                </CardHeader>
                <CardBody style={{ overflow: "auto" }}>

                    <Table variant="simple" color={textColor} >
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th color="gray.400">
                                    Tên khu
                                </Th>
                                <Th style={{ textAlign: 'center' }} color="gray.400">Số bàn</Th>
                                {/* <Th style={{ textAlign: 'center' }} color="gray.400">Play Times</Th> */}
                                <Th style={{ textAlign: 'center' }} color="gray.400">Cập nhật</Th>
                                <Th style={{ textAlign: 'center' }} color="gray.400">Xóa</Th>

                            </Tr>
                        </Thead>
                        <Tbody>
                            {area.map((data, index) => {
                                return (
                                    <Tr key={index} >
                                        <Td minWidth={{ sm: "200px" }} pl="0px" width="100%" as="button" onClick={() => { goToUpdateAreaPage(data.id) }}>
                                            <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                                <Avatar src={iconUrl} w="50px" borderRadius="12px" me="18px" />
                                                <Flex direction="column">
                                                    <Text
                                                        fontSize="lg"
                                                        color={textColor}
                                                        fontWeight="bold"
                                                        minWidth="100%"
                                                    >
                                                        {data.areaName}
                                                    </Text>

                                                </Flex>
                                            </Flex>
                                        </Td>

                                        <Td style={{ textAlign: 'center' }}>
                                            <Flex direction="column">
                                                <Text fontSize="lg" color={textColor} fontWeight="bold">
                                                    {data.totalTable || "0"}
                                                </Text>
                                            </Flex>
                                        </Td>
                                        {/* <Td style={{ textAlign: 'center' }}>
                                            <Text fontSize="lg" color={textColor} fontWeight="bold">
                                                {data.totalPlay || "0"}
                                            </Text>
                                        </Td> */}
                                        <Td style={{ textAlign: 'center' }}>
                                            <Button colorScheme="green" size="sm" onClick={() => { goToUpdateAreaPage(data.id) }} value={data.id}>Chi tiết</Button>
                                        </Td>
                                        <Td style={{ textAlign: 'center' }}>
                                            <Button colorScheme="red" size="sm" onClick={() => { handleDeleteArea(data.id) }}><i className="fa fa-trash"></i></Button>
                                        </Td>
                                    </Tr>
                                );
                            })}
                            <Modal
                                initialFocusRef={initialRef}
                                isOpen={isOpen}
                                onClose={onClose}
                                isCentered
                            >
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Thêm khu bàn</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <FormControl>
                                            <FormLabel>Tên khu</FormLabel>
                                            <Input
                                                ref={initialRef}
                                                placeholder="Nhập tên khu."
                                                name="newName"
                                                onChange={(e) => { setNewName(e.target.value) }}
                                                value={newName}
                                                type="text"
                                            // pattern={"[0-9]*[.,]?[0-9]"}
                                            // step="0.01"
                                            // min="0"
                                            />

                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Số bàn</FormLabel>
                                            <Input
                                                placeholder="Khoảng 1-20.(để trống để bằng 0)"
                                                name="number"
                                                onChange={(e) => { setNumber(e.target.value) }}
                                                value={(number == 0) ? "" : number}
                                                type="number"
                                                pattern="[0-9]*[.,]?[0-9]"
                                                min="0"
                                                max="20"
                                            />
                                        </FormControl>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button onClick={HandleAddNewArea} colorScheme="blue" mr={3}>
                                            Xác nhận
                                        </Button>
                                        <Button onClick={onClose}>Hủy</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Tbody>
                    </Table>

                </CardBody>
            </Card>
        </div>


    );
}
