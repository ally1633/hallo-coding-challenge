import { Badge } from "@mui/material";
import { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Rupee } from "@types";
import { RUPEES_IMAGE_MAP } from "./constants";

type Props = {
  size: Rupee;
  width?: number;
  count?: number;
};

export const RupeeIcon = ({ size, width = 20, count }: Props) => {
  const [, setError] = useState<AxiosError>();
  useEffect(() => {
    (async () => {
      try {
        setError(undefined);
      } catch (e) {
        setError(e as AxiosError);
      }
    })();
  }, []);

  return (
    <Badge
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      badgeContent={`x${count}`}
      color="primary"
    >
      <Image width={width} src={RUPEES_IMAGE_MAP[size]} alt={`ruppe ${size}`} />
    </Badge>
  );
};
