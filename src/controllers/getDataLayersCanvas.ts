//import Tiff from "tiff.js";
import { getTiff, DataLayers } from "@nora-soderlund/google-maps-solar-api";
import { GOOGLE_MAPS_API_KEY } from "../constants";

//@ts-ignore
import * as GeoTIFF from "geotiff.js/dist/geotiff.bundle.min.js";

/*export async function getDataLayerRgbCanvas(dataLayers: DataLayers) {
  const tiffImageBuffer = await getTiff(GOOGLE_MAPS_API_KEY, dataLayers.rgbUrl!);

  const tiff = new Tiff({
    buffer: tiffImageBuffer
  });

  return tiff.toCanvas();
};*/

export async function getDataLayerMaskCanvas(scale: number) {
  const tiffImageBuffer = await (await fetch("./images/geoTiff_2.tif")).arrayBuffer();

  const tiff = await GeoTIFF.fromArrayBuffer(tiffImageBuffer);
  const tiffImage = await tiff.getImage();
  const tiffData = await tiffImage.readRasters();

  const canvas = document.createElement("canvas");

  canvas.width = tiffData.width * scale;
  canvas.height = tiffData.height * scale;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  for(let row = 0; row < tiffData.height; row += Math.round(1 / scale)) 
  for(let column = 0; column < tiffData.width; column += Math.round(1 / scale)) {
    const index = (row * tiffData.width) + column;

    if(tiffData[0][index])
      context.fillRect(column * scale, row * scale, 1, 1);
  }

  console.log({ mask: canvas });

  return canvas;
};

export async function getDataLayerFluxCanvas(scale: number) {
  const tiffImageBuffer = await (await fetch("./images/geoTiff_1.tif")).arrayBuffer();

  const tiff = await GeoTIFF.fromArrayBuffer(tiffImageBuffer);
  const tiffImage = await tiff.getImage();
  const tiffData = await tiffImage.readRasters();

  console.log(tiffData);

  const canvas = document.createElement("canvas");

  canvas.width = tiffData.width * scale;
  canvas.height = tiffData.height * scale;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  //const maximumKwhPerKwPerYear = 1000;
  // const minimumKwhPerKwPerYear = Math.max(...tiffData[0]);

  const maximumKwhPerKwPerYear = tiffData[0].reduce((unit: number, currentUnit: number) => (unit > currentUnit)?(unit):(currentUnit), 0);

  for(let row = 0; row < tiffData.height; row += Math.round(1 / scale)) 
  for(let column = 0; column < tiffData.width; column += Math.round(1 / scale)) {
    const index = (row * tiffData.width) + column;

    const value = tiffData[0][index];

    if(value === -9999)
      continue;

    context.fillStyle = `hsl(50 100% ${((value / maximumKwhPerKwPerYear) * 100)}%)`;

    context.fillRect(column * scale, row * scale, 1, 1);
  }

  console.log({ flux: canvas });

  return canvas;
};

export default async function getDataLayersCanvas() {
  const canvas = document.createElement("canvas");

  const expectedSize = 2000;
  const scale = 1;
  const size = expectedSize * scale;

  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  
  return new Promise<HTMLCanvasElement>((resolve) => {
    const image = new Image();

    image.onload = () => {
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, size, size);
      
      resolve(canvas);
    };

    image.src = "images/grid.png";
  });
};
