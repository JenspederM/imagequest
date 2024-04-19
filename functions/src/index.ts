/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

type GenerateGifRequest = {
  q: string;
  limit: number;
};

export const generateGif = onCall<GenerateGifRequest>(async (request) => {
  const base = "https://api.giphy.com/v1/gifs/search";

  const query = request.data.q;
  const limit = request.data.limit;
  logger.info(
    "Generating gif",
    { structuredData: true },
    JSON.stringify({ query: query, limit: limit })
  );
  const url = `${base}?api_key=${process.env.GIPHY_API_KEY}&q=${query}&limit=${limit}`;
  const responseGiphy = await fetch(url);
  const data = await responseGiphy.json();
  const urls = data.data.map((gif: any) => gif.images.original.url);
  //logger.info("Generating gif", { structuredData: true }, JSON.stringify(data));
  return { urls };
});
