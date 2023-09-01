import DataLayerOverlay from "./interfaces/DataLayerOverlay";
import { getBoundsOfDistance } from "geolib";
import getDataLayersCanvas from "./controllers/getDataLayersCanvas";
import { getDataLayers, DataLayerView } from "@nora-soderlund/google-maps-solar-api";
import { GOOGLE_MAPS_API_KEY } from "./constants";

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { spherical } = await google.maps.importLibrary("geometry") as google.maps.GeometryLibrary;

  const element = document.getElementById("map")!;

  const map = new Map(element, {
    center: {
      /*lat: 48.591441,
      lng: 13.470527
      */

      //lat: 57.71771481185688, 
      //lng: 11.948126107256904,

      lat: 57.623147493770105,
      lng: 11.931981013011718

      //lat: 57.70716748815071,
      //lng: 11.9679619853316
    },
    mapTypeId: "satellite",
    tilt: 0,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ],
    zoom: 17,
    disableDefaultUI: true
  });
  
  getDataLayerForCoordinates("IMAGERY_AND_ANNUAL_FLUX_LAYERS", map.getCenter()!.toJSON());

  async function getDataLayerForCoordinates(layer: DataLayerView, coordinate: google.maps.LatLngLiteral) {
    const radius = 100;

    /*const coordinateBounds = getBoundsOfDistance(
      coordinate,
      radius
    );*/

    const coordinateBounds = [
      spherical.computeOffset(coordinate, radius, 0),
      spherical.computeOffset(coordinate, radius, 90),
      spherical.computeOffset(coordinate, radius, 180),
      spherical.computeOffset(coordinate, radius, 270)
    ];

    /*const dataLayers = await getDataLayers(GOOGLE_MAPS_API_KEY, {
      location: coordinate,
      radiusMeters: radius,
      view: layer
    });*/

    const bounds = new google.maps.LatLngBounds();

    coordinateBounds.forEach((coordinate) => {
      bounds.extend(coordinate);
    });

    const image = await getDataLayersCanvas();

    const dataLayerOverlay = DataLayerOverlay.create(bounds, image);

    dataLayerOverlay.setMap(map);
  };
};

initMap();
