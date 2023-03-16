import Head from "next/head";

import { LoginForm } from "@components";
import { Box } from "@mui/material";

const Login = () => {
  return (
    <>
      <Head>
        <title>PEPSI Machine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box display="flex" width="100%" justifyContent="center">
        <LoginForm />
      </Box>
    </>
  );
};

export default Login;
