/// <reference types="@types/google.maps" />
import { DataLayerView } from "../types/DataLayerView";
import { DataLayers } from "../types/DataLayers";
import { ImageryQuality } from "../types/ImageryQuality";
export type GetDataLayersParameters = {
    /**
     * The longitude and latitude for the center of the region to get data for.
     */
    location: google.maps.LatLngLiteral;
    /**
     * The radius, in meters, defining the region surrounding that centre point for which data should be returned.
     * The limitations on this value are:
     * Any value up to 100m can always be specified.
     * Values over 100m can be specified, as long as radiusMeters <= pixelSizeMeters * 1000.
     * However, for values over 175m, the DataLayerView in the request must not include monthly flux or hourly shade.
     */
    radiusMeters: number;
    /**
     * The desired subset of the data to return.
     */
    view: DataLayerView;
    /**
     * The minimum quality level allowed in the results.
     * No result with lower quality than this will be returned.
     * Not specifying this is equivalent to restricting to HIGH quality only.
     */
    requiredQuality?: ImageryQuality;
    /**
     * The minimum scale, in meters per pixel, of the data to return.
     * Values of 0.1 (the default, if this field is not set explicitly), 0.25, 0.5, and 1.0 are supported.
     * Imagery components whose normal resolution is less than pixelSizeMeters will be returned at the resolution specified by pixelSizeMeters;
     * imagery components whose normal resolution is equal to or greater than pixelSizeMeters will be returned at that normal resolution.
     */
    pixelSizeMeters?: number;
};
export default function getDataLayers(query: GetDataLayersParameters): Promise<DataLayers>;
//# sourceMappingURL=getDataLayers.d.ts.map