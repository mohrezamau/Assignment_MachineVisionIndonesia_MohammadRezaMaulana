import React from 'react'
import { Button, Flex, Heading, Input, Text, Link, InputGroup, InputRightElement, Tag, TagLeftIcon, TagLabel,
Image} from "@chakra-ui/react";
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../services/axiosinstance';
import NextLink from "next/link";

function editprofile(props) {
    const [preview, setPreview] = useState(false)
    const [avatar, setAvatar] = useState("")
    const [bio, setBio] = useState("")
    const [fullname, setFullname] = useState("")
    
    console.log(avatar)

  
  

    const onFileChange = (event) => {
      const targetAvatar = event.target.files[0]
      console.log(`ini avatar ${targetAvatar}`)
        setAvatar(event.target.files[0]);
         setPreview(URL.createObjectURL(event.target.files[0]));
      };

      const onSaveAvatar = async () => {
        try {
          const session = await getSession();

          const {accesstoken} = session.user;
    
          const body = new FormData();
    
          body.append("avatar", avatar);
    
          const config = {
            headers: {Authorization: `Bearer ${accesstoken}`},
          };
    
          const res = await axiosInstance.patch("/users/avatar", body, config);
          
          alert(res.data.message);
          window.location.reload();
        } catch (error) {
          console.log(error);
          alert(error);
        }
      };
      const onSaveProfile = async () => {
        try {
          const session = await getSession();

          const {accesstoken} = session.user;

          const body = {
            bio, fullname
          }
    
          const config = {
            headers: {Authorization: `Bearer ${accesstoken}`},
          };
          console.log({bio}, {fullname}, {body})
          const res = await axiosInstance.patch("/users", body, config);
          alert(res.data.message)
          window.location.reload();
          
        } catch (error) {
          console.log({error});
          alert(error);
        }
      };
    

  return (
    <Flex height="60vh" alignItems="center" justifyContent="center" >
    <Flex alignItems="center" justifyContent="center" 
    direction="column" background="gray.400" p={12} rounded={6}>
      <Text fontSize={"xl"} fontWeight={"semibold"} mb={6}>Edit Profile</Text>
      <Input
        type="text"
        value={fullname}
        placeholder="fullname"
        variant="filled"
        mb={3}
        onChange={(event) => setFullname(event.target.value)}  
      />
      <Input
        type="text"
        value={bio}
        placeholder="bio"
        variant="filled"
        mb={3}
        onChange={(event) => setBio(event.target.value)}  
      />

      <Button mb={3} colorScheme="teal" width={"100%"} height={"30px"}
      onClick={onSaveProfile}
      >
        Save Profile
      </Button>
      {preview? (<><Button mx={3} mb={2} colorScheme="orange" alignItems="center" width="100%"
      onClick={() =>{ setPreview(null), setAvatar("")}} variant="outline">Cancel</Button>
      <Button mx={3} colorScheme="teal" alignItems="center" width="100%"
      onClick={onSaveAvatar} variant="outline"
      >
        Save Avatar</Button></>
      ):(<>
      <label for="inputImage"> <Tag variant='subtle' colorScheme='teal' width={"100%"}>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Avatar
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"} value={avatar}
    onChange={onFileChange}/>
    </>)}
    </Flex>
    <Flex alignItems="center" justifyContent="center" 
     bg={"gray.100"} maxW={320} maxH={320} ml={10} rounded={6}>
        <Image width={320} height={320} src={preview}></Image>
    </Flex>
  </Flex>
  )
}

export async function getServerSideProps(context) {
    try {
      const session = await getSession({req: context.req});
  
      if (!session) return {redirect: {destination: "/login"}};
        console.log({session})
      const {accessToken} = session.user;
  
      const config = {
        headers: {Authorization: `Bearer ${accessToken}`},
      };
  
      const user_id = session.user.user_id;
      console.log({user_id})
      const res = await axiosInstance.get(`/users/profile/${user_id}`, config);
      
      return {
        props: {user: res.data.data.result, session},
      };
    } catch (error) {
      console.log({error});
      return {props: {}};
    }
  }

export default editprofile