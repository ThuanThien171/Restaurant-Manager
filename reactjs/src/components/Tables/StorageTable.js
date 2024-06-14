import DataTable, { createTheme } from 'react-data-table-component';
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
    background,
} from "@chakra-ui/react";

import axios from "axios";
import StorageTableExpand from './StorageTableExpand';



export default function StorageTableComponent(props) {
    const {id, materialImported, measure} = props;

    const columns = [
        {
            name: 'Ngày',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Nhập vào',
            selector: row => `${+parseFloat(row.importedValue).toFixed(2)} ${measure}`,
            sortable: true,
        },
        {
            name: 'Chi phí',
            selector: row => Number(row.materialCost).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }),
            sortable: true,
        },
        {
            name: 'Sử dụng',
            selector: row => `${+parseFloat(-row.usedValue).toFixed(2)} ${measure}`,
            sortable: true,
        },
        {
            name: 'Còn lại',
            selector: row => `${+parseFloat(row.baseValue - row.diffValue).toFixed(2)} ${measure}`,
            sortable: true,
        },
        {
            name: 'Thực tế',
            selector: row => `${+parseFloat(row.baseValue).toFixed(2)} ${measure}`,
            sortable: true,
        },
        {
            name: 'Chênh lệnh',
            selector: row => (row.diffValue > 0) 
                // ? `Thừa ${+parseFloat(row.diffValue).toFixed(2)} ${measure}`
                // :(row.diffValue < 0) 
                // ? `Thiếu ${+parseFloat(-row.diffValue).toFixed(2)} ${measure}`
                ? `${+parseFloat(row.diffValue).toFixed(2)} ${measure}`
                :(row.diffValue < 0) 
                ? `-${+parseFloat(-row.diffValue).toFixed(2)} ${measure}`
                : 0,
            sortable: true,
        },
    ];

    const ExpandedComponent = ({ data }) => <StorageTableExpand id={id} date={data.date} measure={measure}/>
    //<pre>{id}--{JSON.stringify(data)}</pre>;

    const customStyles = {
        rows: {
            style: {
                background: '#e7e7ee', // override the row height
            },
        },
    };

	return (
        <>
        
		<DataTable
			columns={columns}
			data={materialImported}
            responsive
            pagination
            expandableRows
            expandOnRowClicked
			expandableRowsComponent={ExpandedComponent}
            customStyles={customStyles}
		/>
        </>
	);
};