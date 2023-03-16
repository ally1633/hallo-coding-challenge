import { Stack } from "@mui/material";

import { DEPOSIT_SIZES } from "@constants";
import { RupeeIcon } from "@components";

type Props = {
  change: number[];
};

export const RupeeChange = ({ change }: Props) => {
  return (
    <Stack
      direction="row"
      width="100%"
      maxWidth="400px"
      justifyContent="space-between"
      gap={3}
    >
      {change.map((value, index) => {
        return <RupeeIcon size={DEPOSIT_SIZES[index]} count={value} />;
      })}
    </Stack>
  );
};
