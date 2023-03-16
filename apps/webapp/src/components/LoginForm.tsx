import {
  Button,
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { User } from "@types";
import { useRouter } from "next/router";
import * as React from "react";

import { apiClient } from "@api";
import { ShowErrors, UserContext } from "@components";
import { ROLE } from "@constants";

export const LoginForm = () => {
  const [registerBody, setRegisterBody] = React.useState<Partial<User>>();

  const [error, setError] = React.useState<AxiosError>();
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);

  if (user) {
    return null;
  }

  return (
    <Box component="form" sx={{ width: "300px" }}>
      <Typography mb={5} textAlign="center" variant="h4">
        login
      </Typography>
      <Stack gap={4}>
        <TextField
          label="username"
          onChange={(event) => {
            setRegisterBody((current) => ({
              ...current,
              username: event.target.value,
            }));
          }}
        />
        <FormControl>
          <TextField
            label="password"
            onChange={(event) => {
              setRegisterBody((current) => ({
                ...current,
                password: event.target.value,
              }));
            }}
            type="password"
          />
        </FormControl>
        <Button
          onClick={async () => {
            try {
              setError(undefined);
              const { data: currentUser } = await apiClient.post<User>(
                "/auth/login",
                registerBody
              );

              setUser?.(currentUser);
              router.push(
                currentUser.role === ROLE.BUYER ? "/deposit" : "/products"
              );
            } catch (e) {
              setError(e as AxiosError);
            }
          }}
          variant="outlined"
        >
          submit
        </Button>
      </Stack>
      <ShowErrors error={error as AxiosError} />
    </Box>
  );
};
