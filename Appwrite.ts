import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { Account, Client } from "node-appwrite";

export const SESSION_COOKIE = "appwrite-session";

export function createAdminClient() {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const apiKey = process.env.APPWRITE_API_KEY;
  const projectId = process.env.APPWRITE_PROJECT_ID;

  if (!endpoint) {
    throw new Error("APPWRITE_ENDPOINT is not set");
  }

  if (!apiKey) {
    throw new Error("APPWRITE_API_KEY is not set");
  }

  if (!projectId) {
    throw new Error("APPWRITE_PROJECT_ID is not set");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export function createSessionClient(headers: ReadonlyHeaders) {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;

  if (!endpoint) {
    throw new Error("APPWRITE_ENDPOINT is not set");
  }

  if (!projectId) {
    throw new Error("APPWRITE_PROJECT_ID is not set");
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId);

  const cookies = parseCookie(headers.get("cookie") ?? "");
  const session = cookies.get(SESSION_COOKIE);

  if (session) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },
  };
}
