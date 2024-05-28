// Chakra imports
import {
  Box, Flex, Grid, Text, useColorModeValue, Avatar, Button, Image, useDisclosure, Portal, Input,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
// assets
import moment from "moment-timezone";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { Separator } from "components/Separator/Separator";
import swal from "sweetalert";
// React, Redux
import { render } from "react-dom";
import React, { useState, useEffect, createElement } from "react";
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import actionAddMenu from "redux/actions/actionAddMenu";
import actionAddOrder from "redux/actions/actionAddOrder";

// Axios
import axios from "axios";
import TempButton from "components/tempButton/tempButton";
import { EditIcon } from "@chakra-ui/icons"


export default function Artist() {
  // Chakra Color Mode
  const textColor = useColorModeValue("gray.700", "white");
  const [menus, setMenus] = useState([]);
  const [addedMenus, setAddedMenus] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const [hidden, setHidden] = useState(true);
  //check login
  const userInfo = useSelector((state) => state.reducerLogin).userInfo;
  const orderInfo = useSelector((state) => state.reducerOrder);
  const emptyImg = "https://lh3.googleusercontent.com/proxy/KiMo8VuBj-PBx0zWRXHdrlx1Z7bqpBd4Ow2pizNOP6s4U9prV-1lyaMBVi-ESVLg7nDlZoXQdUpbOp7cSkj_CacQZD8u8s0Bot9CI0E";

  //const history = useHistory();
  if (userInfo === undefined) {
    return (<Redirect to={'/auth/signin/'} />);
    // history.push('/auth/signin/');
  }


  useEffect(() => {
    if (orderInfo.action == "changeTable") dispatch(actionAddOrder(0));
    getAvailableMenu();
  }, []);

  const getAvailableMenu = async () => {
    const res = await axios.post("/api/getAllMenu", { id: userInfo.restaurantID });
    if (res.data.errCode === 0) {
      setMenus(res.data.menus);
    }
  };


  const handleAdd = (data, number) => {
    let checkValue = 0;

    for (let i = 0; i < addedMenus.length; i++) {
      if (addedMenus[i].id == data.id) {
        if (number == 1 || number == -1) {
          addedMenus[i].number += number;
        } else {
          addedMenus[i].number = number;
        }
        checkValue = 1;
        if (addedMenus[i].number == 0) { addedMenus.splice(i, 1); }
      }
    }

    if (checkValue == 0) addedMenus.push({
      id: data.id,
      data: data,
      number: 1,
    })

    setAddedMenus(addedMenus);

  }

  const handleGoBack = () => {
    dispatch(actionAddMenu(0));
    history.push('/resmat/home')
  }


  const handleClick = async () => {
    let role = (orderInfo.action != undefined) ? orderInfo.action : "addNewOrder"
    dispatch(actionAddOrder({
      orderID: (orderInfo.orderID != undefined) ? orderInfo.orderID : undefined,
      tableID: (orderInfo.tableID != undefined) ? orderInfo.tableID : undefined,
      action: role,
    }));
    switch (role) {
      case "addNewOrder":
        if (orderInfo.tableID == undefined) {
          if (addedMenus[0] != undefined) {
            dispatch(actionAddMenu(addedMenus));
            history.push('/resmat/table');
          }
        } else {
          const res = await axios.post('/api/addNewOrder', {
            resID: userInfo.restaurantID,
            tableID: orderInfo.tableID,
            staff: userInfo.userName,
            userID: userInfo.id,
            menus: addedMenus ? addedMenus : "",
          });
          if (res.data.errCode === 0) {
            dispatch(actionAddMenu(0));
            dispatch(actionAddOrder(0));
            swal({
              title: "Ok!",
              text: "Thành công",
              icon: "success",
              button: "OK!",
            }).then(() => {
              history.push('/resmat/home');
            })
          } else {
            swal({
              title: "Lỗi!",
              text: res.data.errMessage,
              icon: "error",
              button: "OK!",
            })
          }
        }
        break;

      case "AddNewToOrder":
        if (addedMenus[0] != undefined) {
          const res = await axios.post('/api/addMenuToOrder', {
            orderID: orderInfo.orderID,
            userID: userInfo.id,
            menus: addedMenus,
          });
          if (res.data.errCode === 0) {
            swal({
              title: "Ok!",
              text: "Thành công",
              icon: "success",
              button: "OK!",
            }).then(() => {
              history.push('/resmat/home');
            })
          } else {
            swal({
              title: "Lỗi!",
              text: res.data.errMessage,
              icon: "error",
              button: "OK!",
            })
          }
        } else {
          swal({
            title: "Lỗi!",
            text: "Bạn chưa chọn món nào",
            icon: "error",
            button: "OK!",
          })
        }
        break;

      default:
        break;
    }

    onClose();
  }

  return (
    <div style={{ margin: '60px 0px 0px 0px' }} >
      <Card overflowX={{ xl: "hidden" }} >
        <CardHeader p="6px 0px 22px 0px" alignItems="Center">
          <Box mb={{ sm: "8px", md: "0px" }}>
            <Text fontSize="xl" color={textColor} fontWeight="bold">Menu</Text>
          </Box>
          {/* <Box ms="auto" w={{ sm: "unset", md: "unset" }} >
            <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={() => { handleGoBack() }}>Trở lại</Button>
          </Box> */}
        </CardHeader>
        <CardBody style={{ "flex-wrap": "wrap" }}>
          <Separator mb="15px" />
          {menus.map((data, index) => {

            return (

              <Flex
                m="5px 5px"
                w={{
                  md: "calc(33% - 10px)",
                  sm: "calc(50% - 10px)",
                }}
                flexDirection={{
                  sm: "column",
                  md: "row",
                }}

                _hover={(data.status == 1) && {
                  "box-shadow": "0px 5px 10px -5px",
                  transform: "scale(1.03)",
                }}
                _active={(data.status == 1) && {
                  "box-shadow": "0px 4px 8px",
                  transform: "scale(.98)",
                }}
                alignItems={"center"}
                style={{ border: "1px outset #38B2AC" }}
                borderRadius="10px"
                cursor={(data.status != 1) && "default"}
                as="button"
                onClick={() => { handleAdd(data, 1) }}
                key={index}
                bg={(data.status == 2) && "gray.300"}
                disabled={(data.status == 2) && true}
                hidden={(data.status == 0) && true}

              >
                {/* <Flex
                  w={{
                    md: "50%",
                    sm: "100%",
                  }}
                  paddingTop={{
                    md: "50%",
                    sm: "100%",
                  }}
                  style={{ border: "1px outset #38B2AC" }}
                  bgImage={(data.image != "") ? data.image : emptyImg}
                  bgSize={"cover, contain"}
                  bgRepeat={"no-repeat"}
                  bgPosition={"center"}
                  borderRadius="10px"
                >
                </Flex> */}
                <Flex
                  w={{
                    md: "50%",
                    sm: "100%",
                  }}
                  h={"full"}
                  style={{ border: "1px outset #38B2AC" }}
                  borderRadius="10px"
                >
                  <Image
                    w={"100%"}
                    //h={"full"}
                    style={{'aspect-ratio': '1 / 1' }}
                    //style={{ border: "1px outset #38B2AC" }}
                    src={(data.image != "") ? data.image : emptyImg}
                    objectFit={"fill"}
                    borderRadius="10px"
                  >
                  </Image>
                </Flex>

                <Flex
                  w={{
                    md: "50%",
                    sm: "100%",
                  }}
                  flexDirection={"column"}
                >
                  <Text
                    fontSize="lg"
                    color={textColor}
                    fontWeight="semibold"
                  >
                    {data.menuName}
                  </Text>

                  <Text
                    fontSize="lg"
                    color={textColor}
                    fontWeight="normal"
                  >
                    {Number(data.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}
                  </Text>
                  {data.status == 2 &&
                    <Text
                      fontSize="md"
                      color={"red"}
                      fontWeight="normal"
                    >
                      Hết món
                    </Text>

                  }
                </Flex>

              </Flex>


            )
          })
          }

        </CardBody>
      </Card>
      <Portal>
        <TempButton
          onOpen={() => { onOpen(); }}
          hidden={false}
        />
      </Portal>
      <Drawer

        isOpen={isOpen}
        onClose={onClose}
        //placement={document.documentElement.dir === "rtl" ? "left" : "right"}
        placement="bottom"

        blockScrollOnMount={true}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent style={{ border: "1px outset #A0AEC0", markerStart: "125px" }}>
          <DrawerHeader pt="24px" px="24px" >
            <DrawerCloseButton />
            <Text fontSize="xl" fontWeight="bold" mt="16px">
              Các món đã chọn:
            </Text>
            <Separator />
          </DrawerHeader>
          <DrawerBody width="100%">
            <Flex flexDirection="column" width="100%">
              {addedMenus.map((data, index) => {
                return (
                  <Flex p=".8rem" w="100%" m="4px 0px"
                    flexDirection={{
                      sm: "column",
                      md: "row",
                    }}
                    alignItems={{ sm: "flex-start", md: "center" }}
                    style={{ border: "1px outset #38B2AC" }}
                    borderRadius="10px"
                    key={index}
                    id={index + "t1"}
                  >
                    <Flex p="5px" w={{ sm: "100%", md: "85%" }} style={{ flexDirection: "row" }} alignItems="center">
                      <EditIcon />
                      <Text
                        w={{ sm: '40%', md: "60%" }}
                        fontSize="lg"
                        color={textColor}
                        fontWeight="bold"
                      >
                        {data.data.menuName}
                      </Text>
                      <Flex flexDirection="row" alignItems="center">
                        <Button height="30px" width="30px" borderRadius="20px" border="1px solid #ccc" colorScheme="red"
                          onClick={() => {
                            handleAdd(data, -1);
                            document.getElementById(index).value = data.number;
                            document.getElementById(index + "t2").value = Number(data.data.price * data.number).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });
                            if (data.number == 0) { document.getElementById(index + "t1").remove(); }

                          }}
                        >-</Button>
                        <input defaultValue={data.number}
                          id={index}
                          name={"input1-" + index}
                          type="number"
                          min='0'
                          style={{ border: '1px #ccc solid', width: "60px", height: "30px", padding: "5px", margin: "5px" }}
                          onKeyDown={(e) => {
                            if (e.key == "Enter") {
                              handleAdd(data, parseInt(e.target.value));
                              document.getElementById(index).value = data.number;
                              document.getElementById(index + "t2").value = Number(data.data.price * data.number).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });
                              if (data.number == 0) { document.getElementById(index + "t1").remove(); }
                            }
                          }}
                        ></input>
                        <Button height="30px" width="30px" borderRadius="20px" border="1px solid #ccc" colorScheme="green"
                          onClick={() => {
                            handleAdd(data, 1);
                            document.getElementById(index).value = data.number;
                            document.getElementById(index + "t2").value = Number(data.data.price * data.number).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', });

                          }}
                        >+</Button>
                      </Flex>
                    </Flex>
                    <Flex p="5px" flexDirection="row" alignItems="center" w={{ sm: "100%", md: "20%" }}>
                      <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                      >Giá: </Text>
                      <input
                        value={Number(data.data.price * data.number).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}
                        //type="number"
                        disabled={true}
                        id={index + "t2"}
                        name={"input2-" + index}
                        min={0}
                        style={{ width: "100px", height: "30px", paddingLeft: "5px", backgroundColor: "white" }}
                      />
                    </Flex>
                    <Flex p="5px" flexDirection="column" alignItems="left" w={{ sm: "100%", md: "100%" }}>
                      <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="semibold"
                        m="5px"
                      >Ghi chú: </Text>
                      <input
                        defaultValue={""}
                        type="text"
                        id={index + "t3"}
                        name={"input3-" + index}
                        style={{ paddingLeft: "5px", width: "100%", border: '1px #ccc solid', margin: "5px" }}
                        onChange={(e1) => {
                          addedMenus[index].note = (e1.target.value != "") ? e1.target.value : "";
                          setAddedMenus(addedMenus);
                        }}
                      />
                    </Flex>
                  </Flex>
                )
              })

              }

            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="facebook" onClick={() => { handleClick(); }}>Xác nhận</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div >
  );

}
