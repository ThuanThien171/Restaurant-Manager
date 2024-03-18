import { Link, useHistory, Redirect, useParams } from "react-router-dom";
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
    Image,
    Switch
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { uploadSongImage } from '../../../../firebase/uploadMp3Image';
import swal from "sweetalert";


function MenuDetail() {
    const history = useHistory();
    const textColor = useColorModeValue("gray.700", "white");

    const [material, setMaterial] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [menuName, setMenuName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [newImage, setNewImage] = useState('');
    const { id } = useParams();
    const [newName, setNewName] = useState('');

    const [menuID, setMenuID] = useState(0);
    const [status, setStatus] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const imgUrlUndefinded = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2FMenu%2Fundefined?"

    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
    }

    //Get materials
    useEffect(() => {
        getMaterialList();
        getMenuDetail();
    }, [])
    const getMenuDetail = async () => {
        const res = await axios.post("/api/getMenuDetail", { id: id });
        if (res.data.errCode === 0) {
            setSelectedMaterial(res.data.data);
            setMenuName(res.data.menu.menuName);
            setNewName(res.data.menu.menuName);
            setPrice(res.data.menu.price);
            setImage(res.data.menu.image);
            (res.data.menu.status == 2) ? setStatus(0) : setStatus(res.data.menu.status);

            setMenuID(res.data.menu.id);
        }
    }
    const getMaterialList = async () => {
        const res = await axios.post("/api/getMaterial", { id: userInfo.restaurantID });
        if (res.data.errCode === 0) {
            setMaterial(res.data.materials);
        }
    }

    //Handle back button
    const goToMenuPage = () => {
        history.push('/resmat/manage-menu');
    }

    const handleUploadMenu = async () => {
        setIsLoading(true);
        const imageUrl = "";
        if (newName.trim() != '' && price >= 0) {
            if (newImage != "") {
                const imageUrl2 = await uploadSongImage(newImage); //Get url from 
                if (!imageUrl2.includes(imgUrlUndefinded)) {
                    await updateMenuToDataBase(imageUrl2);

                } else {
                    swal({
                        title: "Lỗi!",
                        text: "Thêm ảnh thất bại",
                        icon: "warning",
                        button: "OK!",
                    })
                }
            } else {
                await updateMenuToDataBase(imageUrl);

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


    const updateMenuToDataBase = async (imageUrl) => {

        const data = {
            id: menuID,
            restaurantID: userInfo.restaurantID,
            menuName: (newName.trim() == menuName.trim()) ? "" : newName,
            image: (imageUrl != "") ? imageUrl : image,
            status: status,
            price: price,
            costData: selectedMaterial

        };

        console.log(data);
        const res = await axios.post('/api/updateMenu', data);
        if (res.data.errCode === 0) {
            setIsLoading(false);
            swal({
                title: "Thành công!",
                text: "Thêm món thành công",
                icon: "success",
                button: "OK!",
            })
                .then((value) => {
                    //return (<Redirect to={'/resmat/menu-detail/:id'} />);
                    history.push('/resmat/manage-menu');
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
                        <Text fontSize="2xl" color={textColor} fontWeight="bold">Cập nhật: {menuName}</Text>
                    </Box>
                    <Box ms="auto" w={{ sm: "unset", md: "unset" }} >
                        <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={goToMenuPage}>Trở lại</Button>
                    </Box>
                </CardHeader>
                <CardBody>
                    <FormControl>
                        <Text fontSize="md" mb="8px" fontWeight="semibold">Tên món:</Text>
                        <Input
                            value={newName}
                            onChange={(e1) => { setNewName(e1.target.value) }}
                            placeholder="Nhập tên món mới"
                        />
                        <br /><br />
                        <Flex style={{ margin: "10px 0px", }}>
                            <FormLabel fontWeight="semibold" style={{ margin: "0px", alignItems: "flex-end" }}>{(status == 0) ? 'Kích hoạt' : 'Hủy kích hoạt'}:</FormLabel>
                            <Switch marginStart="20px" colorScheme="teal" size="lg" id="sw1" isChecked={status} onChange={() => { setStatus(1 - status); }}></Switch>
                        </Flex>
                        <br />
                        <FormLabel fontWeight="semibold">Nguyên liệu:</FormLabel>

                        <Select
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti
                            isClearable
                            value={selectedMaterial}
                            isSearchable
                            onChange={(e2) => {
                                setSelectedMaterial(Array.isArray(e2) ? e2.map((x) => x) : []);
                            }}
                            placeholder="Chọn nguyên liệu"
                            options={material}
                        >

                        </Select>

                        {(selectedMaterial != "") &&
                            <FormLabel>Lượng nguyên liệu dùng cho mỗi món:</FormLabel>}
                        {selectedMaterial
                            && selectedMaterial.map((data, index) => {
                                return (
                                    <Flex key={index} w={{ sm: "unset", md: "unset" }} alignItems="center" style={{ margin: "20px 0px" }}>
                                        <Text minWidth="80px" style={{ margin: "5px 20px 5px 20px" }} fontWeight="semibold" >{data.label}:</Text>
                                        <Input
                                            defaultValue={data.costValue}
                                            //value={data.costValue}
                                            onChange={(e3) => { data.costValue = e3.target.value; data.costValue = parseFloat(data.costValue); console.log(selectedMaterial) }}
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
                            value={price}
                            onChange={(e4) => { setPrice(e4.target.value) }}
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
                                <form>
                                    <input
                                        id="file"
                                        type="file"
                                        accept="image/*"
                                        style={{ visibility: "hidden" }}
                                        onChange={(e) => { setNewImage(e.target.files[0]); }}
                                    />
                                </form>
                            </Flex>
                            <Flex ms="ltr" w={{ sm: "unset", md: "unset" }} alignItems="center">
                                <Flex w="100px" h="150px" flexDirection="column" justifyContent="space-evenly">
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
                                            width: "86px", height: "36px"
                                        }}
                                    >Thêm ảnh</label>
                                    {(newImage != "") &&
                                        <Button colorScheme="red" w="86px" h="36px" fontSize="1em" onClick={() => { setNewImage("") }}>Hủy</Button>
                                    }
                                </Flex>
                                {(newImage == "") ?

                                    (
                                        <Image src={image} w="150px" h="150px" borderRadius="12px" me="18px" style={{ border: "1px outset #A0AEC0", "marginLeft": "50px" }}></Image>

                                    ) : (
                                        <>
                                            <Image src={URL.createObjectURL(newImage)} w="150px" h="150px" borderRadius="12px" me="18px" style={{ border: "1px outset #A0AEC0", "marginLeft": "50px" }}></Image>

                                        </>
                                    )
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

export default MenuDetail