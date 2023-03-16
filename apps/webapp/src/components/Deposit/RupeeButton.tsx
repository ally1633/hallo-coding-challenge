import { IconButton } from "@mui/material";

import Image from "next/image";

import { Rupee } from "@types";
import { RUPEES_IMAGE_MAP } from "./constants";
import disabledRupee from "./disabled.png";

type Props = {
  size: Rupee;
  onClick: () => void;
  disabled?: boolean;
  width?: number;
};

export const RupeeButton = ({ size, onClick, disabled, width = 50 }: Props) => {
  return (
    <IconButton disabled={disabled} size="large" onClick={onClick}>
      <Image
        width={width}
        src={disabled ? disabledRupee : RUPEES_IMAGE_MAP[size]}
        alt={`ruppe ${size}`}
      />
    </IconButton>
  );
};
