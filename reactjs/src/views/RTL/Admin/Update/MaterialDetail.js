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
import StorageTableComponent from "components/Tables/StorageTable";

function MaterialDetail() {

    const history = useHistory();
    const textColor = useColorModeValue("gray.700", "white");
    const { id } = useParams();

    const [materialImported, setMaterialImported] = useState([]);
    const [name, setName] = useState('');
    const [measure, setMeasure] = useState('');

    let date = new Date();
    let month = date.getMonth()+1;
    let day = date.getDate();
    const [fromDate,setFromDate] = useState(`${date.getFullYear()}-${month<10?`0${month}`: month}-01`)
    const [toDate,setToDate] = useState(`${date.getFullYear()}-${month<10?`0${month}`: month}-${day<10?`0${day}`: day}`)

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
        // history.push('/auth/signin/');
    }

    //Get current material detail
    useEffect(() => {
        getMaterialInfo();
    }, [])
    const getMaterialInfo = async () => {
        const res = await axios.post("/api/getImportedInfo", { id: id });
        if (res.data.errCode === 0) {
            setMaterialImported(res.data.importedData);
            setName(res.data.material);
            setMeasure(res.data.measure);
        }
    }

    //Handle back button
    const goToManageStorage = () => {
        history.push('/remat/manage-storage');
    }

    return (
        <div style={{ margin: '60px 0px 0px 0px' }}>
            <Card overflowX={{ xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px" alignItems="Center">
                    <Flex mb={{ sm: "8px", md: "0px" }} w='100%' justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize="2xl" color={textColor} fontWeight="bold">{name}</Text>

                        <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={goToManageStorage}>Back
                        </Button>
                    </Flex>

                </CardHeader>
                <CardBody style={{ overflow: "auto" , display: 'flex', 'flex-direction': 'column'}}>
                    <Flex w="100%" alignItems={"center"} justifyContent={"center"} flexDirection='row' flexWrap={'wrap'} marginBottom={'30px'}>
                        <Text
                            color={textColor}
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                            marginRight={'5px'}
                        >Bảng thống kê nguyên liệu từ </Text>
                        <input type='date' value={fromDate} 
                        style={{width: '120px'}}
                        onChange={ async (e)=> {
                            setFromDate(e.target.value);
                            //getDataTable(e.target.value,null)
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
                            //getDataTable(null,e.target.value)
                        }}/>
                    </Flex>

                    <StorageTableComponent id={id} measure={measure} materialImported={materialImported}/>
                </CardBody>
            </Card>
        </div >
    );
}

export default MaterialDetail