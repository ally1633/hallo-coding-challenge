import { CurrencyRupee } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip, Grid,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { Product } from "database";
import { useContext, useEffect, useState } from "react";

import { ROLE } from "@constants";
import { BuyResult } from "@types";
import { apiClient } from "@api";
import { ShowErrors, UserContext } from "@components";
import Image from "next/image";
import dayjs from "dayjs";

type Props = {
  products: Product[];
  changeProduct: (_data: Product) => void;
  setProducts: (_data: Product[]) => void;
  onBuy: (_buyResylt: BuyResult) => void;
};

export const ProductList = ({ products, setProducts, changeProduct, onBuy }: Props) => {
  const [error, setError] = useState<AxiosError>();
  useEffect(() => {
    (async () => {
      try {
        setProducts((await apiClient.get("/products")).data);
        setError(undefined);
      } catch (e) {
        setError(e as AxiosError);
      }
    })();
  }, [setProducts]);

  const [amount, setAmount] = useState<number>(1);

  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  if (products.length === 0) {
    return <Typography>There are currently no products.</Typography>;
  }

  return (
    <Stack alignItems="center" gap={3} display="flex" width="100%">
      <List
        sx={{
          pt: 2,
          pb: 0,
          width: "100%",
          maxWidth: "700px",
          maxHeight: error
            ? { xs: "65vh", md: "100vh" }
            : { xs: "calc(100vh - 56px)", md: "100vh" },
          overflow: "scroll",
          bgcolor: "background",
        }}
      >
        {products?.map((product) =>
          product.amountAvailable > 0 ? (
            <ListItem key={product.id}>
              <ListItemText
                sx={{ width: { md: "300px", xs: "80px" } }}
                primary={
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Image width={100} height={100} src={product.productImage} alt={product.productName} />
                            </Grid>
                            <Grid item xs={8}>
                                <Typography fontSize={20} m={2}>
                                    {product.productName}
                                    <Typography ml={1} fontSize={15} component="span">
                                        ({product.amountAvailable})
                                    </Typography>
                                </Typography>
                                <Typography
                                    fontSize={25}
                                    p={1}
                                    fontWeight="700"
                                    color="secondary"
                                    display="flex"
                                >
                                    <CurrencyRupee fontSize="large" />
                                    {`${product.cost / 100}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Box pb={4}>
                                    <Chip
                                        color={dayjs().isBefore(dayjs(product.expiresAt)) ? 'secondary':'error'}
                                        label={dayjs().isBefore(dayjs(product.expiresAt)) ? 'Active':'Expired'}
                                    />
                                </Box>

                                {user?.role === ROLE.SELLER && (
                                    <Button
                                        onClick={ () => changeProduct(product)}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Edit
                                    </Button>
                                )}
                                {user?.role === ROLE.BUYER && (
                                    <>
                                        <TextField
                                            sx={{ mr: 2, width: { xs: 60, md: 90 } }}
                                            defaultValue={amount}
                                            label="amount"
                                            onChange={(event) => {
                                                setAmount(parseInt(event.target.value));
                                            }}
                                            type="number"
                                            InputProps={{
                                                inputProps: {
                                                    min: product.amountAvailable > 0 ? 1 : 0,
                                                    max: product.amountAvailable,
                                                },
                                            }}
                                        />
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    const { data: bought } = await apiClient.post("/buy", {
                                                        productId: product.id,
                                                        amount: amount,
                                                    });
                                                    onBuy(bought);
                                                } catch (e) {
                                                    setError(e as AxiosError);
                                                }
                                            }}
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                        >
                                            buy
                                        </Button>
                                    </>
                                )}
                            </Grid>
                        </Grid>

                  </>
                }
                secondary={<span></span>}
              />
            </ListItem>
          ) : null
        )}
      </List>
      <ShowErrors error={error as AxiosError} />
    </Stack>
  );
};
