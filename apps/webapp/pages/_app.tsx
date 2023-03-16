import { css, Global } from "@emotion/react";
import { Container } from "@mui/material";
import { User } from "@types";
import type { AppProps } from "next/app";
import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme, Navigation, UserContext } from "@components";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const App = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = useState<User>();
  const value = useMemo(() => ({ user, setUser }), [user]);
  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={value}>
        <Global
          styles={css`
            body {
              margin: 0;
            }

            button {
              text-transform: none;
            }

            a:-webkit-any-link {
              text-decoration: none;
            }
          `}
        />

        <Container component="main" sx={{ px: 0, pt: { xs: 10, md: 13 } }}>
          <Navigation />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Component {...pageProps} />
          </LocalizationProvider>
        </Container>
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default App;
