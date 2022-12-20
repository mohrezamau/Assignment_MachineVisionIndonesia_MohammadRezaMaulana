import { Button } from "@chakra-ui/react";

export default function MyButton(props) {
  const { children } = props;
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}