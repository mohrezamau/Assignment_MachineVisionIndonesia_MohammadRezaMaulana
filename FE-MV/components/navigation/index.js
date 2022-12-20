import { Box, Button, HStack, Text, Flex, Link, Badge } from "@chakra-ui/react";
import NextLink from "next/link";
import {InfoOutlineIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {signOut} from "next-auth/react"
import {getSession} from 'next-auth/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import axiosInstance from '../../services/axiosinstance'

function Navigation() {
  
const [session, setSession] = useState(false)
// const [user, setUser] = useState(props.user)
// console.log(`NAVIGATION PAGE console ${props.user}`)

  async function getSessionAsync(){
    
    const session = await getSession()
    
    if(session){
      setSession(true)
    }

    console.log({session});
    }
  
    useEffect(() => {
    getSessionAsync()  
    }, )

    return(
        <Box width= "90%" align-items="center" my="2px" mx="auto" padding={5}>
        <HStack> 
            <Flex>   
        <NextLink href="/">
          <Button fontSize="large" variant="ghost" colorScheme="orange" mx="2.5px" my={5} w="100%">
            HOME
          </Button>
        </NextLink>
        {session? (<></>):(<NextLink href="/login">
        <Button  fontSize="large" colorScheme="teal" variant="ghost" mx="2.5px" my={5} w="100%">
                  Login
                </Button>
        </NextLink>)}
        {session? (<></>):(<NextLink href="/register">
                <Button  fontSize="large" colorScheme="teal" variant="ghost" mx="2.5px" my={5} w="100%">
                  Register
                </Button>
        </NextLink>)}
        {session? (<NextLink href="/profile">
          <Button fontSize="large" variant="ghost" colorScheme="orange" mx="2.5px" my={5} w="100%">
            PROFILE
          </Button>
        </NextLink>):(<></>)}        
       {session? (<Button colorScheme={"teal"} fontSize="large" variant="ghost" mx="2.5px" my={5} w="100%" onClick={() => {signOut();}}>
                  LOGOUT <ExternalLinkIcon/>
                </Button>): ("")}
                <NextLink href="/info">
                <Link mx="8px" my="27.5px">
                  <InfoOutlineIcon/>
                </Link>
        </NextLink>
                
        </Flex>
      </HStack>
        </Box>
    );
}

// export async function getServerSideProps(context) {
//   try {
//     const session = await getSession({req: context.req});

//     if (!session) return {redirect: {destination: "/login"}};
//       console.log(`NAVIGATION SESSION ${session}`)
//     const {accessToken} = session.user;

//     const config = {
//       headers: {Authorization: `Bearer ${accessToken}`},
//     };

//     const user_id = session.user.user_id;
//     console.log(`NAVIGATION USER ID ${user_id}`)
//     const res = await axiosInstance.get(`/users/profile/${user_id}`, config);
    
//     return {
//       props: {user: res.data.data.result, session},
//     };
//   } catch (error) {
//     console.log({error});
//     return {props: {}};
//   }
// }

export default Navigation;