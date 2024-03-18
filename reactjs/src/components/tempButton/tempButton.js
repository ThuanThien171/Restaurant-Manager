// Chakra Imports
import { Button, useColorModeValue } from "@chakra-ui/react";
// Custom Icons
import { CartIcon } from "components/Icons/Icons";
import PropTypes from "prop-types";
import React from "react";
import { AddIcon } from "@chakra-ui/icons"
export default function TempButton(props) {
    const { secondary, onChange, onSwitch, fixed, onClick, ...rest } = props;
    // Chakra Color Mode
    let navbarIcon = useColorModeValue("gray.500", "gray.200");
    let bgButton = useColorModeValue("white", "gray.600");
    let fixedDisplay = "flex";
    if (props.secondary) {
        fixedDisplay = "none";
    }

    const tempRef = React.useRef();
    return (
        <>
            <Button
                h="52px"
                w="auto"
                onClick={props.onOpen}
                bg={bgButton}
                position="fixed"
                variant="no-hover"
                left={document.documentElement.dir === "rtl" ? "35px" : ""}
                right={document.documentElement.dir === "rtl" ? "" : "35px"}
                bottom="30px"
                borderRadius="50px"
                boxShadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
                hidden={props.hidden}
                border="1px outset #000000"
            >
                <AddIcon
                    cursor="pointer"
                    ref={tempRef}
                    color={navbarIcon}
                    w="20px"
                    h="20px"
                    mr="10px"
                />
                Xác nhận
            </Button >
        </>
    );
}

TempButton.propTypes = {
    fixed: PropTypes.bool,
    onChange: PropTypes.func,
    onSwitch: PropTypes.func,
};
