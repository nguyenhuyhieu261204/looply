export const returnSuccess = (message = "Success", data, meta = null) => ({
  status: "success",
  success: true,
  message,
  data,
  ...(meta && { meta }),
});

export const returnError = (message = "Error", meta = null) => ({
  status: "error",
  success: false,
  message,
  ...(meta && { meta }),
});
