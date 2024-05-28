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
import {
    StatsIcon,
    DocumentIcon,
    RocketIcon,
    SupportIcon,
    SettingsIcon
} from "components/Icons/Icons";

export default function Dashboard() {
    // Chakra Color Mode
    const textColor = useColorModeValue("gray.700", "white");
    const history = useHistory();
    const [material, setMaterial] = useState([]);
    const userInfo = useSelector((state) => state.reducerLogin).userInfo;

    //popup setup
    const [newName, setNewName] = useState('');
    const [measure, setMeasure] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();
    const [updateID, getUpdateId] = useState(0);
    const [stat, setStat] = useState(0);

    const iconUrl = "https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2Ficon%2FmaterialIcon.PNG?alt=media&token=3d6ff0f3-086a-4381-9af1-8ebb111e70fc";

    //add new setup
    const [addNew, setNew] = useState({
        materialID: 0,
        importValue: 0,
        materialCost: 0,
        type: 0,// 0 = import type, 1 = used type
        note: ""
    });

    const [updateStorage, setUpdateStorage] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setNew({ ...addNew, [e.target.name]: e.target.value });
    };

    const inputUpdateStorage = (id, value) => {
        let m1 = material.filter((item) => item.id == id);
        let m2 = updateStorage.filter((item) => item.id == id);

        if (m2[0] == undefined) {
            updateStorage.push({
                id: id,
                value: (parseFloat(value) - parseFloat(m1[0].totalValue)),
            });
            setUpdateStorage(updateStorage);
        } else {
            if (!value) {
                let m3 = updateStorage.filter((item) => item.id != id);
                console.log(m3);
                setUpdateStorage(m3);
            } else {
                updateStorage.map((data) => {
                    if (data.id == id) data.value = (parseFloat(value) - parseFloat(m1[0].totalValue));
                })
                setUpdateStorage(updateStorage);
            }
        }


    }

    if (userInfo === undefined) {
        return (<Redirect to={'/auth/signin/'} />);
        // history.push('/auth/signin/');
    }
    useEffect(() => {
        getAllStorageData();
    }, [])
    //Get material data from database
    const getAllStorageData = async () => {
        const res = await axios.post("/api/getAllStorageInfo", { id: userInfo.restaurantID });
        if (res.data.errCode === 0) {

            setMaterial(res.data.storages);
        }
    }

    const handleChange = async () => {

        if (stat == 3) {
            //add storage state
            if (addNew.importValue == 0) {
                swal({
                    title: "Lỗi!",
                    text: "Chưa nhập lượng ngyên liệu thêm!",
                    icon: "warning",
                    button: "OK!",
                });
            } else {
                addNew.materialID = updateID;
                addNew.id = userInfo.restaurantID;
                const res = await axios.post("/api/addStorage", addNew);
                if (res.data.errCode === 0) {

                    setMaterial(res.data.storages);
                    swal({
                        title: "Thành công!",
                        text: "Nhập kho thành công",
                        icon: "success",
                        button: "OK!",
                    });

                }
            }
        } else if (!measure.trim() || !newName.trim()) {

            swal({
                title: "Lỗi!",
                text: "Thiếu giá trị nhập vào",
                icon: "warning",
                button: "OK!",
            });
        } else {
            if (stat == 1) {
                const res = await axios.post("/api/updateMaterial", { id: updateID, name: newName, resID: userInfo.restaurantID, measure: measure });
                //change password state   
                if (res.data.errCode === 0) {

                    setMaterial(res.data.storages);
                    swal({
                        title: "Thành công!",
                        text: "Đổi tên thành công",
                        icon: "success",
                        button: "OK!",
                    });
                } else {
                    swal({
                        title: "Lỗi!",
                        text: res.data.errMessage,
                        icon: "warning",
                        button: "OK!",
                    });
                }
            } else if (stat == 2) {
                //add material state 
                const res = await axios.post("/api/addMaterial", { name: newName, resID: userInfo.restaurantID, measure: measure });
                if (res.data.errCode === 0) {

                    setMaterial(res.data.storages);
                    swal({
                        title: "Thành công!",
                        text: "Thêm thành công",
                        icon: "success",
                        button: "OK!",
                    });
                } else {
                    swal({
                        title: "Lỗi!",
                        text: res.data.errMessage,
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }


        }

        setStat(0);
        onClose();
        setNew({
            materialID: 0,
            importValue: 0,
            materialCost: 0,
            type: 0,// 0 = import type, 1 = used type
            note: ""
        });
    }

    //Handle update material
    const goToMaterialDetail = (genreCurrentId) => {
        // const genreCurrentId = event.target.value;
        history.push('/resmat/material-detail/' + genreCurrentId);
    }
    //Handle delete material
    const handleDeleteMaterial = (id) => {

        swal("Bạn muốn xóa nguyên liệu này?", {
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
                        axios.post("/api/deleteOneMaterial", { id: id });
                        setTimeout(function () {
                            swal({
                                title: "Success!",
                                text: "Xóa thành công",
                                icon: "success",
                                button: "OK!",
                            })
                        }, 200);
                        setMaterial(material.filter((item) => item.id != id));
                        // window.location.reload();
                        break;
                    default:
                        break;
                }
            });
    }

    const handleUpdateStorage = async () => {
        console.log(updateStorage);
        onClose();
        const res = await axios.post("/api/updateStorage", { id: userInfo.restaurantID, data: updateStorage });
        if (res.data.errCode === 0) {

            setMaterial(res.data.storages);
            swal({
                title: "Thành công!",
                text: "Nhập kho thành công",
                icon: "success",
                button: "OK!",
            });

        }
    }
    return (
        <div style={{ margin: '60px 0px 0px 0px' }}>
            <Card overflowX={{ xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px" alignItems="Center" justifyContent="space-between">

                    <Text fontSize="2xl" color={textColor} fontWeight="bold">Kho</Text>
                    <Flex>
                        <Button style={{ margin: "5px", }} colorScheme="blue" onClick={(e) => { onOpen(); setStat(4); setUpdateStorage([]); }}>Kiểm kho</Button>

                        <Button style={{ margin: "5px", }} colorScheme="blue" onClick={(e) => { onOpen(); setStat(2); setNewName(""); setMeasure(""); }}>Thêm nguyên liệu</Button>
                    </Flex>

                </CardHeader>
                <CardBody style={{ overflow: "auto" }}>
                    <Table variant="simple" color={textColor}>
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th color="gray.400">Nguyên liệu</Th>
                                <Th color="gray.400">Tồn kho</Th>
                                <Th color="gray.400">Chi phí</Th>
                                <Th color="gray.400">Chi tiết</Th>
                                <Th color="gray.400">Cập nhật</Th>
                                <Th color="gray.400">Xóa</Th>

                            </Tr>
                        </Thead>
                        <Tbody>
                            {material.map((data, index) => {
                                return (
                                    <Tr key={index}>
                                        <Td minWidth={{ sm: "200px" }} width="100%" pl="0px" as="button" onClick={() => { goToMaterialDetail(data.id) }}>
                                            <Flex align="center" py=".8rem" minWidth="100%" >
                                                <Avatar src={iconUrl} w="50px" borderRadius="12px" me="18px" objectFit="fill" />
                                                <Flex direction="column">
                                                    <Text
                                                        fontSize="lg"
                                                        color={textColor}
                                                        fontWeight="bold"
                                                        minWidth="100%"
                                                    >
                                                        {data.materialName}
                                                    </Text>

                                                </Flex>
                                            </Flex>
                                        </Td>
                                        <Td>
                                            <Flex direction="column" style={{ 'align-items': ' center', 'flex-direction': 'row' }}>

                                                <Text fontSize="lg" color="orange.600" fontWeight="bold">{Number(data.totalValue).toLocaleString('vi-VN') || 0}</Text>
                                                <Text style={{ margin: "5px 5px 5px 5px", 'font-size': '17px' }} alignItems="center">{data.measure}</Text>

                                            </Flex>
                                        </Td>
                                        <Td>
                                            <Flex direction="column">
                                                <Text fontSize="lg" color="orange.600" fontWeight="bold">{Number(data.totalCost).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}</Text>
                                            </Flex>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="green" size="sm" onClick={() => { goToMaterialDetail(data.id) }} value={data.id}><DocumentIcon color="inherit" margin="0 3px 0 0" /> Chi tiết</Button>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="green" size="sm" style={{ margin: "5px 5px 5px 5px" }} onClick={(e) => { onOpen(); getUpdateId(e.target.value); setStat(1); setMeasure(data.measure); setNewName(data.materialName) }} value={data.id}><SupportIcon color="inherit" margin="0 3px 0 0" /> Sửa</Button>
                                            <Button colorScheme="green" size="sm" style={{ margin: "5px 5px 5px 5px" }} onClick={(e) => { onOpen(); getUpdateId(e.target.value); setStat(3); setMeasure(data.measure); }} value={data.id}><SupportIcon color="inherit" margin="0 3px 0 0" /> Nhập kho</Button>
                                        </Td>
                                        <Td>
                                            <Button colorScheme="red" size="sm" onClick={() => { handleDeleteMaterial(data.id) }}><i className="fa fa-trash"></i></Button>
                                        </Td>
                                    </Tr>
                                );
                            })}
                            {(stat == 2 || stat == 1) &&
                                <Modal
                                    initialFocusRef={initialRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                >
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Thêm nguyên liệu</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={6}>
                                            <FormControl>
                                                <FormLabel>Tên nguyên liệu</FormLabel>
                                                <Flex>
                                                    <Input
                                                        ref={initialRef}
                                                        placeholder="Nhập tên nguyên liệu."
                                                        name="importValue"
                                                        onChange={(e) => { setNewName(e.target.value) }}
                                                        value={newName}
                                                        type="text"
                                                    />
                                                </Flex>
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Đơn vị</FormLabel>
                                                <Input
                                                    placeholder="Nhập đơn vị."
                                                    name="materialCost"
                                                    onChange={(e) => { setMeasure(e.target.value) }}
                                                    value={measure}
                                                    type="text"
                                                />
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button onClick={handleChange} colorScheme="blue" mr={3}>
                                                Xác nhận
                                            </Button>
                                            <Button onClick={onClose}>Hủy</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            }
                            {stat == 3 &&
                                <Modal
                                    initialFocusRef={initialRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                >
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Nhập nguyên liệu</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={6}>
                                            <FormControl>
                                                <FormLabel>Lượng nhập</FormLabel>
                                                <Flex style={{ 'align-items': ' center' }}>
                                                    <Input
                                                        // style={{ 'max-width': '300px' }}
                                                        ref={initialRef}
                                                        placeholder="Nhập thấp nhất 0.01."
                                                        name="importValue"
                                                        onChange={handleInput}
                                                        value={(addNew.importValue == 0) ? "" : addNew.importValue}
                                                        type="number"
                                                        pattern={"[0-9]*[.,]?[0-9]"}
                                                        step="0.01"
                                                        min="0"

                                                    />
                                                    <Text style={{ margin: "5px 30px 5px 30px", 'font-size': '20px' }} alignItems="center">{measure}</Text>
                                                </Flex>
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Chi phí</FormLabel>
                                                <Flex style={{ 'align-items': ' center' }}>
                                                    <Input
                                                        placeholder="Nhập chi phí."
                                                        name="materialCost"
                                                        onChange={handleInput}
                                                        value={(addNew.materialCost == 0) ? "" : addNew.materialCost}
                                                        type="number"
                                                        min="0"
                                                    />
                                                    <Text style={{ margin: "5px 30px 5px 30px", 'font-size': '20px' }} alignItems="center">VND</Text>
                                                </Flex>
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Ghi chú</FormLabel>
                                                <Input
                                                    placeholder="Nhập ghi chú."
                                                    name="note"
                                                    onChange={handleInput}
                                                    value={addNew.note}
                                                    type="text"
                                                />
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button onClick={handleChange} colorScheme="blue" mr={3}>
                                                Xác nhận
                                            </Button>
                                            <Button onClick={onClose}>Hủy</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            }
                            {stat == 4 &&
                                <Modal
                                    initialFocusRef={initialRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                    blockScrollOnMount={true}
                                >
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Kiểm kho</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={6}>
                                            {material.map((data, index) => {
                                                return (
                                                    <FormControl>

                                                        <Flex style={{ 'align-items': ' center' }} p="3px" key={index}>
                                                            <Text w={"15%"} alignItems={"center"}>{data.materialName}</Text>
                                                            <Input
                                                                // style={{ 'max-width': '300px' }}
                                                                w="70%"
                                                                ref={initialRef}
                                                                placeholder="Nhập số lượng còn lại."
                                                                name="importValue"
                                                                onChange={(e) => { inputUpdateStorage(data.id, e.target.value) }}
                                                                type="number"
                                                                pattern={"[0-9]*[.,]?[0-9]"}
                                                                step="0.01"
                                                                min="0"

                                                            />
                                                            <Text w="15%" style={{ margin: "5px", 'font-size': '20px' }} display={"flex"} alignItems="center" justifyContent={"center"}>{data.measure}</Text>
                                                        </Flex>
                                                    </FormControl>
                                                )
                                            })}

                                        </ModalBody>
                                        <ModalFooter>
                                            <Button onClick={() => { handleUpdateStorage(); }} colorScheme="blue" mr={3}>
                                                Xác nhận
                                            </Button>
                                            <Button onClick={onClose}>Hủy</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            }
                        </Tbody>
                    </Table>

                </CardBody>
            </Card>
        </div>


    );
}
