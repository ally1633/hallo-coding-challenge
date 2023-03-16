import { AxiosError } from "axios";

export function getErrorsFromResponse(e: AxiosError) {
  const errorMessages = (e as AxiosError<{ message: string[] }>)?.response?.data
    ?.message;
  if (Array.isArray(errorMessages)) {
    return errorMessages;
  } else if (typeof errorMessages === "string") {
    return [errorMessages];
  }
}
