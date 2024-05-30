import { Link, useHistory, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select, { MultiValue } from 'react-select';
import axios from "axios";
// Chakra imports
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Icon,
    Avatar,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    Tfoot,
    Td,
    Input,
    TableCaption,
    useColorMode,
    FormControl,
    FormLabel,
    // Select,
    FormErrorMessage,
    FormHelperText,
    useColorModeValue,
    Center,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { uploadSongImage } from '../../../../firebase/uploadMp3Image';
import swal from "sweetalert";


function AddMenu() {
    const history = useHistory();
    const textColor = useColorModeValue("gray.700", "white");

    const [material, setMaterial] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [menuName, setMenuName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [cost, setCost] = useState([]);


    const [isLoading, setIsLoading] = useState(false);
    const imgUrlUndefinded = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2FMenu%2Fundefined?"

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
    }

    //Get materials
    useEffect(() => {
        getAllMaterialInfo();
    }, [])
    const getAllMaterialInfo = async () => {
        const res = await axios.post("/api/getMaterial", { id: userInfo.restaurantID });
        if (res.data.errCode === 0) {
            setMaterial(res.data.materials);
        }
    }

    //Handle back button
    const goToMenuPage = () => {
        history.push('/remat/manage-menu');
    }

    //Handle upload song
    const handleUploadMenu = async () => {
        setIsLoading(true);
        const imageUrl = "";
        if (menuName.trim() != '' && price >= 0) {
            if (image != "") {
                const imageUrl2 = await uploadSongImage(image); //Get url from 
                if (!imageUrl2.includes(imgUrlUndefinded)) {
                    await addNewSongToDataBase(imageUrl2);

                } else {
                    swal({
                        title: "Lỗi!",
                        text: "Thêm ảnh thất bại",
                        icon: "warning",
                        button: "OK!",
                    })
                }
            } else {
                await addNewSongToDataBase(imageUrl);

            }
        } else {
            swal({
                title: "Lỗi!",
                text: "Tên món hoặc giá không hợp lệ",
                icon: "warning",
                button: "OK!",
            });
            setIsLoading(false);
        }
    }

    // let durationConvert = "";
    const addNewSongToDataBase = async (imageUrl) => {

        const data = {
            restaurantID: userInfo.restaurantID,
            menuName: menuName,
            image: imageUrl,
            status: 1,
            price: price,
            costData: selectedMaterial

        };
        //Add new song to database
        console.log(data);
        const res = await axios.post('/api/postNewMenu', data);
        if (res.data.errCode === 0) {
            setIsLoading(false);
            swal({
                title: "Thành công!",
                text: "Thêm món thành công",
                icon: "success",
                button: "OK!",
            })
                .then((value) => {
                    return (<Redirect to={'/remat/manage-menu'} />);
                    //history.push('/remat/manage-menu');
                });

        } else {
            swal({
                title: "Lỗi!",
                text: res.data.errMessage,
                icon: "error",
                button: "OK!",
            })
            setIsLoading(false);
        }


    }
    return (
        <div style={{ margin: '60px 0px 0px 0px' }} >
            <Card overflowX={{ xl: "hidden" }} >
                <CardHeader p="6px 0px 22px 0px" alignItems="Center">
                    <Box mb={{ sm: "8px", md: "0px" }}>
                        <Text fontSize="2xl" color={textColor} fontWeight="bold">Món mới</Text>
                    </Box>
                    <Box ms="auto" w={{ sm: "unset", md: "unset" }} >
                        <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={goToMenuPage}>Trở lại</Button>
                    </Box>
                </CardHeader>
                <CardBody>
                    <FormControl>
                        <Text fontSize="md" mb="8px" fontWeight="semibold">Tên món:</Text>
                        <Input
                            value={menuName}
                            onChange={(e) => { setMenuName(e.target.value) }}
                            placeholder="Nhập tên món mới"
                        />
                        <br /><br />
                        <FormLabel fontWeight="semibold">Nguyên liệu:</FormLabel>

                        <Select
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti
                            isClearable
                            isSearchable
                            onChange={(e) => {
                                setSelectedMaterial(Array.isArray(e) ? e.map((x) => x) : []);
                            }}
                            placeholder="Chọn nguyên liệu"
                            options={material}
                        >

                        </Select>
                        <br />
                        {(selectedMaterial != "") &&
                            <FormLabel>Lượng nguyên liệu dùng cho mỗi món:</FormLabel>}
                        {selectedMaterial
                            && selectedMaterial.map((data, index) => {
                                return (
                                    <Flex key={index} w={{ sm: "unset", md: "unset" }} alignItems="center" style={{ margin: "20px 0px" }}>
                                        <Text minWidth="80px" style={{ margin: "5px 20px 5px 20px" }} fontWeight="semibold" >{data.label}:</Text>
                                        <Input

                                            //value={data.costValue}
                                            onChange={(e) => { data.costValue = e.target.value; data.costValue = parseFloat(data.costValue); }}
                                            placeholder="Nhập lượng nguyên liệu"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                        />
                                        <Text minWidth="80px" style={{ margin: "5px 20px 5px 20px" }} fontWeight="semibold">Đơn vị: {data.measure}</Text>
                                    </Flex>
                                )
                            })
                        }
                        <br />
                        <FormLabel fontWeight="semibold">Giá:</FormLabel>
                        <Input
                            defaultValue=""
                            //value={price}
                            onChange={(e) => { setPrice(e.target.value) }}
                            placeholder="Nhập giá món mới"
                            type="number"
                            min="0"

                        />
                        <br /> <br />

                        <FormLabel fontWeight="semibold">Ảnh món:</FormLabel>
                        <Flex
                            align="center"
                            w="100%"
                            // justifyContent="center"
                            py="10px"
                            mx={{ lg: "1rem" }}

                        >
                            <Flex mb={{ sm: "8px", md: "0px" }} maxWidth="0px">
                                <input
                                    id="file"
                                    type="file"
                                    accept="image/*"
                                    style={{ visibility: "hidden" }}
                                    onChange={(e) => { setImage(e.target.files[0]) }}
                                /></Flex>
                            <Flex ms="ltr" w={{ sm: "unset", md: "unset" }} alignItems="center">
                                <label for="file"
                                    style={{
                                        padding: "5px",
                                        "font-size": "1em",
                                        "font-weight": "700",
                                        "color": "white",
                                        "background-color": "darkcyan",
                                        "display": "inline-block",
                                        "cursor": "pointer",
                                        "border-radius": "10px",
                                        "min-width": "86px"
                                    }}
                                >Thêm ảnh</label>
                                {(image != "") &&

                                    <text style={{ "marginLeft": "5px", "word-break": "break-all" }} >{image.name}</text>
                                }
                            </Flex>
                        </Flex>

                        <br /><br />
                        <Button style={{ 'borderRadius': "5px" }} colorScheme="blue" onClick={handleUploadMenu} isLoading={isLoading}>Xác nhận
                        </Button>
                    </FormControl>
                </CardBody>
            </Card>
        </div >
    );
}

export default AddMenu