import { JsonObject } from "type-fest";
import { createOAuthHeader } from "./create-oauth-header";
import { getTrelloApiResponseErrorMessage } from "./get-trello-api-response-error-message";

type TrelloApiRequestParams = {
  trelloToken: string;
  appKey: string;
  method?: string;
  body?: JsonObject;
  searchParams?: JsonObject;
};

export async function trelloApiRequest<Data>(
  path: string,
  { appKey, trelloToken, method, body, searchParams }: TrelloApiRequestParams,
): Promise<Data> {
  const url = prepareUrl(path, searchParams);
  const requestInit = await prepareRequestInit({
    appKey,
    trelloToken,
    method,
    body,
  });

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    const errorMessage = await getTrelloApiResponseErrorMessage(response);

    throw new Error(errorMessage);
  }

  const data = await response.json();

  return data;
}

function prepareUrl(path: string, searchParams?: JsonObject) {
  const baseUrl = `${API_URL}/${path}`;

  if (!searchParams) {
    return baseUrl;
  }

  const search = `?${prepareSearchParamsString(searchParams)}`;

  return `${baseUrl}${search}`;
}

async function prepareRequestInit({
  appKey,
  trelloToken,
  method,
  body,
}: TrelloApiRequestParams) {
  const init: RequestInit = {
    headers: prepareHeaders(appKey, trelloToken),
  };

  if (method) {
    init.method = method;
  }

  if (body) {
    init.body = JSON.stringify(body);
  }

  return init;
}

function prepareSearchParamsString(input: JsonObject): string {
  const init = Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      return [key, value?.toString() ?? ""];
    }),
  );

  return new URLSearchParams(init).toString();
}

function prepareHeaders(appKey: string, trelloToken: string) {
  return {
    accept: "application/json",
    "content-type": "application/json",
    authorization: createOAuthHeader(appKey, trelloToken),
  };
}

const API_URL = "https://api.trello.com/1";
