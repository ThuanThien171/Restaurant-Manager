import { Link, useHistory, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

// Chakra imports
import {
  Box,
  Button,
  Portal,
  ButtonGroup,
  Flex,
  Image,
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

} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";


export default function Dashboard() {
  // Chakra Color Mode
  const textColor = useColorModeValue("gray.700", "white");
  const history = useHistory();
  const [menu, setMenu] = useState([]);
  const emptyImg = "https://lh3.googleusercontent.com/proxy/KiMo8VuBj-PBx0zWRXHdrlx1Z7bqpBd4Ow2pizNOP6s4U9prV-1lyaMBVi-ESVLg7nDlZoXQdUpbOp7cSkj_CacQZD8u8s0Bot9CI0E";
  const userInfo = useSelector((state) => state.reducerLogin).userInfo;



  if (userInfo === undefined) {
    return (<Redirect to={'/auth/signin/'} />);
  }
  useEffect(() => {
    getAllMenuData();

  }, [])
  //Get menu data from database
  const getAllMenuData = async () => {
    const res = await axios.post("/api/getAllMenu", { id: userInfo.restaurantID });
    if (res.data.errCode === 0) {
      setMenu(res.data.menus);
    }
  }
  //Handle add new menu
  const goToAddMenuPage = () => {
    history.push('/remat/add-menu');
  }
  //Handle update menu
  const goToUpdateMenuPage = (event) => {
    const menuCurrentId = event.target.value;
    history.push('/remat/menu-detail/' + menuCurrentId);
  }
  // Handle delete menu
  const handleDeleteMenu = (id) => {
    swal("Bạn muốn xóa món này?", {
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
            let res = await axios.post("/api/deleteOneMenu", { id: id });
            if (res.data.errCode === 0) {
              setTimeout(function () {
                swal({
                  title: "Thành công!",
                  text: "Xóa thành công",
                  icon: "success",
                  button: "OK!",
                })
              }, 200);
              setMenu(menu.filter((item) => item.id != id));
            }
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
            <Text fontSize="xl" color={textColor} fontWeight="bold">Menu</Text>
          </Box>
          <Box ms="auto" w={{ sm: "unset", md: "unset" }} >
            <Button style={{ margin: "10px 10px 10px 20px", 'borderRadius': "5px" }} colorScheme="blue" onClick={goToAddMenuPage}>Thêm món</Button>
          </Box>
        </CardHeader>
        <CardBody style={{ overflow: "auto" }}>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th color="gray.400">
                  Tên món
                </Th>
                <Th color="gray.400">Giá</Th>
                <Th color="gray.400">Cập nhật</Th>
                <Th color="gray.400">Xóa</Th>

              </Tr>
            </Thead>
            <Tbody>
              {menu.map((data, index) => {
                return (

                  <Tr key={index}>
                    <Td minWidth={{ sm: "200px", md: "100%" }} pl="0px" value={data.id}>
                      <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                        <Image src={(data.image != "") ? data.image : emptyImg} w="120px" h="120px" borderRadius="12px" me="18px" style={{ border: "1px outset #A0AEC0" }} />
                        <Flex direction="column">
                          <Text
                            fontSize="lg"
                            color={textColor}
                            fontWeight="bold"
                            minWidth="100%"
                          >
                            {data.menuName}
                          </Text>
                          {data.status == 0 &&
                            <Text fontSize="sm" color="red" fontWeight="normal">
                              không kích hoạt
                            </Text>
                          }
                          {data.status == 1 &&
                            <Text fontSize="sm" color="green" fontWeight="normal">
                              kích hoạt
                            </Text>
                          }
                          {data.status == 2 &&
                            <Text fontSize="sm" color="gray" fontWeight="normal">
                              Hết món
                            </Text>
                          }
                        </Flex>
                      </Flex>
                    </Td>

                    <Td>
                      <Flex direction="column">
                        <Text fontSize="lg" color={textColor} fontWeight="bold">
                          {Number(data.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', }) || 0}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Button colorScheme="green" size="sm" onClick={goToUpdateMenuPage} value={data.id}>Cập nhật</Button>
                    </Td>
                    <Td>
                      <Button colorScheme="red" size="sm" onClick={() => { handleDeleteMenu(data.id) }}><i className="fa fa-trash"></i></Button>
                    </Td>
                  </Tr>

                );

              })}


            </Tbody>
          </Table>
        </CardBody>
      </Card>

    </div>



  );
}
