import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

/**
 * Modified axios http methods to automate passing of auth and other header data
 * (could be replaced with interceptor/middleware)
 */

function getEnv() {
  const username = process.env.ODK_USERNAME;
  const password = process.env.ODK_PASSWORD;
  const baseUrl = `${process.env.ODK_SERVER_URL}/odktables`;
  return { username, password, baseUrl };
}

async function get<T = any>(endpoint: string, config: AxiosRequestConfig = {}) {
  const { baseUrl, username, password } = getEnv();
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .get(url, { auth: { username, password }, ...config })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}

async function post<T = any>(endpoint: string, data: any, headers = {}) {
  const { baseUrl, username, password } = getEnv();
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .post(url, data, {
      auth: { username, password },
      headers: {
        ...headers,
        "X-OpenDataKit-Version": "2.0",
        // set max limits for posting size
        maxContentLength: 100000000,
        maxBodyLength: 1000000000,
      },
    })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}
async function put<T = any>(endpoint: string, data: any, headers = {}) {
  const { baseUrl, username, password } = getEnv();
  const url = `${baseUrl}/${endpoint}`;
  return axios
    .put(url, data, {
      auth: { username, password },
      headers: { ...headers, "X-OpenDataKit-Version": "2.0" },
      // set max limits for posting size
      maxContentLength: 100000000,
    })
    .then((res) => handleRes<T>(res))
    .catch((err) => handleErr(err));
}
async function del<T = any>(endpoint: string) {
  const { baseUrl, username, password } = getEnv();
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
  if (err.toJSON) {
    const { message } = err.toJSON() as Error;
    console.log(message);
  }
  if (err.message) {
    console.log(err.message);
  }
  if (err.code) {
    const e = err as any; // possible network error instead of axios
    console.log(`[${e.code}][${e.hostname}]`);
  } else if (err.response) {
    console.log(
      `[${err.response.status}][${err.request.method}]`,
      err.request.path
    );
    console.log(err.response.data);
  } else {
    console.log("err", Object.keys(err));
  }

  throw new Error("request failed, see logs for details");
}

export default { get, post, del, put };
