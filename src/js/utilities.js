import L from "leaflet"
import LProj from "proj4leaflet"

export function latlngToCoord(latlng) {
    let crs3857 = new LProj.CRS('EPSG:3857');
    return crs3857.projection.project(latlng)
}

export function coordToLatlng(point) {
    let crs3857 = new LProj.CRS('EPSG:3857');
    return crs3857.projection.unproject(point)
}

export function closest(){
	(function (ElementProto) {
		if (typeof ElementProto.matches !== 'function') {
			ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
				var element = this;
				var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
				var index = 0;

				while (elements[index] && elements[index] !== element) {
					++index;
				}

				return Boolean(elements[index]);
			};
		}

		if (typeof ElementProto.closest !== 'function') {
			ElementProto.closest = function closest(selector) {
				var element = this;

				while (element && element.nodeType === 1) {
					if (element.matches(selector)) {
						return element;
					}

					element = element.parentNode;
				}

				return null;
			};
		}
	})(window.Element.prototype);
}