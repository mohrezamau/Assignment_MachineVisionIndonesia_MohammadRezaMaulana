import { Box, ChakraProvider } from "@chakra-ui/react";
import React from "react";
import Navigation from "../navigation";


function Layout({ children }) {
  return (
    <>
      <Navigation />
      <Box  width="80%" mx="auto">
       {children}
      </Box>
    </>
  );
}
export default Layout;
