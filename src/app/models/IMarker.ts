import { Marker } from "@capacitor/google-maps";

export interface IMarker extends Marker {
    userId: string;
}