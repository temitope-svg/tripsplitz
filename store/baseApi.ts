import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@src/services/config.service";

// initialize a base empty api service that we'll inject endpoints into later as needed
export const baseEmptyApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: "baseEmptyApi",
});
