import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import {
  Stack,
  styled,
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ButtonProps } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import { apiClient } from "@api";
import { UserContext, DepositMeter } from "@components";

import { yellow } from "@mui/material/colors";

const pagesAuthed = ["products", "deposit"];
const pagesGuest = ["login", "register"];

export const Navigation = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const router = useRouter();

  const { user, setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    (async () => {
      try {
        if (!user) {
          const user = await apiClient.get("/auth/me");
          setUser?.(user.data);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [setUser, user]);

  const pages = user ? pagesAuthed : pagesGuest;

  return (
    <AppBar position="fixed">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                setAnchorElNav(event.currentTarget);
              }}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              disableScrollLock
              anchorEl={anchorElNav}
              keepMounted
              open={Boolean(anchorElNav)}
              onClose={() => {
                setAnchorElNav(null);
              }}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <Stack p={2} gap={2}>
                {pages.map((page) => (
                  <Link key={page} href={`/${page}`}>
                    <Typography p={3} fontSize={25}>
                      {page}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              gap: 5,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {pages.map((page) => (
              <Link key={page} href={`/${page}`}>
                <Typography
                  sx={{ textDecoration: "none !important" }}
                  color="white"
                >
                  {page}
                </Typography>
              </Link>
            ))}
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            pr={{ xs: 2, md: 4 }}
            gap={{ xs: 2, md: 4 }}
          >
            {user && (
              <>
                <Link href="/deposit">
                  <DepositMeter
                    sx={{
                      borderColor: yellow[500],
                      color: yellow[500],
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    amount={user.deposit / 100}
                  />
                </Link>
                <NavigationButton
                  size="small"
                  endIcon={<LogoutIcon />}
                  onClick={async () => {
                    try {
                      await apiClient.post("/auth/logout");
                      setUser?.(undefined);
                    } catch (e) {
                      console.log(e);
                    }

                    router.push("/login");
                  }}
                >
                  logout
                </NavigationButton>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const NavigationButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(yellow[500]),
  backgroundColor: yellow[500],
  "&:hover": {
    backgroundColor: yellow[700],
  },
  px: 3,
}));
