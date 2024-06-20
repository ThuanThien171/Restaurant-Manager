import { Link, useHistory, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import React from 'react';
import moment from "moment-timezone";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import DataTableComponent from 'components/Tables/DataTable';

import axios from "axios";
import { Separator } from "components/Separator/Separator";
// Chakra imports
import {
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
    ButtonGroup,
    Flex,
    Select,
    Avatar,
    Table,
    Tbody,
    Grid,
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
} from "@chakra-ui/react";

import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import {
    TimeIcon,
    PlusSquareIcon,
    CopyIcon,
    DragHandleIcon,
    EditIcon,
    WarningTwoIcon
} from "@chakra-ui/icons"

export default function BusinessChart() {
    // Chakra Color Mode
    const textColor = useColorModeValue("gray.700", "white");
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [costData, setCostData] = useState([]);
    const initialRef = React.useRef();

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
        // history.push('/auth/signin/');
    }


    const listYear = Array.from(Array(6).keys())
    let date = new Date();
    //let year = date.getFullYear();
    const [year, setYear] = useState(date.getFullYear());
    //const [barChartData, setBarChartData] = useState({});

    const [state, setState] = useState({
        chartData: [],
        chartOptions: {},
    });

    useEffect(() => {
        getBarChartData(year);
    }, []);
    const getBarChartData = async (yearIn) => {
        const res = await axios.post("/api/getBarChartData", {
            resID: userInfo.restaurantID,
            year: yearIn,
        });
        if (res.data.errCode === 0) {
            setState({
                chartData: [{
                    name: "Doanh thu",
                    group: "sale",
                    data: res.data.data.saleData,
                }, {
                    name: "Chi phí nguyên liệu",
                    group: "Cost",
                    data: res.data.data.materialData
                }, {
                    name: "Chi phí khác",
                    group: "Cost",
                    data: res.data.data.costData,
                }],
                chartOptions: {},
            });
        }
    }


    useEffect(() => {
        getCostData();
    }, [])
    const getCostData = async () => {
        const res = await axios.post("/api/getCostData", { id: userInfo.restaurantID });
        if (res.data.errCode === 0) {
            setCostData(res.data.data);
        }
    }


    const [newCost, setNewCost] = useState({
        restaurantID: userInfo.restaurantID,
        fee: 0,
        costName: "",
    });

    const handleInput = (e) => {
        e.persist();
        setNewCost({ ...newCost, [e.target.name]: e.target.value });
    };

    const addNewCost = async () => {
        if (newCost.costName.trim() == "") {
            swal({
                title: "Lỗi!",
                text: "Thiếu giá trị nhập vào",
                icon: "error",
                button: "OK!",
            });
        } else {
            const res = await axios.post("/api/addNewCost", newCost);
            if (res.data.errCode === 0) {
                setCostData(res.data.data);
                getBarChartData(year);
                swal({
                    title: "Thành công!",
                    text: res.data.errMessage,
                    icon: "success",
                    button: "OK!",
                });

                onClose();
                setNewCost({
                    restaurantID: userInfo.restaurantID,
                    fee: 0,
                    costName: "",
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

    const deleteCost = async (id) => {
        swal("Bạn muốn xóa chi phí này?", {
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
                        const res = await axios.post("/api/deleteCost", { id: id, restaurantID: userInfo.restaurantID });
                        if (res.data.errCode === 0) {
                            setCostData(res.data.data);
                            getBarChartData(year);
                            swal({
                                title: "Ok!",
                                text: "Thành công",
                                icon: "success",
                                button: "OK!",
                            })
                        }
                        break;
                    default:
                        break;
                }
            });
    }

    return (
        <div style={{ margin: '70px 0px 0px 0px' }}>

            <Card overflowX={{ xl: "hidden" }}>

                <Tabs size="sm" colorScheme="cyan" width="100%" variant='enclosed' isFitted >
                    <TabList>
                        <Tab _focus={{ boxShadow: "none", }} >Biểu đồ</Tab>
                        <Tab _focus={{ boxShadow: "none", }} >Chi phí</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel p="0">
                            <CardHeader py="15px">
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    Biểu đồ
                                </Text>

                            </CardHeader>
                            <Separator />
                            <Text fontSize={"sm"} color={"red"} ms="10px"><WarningTwoIcon mb="2px" /> Số liệu chỉ tính đơn đã thanh toán</Text>
                            <CardBody flexDirection={"column"} >
                                <Flex w="100%" flexDirection={"column"} my="30px">
                                    <Flex w="100%" alignItems={"center"} justifyContent={"center"} flexDirection={{ sm: "column", md: "row" }}>
                                        <Text
                                            color={textColor}
                                            fontSize={"lg"}
                                            fontWeight={"semibold"}
                                        >Biểu đồ doanh thu và chi tiêu theo tháng trong năm: </Text>
                                        <Select
                                            _focus={{ boxShadow: "none" }}
                                            w="80px"
                                            size="sm"
                                            name="role"
                                            fontWeight={"semibold"}
                                            defaultValue={year}
                                            onChange={(e) => { setYear(e.target.value); getBarChartData(e.target.value); }}
                                        >
                                            {listYear.map((data, index) => {
                                                return (
                                                    <option value={date.getFullYear() - data} >{date.getFullYear() - data}</option>
                                                );
                                            })}


                                        </Select>
                                    </Flex>
                                    <BarChart restaurantID={userInfo.restaurantID} chartData={state.chartData} />
                                </Flex>
                                <Separator />

                                {/* <LineChart restaurantID={userInfo.restaurantID} /> */}
                                <DataTableComponent/>

                            </CardBody>
                        </TabPanel>
                        <TabPanel p="0">
                            <CardHeader py="15px" alignItems="Center" justifyContent="space-between">
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    Chi phí
                                </Text>
                                <Button colorScheme="blue" onClick={() => { onOpen(); }}>Thêm chi phí
                                </Button>

                            </CardHeader>
                            <Separator />
                            <CardBody flexDirection={"column"} >
                                {costData.map((data, index) => {
                                    return (

                                        <Flex p=".3rem" w="100%" m="4px 0px"
                                            flexDirection={{ md: "row", sm: "column" }}
                                            alignItems={"center"}
                                            justifyContent={"space-between"}
                                            style={{ border: "1px solid #38B2AC" }}
                                            borderRadius="10px"
                                            key={index}
                                            id={data.id}
                                        >
                                            <Flex flexWrap={"wrap"} alignItems={"center"} h="100%" m="0px 20px">
                                                <Flex flexDirection={"column"} m="5px 20px" minW={"250px"}>
                                                    <Text color={textColor} fontSize={"sm"} fontWeight={"semibold"}>
                                                        {moment(data.createdAt).tz("Asia/Ho_Chi_Minh").format('ddd, D-M-YYYY, H:mm')}
                                                    </Text>
                                                    <Text color={textColor} fontSize={"lg"} fontWeight={"semibold"}>Tên chi phí: {data.costName}</Text>
                                                </Flex>
                                                <Flex flexDirection={"column"} m="5px 20px">

                                                    <Text color={textColor} fontSize={"md"} fontWeight={"nomal"}>
                                                        Chi phí: {Number(data.fee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', })}
                                                    </Text>

                                                </Flex>
                                            </Flex>
                                            <Flex m={"5px"} w="unset" me={{ sm: "5px", md: "25px" }}>
                                                <Button colorScheme="red" m={"0px 5px"} w="110px"
                                                    onClick={() => { deleteCost(data.id) }}
                                                ><i className="fa fa-trash fa-sm" style={{ marginRight: "5px" }}></i> Xóa</Button>

                                            </Flex>
                                        </Flex>

                                    );

                                })}
                            </CardBody>
                            <Modal
                                initialFocusRef={initialRef}
                                isOpen={isOpen}
                                onClose={onClose}
                                isCentered
                            >
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Thêm chi phí</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={7}>
                                        <FormControl>
                                            <FormLabel>Tên chi phí</FormLabel>
                                            <Input
                                                ref={initialRef}
                                                placeholder="Nhập tên chi phí."
                                                name="costName"
                                                onChange={handleInput}
                                                //value={newCost.costName}
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Chi chí</FormLabel>
                                            <Input
                                                placeholder="Đơn vị Vnd."
                                                name="fee"
                                                onChange={handleInput}
                                                //value={newCost.fee}
                                                //defaultValue={""}
                                                type="number"
                                                pattern="[0-9]"
                                                required={true}
                                            />
                                        </FormControl>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme="blue" mr={3} onClick={addNewCost}>
                                            OK
                                        </Button>
                                        <Button onClick={onClose}>Hủy</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </TabPanel>
                    </TabPanels>
                </Tabs>



            </Card>
        </div>


    );
}
