import { Marker } from "@capacitor/google-maps";

export interface IMarker extends Marker {
    id: string;
    userId: string;
    photoURL: string;
}
