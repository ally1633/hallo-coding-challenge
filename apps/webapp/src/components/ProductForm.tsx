import {
    Button,
    Box,
    Stack,
    Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { Product } from "database";
import * as React from "react";
import { apiClient } from "@api";
import { NumberFormatCustom, ShowErrors } from "@components";
import {useEffect} from "react";
import {FormContainer,Controller, TextFieldElement, useForm} from "react-hook-form-mui";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
const weekday = require('dayjs/plugin/weekday')
dayjs.extend(weekday)

type Props = {
    onAdd: () => {};
    onChange: () => void;
    product?: Product;
};

export const ProductForm = ({ onAdd,onChange, product }: Props) => {
    const [error, setError] = React.useState<AxiosError>();
    const isEdit = product?.id;

    // @ts-ignore
    const formValues: Partial<Product> = product ?{...product, expiresAt: dayjs(product?.expiresAt)}: {expiresAt:  dayjs().weekday(1)};
    const formContext = useForm<Product>({
        defaultValues: formValues,
    })
    const {handleSubmit,setValue, reset, control} = formContext

    useEffect(() => {
        reset(formValues);
    }, [product, reset]);

    const onSubmit =  async (data:Product) => {
        try {
           await apiClient[isEdit?'put':'post']<Product>("/products",
               {
                   ...data,
                   cost: data?.cost * 100
               }
           );
           onChange();
           onAdd();
           setError(undefined);
           reset(formValues)
        } catch (e) {
            setError(e as AxiosError);
        }
    }

    return (
        <Box sx={{ width: "300px" }}>
            <Typography mb={5} textAlign="center" variant="h4">
                {isEdit?`You are editing product named ${product?.productName}`:'Add Product'}
            </Typography>
            <FormContainer
                formContext={formContext}
                handleSubmit={handleSubmit(onSubmit)}
            >
                <Stack gap={4}>
                    <TextFieldElement name="cost" label="Cost" required
                                      onChange={(event)=>setValue("cost",parseFloat(event.target.value))}
                                      InputProps={{inputComponent: NumberFormatCustom as any }}/>
                    <TextFieldElement type={"number"} name="amountAvailable" label="Amount available" required onChange={(event)=>setValue("amountAvailable",parseInt(event.target.value))}/>
                    <TextFieldElement name="productName" label="Name" required/>
                    <TextFieldElement name="productImage" label="Image" required/>
                    <Controller
                        control={control}
                        name="expiresAt"
                        render={({field})=>
                            <DateTimePicker
                                label="Expiration date"
                                onChange={field?.onChange}
                                // @ts-ignore
                                value={field.value ? dayjs(field.value) : dayjs().weekday(1)}
                                format="DD-MM-YYYY hh:mm"
                                disablePast={true}
                                shouldDisableDate={(date:string)=> date? new Date(date).getDay() === 0 || new Date(date).getDay() === 6: false}
                            />}
                    />


                    {isEdit && <Button
                        onClick={()=>{
                            reset({});
                            onChange()
                        }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>

                </Stack>
            </FormContainer>
            <ShowErrors error={error as AxiosError} />
        </Box>
    );
};
