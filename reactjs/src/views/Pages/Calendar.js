import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction'

import axios from "axios";
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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
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
import { AddIcon } from '@chakra-ui/icons'

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { dA } from "@fullcalendar/core/internal-common";
import swal from "sweetalert";

export default function Dashboard() {
    // Chakra Color Mode
    const textColor = useColorModeValue("gray.700", "white");
    const history = useHistory();
    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        history.push('/auth/signin');
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shiftTime, setShiftTime] = useState({
        start: "",
        end: "",
    });

    const handleInput = (e) => {
        e.persist();
        setShiftTime({ ...shiftTime, [e.target.name]: e.target.value });
    }

    const addNewShift = async () => {
        if (shiftTime.start == "" || shiftTime.end == "") {
            swal("Error", "Thiếu dữ liệu nhập vào", "error");
        } else {
            const data = {
                resID: userInfo.restaurantID,
                time: shiftTime.start + "-" + shiftTime.end,
            }
            const res = await axios.post("/api/addNewShift", data);
            if (res.data.errCode === 0) {
                swal({
                    title: "Thành công!",
                    text: res.data.errMessage,
                    icon: "success",
                    button: "OK!",
                });
                setShiftTime({
                    start: "",
                    end: "",
                });
                onClose();

            }
        }
    }

    return (
        <div style={{ margin: '60px 0px 0px 0px' }}>
            <Card overflowX={{ xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Lịch làm việc
                    </Text>
                    <Button style={{ margin: "0 0 0 75%", 'borderRadius': "5px" }} colorScheme="blue" onClick={() => { onOpen(); }}><AddIcon color={"inherit"} />
                    </Button>
                </CardHeader>
                <CardBody>
                    <Tabs size="sm" colorScheme="cyan" width="100%" variant='enclosed' isFitted >
                        <TabList>
                            <Tab _focus={{ boxShadow: "none", }} >Lịch làm</Tab>
                            <Tab _focus={{ boxShadow: "none", }} >Số giờ làm theo tháng</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>

                                <div style={{
                                    width: "900px",
                                    height: "800px",
                                    margin: "auto",
                                }}>
                                    <FullCalendar
                                        // ref={calendarRef}
                                        locale="vi"
                                        headerToolbar={{
                                            start: false,
                                            center: 'title',
                                            end: 'today prev,next'
                                        }}
                                        buttonText={{ today: "hôm nay" }}
                                        plugins={[dayGridPlugin, bootstrap5Plugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        height={800}
                                        themeSystem="bootstrap5"

                                        // stickyHeaderDates={true}
                                        editable={true}
                                        selectable={true}
                                        selectMirror
                                    // views={views}
                                    // select={ }
                                    // eventTimeFormat={eventTimeFormat}
                                    // eventClick={handleEventClick}
                                    // events={calendar}
                                    // buttonText={buttonText}
                                    // eventDrop={(e) => { return console.log("eventDrop ran======-----======", dispatch(calendarUpdate({ start: e.event.start, end: e.event.end, _id: e.event._def.extendedProps._id }))) }}

                                    />
                                </div>
                            </TabPanel>
                            <TabPanel>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </CardBody>

                <Modal
                    //initialFocusRef={initialRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Nhập thời gian làm việc</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Thời gian bắt đầu</FormLabel>
                                <Input
                                    placeholder=""
                                    name="start"
                                    onChange={handleInput}
                                    value={shiftTime.start}
                                    type="time"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Thời gian kết thúc</FormLabel>
                                <Input
                                    placeholder=""
                                    name="end"
                                    onChange={handleInput}
                                    value={shiftTime.end}
                                    type="time"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => { addNewShift(); }} colorScheme="blue" mr={3}>
                                Xác nhận
                            </Button>
                            <Button onClick={onClose}>Hủy</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Card>
        </div>


    );
}
