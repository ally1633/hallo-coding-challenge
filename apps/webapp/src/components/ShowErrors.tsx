import { Alert, AlertTitle, Stack, Typography } from "@mui/material";
import { AxiosError } from "axios";

import { getErrorsFromResponse } from "@utils";
import Link from "next/link";

export const ShowErrors = ({ error }: { error: AxiosError }) => {
  const messages = getErrorsFromResponse(error);

  if (!messages || messages?.length === 0) {
    return null;
  }

  return (
    <Stack sx={{ mt: 2, width: "100%" }} spacing={2}>
      {messages.map((message) => {
        let specialCase: React.ReactNode;
        if (
          message.includes(
            "There is already an active session using your account"
          )
        ) {
          specialCase = (
            <Typography>
              There is already an active session using your account. Maybe you
              would like to <Link href="/logout-all">force log out them.</Link>
            </Typography>
          );
        }
        return (
          <Alert key={message} severity="error">
            <AlertTitle>Error</AlertTitle>
            {specialCase || message}
          </Alert>
        );
      })}
    </Stack>
  );
};
