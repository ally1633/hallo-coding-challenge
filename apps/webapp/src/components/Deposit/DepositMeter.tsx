import { CurrencyRupee } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

type Props = { amount: number; sx?: SxProps<Theme> };

export const DepositMeter = ({ amount, sx }: Props) => {
  return (
    <Chip
      variant="outlined"
      color="primary"
      sx={{ ml: 2, width: 100, ...sx }}
      label={
        <Box display="flex" alignItems="center">
          <CurrencyRupee />
          <Typography>{amount}</Typography>
        </Box>
      }
    />
  );
};
