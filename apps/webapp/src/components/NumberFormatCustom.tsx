import * as React from "react";
import { NumericFormat } from "react-number-format";
import type { InputAttributes, NumericFormatProps } from "react-number-format";

interface CustomProps {
  onChange: (_event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumberFormatCustom = React.forwardRef<
  NumericFormatProps<InputAttributes>,
  CustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="R "
      allowNegative={false}
      decimalScale={2}
      min={0.05}
    />
  );
});
