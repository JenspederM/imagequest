const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

async function generateGif(query: string, limit: number): Promise<string[]> {
  const base = "https://api.giphy.com/v1/gifs/search";

  const response = await fetch(
    `${base}?api_key=${GIPHY_API_KEY}&q=${query}&limit=${limit}`
  );
  const data = await response.json();
  return data.data.map((gif: any) => gif.images.original.url);
}

export default {
  generateGif,
};
