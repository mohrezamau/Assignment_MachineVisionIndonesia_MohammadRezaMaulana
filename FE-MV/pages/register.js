import React from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Box,
  Text,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import axiosInstance from "../services/axiosinstance";
import { passwordStrength } from "check-password-strength";
import { useRouter } from "next/router";
function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const onRegisterClick = async () => {
    setLoading(true);
    try {
      const body = {
        username,
        email,
        password,
      };

      const res = await axiosInstance.post("/users/register", body);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const onResendClick = async () => {
    try {
      const body = {
        username,
        email,
        password,
      };

      const res = await axiosInstance.post("/users/resend", body);
      setSent(true);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  function okChecker() {
    if (!password)
      return (
        <Alert status="info" rounded={6}>
          <AlertIcon />
          mind that your password contains both lowercase and uppercase letters,
          a symbol, a number, and a minimum of 8 characters!
        </Alert>
      );
    const strengthTester = passwordStrength(password).value;
    const length = password.length;
    let pass = password;
    let conPass = confirmPassword;
    let statusStrength;
    let textStrength;
    switch (strengthTester) {
      case "Too weak":
        statusStrength = "warning";
        textStrength = "password is too weak";
        break;
      case "Weak":
        statusStrength = "warning";
        textStrength = "password is weak";
      case "Medium":
        statusStrength = "success";
        textStrength = "password is sufficient";
        break;
      case "Strong":
        statusStrength = "success";
        textStrength = "password is strong";
        break;
      default:
        statusStrength = "info";
        textStrength =
          " Mind that your password contains both lowercase and uppercase letters, a symbol, a number, and a minimum of 8 characters!";
    }

    // console.log(pass, conPass)
    if (length < 8) {
      return (
        <Alert status="warning" rounded={6}>
          <AlertIcon />
          password needs a minimum of 8 characters!
        </Alert>
      );
    }
    if (statusStrength === "warning" || statusStrength === "info") {
      return (
        <>
          <Alert status={`${statusStrength}`} rounded={6}>
            <AlertIcon />
            {`${textStrength}`}
          </Alert>
          <Button
            mt={5}
            mb={5}
            colorScheme="teal"
            alignItems="center"
            width="30vh"
            isDisabled
            onClick={onRegisterClick}
          >
            Sign up
          </Button>
        </>
      );
    } else if (statusStrength == "success" && pass == conPass) {
      return (
        <>
          <Alert status={`${statusStrength}`} rounded={6}>
            <AlertIcon />
            {`${textStrength}`}
          </Alert>
          {loading ? (
            <Button
              mt={5}
              mb={5}
              colorScheme="teal"
              alignItems="center"
              width="30vh"
              isLoading
              loadingText="Submitting"
              variant="outline"
              onClick={onRegisterClick}
            >
              Sign up
            </Button>
          ) : (
            <Button
              mt={5}
              mb={5}
              colorScheme="teal"
              alignItems="center"
              width="30vh"
              onClick={onRegisterClick}
            >
              Sign up
            </Button>
          )}
        </>
      );
    } else if (statusStrength == "success") {
      return (
        <>
          <Alert status={`${statusStrength}`} rounded={6}>
            <AlertIcon />
            {`${textStrength}`}
          </Alert>
          <Button
            mt={5}
            mb={5}
            colorScheme="teal"
            alignItems="center"
            width="30vh"
            isDisabled
            onClick={onRegisterClick}
          >
            Sign up
          </Button>
        </>
      );
    }
  }

  return (
    <Flex
      height="85vh"
      alignItems="center"
      justifyContent="center"
      gap="100px"
      mx="10px"
    >
      <Flex direction="column" p={12} rounded={6}>
        <Box
          height="80vh"
          width="sm"
          maxW={"sm"}
          alignItems="center"
          justifyContent="center"
        ></Box>
      </Flex>
      <Flex
        direction="column"
        p={10}
        rounded={6}
        height="80vh"
        width="75vh"
        alignItems={"center"}
      >
        {!success ? <Heading mb={5}>Sign up!</Heading> : ""}
        {!success ? (
          <>
            <Input
              type="text"
              value={username}
              placeholder="username"
              variant="filled"
              mb={3}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              type="text"
              value={email}
              placeholder="email"
              variant="filled"
              mb={3}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              type="password"
              value={password}
              placeholder="password"
              variant="filled"
              mb={3}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Input
              type="password"
              value={confirmPassword}
              placeholder="confirm password"
              variant="filled"
              mb={6}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </>
        ) : (
          <>
            <Flex
              alignItems="center"
              justifyContent="center"
              direction="column"
              background="gray.400"
              p={12}
              rounded={6}
            >
              <Heading mb={6}>
                Registration success, we have sent you a verification email!
              </Heading>
              <Text mb={3}>
                {" "}
                If you did not get an email, you can resend with the button
                below
              </Text>
              <Button
                colorScheme="teal"
                width={"150px"}
                onClick={onResendClick}
              >
                Resend Email
              </Button>
              <Text mt={3}>
                proceed to{" "}
                <Link color="teal" href="/login">
                  login!
                </Link>
              </Text>
            </Flex>
            {sent ? (
              <Alert status="success" rounded={6}>
                <AlertIcon />
                new verification email sent!
              </Alert>
            ) : (
              ""
            )}
          </>
        )}

        {!success ? (
          <Text mt={5} mb={5}>
            Already have an account?, you can sign in{" "}
            <Link color="teal" href="/login">
              here!
            </Link>
          </Text>
        ) : (
          ""
        )}
        {!success ? <>{okChecker()}</> : ""}
      </Flex>
    </Flex>
  );
}

export default register;
