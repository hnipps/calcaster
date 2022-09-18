import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { BaseExternalAccountClient, OAuth2Client } from "google-auth-library";
import { arrayify, keccak256, toUtf8Bytes } from "ethers/lib/utils";

import dotenv from "dotenv";
dotenv.config();

import { Event, EventData } from "../../types";
import getWallet from "./wallet";
import init from "./lit";
import encrypt from "./lit/encrypt";
import config from "./config";
import decrypt from "./lit/decrypt";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, "../token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const CALCASTER_DATA_PATH = path.join(__dirname, "../output/data.json");
const ENCRYPTED_DATA_PATH = path.join(__dirname, "../encrypted/encrypted.json");

const wallet = getWallet(process.env.MNEMONIC);
console.info("Address:", wallet.address);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, { encoding: "utf-8" });
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: "utf-8" });
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  const client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  const oauthClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (oauthClient.credentials) {
    await saveCredentials(oauthClient);
  }
  return oauthClient;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth: BaseExternalAccountClient | OAuth2Client) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 5,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming events:");
  const calEvents = (
    await Promise.all(
      events.map(async ({ start, end, transparency }, i) => {
        if (
          start?.dateTime &&
          start?.timeZone &&
          end?.dateTime &&
          end?.timeZone &&
          transparency !== "transparent"
        ) {
          const data: EventData = {
            start: {
              datetime: start.dateTime,
              timezone: start.timeZone,
            },
            end: {
              datetime: end.dateTime,
              timezone: end.timeZone,
            },
          };

          const merkleRoot = keccak256(toUtf8Bytes(JSON.stringify(data)));

          const message = arrayify(merkleRoot);

          const signature = await wallet.signMessage(message);

          return {
            data,
            merkleRoot,
            signature,
          };
        }
        return false;
      })
    )
  ).filter((item) => Boolean(item)) as Event[]; // Coercing type here because we know the filter will remove all "false" items

  console.log("data:", calEvents);

  await fs.writeFile(CALCASTER_DATA_PATH, JSON.stringify(calEvents));
}

authorize().then(listEvents).catch(console.error);

(async () => {
  const litNodeClient = await init();
  const chain = "ethereum";

  const file = await fs
    .readFile(CALCASTER_DATA_PATH, { encoding: "utf-8" })
    .catch(console.error);

  if (!file) {
    throw new Error("Cannot read file.");
  }

  const blob = new Blob([file], {
    type: "application/json",
  });

  const result = await encrypt(
    litNodeClient,
    blob,
    wallet,
    wallet.address,
    chain,
    config.accessControlConditions
  );

  console.log(result);

  await fs.writeFile(ENCRYPTED_DATA_PATH, result.encryptedFile.stream());

  console.log("Encrypted!");

  const encryptedFileBuffer = await fs.readFile(ENCRYPTED_DATA_PATH);
  const encryptedFileBlob = new Blob([encryptedFileBuffer]);

  const decryptedFile = await decrypt(
    litNodeClient,
    wallet,
    config.accessControlConditions,
    result.encryptedSymmetricKey,
    chain,
    encryptedFileBlob
  );

  console.log("DECRYPTED:");
  console.log(decryptedFile);
})();
