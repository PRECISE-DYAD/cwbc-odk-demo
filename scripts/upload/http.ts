import axios, { AxiosResponse, AxiosError } from "axios";
require("dotenv").config();

/**
 * Modified axios http methods to automate passing of auth and other header data
 * (could be replaced with interceptor/middleware)
 */
const username = process.env.ODK_USERNAME;
const password = process.env.ODK_PASSWORD;
const baseUrl = `${process.env.ODK_SERVER_URL}/odktables`;

async function get<T = any>(endpoint: string) {
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .get(url, { auth: { username, password } })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}

async function post<T = any>(endpoint: string, data: any, headers = {}) {
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .post(url, data, {
      auth: { username, password },
      headers: {
        ...headers,
        "X-OpenDataKit-Version": "2.0",
      },
    })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}
async function put<T = any>(endpoint: string, data: any, headers = {}) {
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .put(url, data, {
      auth: { username, password },
      headers: { ...headers, "X-OpenDataKit-Version": "2.0" },
    })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}
async function del<T = any>(endpoint: string) {
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .delete(url, { auth: { username, password } })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}

function handleRes<T>(res: AxiosResponse) {
  console.log(`[${res.status}][${res.request.method}]`, res.request.path);
  if (res.data.hasMoreResults) {
    throw new Error(
      "Batch requests not currently supported, res has more results"
    );
  }
  return res.data as T;
}
function handleErr<T = any>(err: AxiosError): T {
  console.log(
    `[${err.response.status}][${err.request.method}]`,
    err.request.path
  );
  console.log(err.response.data);
  throw new Error("request failed, see logs for details");
}

export default { get, post, del, put };
