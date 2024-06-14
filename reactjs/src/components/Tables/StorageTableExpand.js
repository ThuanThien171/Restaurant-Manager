import { useEffect, useState } from "react";
import axios from "axios";
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
    TabIndicator,
    border,
} from "@chakra-ui/react";


export default function StorageTableExpand(props) {
    const {id, date, measure} = props;
    const [materialImported, setMaterialImported] = useState([]);
    const [materialUsed, setMaterialUsed] = useState([]);

    const textColor = useColorModeValue("gray.700", "white");



    useEffect(() => {
        getImportedInDay();
        getUsedInDay();
    }, [])

    const getImportedInDay = async () => {
        const res = await axios.post("/api/getImportedInDay", { id, date });
        if (res.data.errCode === 0) {
            setMaterialImported(res.data.importedData);
        }
    }
    const getUsedInDay = async () => {
        const res = await axios.post("/api/getUsedInDay", { id, date });
        if (res.data.errCode === 0) {
            setMaterialUsed(res.data.materials);
        }
    }

    return(
        <>
            <Tabs size="sm" width="100%" paddingY={'20px'} variant='unstyled'>
                        <TabList>
                            <Tab fontSize={'12px'} style={{outline: 'none', boxShadow: 'none'}}
                            >Nhập vào</Tab>
                            <Tab fontSize={'12px'} style={{outline: 'none', boxShadow: 'none'}}
                            >Tiêu hao</Tab>
                        </TabList>
                        <TabIndicator mt='-1.5px' height='2px' bg='black' borderRadius='1px' />
                        <TabPanels>
                            <TabPanel>
                                <Table variant="simple" color={textColor}>
                                    <Thead>
                                        <Tr my=".8rem" pl="0px" color="gray.400">
                                            <Th color="gray.400" textTransform="none">Thời gian</Th>
                                            <Th color="gray.400" textTransform="none">Lượng nhập</Th>
                                            <Th color="gray.400" textTransform="none">Chi phí</Th>
                                            <Th color="gray.400" textTransform="none">Ghi chú</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {materialImported.map((data, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Td minWidth={{ sm: "100px" }}>
                                                        <Flex align="center" py=".8rem" minWidth="100%" >
                                                            <Text
                                                                fontSize="sm"
                                                                color={textColor}
                                                                minWidth="100%"
                                                                fontWeight="bold"
                                                            >
                                                            {data.time}
                                                            </Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Flex alignItems={'center'} flexWrap={'wrap'}>
                                                            <Text fontSize="sm" fontWeight="bold">{Number(data.importValue).toLocaleString('vi-VN') || 0} {measure}</Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" fontWeight="bold">{Number(data.materialCost).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" fontWeight="light">{data.note || "..."}</Text>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}

                                    </Tbody>
                                </Table>
                            </TabPanel>
                            <TabPanel>
                                <Table variant="simple" color={textColor} >
                                    <Thead>
                                        <Tr my=".8rem" pl="0px" color="gray.400">
                                            <Th color="gray.400" textTransform="none">Thời gian</Th>
                                            <Th color="gray.400" textTransform="none">Món</Th>
                                            <Th color="gray.400" textTransform="none">Sử dụng/món</Th>
                                            <Th color="gray.400" textTransform="none">Số lượng</Th>
                                            <Th color="gray.400" textTransform="none">Tổng</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {materialUsed.map((data, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Td minWidth={{ sm: "100px" }}>
                                                        <Flex align="center" py=".8rem" minWidth="100%" >
                                                            <Text
                                                                fontSize="sm"
                                                                color={textColor}
                                                                minWidth="100%"
                                                                fontWeight="bold"
                                                            >
                                                            {data.time}
                                                            </Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" fontWeight="bold">{data.menuName}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Flex alignItems={'center'} flexWrap={'wrap'}>
                                                            <Text fontSize="sm" fontWeight="bold">{Number(-data.value/data.num).toLocaleString('vi-VN') || 0} {measure}</Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Flex alignItems={'center'} flexWrap={'wrap'}>
                                                            <Text fontSize="sm" fontWeight="bold">{Number(data.num).toLocaleString('vi-VN') || 0}</Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Flex alignItems={'center'} flexWrap={'wrap'}>
                                                            <Text fontSize="sm" fontWeight="bold">{Number(-data.value).toLocaleString('vi-VN') || 0} {measure}</Text>
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
        </>
    );
}