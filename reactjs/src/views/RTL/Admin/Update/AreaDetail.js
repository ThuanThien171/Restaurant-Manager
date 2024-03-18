import { Link, useHistory, useParams, Redirect } from "react-router-dom";
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
    Icon,
    Text,
    Th,
    Input,
    Thead,
    Tr,
    Tfoot,
    Td,
    TableCaption,
    useColorMode,
    useDisclosure,
    FormControl,
    FormLabel,
    Select,
    FormErrorMessage,
    FormHelperText,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton


} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";


function AreaDetail() {
    const history = useHistory();
    const textColor = useColorModeValue("gray.700", "white");
    const [areaCurrentName, getAreaCurrentName] = useState('');
    const [newName, setNewName] = useState('');
    const { id } = useParams();

    const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2Ftable.PNG?alt=media&token=5c49e9ba-9df2-4a03-94a8-b1aed269d10b";

    const dispatch = useDispatch();

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;

    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
    }

    const [table, getTable] = useState([]);
    const [tableUpdateId, getTableUpdateId] = useState(0);
    const [route, setRoute] = useState(0);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    //Get current area update
    useEffect(() => {
        getCurrentAreaUpdate();
    }, [])
    const getCurrentAreaUpdate = async () => {
        const data = {
            id: id
        }
        const res = await axios.post("/api/getOneAreaInfo", data);
        if (res.data.errCode === 0) {
            getAreaCurrentName(res.data.areaName);
            getTable(res.data.tables);
        }
    }

    //Handle back button
    const goToManageAreaPage = () => {
        history.push('/resmat/manage-area');
    }

    //Handle update album
    const handleChange = async () => {
        if (!newName.trim()) {
            swal({
                title: "Lỗi!",
                text: "Thiếu giá trị nhập vào",
                icon: "warning",
                button: "OK!",
            });
        } else {
            switch (route) {
                case 1:
                    const res1 = await axios.post("/api/addTable",
                        {
                            areaID: id,
                            tableName: newName,
                        });
                    //change password state
                    if (res1.data.errCode === 0) {

                        getTable(res1.data.tables);
                        swal({
                            title: "Thành công!",
                            text: "thêm bàn thành công",
                            icon: "success",
                            button: "OK!",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res1.data.errMessage,
                            icon: "error",
                            button: "OK!",
                        });
                    }
                    break;
                case 2:
                    const res2 = await axios.post("/api/changeNameArea", { id: id, name: newName, resID: userInfo.restaurantID });
                    //Update state
                    if (res2.data.errCode === 0) {
                        getAreaCurrentName(newName);
                        swal({
                            title: "Thành công!",
                            text: "Đổi tên thành công",
                            icon: "success",
                            button: "OK!",
                        });
                    } else {
                        swal({
                            title: "Lỗi!",
                            text: res2.data.errMessage,
                            icon: "warning",
                            button: "OK!",
                        })
                    }
                    break;
                case 3:
                    const res3 = await axios.post("/api/changeNameTable", { id: tableUpdateId, name: newName, areaID: id });
                    //change password state
                    if (res3.data.errCode === 0) {

                        getTable(res3.data.tables);
                        swal({
                            title: "Thành công!",
                            text: "Đổi tên thành công",
                            icon: "success",
                            button: "OK!",
                        });
                    } else {
                        swal({
                            title: "Lỗi!",
                            text: res3.data.errMessage,
                            icon: "error",
                            button: "OK!",
                        });
                    }

                    break;
                default:
                    break;
            }

        }
        onClose();
        getTableUpdateId(0);
        setRoute(0);

    }

    const handleDeleteTable = async (tableID) => {

        swal("Bạn muốn xóa bàn này?", {
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
                        const res = await axios.post("/api/deleteTable", { id: tableID });
                        if (res.data.errCode === 0) {
                            setTimeout(function () {
                                swal({
                                    title: "Thành công!",
                                    text: "Xóa thành công",
                                    icon: "success",
                                    button: "OK!",
                                })
                            }, 200);
                            // thisClicked.closest("tr").remove();
                            getTable(table.filter((item) => item.id != tableID));
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
        <div style={{ margin: '60px 0px 0px 0px' }} >
            <Card overflowX={{ xl: "hidden" }} >
                <CardHeader p="6px 0px 22px 0px" alignItems="Center">
                    <Box mb={{ sm: "8px", md: "0px" }}>
                        <Text fontSize="2xl" color={textColor} fontWeight="bold">
                            {areaCurrentName}
                        </Text>
                    </Box>
                    <Box ms="auto" w={{ sm: "unset", md: "unset" }} alignItems="Center">
                        <Button style={{ margin: "10px 10px 10px 20px" }} colorScheme="teal" onClick={(e) => { onOpen(); setRoute(1); setNewName(""); }}>Thêm bàn</Button>
                        <Button style={{ margin: "10px 10px 10px 20px" }} colorScheme="teal" onClick={(e) => { onOpen(); setRoute(2); setNewName(""); }}>Đổi tên khu</Button>
                        <Button style={{ margin: "10px 10px 10px 20px", borderRadius: "5px" }} colorScheme="blue" onClick={goToManageAreaPage}>Back</Button>
                    </Box>
                </CardHeader>
                <CardBody style={{ overflow: "auto" }}>
                    <Table variant="simple" color={textColor} width="100%" >
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th color="gray.400">
                                    Tên bàn
                                </Th>
                                {/* <Th color="gray.400">FullName</Th> */}
                                {/* <Th color="gray.400">Name</Th> */}
                                <Th color="gray.400">Trạng thái</Th>
                                <Th color="gray.400">Cập nhật</Th>
                                <Th color="gray.400">Xóa</Th>

                            </Tr>
                        </Thead>
                        <Tbody >
                            {table.map((data, index) => {
                                return (
                                    <Tr key={index} backgroundColor={(data.status == 1) && "#e9e9e9"}>
                                        <Td minWidth={{ sm: "200px", md: "100%" }} pl="0px" >
                                            <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                                <Avatar src={iconUrl} w="50px" borderRadius="12px" me="18px" />
                                                <Flex direction="column">
                                                    <Text
                                                        fontSize="lg"
                                                        color={textColor}
                                                        fontWeight="bold"
                                                        minWidth="100%"
                                                    >
                                                        {data.tableName}
                                                    </Text>
                                                    {/* <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                                        {data.userName}
                                                    </Text> */}
                                                </Flex>
                                            </Flex>
                                        </Td>

                                        <Td>
                                            <Flex direction="column">
                                                {data.status == 0 &&
                                                    <Text fontSize="lg" color="orange" fontWeight="bold">
                                                        Trống
                                                    </Text>
                                                }
                                                {data.status == 1 &&
                                                    <Text fontSize="lg" color="green" fontWeight="bold">
                                                        Đang dùng
                                                    </Text>
                                                }
                                            </Flex>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="green" size="sm" onClick={() => { onOpen(); getTableUpdateId(data.id); setRoute(3); setNewName(""); }} value={data.id}>Đổi tên</Button>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="red" size="sm" onClick={() => { handleDeleteTable(data.id) }}><i className="fa fa-trash"></i></Button>
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
                                    <ModalHeader>Nhập tên</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <Input type="text" value={newName} onChange={(e) => { setNewName(e.target.value) }} />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button onClick={handleChange} colorScheme="blue" mr={3}>
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
        </div >
    );
}

export default AreaDetail