import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

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
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

export default function Dashboard() {
    // Chakra Color Mode
    const textColor = useColorModeValue("gray.700", "white");
    const history = useHistory();
    const [artist, setArtist] = useState([]);
    const [artistSong, getArtistSong] = useState([]);
    const userInfo = useSelector((state) => state.reducerLogin).userInfo;
    if (userInfo === undefined) {
        history.push('/auth/signin/');
    }
    useEffect(() => {
        getAllArtistData();
    }, [])
    //Get artist data from database
    const getAllArtistData = async () => {
        const res = await axios.post("/api/getAllArtistInfo");
        if (res.data.status === 200) {
            setArtist(res.data.artists);
        }
        const res1 = await axios.post("/api/getSongNumberOfAnArtist");
        if (res.data.status === 200) {
            getArtistSong(res1.data.artistSong);
        }
    }
    for (let i = 0; i < artist.length; i++) {
        if (artistSong !== undefined) {
            for (let j = 0; j < artistSong.length; j++) {
                if (artist[i].artistId === artistSong[j].artistId) {
                    artist[i]["totalSong"] = artistSong[j].songNumber;
                }
            }
        }

    }
    //Handle add new artist
    const goToAddArtistPage = () => {
        history.push('/resmat/add-artist');
    }
    //Handle update artist
    const goToUpdateArtistPage = (event) => {
        const artistCurrentId = event.target.value;
        history.push('/resmat/update-artist/' + artistCurrentId);
    }
    //Handle delete artist
    const handleDeleteArtist = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        swal("Are you sure you to delete this artist?", {
            buttons: {
                cancel: "No",
                catch: {
                    text: "Yes",
                    value: "catch",
                },
            },
        })
            .then((value) => {
                switch (value) {
                    case "cancel":
                        break;
                    case "catch":
                        axios.post("/api/deleteOneArtist", { artistId: id });
                        setTimeout(function () {
                            swal({
                                title: "Success!",
                                text: "Delete Artist Successfully",
                                icon: "success",
                                button: "OK!",
                            })
                        }, 200);
                        thisClicked.closest("tr").remove();

                        // window.location.reload();
                        break;
                    default:
                        break;
                }
            });
    }
    return (
        <div style={{ margin: '60px 0px 0px 0px' }}>
            <Card overflowX={{ xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Lịch làm việc
                    </Text>
                    <Button style={{ margin: "0 0 0 75%", 'borderRadius': "5px" }} colorScheme="blue" onClick={goToAddArtistPage}>Add artist
                    </Button>
                </CardHeader>
                <CardBody>
                    <div style={{
                        width: "1100px",
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
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            height={800}
                        // themeSystem="bootstrap"
                        // stickyHeaderDates={true}
                        // editable={true}
                        // selectable={true}
                        // selectMirror
                        // views={views}
                        // select={ }
                        // eventTimeFormat={eventTimeFormat}
                        // eventClick={handleEventClick}
                        // events={calendar}
                        // buttonText={buttonText}
                        // eventDrop={(e) => { return console.log("eventDrop ran======-----======", dispatch(calendarUpdate({ start: e.event.start, end: e.event.end, _id: e.event._def.extendedProps._id }))) }}

                        />
                    </div>
                </CardBody>
            </Card>
        </div>


    );
}
