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
const fetch = require("node-fetch"); // eslint-disable-line
import OpenAI from "openai";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

type GifRequest = {
  q: string;
  limit: number;
};
type OpanAiImageRequest = {
  q: string;
  limit: number;
};

export const generateOpenAiImage = onCall<OpanAiImageRequest>(
  async (request) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const query = request.data.q;
    const limit = request.data.limit;
    logger.info(
      "Generating OpenAI image",
      { structuredData: true },
      JSON.stringify({ query: query, limit: limit }) // eslint-disable-line
    );
    const images = await openai.images.generate({
      prompt: query,
      n: limit,
    });
    const urls = images.data.map(
      (img) => img.url // eslint-disable-line
    );
    logger.info(
      "Returning generated gif",
      { structuredData: true },
      JSON.stringify({ urls }) // eslint-disable-line
    );
    return { urls }; // eslint-disable-line
  } // eslint-disable-line
);

export const generateGif = onCall<GifRequest>(
  async (request) => {
    const base = "https://api.giphy.com/v1/gifs/search";

    const query = request.data.q;
    const limit = request.data.limit;
    logger.info(
      "Generating gif",
      { structuredData: true },
      JSON.stringify({ query: query, limit: limit }) // eslint-disable-line
    );
    const url = `${base}?api_key=${process.env.GIPHY_API_KEY}&q=${query}&limit=${limit}&r=pg-13`;
    const responseGiphy = await fetch(url);
    const data = (await responseGiphy.json()) as {
      data: { images: { original: { url: string } } }[];
    }; // eslint-disable-line
    const urls = data.data.map(
      (gif: { images: { original: { url: string } } }) =>
        gif.images.original.url // eslint-disable-line
    );
    logger.info(
      "Returning generated gif",
      { structuredData: true },
      JSON.stringify({ urls }) // eslint-disable-line
    );
    return { urls }; // eslint-disable-line
  } // eslint-disable-line
);
