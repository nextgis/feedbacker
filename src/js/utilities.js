import L from "leaflet"
import LProj from "proj4leaflet"

export function latlngToCoord(latlng) {
    let crs3857 = new LProj.CRS('EPSG:3857');
    return crs3857.projection.project(latlng)
}