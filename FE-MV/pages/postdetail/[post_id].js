import React from 'react'
import { useState, useEffect } from 'react';
import { Input, Button, Flex, Box, Tag, TagLeftIcon, TagLabel, Text, Link, VStack, Badge, HStack, Spacer
  ,Stack, Image, Alert, AlertIcon, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton } from '@chakra-ui/react'
import {Icon, AddIcon, StarIcon} from '@chakra-ui/icons'
import {getSession} from 'next-auth/react'
import axiosInstance from '../../services/axiosinstance';
import { useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';

function postDetail(props) {
  const [likeCount, setLikeCount] = useState(props.like.length)
  const [allcomments, setAllcomments] = useState(props.comment)
  const [post, setPost] = useState(props.post)
  const [poster, setPoster] = useState(props.poster)
  const [phrase, setPhrase] = useState("")
  const [caption, setCaption] = useState("")
  const [allowed, setAllowed] = useState(false)
  const {user_id} = props.session.user
  const [liked, setLiked] = useState(props.like.some(function (user) {
        return user.user_id === user_id;
      }))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  
  const [] = allcomments;
  const mappedComments = allcomments.map(renderComments)



function renderComments (comment){
  const createdAt = comment.createdAt
  const slicedCreatedAt = createdAt.slice(0,10)
  
    return (
      <Box fontSize={"md"} bg={"teal.100"} width={400} height={70} p={3} my={3} mx={7} rounded={10}>
      <Box display='flex' alignItems='baseline'>
          <Badge fontSize={"xx-small"} borderRadius='md' px='2' colorScheme='teal'>
              comment by {comment.username}
            </Badge>
            <Box
              color='gray.500'
              letterSpacing='normal'
              fontSize='small'
              ml='2'
            >
             created at &bull; {slicedCreatedAt}
            </Box>
          </Box>
        {comment.phrase}
      </Box>
    )
  

}

  useEffect(() => {
    const {user_id} = props.session.user
    if (user_id == post.user_id){
      setAllowed(true)
    }
  }, [])
  

  const onSaveEdit = async () => {
    try {
      const body = {
        caption
      }
      const res = await axiosInstance.patch(`/posts/${post.post_id}`, body)
      alert(res.data.message)
      window.location.reload();
      
    } catch (error) {
      console.log(error);
      alert(error)
    }
  }
  
  const onDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/posts/${post.post_id}`)
      alert(res.data.message)
      router.replace("/")
      
    } catch (error) {
      console.log(error);
      alert(error)
    }
  }

  const onComment = async () => {
    const {user_id} = props.session.user
    console.log({user_id})
    try {
        const body = {
          phrase, user_id
        }

      const res = await axiosInstance.post(`/comments/${post.post_id}`, body)
      alert(res.data.message)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }
    
  const onLike = async () => {

    const {user_id} = props.session.user

   try {
    const body = {user_id}

    const res = await axiosInstance.post(`/likes/${props.post.post_id}`, body)


    setLiked(true)
    setLikeCount(likeCount + 1)
   } catch (error) {
    console.log(error)
    alert(error)
   }
  }

  const onUnlike = async () => {
    
    try {
      const session = await getSession();

        const {accesstoken} = session.user;
        const config = {
          headers: {Authorization: `Bearer ${accesstoken}`},
        };
      const res = await axiosInstance.delete(`/likes/${post.post_id}`, config)

     

      setLiked(false)
      setLikeCount(likeCount - 1)
    } catch (error) {
      console.log(error)
    alert(error)
    }
  }

    const createdAt = post.createdAt
    const slicedCreatedAt = createdAt.slice(0,10)
    const addressAPI = "http://localhost:2105"
    const addressImage = addressAPI.concat(`${post.image}`)
    
  return (
    (
      <Flex>
        <Box as='button' bg={"gray.100"} alignContent={"center"} alignItems={"center"} boxShadow={"2xl"}
      width={480} maxH={1200} borderWidth='1px' borderRadius='lg' overflow='hidden' mt={5} mx={12} _hover={{ background: "white",
      color: "orange.400",}}>
    <Image src={addressImage} width={480} height={320} borderWidth='1px' borderRadius='lg' overflow='hidden'/>
    <Box p='3'>
      <Box display='flex' alignItems='baseline'>
      <Badge borderRadius='md' px='2' colorScheme='teal'>
          Posted by {poster.username}
        </Badge>
        <Box
          color='gray.500'
          fontWeight='semibold'
          letterSpacing='wide'
          fontSize='xs'
          textTransform='uppercase'
          ml='2'
        >
         created at &bull; {slicedCreatedAt}
        </Box>
      </Box>
      <Box
        mt='1'
        fontWeight='medium'
        as='h4'
        lineHeight='tight'
        noOfLines={2}
      >
        {post.caption}
      </Box>
      <Box display='flex' mt='2' alignItems='center'>
      <StarIcon
              color={liked ? 'orange' : 'gray.300'}
            />
        <Box as='span' ml='2' color='gray.600' fontSize='sm'>
          {likeCount} likes
        </Box>
      </Box>
    </Box>
  </Box>
 
  <Box width={480} height={480} p={3} bg={"gray.100"} rounded={6} alignContent={"center"} alignItems={"center"}>
  <Input type="text" width={"100%"}
          placeholder="add comment..."
          variant="outline"
          mb="10px"
          bg="gray.50"
          value={phrase}
          onChange={(event) => setPhrase(event.target.value)}
          >
          
          </Input>
          <Button mx={3}
            variant={"outline"} fontSize={"small"} colorScheme="teal" alignItems="center" height="4vh" width="14vh" 
              onClick={onComment} 
              >
              Post comment
            </Button>
            {!liked?(<><StarIcon color={"gray.300"}></StarIcon><Button onClick={onLike}>Like Post</Button></>)
         :(<><StarIcon color={"orange"}></StarIcon><Button onClick={onUnlike}>Unlike Post</Button></>)} 
            
  {mappedComments}
  </Box>
  
   
  <Flex direction={"column"}>
{allowed? (
  <>
  
  <Button mx={3} my={1}
            variant={"outline"} colorScheme="teal" alignItems="center" height="4vh" width="16vh" 
            onClick={onOpen} >
              Edit Post
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Input type="text" width={"100%"}
          placeholder="caption..."
          variant="outline"
          mb="10px"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}  
          bg="gray.50">
          </Input>
          </ModalBody>

          <ModalFooter>
            <Button variant='outline' colorScheme='orange' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='teal' variant='outline' onClick={onSaveEdit} >Save</Button>
            <Button mx={3} my={1}
            variant={"ghost"} colorScheme="pink" alignItems="center" width="16vh" 
            onClick={onDelete}
              >
              Delete Post
            </Button>
          </ModalFooter>
          </ModalContent>
          </Modal>
  </>
):(<></>)}
  </Flex>
      </Flex>
  )
  )
}


export async function getServerSideProps(context) {
  try {
    const session = await getSession({req: context.req});
    const {post_id} = context.params

    if (!session) return {redirect: {destination: "/login"}};
   
    const {accessToken} = session.user;

    const config = {
      headers: {Authorization: `Bearer ${accessToken}`},
    };

    const user_id = session.user.user_id;
    const res = await axiosInstance.get(`/users/profile/${user_id}`, config);
    const postRes = await axiosInstance.get(`/posts/getPost/${post_id}`, config);
    const commentRes = await axiosInstance.get(`/comments/${post_id}`, config);
    const likeRes = await axiosInstance.get(`/likes/${post_id}`, config)
    
    console.log(user_id, res, postRes, commentRes);

    return {
      props: {user: res.data.data.result, 
        post: postRes.data.data, poster: postRes.data.resGetPoster, 
        comment: commentRes.data.data,
        like: likeRes.data.data
        ,session},
    };
  } catch (error) {
    console.log({error});
    return {props: {}};
  }
}
export default postDetail