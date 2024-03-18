
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import axios from "axios";

import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { countDecimalPlaces } from "@chakra-ui/utils";
function SearchBar(props) {
    // Pass the computed styles into the `__css` prop
    const { variant, children, ...rest } = props;
    // Chakra Color Mode
    const history = useHistory();
    const mainTeal = useColorModeValue("teal.300", "teal.300");
    const searchIconColor = useColorModeValue("gray.700", "gray.200");
    const inputBg = useColorModeValue("white", "gray.800");
    const [song, getSong] = useState([]);
    const [artist, getArtist] = useState([]);
    const [album, getAlbum] = useState([]);
    const [genre, getGenre] = useState([]);

    useEffect(() => {
        getAllSongData();
    }, [])
    //Get song data from database
    const getAllSongData = async () => {
        const res = await axios.post("/api/getAllSongInfo");
        if (res.data.status === 200) {
            getSong(res.data.songInfo);
            // console.log(res.data.songInfo);
        }
    }

    //Get artist
    useEffect(() => {
        getAllArtistInfo();
    }, [])
    const getAllArtistInfo = async () => {
        const res = await axios.post("/api/getAllArtistInfo");
        if (res.data.status === 200) {
            getArtist(res.data.artistInfo);
            // console.log(res.data.artistInfo);
        }
    }

    //Get album
    useEffect(() => {
        getAllAlbumInfo();
    }, [])
    const getAllAlbumInfo = async () => {
        const res = await axios.post("/api/getAllAlbumInfo");
        if (res.data.status === 200) {
            getAlbum(res.data.albumInfo);
            // console.log(res.data.albumInfo);
        }
    }

    //Get genre
    useEffect(() => {
        getAllGenreInfo();
    }, [])
    const getAllGenreInfo = async () => {
        const res = await axios.post("/api/getAllGenreInfo");
        if (res.data.status === 200) {
            getGenre(res.data.genreInfo);
            // console.log(res.data.albumInfo);
        }
    }

    const data = [...song, ...artist, ...album, ...genre];
    //console.log(data);

    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        // console.log(string, results)
    }

    const handleOnHover = (result) => {
        // the item hovered
        // console.log(result)
    }

    const handleOnSelect = (item) => {
        // the item selected
        // console.log(item)
        if (item.type == "song")
            goToSongPage(item.id);
        else if (item.type == "artist")
            goToArtistPage(item.id);
        else if (item.type == "album")
            goToAlbumPage(item.id);
        else if (item.type == "genre")
            goToGenrePage(item.id);

    }
    //Go page
    const goToSongPage = (k) => {
        history.push("/resmat/song/" + k);
    }
    const goToArtistPage = (k) => {
        history.push("/resmat/artist/" + k);
    }
    const goToAlbumPage = (k) => {
        history.push("/resmat/album/" + k);
    }
    const goToGenrePage = (k) => {
        history.push("/resmat/genres/" + k);
    }

    const handleOnFocus = () => {
        //console.log('Focused')
    }
    const formatResult = (item) => {
        return item
    }
    return (
        <div style={{ width: 300, margin: "0 15px 0 0" }}>
            <ReactSearchAutocomplete
                items={data}
                onSearch={handleOnSearch}
                onHover={handleOnHover}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                autoFocus
                formatResult={formatResult}
                placeholder="Type here to search..."
                styling={{
                    height: "38px",
                    fontFamily: 'Trocchi',
                    fontSize: "18px",
                }}
            />
        </div>
    );
}
export default SearchBar;