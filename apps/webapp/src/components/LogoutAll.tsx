import {
  Button,
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import * as React from "react";

import { apiClient } from "@api";
import { ShowErrors } from "@components";

export const LogoutAll = () => {
  const [registerBody, setRegisterBody] = React.useState<
    Partial<{
      username: string;
      password: string;
    }>
  >();

  const [error, setError] = React.useState<AxiosError>();
  const router = useRouter();

  return (
    <Box sx={{ width: "300px" }}>
      <Typography mb={5} textAlign="center" variant="h4">
        logout all
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
              await apiClient.post("/auth/logout/all", registerBody);
              router.push("/login");
            } catch (e) {
              setError(e as AxiosError);
            }
          }}
          variant="outlined"
        >
          logout
        </Button>
      </Stack>
      <ShowErrors error={error as AxiosError} />
    </Box>
  );
};
