import {
  Input,
  Button,
  Flex,
  Box,
  Tag,
  TagLeftIcon,
  TagLabel,
  Text,
  Link,
  VStack,
  Badge,
  HStack,
  Image,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import axiosInstance from "../services/axiosinstance";

export default function Home(props) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(props.user);
  const [allPosts, setAllPosts] = useState([]);
  const [search, setSearch] = useState([]);
  // const search = "coldplay";
  const router = useRouter();
  const [session, setSession] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const toast = useToast();

  useEffect(() => {
    fetchAllPosts();
    getSessionAsync();
  }, [page]);

  const onPrevClick = () => {
    setPage(page - 1);
  };

  const onNextClick = () => {
    setPage(page + 1);
  };

  const fetchAllPosts = async () => {
    try {
      const config = {
        params: { page, pageSize },
      };
      const res = await axiosInstance.get(`/posts`, config);

      setAllPosts(res.data.data);
    } catch (error) {
      alert(error);

      toast({
        title: "Unexpected Fail fetching all posts!",
        description: error.response.data?.message
          ? error.response.data.message
          : error.message,
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchPostsBySearch = async () => {
    try {
      // const config = {
      //   params: { page, pageSize },
      // };
      const res = await axiosInstance.get(`/posts/getPostsBySearch/${search}`);
      console.log(res.data.data);
      setAllPosts(res.data.data);
    } catch (error) {
      console.log({ error });
      toast({
        title: "Unexpected Fail fetching searched posts!",
        description: error.response.data?.message
          ? error.response.data.message
          : error.message,
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const mappedPosts = allPosts.map(renderPosts);

  function renderPosts(post) {
    const addressAPI = "http://localhost:2105";
    const addressImage = addressAPI.concat(`${post.image}`);
    const createdAt = post.createdAt;
    const slicedCreatedAt = createdAt.slice(0, 10);
    const postId = post.post_id;

    return (
      <Link mt={6} key={postId} href={`/postdetail/${postId}`}>
        <Box
          as="button"
          bg={"gray.100"}
          alignContent={"center"}
          alignItems={"center"}
          boxShadow={"2xl"}
          width={480}
          maxH={1200}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mx={2}
          _hover={{ background: "white", color: "orange.400" }}
        >
          <Image
            src={addressImage}
            width={480}
            height={320}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          />
          <Box p="3">
            <Box display="flex" alignItems="baseline">
              <Badge borderRadius="md" px="2" colorScheme="teal">
                Posted by {post.username}
              </Badge>
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                created at &bull; {slicedCreatedAt}
              </Box>
            </Box>
            <Box
              mt="1"
              fontWeight="medium"
              as="h4"
              lineHeight="tight"
              noOfLines={2}
            >
              {post.caption}
            </Box>
            <Box display="flex" mt="2" alignItems="center">
              <></>
              <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {post.likeCount}
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    );
  }

  async function getSessionAsync() {
    const session = await getSession();
    setSession(true);
    if (!session) {
      router.replace("/login");
    }
  }

  const onImageChange = (event) => {
    setImage(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onPostClick = async () => {
    setLoading(true);
    try {
      const session = await getSession();

      const { accesstoken } = session.user;
      const user_id = session.user.user_id;
      const body = new FormData();
      body.append("image", image);
      body.append("caption", caption);
      body.append("user_id", user_id);
      const config = {
        headers: { Authorization: `Bearer ${accesstoken}` },
      };
      const res = await axiosInstance.post("/posts", body, config);
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setLoading(false);
      setImage(null);
      setCaption(null);
      setPreview(null);
    }
  };

  const onWowClick = () => {
    console.log("heheheheh");
  };

  return (
    <VStack spacing={20} align={"center"}>
      <Box
        maxH="10vh"
        width="80%"
        align-items="center"
        my="auto"
        mx="auto"
        padding={"auto"}
        rounded={8}
      >
        <Text
          mb={3}
          fontSize={"3xl"}
          fontWeight={"semibold"}
          color={"teal.500"}
          fontStyle={"normal"}
        >
          Hi! {user.username}!
        </Text>
        <Input
          type="text"
          width={"100%"}
          placeholder="What's going on?"
          variant="outline"
          mb="10px"
          bg="gray.50"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
        {loading ? (
          <Button
            mx={3}
            isLoading
            variant={"outline"}
            colorScheme="teal"
            alignItems="center"
            width="20vh"
            onClick={onPostClick}
          >
            Post!
          </Button>
        ) : (
          <Button
            mx={3}
            variant={"outline"}
            colorScheme="teal"
            alignItems="center"
            width="20vh"
            onClick={onPostClick}
          >
            Post!
          </Button>
        )}

        {preview ? (
          <>
            {loading ? (
              <Button
                mx={3}
                isLoading
                colorScheme="orange"
                alignItems="center"
                width="22vh"
                onClick={() => {
                  setPreview(null), setImage(null);
                }}
              >
                Remove Image
              </Button>
            ) : (
              <Button
                mx={3}
                colorScheme="orange"
                alignItems="center"
                width="22vh"
                onClick={() => {
                  setPreview(null), setImage(null);
                }}
              >
                Remove Image
              </Button>
            )}
          </>
        ) : (
          <>
            <label for="inputImage">
              {" "}
              <Tag
                variant="outline"
                colorScheme="teal"
                _hover={{ background: "white", color: "orange.400" }}
              >
                <TagLeftIcon boxSize={"12px"} as={AddIcon} />
                <TagLabel>Image</TagLabel>
              </Tag>
            </label>
            <input
              id="inputImage"
              style={{ visibility: "hidden" }}
              type={"file"}
              value={image}
              onChange={onImageChange}
            />
          </>
        )}
      </Box>
      <Flex wrap={"wrap"} direction={"row"} align="center">
        {mappedPosts}
      </Flex>
      {allPosts.length ? (
        <HStack paddingLeft={20}>
          <Button
            variant={"outline"}
            marginRight={2}
            onClick={onPrevClick}
            isDisabled={page == 1}
            colorScheme="messenger"
          >
            Prev
          </Button>
          <Text paddingRight={2}>{page}</Text>
          <Button
            variant={"outline"}
            onClick={onNextClick}
            isDisabled={page >= allPosts.length}
            colorScheme="messenger"
          >
            Next
          </Button>
        </HStack>
      ) : (
        <Text>There are no Posts!</Text>
      )}
      <HStack paddingBottom={20} marginBottom={6}>
        <Input type={"text"} onChange={onSearchChange}></Input>
        <Button onClick={fetchPostsBySearch} placeholder="search posts here!">
          <SearchIcon></SearchIcon>
        </Button>
      </HStack>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const user_id = session.user.user_id;
    // console.log({user_id})
    const res = await axiosInstance.get(`/users/profile/${user_id}`, config);

    return {
      props: {
        user: res.data.data.result,

        session,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: {} };
  }
}
