import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { IoDocumentsSharp } from "react-icons/io5";
import swal from "sweetalert";
import moment from "moment-timezone";
import {
    TimeIcon,
    PlusSquareIcon,
    CopyIcon,
    DragHandleIcon,
    EditIcon,
    WarningTwoIcon
} from "@chakra-ui/icons"

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
    FormControl,
    FormLabel,
    Select,
    FormErrorMessage,
    FormHelperText,
    useColorModeValue,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    border,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

function MaterialDetail() {

    const history = useHistory();
    const textColor = useColorModeValue("gray.700", "white");
    const { id } = useParams();

    const [materialImported, setMaterialImported] = useState([]);
    const [materialUsed, setMaterialUsed] = useState([]);

    const [name, setName] = useState('');
    const [measure, setMeasure] = useState('');

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
        // history.push('/auth/signin/');
    }

    //Get current material detail
    useEffect(() => {
        getMaterialInfo();
        getUsedInfo();
    }, [])
    const getMaterialInfo = async () => {
        const res = await axios.post("/api/getImportedInfo", { id: id });
        if (res.data.errCode === 0) {
            setMaterialImported(res.data.importedData);

            setName(res.data.material);
            setMeasure(res.data.measure);
        }
    }
    const getUsedInfo = async () => {
        const res = await axios.post("/api/getUsedMaterial", { id: id });
        if (res.data.errCode === 0) {
            setMaterialUsed(res.data.materials);

        }
    }


    //Handle back button
    const goToManageStorage = () => {
        history.push('/remat/manage-storage');
    }

    const handleDeleteImported = (id) => {

        swal("Bạn muốn xóa bản ghi này?", {
            buttons: {
                cancel: "Không",
                catch: {
                    text: "Đúng",
                    value: "catch",
                },
            },
        })
            .then((value) => {
                switch (value) {
                    case "cancel":
                        break;
                    case "catch":
                        axios.post("/api/deleteImported", { id: id });
                        setTimeout(function () {
                            swal({
                                title: "Success!",
                                text: "Xóa thành công",
                                icon: "success",
                                button: "OK!",
                            })
                        }, 200);
                        setMaterialImported(materialImported.filter((item) => item.id != id));

                        // window.location.reload();
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
                        <Text fontSize="2xl" color={textColor} fontWeight="bold">{name}</Text>
                    </Box>
                    <Box ms="auto" w={{ sm: "100%", md: "unset" }} >
                        <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={goToManageStorage}>Back
                        </Button>
                    </Box>

                </CardHeader>
                <CardBody style={{ overflow: "auto" }}>
                    <Tabs size="sm" colorScheme="cyan" width="100%" variant='enclosed' isFitted>
                        <TabList>
                            <Tab _focus={{ boxShadow: "none", }} >Nhập vào</Tab>
                            <Tab _focus={{ boxShadow: "none", }}>Tiêu hao</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Table variant="simple" color={textColor} >
                                    <Thead>
                                        <Tr my=".8rem" pl="0px" color="gray.400">
                                            <Th color="gray.400">Ngày nhập</Th>
                                            <Th color="gray.400">Lượng nhập</Th>
                                            <Th color="gray.400">Chi phí</Th>
                                            <Th color="gray.400">Ghi chú</Th>
                                            <Th color="gray.400">Xóa</Th>

                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {materialImported.map((data, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Td minWidth={{ sm: "120px" }} pl="0px">
                                                        <Flex align="center" py=".8rem" minWidth="100%" >

                                                            <Flex direction="column">
                                                                <Text
                                                                    fontSize="lg"
                                                                    color={textColor}

                                                                    minWidth="100%"
                                                                >
                                                                    {moment(data.createdAt).tz("Asia/Ho_Chi_Minh").format('D-M-YYYY, h:mm:ss a')}
                                                                </Text>

                                                            </Flex>
                                                        </Flex>
                                                    </Td>
                                                    <Td maxWidth={{ sm: "100px" }}>
                                                        <Flex direction="column" style={{ 'align-items': ' center', 'flex-direction': 'row' }}>

                                                            <Text fontSize="lg" color="orange.600" fontWeight="bold">{Number(data.importValue).toLocaleString('vi-VN') || 0}</Text>
                                                            <Text fontSize="lg" style={{ margin: "5px 5px 5px 5px" }} >{measure}</Text>

                                                        </Flex>
                                                    </Td>
                                                    <Td maxWidth={{ sm: "100px" }}>
                                                        <Flex direction="column">
                                                            <Text fontSize="lg" color="orange.600" fontWeight="bold">{Number(data.materialCost).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}</Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td minWidth={{ sm: "200px" }}>
                                                        <Flex direction="column">
                                                            <Text fontSize="lg" color={data.type == 0 ? textColor : "red.500"} fontWeight="light">{data.note || "..."}</Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Button colorScheme="red" size="sm" onClick={() => { handleDeleteImported(data.id) }}><i className="fa fa-trash"></i></Button>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}

                                    </Tbody>
                                </Table>
                            </TabPanel>
                            <TabPanel>
                                <Text fontSize={"sm"} color={"red"} ms="10px"><WarningTwoIcon mb="2px" /> Số liệu không tính những đơn đã hủy</Text>
                                <Table variant="simple" color={textColor} >
                                    <Thead>
                                        <Tr my=".8rem" pl="0px" color="gray.400">
                                            <Th color="gray.400">Món</Th>
                                            <Th color="gray.400">Số lượng</Th>
                                            <Th color="gray.400">Tổng tiêu hao</Th>
                                            {/* <Th color="gray.400">Xóa</Th> */}

                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {materialUsed.map((data, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Td minWidth={"200px"} pl="0px">
                                                        <Flex align="center" py=".8rem" minWidth="100%" >

                                                            <Flex direction="column">
                                                                <Text
                                                                    fontSize="lg"
                                                                    color={textColor}
                                                                    fontWeight={"semibold"}
                                                                    minWidth="100%"
                                                                >
                                                                    {data.menuName}
                                                                </Text>
                                                                <Text
                                                                    fontSize="sm"
                                                                    color={textColor}

                                                                    minWidth="100%"
                                                                >
                                                                    Lượng hao mỗi món: {data.costValue} {measure}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </Td>
                                                    <Td minWidth={{ sm: "200px" }}>
                                                        <Text fontSize="lg" color="orange.600" fontWeight="bold">{data.totalNumber || 0}</Text>

                                                    </Td>

                                                    <Td minWidth={{ sm: "200px" }} alignItems={"center"}>
                                                        <Flex direction="row">
                                                            <Text fontSize="lg" color={textColor} fontWeight="light" m="5px">{Number(data.costValue * data.totalNumber).toFixed(2) || 0}</Text>
                                                            <Text fontSize="lg" style={{ margin: "5px 0" }} >{measure}</Text>
                                                        </Flex>
                                                    </Td>
                                                    {/* <Td>
                                                        <Button colorScheme="red" size="sm" onClick={() => { handleDeleteImported(data.id) }}><i className="fa fa-trash"></i></Button>
                                                    </Td> */}
                                                </Tr>
                                            );
                                        })}

                                    </Tbody>
                                </Table>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>


                </CardBody>
            </Card>
        </div >
    );
}

export default MaterialDetail