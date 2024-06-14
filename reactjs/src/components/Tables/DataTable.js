import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

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

import axios from "axios";

const columns = [
	{
		name: 'Món',
		selector: row => row.menuName,
		sortable: true,
	},
    {
		name: 'Giá',
		selector: row => Number(row.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }),
		sortable: true,
	},
	{
		name: 'Số lượng đã bán',
		selector: row => row.totalNumber?row.totalNumber : 0,
		sortable: true,
	},
    {
		name: 'Tổng',
		selector: row => Number(row.totalNumber*row.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }),
		sortable: true,
	},
];

const data = [
  	{
		id: 1,
		title: 'Beetlejuice',
		year: '1988',
	},
	{
		id: 2,
		title: 'Ghostbusters',
		year: '1984',
	},
]

export default function DataTableComponent() {
    const textColor = useColorModeValue("gray.700", "white");

    const [tableData, setTableDate] = useState([]);

    let date = new Date();
    let month = date.getMonth()+1;
    let day = date.getDate();
    const [fromDate,setFromDate] = useState(`${date.getFullYear()}-${month<10?`0${month}`: month}-01`)
    const [toDate,setToDate] = useState(`${date.getFullYear()}-${month<10?`0${month}`: month}-${day<10?`0${day}`: day}`)

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;

    const getDataTable = async (start,end) =>{
        const res = await axios.post("/api/getDataTable", { 
            resID: userInfo.restaurantID,
            fromDate: start?start:fromDate,
            toDate: end?end:toDate
        });
		if (res.data.errCode === 0) {
			setTableDate(res.data.data);
		}
    }

    useEffect(()=>{
        getDataTable();
    },[])

	return (
        <>
        <Flex w="100%" alignItems={"center"} justifyContent={"center"} flexDirection='row' flexWrap={'wrap'}>
            <Text
                color={textColor}
                fontSize={"lg"}
                fontWeight={"semibold"}
                marginRight={'5px'}
            >Bảng thống kê kinh doanh từ </Text>
            <input type='date' value={fromDate} 
            style={{width: '120px'}}
            onChange={ async (e)=> {
                setFromDate(e.target.value);
                getDataTable(e.target.value,null)
            }}/>
            <Text
                color={textColor}
                fontSize={"lg"}
                fontWeight={"semibold"}
                marginX={'5px'}
            > đến</Text>
            <input type='date' value={toDate} 
            style={{width: '120px'}}
            onChange={(e)=> {
                setToDate(e.target.value);
                getDataTable(null,e.target.value)
            }}/>
        </Flex>
		<DataTable
			columns={columns}
			data={tableData}
            responsive
            pagination
		/>
        </>
	);
};