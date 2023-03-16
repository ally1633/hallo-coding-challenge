import {
  Badge,
  Box,
  Button,
  Container,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";

import { DEPOSIT_SIZES } from "@constants";
import { Rupee, User } from "@types";
import { apiClient } from "@api";

import {
  ShowErrors,
  UserContext,
  DepositMeter,
  RupeeButton,
} from "@components";

type State = {
  size?: Rupee;
  isMachineReloading?: boolean;
  progress: number;
  progressInterval?: NodeJS.Timer;
};

const TOTAL = 100;
const STEP = 10;
const SPEED = 50;

export const DepositForm = () => {
  const [error, setError] = useState<AxiosError>();

  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    setAudio(new Audio("win.mp3"));
  }, []);

  const [state, setState] = useState<State>({ progress: 0 });
  const [snackOpen, setSnackOpen] = useState(false);

  const { setUser } = useContext(UserContext);
  const startProgress = () => {
    setState((current) => ({ ...current, progress: 0 }));

    const intervalProgress = setInterval(() => {
      setState((current) => {
        if (current.progress >= TOTAL) {
          clearInterval(intervalProgress);
          setSnackOpen(false);

          return {
            ...current,
            isMachineReloading: false,
          };
        }
        return { ...current, progress: current.progress + STEP };
      });
    }, SPEED);
  };

  const startMachineReload = (size: Rupee) => {
    setState((current) => ({
      ...current,
      size,
      isMachineReloading: true,
    }));
    setSnackOpen(true);

    startProgress();
  };

  const matches = useMediaQuery("(min-width:400px)");

  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          mb={5}
        >
          <Typography mb={5} textAlign="center" variant="h4" marginBottom={0}>
            deposit rupees
          </Typography>
          <DepositMeter amount={user.deposit / 100} />
        </Stack>

        <Stack mt={12} direction="row" justifyContent="center">
          {DEPOSIT_SIZES.map((size) => (
            <Badge key={size} badgeContent={size / 100} color="secondary">
              <RupeeButton
                disabled={state.isMachineReloading}
                size={size}
                width={matches ? 50 : 40}
                onClick={async () => {
                  try {
                    const { data: updatedUser } = await apiClient.post(
                      "/deposit",
                      {
                        deposit: size,
                      }
                    );
                    setUser?.(updatedUser);
                    startMachineReload(size);

                    audio?.play();
                  } catch (e) {
                    setError(e as AxiosError);
                  }
                }}
              />
            </Badge>
          ))}
        </Stack>
        <Box>
          <Container sx={{ width: "60%", height: 60, mt: 4 }}>
            {state.isMachineReloading && (
              <LinearProgress variant="determinate" value={state.progress} />
            )}
          </Container>
        </Box>
        <Box textAlign="center">
          <Button
            onClick={async () => {
              try {
                const { data: user } = await apiClient.post<User>("/reset");

                setUser?.(user);
              } catch (e) {
                setError(e as AxiosError);
              }
            }}
            variant="outlined"
            disabled={user.deposit === 0}
          >
            reset deposit to 0
          </Button>
        </Box>

        <Box>
          <ShowErrors error={error as AxiosError} />
        </Box>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackOpen}
        message={`added ${state.size} rupees to your deposit`}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={state.isMachineReloading}
        message={`machine reloading.`}
      />
    </>
  );
};
