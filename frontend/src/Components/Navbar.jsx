import { Container, Flex, Text, HStack, Button, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";
import { IoStorefront } from "react-icons/io5";
import { FaRegSun } from "react-icons/fa";
import { LuMoon } from "react-icons/lu";
import { PlusSquareIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="1140px" px={4}>
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
      >
        <HStack spacing={2}>
          <IoStorefront size={28} color="teal" />
          <Text
            fontSize={{ base: "22px", sm: "28px" }}
            fontWeight="bold"
            textTransform="uppercase"
            bgGradient="linear(to-r,cyan.400,blue.500)"
            bgClip="text"
          >
            <Link to="/">Product Store</Link>
          </Text>
        </HStack>

        <HStack spacing={2} mt={{ base: 2, sm: 0 }}>
          <Link to="/CreateProduct">
            <Button>
              <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>

          <Button onClick={toggleColorMode}>
            {colorMode === "dark" ? <FaRegSun size={20} /> : <LuMoon size={20} />}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
