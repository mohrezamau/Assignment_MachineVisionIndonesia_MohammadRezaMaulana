import React from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Link,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Icon, ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import NextAuth from "next-auth/react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";

function login() {
  async function getSessionAsync() {
    const session = await getSession();

    if (session) {
      router.replace("/");
    }

    console.log({ session });
  }

  useEffect(() => {
    getSessionAsync();
  }, []);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onLoginClick = async () => {
    // try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(res);
    if (!res.error) {
      router.replace("/");
    } else {
      console.log(res.error);
      alert(res.error);
    }
  };

  function PasswordInput() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          variant={"filled"}
          mb={6}
        />
        <InputRightElement>
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  }

  return (
    <Flex height="60vh" alignItems="center" justifyContent="center">
      <Flex
        alignItems="center"
        justifyContent="center"
        direction="column"
        background="gray.400"
        p={12}
        rounded={6}
      >
        <Heading mb={6}>Welcome!</Heading>
        <Input
          type="text"
          value={email}
          placeholder="your@mail.com"
          variant="filled"
          mb={3}
          onChange={(event) => setEmail(event.target.value)}
        />
        {PasswordInput()}

        <Button colorScheme="teal" width={"100px"} onClick={onLoginClick}>
          Login
        </Button>
        <Text mt={5}>
          Don't have an account?, you can sign up{" "}
          <Link color="teal" href="/register">
            here!
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}

export default login;
