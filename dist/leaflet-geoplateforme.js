/*!
 * leaflet-geoplateforme 0.1.0 (expérimental)
 * Extension Leaflet pour la Géoplateforme de l'IGN (data.geopf.fr).
 * Cible : Leaflet 1.9.x (dernière version stable). Licence MIT.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('leaflet'));
    } else {
        factory(window.L);
    }
}(function (L) {
    'use strict';

    var G = L.geoplateforme = { version: '0.1.0' };

    /* ------------------------------------------------------------------ */
    /* Configuration                                                       */
    /* ------------------------------------------------------------------ */

    G.config = {
        wmts: 'https://data.geopf.fr/wmts',
        wmtsPrivate: 'https://data.geopf.fr/private/wmts',
        wms: 'https://data.geopf.fr/wms-r/wms',
        wfs: 'https://data.geopf.fr/wfs/ows',
        search: 'https://data.geopf.fr/recherche/api/indexes/geoplateforme',
        panoramax: 'https://api.panoramax.xyz/api',     // méta-catalogue Panoramax (toutes les instances)
        panoramaxViewer: 'https://panoramax.ign.fr/',   // visualiseur Panoramax
        geocoding: 'https://data.geopf.fr/geocodage',
        route: 'https://data.geopf.fr/navigation/itineraire',
        isochrone: 'https://data.geopf.fr/navigation/isochrone',
        altimetry: 'https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest',
        altimetryResource: 'ign_rge_alti_wld',
        attribution: '<a href="https://www.ign.fr/" target="_blank" rel="noopener">IGN</a>'
    };

    G.setConfig = function (opts) {
        L.extend(G.config, opts);
        return G;
    };

    /* ------------------------------------------------------------------ */
    /* Internationalisation                                                */
    /* ------------------------------------------------------------------ */

    var I18N = {
        fr: {
            search: 'Rechercher un lieu', searchPlaceholder: 'Adresse, lieu, parcelle…', searchBtn: 'Rechercher',
            noResult: 'Aucun résultat', error: 'Erreur : {msg}', loading: 'Chargement…',
            idxAddress: 'Adresses', idxPoi: 'Lieux', idxParcel: 'Parcelles',
            layers: 'Couches', info: 'Informations', opacity: 'Opacité', remove: 'Retirer la couche',
            legend: 'Légende', metadata: 'Métadonnées', moveHint: 'Glisser pour réordonner',
            reverse: 'Géocodage inverse', reverseHint: 'Cliquez sur la carte pour localiser.',
            reverseHintCircle: 'Maintenez le clic et glissez pour tracer un cercle.',
            reverseHintExtent: 'Maintenez le clic et glissez pour tracer un rectangle.',
            delimPoint: 'Point', delimCircle: 'Cercle', delimExtent: 'Rectangle',
            activate: 'Sélectionner sur la carte', deactivate: 'Arrêter la sélection', clear: 'Effacer',
            route: 'Calcul d’itinéraire', start: 'Départ', end: 'Arrivée', via: 'Étape',
            addVia: 'Ajouter une étape', removeVia: 'Supprimer l’étape', pick: 'Choisir sur la carte',
            pickHint: 'Cliquez sur la carte…', car: 'Voiture', pedestrian: 'Piéton',
            fastest: 'Plus rapide', shortest: 'Plus court', compute: 'Calculer',
            exclusions: 'Éviter', exAutoroute: 'Autoroutes', exTunnel: 'Tunnels', exPont: 'Ponts',
            distance: 'Distance', duration: 'Durée', needPoints: 'Renseignez un départ et une arrivée.',
            isocurve: 'Isochrone / isodistance', point: 'Point de départ', time: 'Temps', dist: 'Distance',
            value: 'Valeur', minutes: 'minutes', hours: 'heures', meters: 'mètres', kilometers: 'kilomètres',
            departure: 'Au départ de', arrival: 'À l’arrivée en', needPoint: 'Renseignez un point.',
            mouse: 'Coordonnées', altitude: 'Altitude', system: 'Système', settings: 'Paramètres',
            elevation: 'Profil altimétrique', draw: 'Tracer un profil', finish: 'Terminer', drawHint: 'Cliquez pour ajouter des points, double-clic pour terminer.',
            minAlt: 'Min', maxAlt: 'Max', ascent: 'D+', descent: 'D−', length: 'Longueur', export: 'Exporter CSV',
            needTwoPoints: 'Au moins deux points sont nécessaires.', unavailable: 'indisponible',
            sysDD: 'WGS84 – degrés décimaux', sysDM: 'WGS84 – degrés, minutes', sysDMS: 'WGS84 – degrés, minutes, secondes',
            sysMercator: 'Web Mercator (EPSG:3857)', sysLambert93: 'Lambert 93 (EPSG:2154)',
            catalog: 'Catalogue de couches', catalogPlaceholder: 'Rechercher une couche…', allThemes: 'Tous les thèmes',
            more: 'Plus de résultats', addLayer: 'Ajouter à la carte', removeLayer: 'Retirer de la carte', zoomExtent: 'Zoomer sur l’emprise',
            featureInfo: 'Interroger la carte', noInfo: 'Aucune information à cet endroit.',
            measure: 'Mesures', mDistance: 'Distance', mArea: 'Surface', mAzimuth: 'Azimut', measureStart: 'Mesurer',
            measureHintAz: 'Cliquez sur deux points.', perimeter: 'Périmètre', backAzimuth: 'Contre-azimut',
            compare: 'Comparateur', cmpLeft: 'Couche de gauche', cmpRight: 'Couche de droite',
            exportMap: 'Exporter la carte', mapTitle: 'Titre (facultatif)', quality: 'Échelle', downloadPng: 'Télécharger (PNG)',
            print: 'Imprimer', capturing: 'Génération…', captureFail: 'Capture impossible : {msg}',
            panoramax: 'Photos de terrain (Panoramax)', showCoverage: 'Afficher la couverture',
            panoHint: 'Zoomez (niveau 15 ou plus), puis cliquez sur un point pour voir la photo.',
            prevPic: 'Précédente', nextPic: 'Suivante', openPanoramax: 'Ouvrir dans Panoramax', capturedOn: 'Prise le',
            pano360: 'Photo à 360° : faites glisser pour regarder autour de vous, molette pour zoomer, double-clic pour le plein écran.',
            severalPics: '{n} photos à cet endroit :',
            pano360Unsupported: 'Photo à 360° : WebGL est indisponible, ouvrez-la dans Panoramax pour la parcourir.',
            lat: 'Lat', lng: 'Lon',
            stepDepart: 'Départ', stepArrive: 'Arrivée', stepContinue: 'Continuer', stepTurn: 'Tourner',
            stepStraight: 'Continuer tout droit', stepUturn: 'Faire demi-tour', stepMerge: 'Rejoindre',
            stepOnRamp: 'Prendre la bretelle', stepOffRamp: 'Prendre la sortie', stepFork: 'À l’embranchement',
            stepEndOfRoad: 'Au bout de la route', stepRoundabout: 'Au rond-point', stepExit: 'prendre la sortie {n}',
            stepOn: 'sur {name}', left: 'à gauche', right: 'à droite', slightLeft: 'légèrement à gauche',
            slightRight: 'légèrement à droite', sharpLeft: 'franchement à gauche', sharpRight: 'franchement à droite',
            straight: 'tout droit'
        },
        en: {
            search: 'Search a place', searchPlaceholder: 'Address, place, parcel…', searchBtn: 'Search',
            noResult: 'No result', error: 'Error: {msg}', loading: 'Loading…',
            idxAddress: 'Addresses', idxPoi: 'Places', idxParcel: 'Parcels',
            layers: 'Layers', info: 'Information', opacity: 'Opacity', remove: 'Remove layer',
            legend: 'Legend', metadata: 'Metadata', moveHint: 'Drag to reorder',
            reverse: 'Reverse geocoding', reverseHint: 'Click on the map to locate.',
            reverseHintCircle: 'Press and drag to draw a circle.',
            reverseHintExtent: 'Press and drag to draw a rectangle.',
            delimPoint: 'Point', delimCircle: 'Circle', delimExtent: 'Rectangle',
            activate: 'Select on map', deactivate: 'Stop selecting', clear: 'Clear',
            route: 'Route', start: 'Start', end: 'End', via: 'Stop',
            addVia: 'Add a stop', removeVia: 'Remove stop', pick: 'Pick on map',
            pickHint: 'Click on the map…', car: 'Car', pedestrian: 'Pedestrian',
            fastest: 'Fastest', shortest: 'Shortest', compute: 'Compute',
            exclusions: 'Avoid', exAutoroute: 'Motorways', exTunnel: 'Tunnels', exPont: 'Bridges',
            distance: 'Distance', duration: 'Duration', needPoints: 'Set a start and an end point.',
            isocurve: 'Isochrone / isodistance', point: 'Origin', time: 'Time', dist: 'Distance',
            value: 'Value', minutes: 'minutes', hours: 'hours', meters: 'meters', kilometers: 'kilometers',
            departure: 'Departing from', arrival: 'Arriving at', needPoint: 'Set a point.',
            mouse: 'Coordinates', altitude: 'Elevation', system: 'System', settings: 'Settings',
            elevation: 'Elevation profile', draw: 'Draw a profile', finish: 'Finish', drawHint: 'Click to add points, double-click to finish.',
            minAlt: 'Min', maxAlt: 'Max', ascent: 'Ascent', descent: 'Descent', length: 'Length', export: 'Export CSV',
            needTwoPoints: 'At least two points are required.', unavailable: 'unavailable',
            sysDD: 'WGS84 – decimal degrees', sysDM: 'WGS84 – degrees, minutes', sysDMS: 'WGS84 – degrees, minutes, seconds',
            sysMercator: 'Web Mercator (EPSG:3857)', sysLambert93: 'Lambert 93 (EPSG:2154)',
            catalog: 'Layer catalogue', catalogPlaceholder: 'Search a layer…', allThemes: 'All themes',
            more: 'More results', addLayer: 'Add to map', removeLayer: 'Remove from map', zoomExtent: 'Zoom to extent',
            featureInfo: 'Query the map', noInfo: 'No information here.',
            measure: 'Measure', mDistance: 'Distance', mArea: 'Area', mAzimuth: 'Bearing', measureStart: 'Measure',
            measureHintAz: 'Click two points.', perimeter: 'Perimeter', backAzimuth: 'Back bearing',
            compare: 'Compare', cmpLeft: 'Left layer', cmpRight: 'Right layer',
            exportMap: 'Export the map', mapTitle: 'Title (optional)', quality: 'Scale', downloadPng: 'Download (PNG)',
            print: 'Print', capturing: 'Rendering…', captureFail: 'Capture failed: {msg}',
            panoramax: 'Street-level photos (Panoramax)', showCoverage: 'Show coverage',
            panoHint: 'Zoom in (level 15 or more), then click a point to see the picture.',
            prevPic: 'Previous', nextPic: 'Next', openPanoramax: 'Open in Panoramax', capturedOn: 'Taken on',
            pano360: '360° picture: drag to look around, wheel to zoom, double-click for fullscreen.',
            severalPics: '{n} pictures at this spot:',
            pano360Unsupported: '360° picture: WebGL is unavailable, open it in Panoramax to look around.',
            lat: 'Lat', lng: 'Lon',
            stepDepart: 'Start', stepArrive: 'Arrive', stepContinue: 'Continue', stepTurn: 'Turn',
            stepStraight: 'Continue straight', stepUturn: 'Make a U-turn', stepMerge: 'Merge',
            stepOnRamp: 'Take the ramp', stepOffRamp: 'Take the exit', stepFork: 'At the fork',
            stepEndOfRoad: 'At the end of the road', stepRoundabout: 'At the roundabout', stepExit: 'take exit {n}',
            stepOn: 'onto {name}', left: 'left', right: 'right', slightLeft: 'slightly left',
            slightRight: 'slightly right', sharpLeft: 'sharp left', sharpRight: 'sharp right',
            straight: 'straight'
        }
    };

    G.lang = 'fr';

    /** Change la langue (« fr » ou « en »). */
    G.setLang = function (lang) {
        if (I18N[lang]) { G.lang = lang; }
        return G;
    };

    /** Ajoute ou surcharge des libellés : G.addMessages('fr', { search: '…' }). */
    G.addMessages = function (lang, messages) {
        I18N[lang] = L.extend(I18N[lang] || {}, messages);
        return G;
    };

    function t(key, vars) {
        var s = (I18N[G.lang] && I18N[G.lang][key]) || I18N.fr[key] || key;
        if (vars) {
            Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
        }
        return s;
    }

    /* ------------------------------------------------------------------ */
    /* Utilitaires                                                         */
    /* ------------------------------------------------------------------ */

    function el(tag, cls, parent, text) {
        var e = document.createElement(tag);
        if (cls) { e.className = cls; }
        if (text !== undefined && text !== null) { e.textContent = text; }
        if (parent) { parent.appendChild(e); }
        return e;
    }

    function qs(params) {
        return Object.keys(params).filter(function (k) {
            return params[k] !== undefined && params[k] !== null && params[k] !== '';
        }).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
    }

    function errorMessage(d) {
        if (!d) { return null; }
        if (d.message) {
            return d.message + (d.detail ? ' — ' + [].concat(d.detail).join(' ; ') : '');
        }
        if (d.error) { return d.error.message || String(d.error); }
        return null;
    }

    function request(url, params, init) {
        var u = params ? url + (url.indexOf('?') < 0 ? '?' : '&') + qs(params) : url;
        return fetch(u, init).then(function (r) {
            return r.text().then(function (txt) {
                var data;
                try { data = JSON.parse(txt); } catch (e) { /* non JSON */ }
                if (!r.ok) { throw new Error(errorMessage(data) || ('HTTP ' + r.status)); }
                if (data === undefined) { throw new Error('Invalid response'); }
                return data;
            });
        });
    }

    function debounce(fn, delay) {
        var timer;
        return function () {
            var ctx = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
        };
    }

    function first(v) { return Array.isArray(v) ? v[0] : v; }

    function formatDistance(m) {
        return m >= 1000 ? (m / 1000).toFixed(m >= 10000 ? 1 : 2) + ' km' : Math.round(m) + ' m';
    }

    function formatDuration(s) {
        s = Math.round(s);
        var h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
        if (m === 60) { h += 1; m = 0; }
        if (h > 0) { return h + ' h ' + (m < 10 ? '0' : '') + m + ' min'; }
        return m < 1 ? s + ' s' : m + ' min';
    }

    var ICONS = {
        search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg>',
        layers: '<svg viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/></svg>',
        reverse: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/></svg>',
        route: '<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 17c8 0 0-10 8-10"/></svg>',
        isocurve: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/></svg>',
        elevation: '<svg viewBox="0 0 24 24"><path d="M2 19l6-9 4 5 3-4 7 8z"/></svg>',
        settings: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
        info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
        catalog: '<svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h10"/><circle cx="18" cy="18" r="2.5"/><path d="M20 20l2 2"/></svg>',
        plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
        minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
        extent: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>',
        pointer: '<svg viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z"/></svg>',
        ruler: '<svg viewBox="0 0 24 24"><path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/></svg>',
        compare: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16M8 12l-2 0M16 12l2 0"/></svg>',
        camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
        panoramax: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M3 12a9 4 0 0018 0M3 12a9 4 0 0118 0"/></svg>',
        close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        pick: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
    };

    function icon(name) {
        var s = el('span', 'gpf-icon');
        s.innerHTML = ICONS[name] || '';
        return s;
    }

    function button(cls, parent, label, iconName, title) {
        var b = el('button', 'gpf-btn ' + (cls || ''), parent);
        b.type = 'button';
        if (iconName) { b.appendChild(icon(iconName)); }
        if (label) { el('span', null, b, label); }
        if (title) { b.title = title; }
        return b;
    }

    function stopEvents(container) {
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
    }

    function pointIcon(cls, text) {
        return L.divIcon({
            className: 'gpf-marker-wrap',
            html: '<span class="gpf-marker ' + cls + '">' + (text || '') + '</span>',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });
    }

    /* ------------------------------------------------------------------ */
    /* Services                                                            */
    /* ------------------------------------------------------------------ */

    var INDEX_BY_KEY = { address: 'address', poi: 'poi', parcel: 'parcel' };

    function featureLatLng(f) {
        var g = f.geometry;
        if (g && g.type === 'Point') { return L.latLng(g.coordinates[1], g.coordinates[0]); }
        return L.geoJSON(f).getBounds().getCenter();
    }

    function featureLabel(f) {
        var p = f.properties || {};
        if (p._type === 'parcel') {
            return [p.city, p.section, String(p.number || '').replace(/^0+/, '')].filter(Boolean).join(' ') +
                (p.id ? ' (' + p.id + ')' : '');
        }
        if (p._type === 'poi') {
            var city = first(p.city);
            return (first(p.toponym) || first(p.name) || '') + (city ? ', ' + city : '');
        }
        return p.label || first(p.name) || p.id || '';
    }

    function featureSubtitle(f) {
        var p = f.properties || {};
        if (p._type === 'poi') { return first(p.category) || ''; }
        if (p._type === 'address') { return p.context || ''; }
        return '';
    }

    function normalizeFeature(f) {
        return {
            label: featureLabel(f),
            sub: featureSubtitle(f),
            latlng: featureLatLng(f),
            type: (f.properties || {})._type,
            distance: (f.properties || {}).distance,
            feature: f
        };
    }

    G.services = {
        /** Autocomplétion (adresses et lieux). Retourne [{label, sub, latlng, raw}]. */
        complete: function (text, opts) {
            opts = opts || {};
            return request(G.config.geocoding + '/completion/', {
                text: text,
                type: (opts.types || ['PositionOfInterest', 'StreetAddress']).join(','),
                maximumResponses: opts.max || 8,
                terr: opts.terr
            }).then(function (d) {
                return (d.results || []).map(function (r) {
                    return {
                        label: r.fulltext,
                        sub: r.kind || '',
                        latlng: L.latLng(r.y, r.x),
                        raw: r
                    };
                });
            });
        },

        /** Recherche (géocodage direct). indexes : ['address','poi','parcel']. */
        search: function (text, opts) {
            opts = opts || {};
            return request(G.config.geocoding + '/search', {
                q: text,
                index: (opts.indexes || ['address', 'poi']).join(','),
                limit: opts.limit || 5
            }).then(function (d) { return (d.features || []).map(normalizeFeature); });
        },

        /** Géocodage inverse : point (latlng) ou zone (searchgeom GeoJSON). */
        reverse: function (opts) {
            return request(G.config.geocoding + '/reverse', {
                lon: opts.latlng ? opts.latlng.lng : undefined,
                lat: opts.latlng ? opts.latlng.lat : undefined,
                index: (opts.indexes || ['address']).join(','),
                limit: opts.limit || 5,
                searchgeom: opts.searchgeom ? JSON.stringify(opts.searchgeom) : undefined
            }).then(function (d) { return (d.features || []).map(normalizeFeature); });
        },

        /** Itinéraire. */
        route: function (opts) {
            var constraints = (opts.exclusions || []).map(function (v) {
                return JSON.stringify({ constraintType: 'banned', key: 'wayType', operator: '=', value: v });
            });
            return request(G.config.route, {
                resource: opts.resource || 'bdtopo-osrm',
                start: opts.start.lng + ',' + opts.start.lat,
                end: opts.end.lng + ',' + opts.end.lat,
                intermediates: (opts.via || []).map(function (p) { return p.lng + ',' + p.lat; }).join('|'),
                profile: opts.profile || 'car',
                optimization: opts.optimization || 'fastest',
                constraints: constraints.join('|'),
                getSteps: true,
                geometryFormat: 'geojson'
            });
        },

        /** Isochrone / isodistance. */
        isochrone: function (opts) {
            var isTime = opts.costType !== 'distance';
            return request(G.config.isochrone, {
                resource: opts.resource || 'bdtopo-valhalla',
                point: opts.point.lng + ',' + opts.point.lat,
                costType: isTime ? 'time' : 'distance',
                costValue: opts.costValue,
                timeUnit: isTime ? (opts.unit || 'minute') : undefined,
                distanceUnit: isTime ? undefined : (opts.unit || 'meter'),
                profile: opts.profile || 'car',
                direction: opts.direction || 'departure'
            });
        },

        /** Altitudes d'une liste de points : retourne [{latlng, z}] (z = null si inconnu). */
        elevation: function (latlngs) {
            return request(G.config.altimetry + '/elevation.json', {
                lon: latlngs.map(function (p) { return p.lng.toFixed(6); }).join('|'),
                lat: latlngs.map(function (p) { return p.lat.toFixed(6); }).join('|'),
                resource: G.config.altimetryResource,
                zonly: false
            }).then(function (d) {
                return d.elevations.map(function (e) {
                    return { latlng: L.latLng(e.lat, e.lon), z: e.z <= -9999 ? null : e.z };
                });
            });
        },

        /** Profil le long d'une ligne : retourne [{latlng, z, dist}] avec dist cumulée en mètres. */
        elevationLine: function (latlngs, opts) {
            opts = opts || {};
            return request(G.config.altimetry + '/elevationLine.json', null, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lon: latlngs.map(function (p) { return p.lng.toFixed(6); }).join('|'),
                    lat: latlngs.map(function (p) { return p.lat.toFixed(6); }).join('|'),
                    resource: G.config.altimetryResource,
                    profile_mode: opts.mode || 'simple',
                    sampling: opts.sampling || 50,
                    zonly: false
                })
            }).then(function (d) {
                var dist = 0, prev = null;
                return d.elevations.map(function (e) {
                    var ll = L.latLng(e.lat, e.lon);
                    if (prev) { dist += prev.distanceTo(ll); }
                    prev = ll;
                    return { latlng: ll, z: e.z <= -9999 ? null : e.z, dist: dist };
                });
            });
        }
    };

    /* ------------------------------------------------------------------ */
    /* Capabilities WMTS (optionnel)                                       */
    /* ------------------------------------------------------------------ */

    var capsPromise = null;

    /**
     * Charge (une seule fois, ~3 Mo) les capabilities WMTS de la Géoplateforme
     * et retourne une Promise d'un dictionnaire { identifiant : infos }.
     */
    G.getCapabilities = function () {
        if (!capsPromise) {
            capsPromise = fetch(G.config.wmts + '?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0')
                .then(function (r) { return r.text(); })
                .then(function (xml) {
                    var doc = new DOMParser().parseFromString(xml, 'text/xml');
                    var out = {};
                    var layers = doc.getElementsByTagNameNS('*', 'Layer');
                    for (var i = 0; i < layers.length; i++) {
                        var l = layers[i];
                        var id = childText(l, 'Identifier');
                        if (!id) { continue; }
                        var style = firstChild(l, 'Style');
                        var legend = style ? firstChild(style, 'LegendURL') : null;
                        var minZ = Infinity, maxZ = -Infinity;
                        var links = l.getElementsByTagNameNS('*', 'TileMatrixSetLink');
                        for (var k = 0; k < links.length; k++) {
                            if (childText(links[k], 'TileMatrixSet').indexOf('PM') !== 0) { continue; }
                            var tm = links[k].getElementsByTagNameNS('*', 'TileMatrix');
                            for (var j = 0; j < tm.length; j++) {
                                var z = parseInt(tm[j].textContent, 10);
                                if (!isNaN(z)) { minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); }
                            }
                        }
                        out[id] = {
                            title: childText(l, 'Title'),
                            description: childText(l, 'Abstract'),
                            style: style ? childText(style, 'Identifier') : 'normal',
                            format: childText(l, 'Format') || 'image/png',
                            legend: legend ? legend.getAttribute('xlink:href') ||
                                legend.getAttributeNS('http://www.w3.org/1999/xlink', 'href') : null,
                            minZoom: isFinite(minZ) ? minZ : undefined,
                            maxZoom: isFinite(maxZ) ? maxZ : undefined
                        };
                    }
                    return out;
                });
            capsPromise.catch(function () { capsPromise = null; });
        }
        return capsPromise;
    };

    function firstChild(node, name) {
        for (var c = node.firstElementChild; c; c = c.nextElementSibling) {
            if (c.localName === name) { return c; }
        }
        return null;
    }

    function childText(node, name) {
        var c = firstChild(node, name);
        return c ? c.textContent : '';
    }

    /* ------------------------------------------------------------------ */
    /* Couches                                                             */
    /* ------------------------------------------------------------------ */

    /** Catalogue des couches courantes (vérifié sur les capabilities WMTS). */
    var KNOWN = {
        'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2': { title: 'Plan IGN', format: 'image/png', minZoom: 0, maxZoom: 19, legend: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2-legend.png' },
        'GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1': { title: 'Plan IGN J+1', format: 'image/png', minZoom: 0, maxZoom: 18, legend: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1-legend.png' },
        // Couches en Lambert 93 (EPSG:2154) : à utiliser avec L.geoplateforme.crs.EPSG2154
        'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2.L93': { title: 'Plan IGN (Lambert 93)', format: 'image/jpeg', minZoom: 6, maxZoom: 20 },
        'HR.ORTHOIMAGERY.ORTHOPHOTOS.L93': { title: 'Photographies aériennes (Lambert 93)', format: 'image/jpeg', minZoom: 6, maxZoom: 20 },
        'CADASTRALPARCELS.PARCELLAIRE_EXPRESS.L93': { title: 'Parcellaire Express (Lambert 93)', format: 'image/png', minZoom: 12, maxZoom: 20 },
        'CADASTRALPARCELS.PARCELS.L93': { title: 'Parcelles cadastrales (Lambert 93)', format: 'image/png', style: 'bdparcellaire', minZoom: 6, maxZoom: 20 },
        'ORTHOIMAGERY.ORTHOPHOTOS': { title: 'Photographies aériennes', format: 'image/jpeg', minZoom: 0, maxZoom: 19, legend: 'ORTHOIMAGERY-ORTHOPHOTOS-legend.png' },
        'HR.ORTHOIMAGERY.ORTHOPHOTOS': { title: 'Ortho 20 cm', format: 'image/jpeg', minZoom: 6, maxZoom: 19 },
        'ORTHOIMAGERY.ORTHOPHOTOS.IRC': { title: 'Ortho infrarouge fausses couleurs', format: 'image/jpeg', minZoom: 6, maxZoom: 19 },
        'ORTHOIMAGERY.ORTHOPHOTOS.1950-1965': { title: 'Photographies aériennes 1950-1965', format: 'image/png', style: 'BDORTHOHISTORIQUE', minZoom: 0, maxZoom: 18 },
        'GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40': { title: 'Carte de l’état-major (1820-1866)', format: 'image/jpeg', minZoom: 6, maxZoom: 15 },
        'GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR10': { title: 'Carte de l’état-major, environs de Paris', format: 'image/jpeg', minZoom: 6, maxZoom: 16 },
        'CADASTRALPARCELS.PARCELLAIRE_EXPRESS': { title: 'Parcellaire Express (PCI)', format: 'image/png', minZoom: 0, maxZoom: 19, legend: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS-legend.png' },
        'CADASTRALPARCELS.PARCELS': { title: 'Parcelles cadastrales (2013-2018)', format: 'image/png', style: 'bdparcellaire', minZoom: 0, maxZoom: 20 },
        'ADMINEXPRESS-COG.LATEST': { title: 'Admin Express COG', format: 'image/png', minZoom: 6, maxZoom: 16, legend: 'ADMINEXPRESS-COG-legend.png' },
        'LIMITES_ADMINISTRATIVES_EXPRESS.LATEST': { title: 'Limites administratives', format: 'image/png', minZoom: 6, maxZoom: 16, legend: 'LIMITES_ADMINISTRATIVES_EXPRESS.LATEST-legend.png' },
        'BUILDINGS.BUILDINGS': { title: 'Bâtiments', format: 'image/png', minZoom: 6, maxZoom: 18 },
        'TRANSPORTNETWORKS.ROADS': { title: 'Routes', format: 'image/png', minZoom: 6, maxZoom: 18 },
        'TRANSPORTNETWORKS.RAILWAYS': { title: 'Voies ferrées', format: 'image/png', minZoom: 6, maxZoom: 18 },
        'HYDROGRAPHY.HYDROGRAPHY': { title: 'Hydrographie', format: 'image/png', minZoom: 6, maxZoom: 18 },
        'ELEVATION.SLOPES': { title: 'Altitude', format: 'image/jpeg', minZoom: 6, maxZoom: 14 },
        'ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW': { title: 'Estompage', format: 'image/png', style: 'estompage_grayscale', minZoom: 0, maxZoom: 15 },
        'ELEVATION.LEVEL0': { title: 'Trait de côte Histolitt', format: 'image/png', minZoom: 6, maxZoom: 18 },
        'LANDCOVER.CLC18_FR': { title: 'CORINE Land Cover 2018', format: 'image/png', style: 'CORINE Land Cover - France métropolitaine', minZoom: 0, maxZoom: 16, legend: 'CLC_FR.png' },
        'OCSGE.COUVERTURE': { title: 'OCS GE – couverture', format: 'image/png', minZoom: 6, maxZoom: 16, legend: 'OCSGE.COUVERTURE-legend.png' }
    };

    var LEGENDS_BASE = 'https://data.geopf.fr/annexes/ressources/legendes/';

    G.knownLayers = KNOWN;

    /** Couche WMTS de la Géoplateforme (L.TileLayer). */
    var WMTS = L.TileLayer.extend({
        options: {
            layer: null,
            style: null,
            format: null,
            tileMatrixSet: null, // « PM » (Web Mercator) ou « 2154_10cm » selon le CRS de la carte
            apiKey: null,        // clé pour les ressources privées
            resolve: false,      // true : complète format/style/zooms depuis les capabilities
            attribution: G.config.attribution,
            crossOrigin: true,   // nécessaire à la capture de la carte (le service envoie les en-têtes CORS)
            maxNativeZoom: 19,
            title: null,
            description: null,
            legend: null,
            metadata: null
        },

        initialize: function (opts) {
            opts = L.extend({}, opts);
            if (opts.layer === undefined && opts.layers) { opts.layer = opts.layers; }
            this._userStyle = !!opts.style;
            var known = KNOWN[opts.layer] || {};
            var d = {
                style: known.style || 'normal',
                format: known.format || (/ORTHO|IMAGERY|SLOPES/i.test(opts.layer || '') ? 'image/jpeg' : 'image/png'),
                title: known.title || opts.layer,
                legend: known.legend ? LEGENDS_BASE + known.legend : null,
                attribution: G.config.attribution
            };
            if (known.minZoom !== undefined) { d.minZoom = known.minZoom; }
            if (known.maxZoom !== undefined) { d.maxNativeZoom = known.maxZoom; }
            L.TileLayer.prototype.initialize.call(this, G.config.wmts, L.extend(d, opts));
        },

        onAdd: function (map) {
            if (this.options.resolve && !this._resolved) {
                this._resolved = true;
                this._resolving = true;   // pas de requête de tuile avant de connaître format, style et zooms
                var self = this;
                G.getCapabilities().then(function (caps) {
                    var c = caps[self.options.layer];
                    if (!c) { return; }
                    var o = self.options;
                    if (!self._userStyle) { o.style = c.style || o.style; }
                    o.format = c.format || o.format;
                    o.title = o.title || c.title;
                    o.description = o.description || c.description;
                    if (!o.legend && c.legend) { o.legend = c.legend; }
                    if (c.minZoom !== undefined) { o.minZoom = c.minZoom; }
                    if (c.maxZoom !== undefined) { o.maxNativeZoom = c.maxZoom; }
                    self.fire('resolved', { info: c });
                }).catch(function () { /* on garde les valeurs par défaut */ }).then(function () {
                    self._resolving = false;
                    self.redraw();
                });
            }
            return L.TileLayer.prototype.onAdd.call(this, map);
        },

        _matrixSet: function () {
            var crs = this._map && this._map.options.crs;
            return this.options.tileMatrixSet || (crs && crs.code === 'EPSG:2154' ? '2154_10cm' : 'PM');
        },

        getTileUrl: function (coords) {
            var o = this.options;
            if (this._resolving) { return L.Util.emptyImageUrl; }
            var tms = this._matrixSet();
            var params = {
                SERVICE: 'WMTS',
                REQUEST: 'GetTile',
                VERSION: '1.0.0',
                LAYER: o.layer,
                STYLE: o.style,
                FORMAT: o.format,
                TILEMATRIXSET: tms,
                TILEMATRIX: this._getZoomForUrl(),
                TILEROW: coords.y,
                TILECOL: coords.x
            };
            if (o.apiKey) {
                return G.config.wmtsPrivate + '?apikey=' + encodeURIComponent(o.apiKey) + '&' + qs(params);
            }
            return G.config.wmts + '?' + qs(params);
        }
    });

    /** Couche WMS de la Géoplateforme (L.TileLayer.WMS). */
    var WMS = L.TileLayer.WMS.extend({
        initialize: function (opts) {
            opts = L.extend({}, opts);
            var layers = opts.layers || opts.layer;
            var url = opts.url || G.config.wms;
            var known = KNOWN[layers] || {};
            var o = L.extend({
                format: known.format || 'image/png',
                transparent: (known.format || 'image/png') === 'image/png',
                version: '1.3.0',
                crossOrigin: true,
                attribution: G.config.attribution,
                title: known.title || layers
            }, opts, { layers: layers });
            delete o.layer;
            delete o.url;
            L.TileLayer.WMS.prototype.initialize.call(this, url, o);
        }
    });

    G.WMTS = WMTS;
    G.WMS = WMS;
    G.wmts = function (opts) { return new WMTS(opts); };
    G.wms = function (opts) { return new WMS(opts); };

    /* ------------------------------------------------------------------ */
    /* Système de coordonnées Lambert 93 (nécessite Proj4Leaflet)          */
    /* ------------------------------------------------------------------ */

    var crsCache = null;
    G.crs = {};
    Object.defineProperty(G.crs, 'EPSG2154', {
        enumerable: true,
        get: function () {
            if (crsCache) { return crsCache; }
            if (!L.Proj || !L.Proj.CRS) {
                throw new Error('leaflet-geoplateforme : Proj4Leaflet (L.Proj) est requis pour EPSG:2154.');
            }
            var res = [];
            for (var i = 0; i <= 21; i++) { res.push(209715.2 / Math.pow(2, i)); }
            crsCache = new L.Proj.CRS(
                'EPSG:2154',
                '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 ' +
                '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
                { resolutions: res, origin: [0, 12000000] }
            );
            return crsCache;
        }
    });

    /* Conversion WGS84 → Lambert 93 (projection conique conforme, GRS80), autonome. */
    function toLambert93(lat, lng) {
        var a = 6378137, f = 1 / 298.257222101, e2 = 2 * f - f * f, e = Math.sqrt(e2);
        var rad = Math.PI / 180;
        var phi0 = 46.5 * rad, lam0 = 3 * rad, phi1 = 44 * rad, phi2 = 49 * rad;
        var m = function (p) { return Math.cos(p) / Math.sqrt(1 - e2 * Math.pow(Math.sin(p), 2)); };
        var tt = function (p) {
            return Math.tan(Math.PI / 4 - p / 2) /
                Math.pow((1 - e * Math.sin(p)) / (1 + e * Math.sin(p)), e / 2);
        };
        var n = (Math.log(m(phi1)) - Math.log(m(phi2))) / (Math.log(tt(phi1)) - Math.log(tt(phi2)));
        var F = m(phi1) / (n * Math.pow(tt(phi1), n));
        var rho0 = a * F * Math.pow(tt(phi0), n);
        var rho = a * F * Math.pow(tt(lat * rad), n);
        var theta = n * (lng * rad - lam0);
        return [700000 + rho * Math.sin(theta), 6600000 + rho0 - rho * Math.cos(theta)];
    }

    G.toLambert93 = toLambert93;

    /* ------------------------------------------------------------------ */
    /* Base des contrôles à panneau                                        */
    /* ------------------------------------------------------------------ */

    var PanelControl = L.Control.extend({
        options: { position: 'topright', collapsed: true },
        _iconName: 'search',
        _titleKey: 'search',

        onAdd: function (map) {
            this._map = map;
            var c = this._container = el('div', 'gpf-control ' + (this._cls || ''));
            stopEvents(c);
            this._toggleBtn = el('a', 'gpf-toggle', c);
            this._toggleBtn.href = '#';
            this._toggleBtn.setAttribute('role', 'button');
            this._toggleBtn.title = t(this._titleKey);
            this._toggleBtn.appendChild(icon(this._iconName));
            this._panel = el('div', 'gpf-panel', c);
            var head = el('div', 'gpf-panel-head', this._panel);
            el('span', 'gpf-panel-title', head, t(this._titleKey));
            var closeBtn = button('gpf-btn-icon gpf-close', head, null, 'close');
            L.DomEvent.on(closeBtn, 'click', this.collapse, this);
            this._body = el('div', 'gpf-panel-body', this._panel);
            L.DomEvent.on(this._toggleBtn, 'click', function (e) { L.DomEvent.stop(e); this.toggle(); }, this);
            this._build(this._body);
            this._setCollapsed(this.options.collapsed);
            if (this._added) { this._added(map); }
            return c;
        },

        onRemove: function (map) {
            if (this._removed) { this._removed(map); }
        },

        _setCollapsed: function (v) {
            this._isCollapsed = v;
            L.DomUtil[v ? 'addClass' : 'removeClass'](this._container, 'gpf-collapsed');
        },
        expand: function () { this._setCollapsed(false); this.fire('expand'); return this; },
        collapse: function () { this._setCollapsed(true); this.fire('collapse'); return this; },
        toggle: function () { return this._isCollapsed ? this.expand() : this.collapse(); },

        _status: function (target, msg, isError) {
            target.textContent = msg || '';
            target.className = 'gpf-status' + (isError ? ' gpf-error' : '');
        },
        _fail: function (target, err) {
            this._status(target, t('error', { msg: err.message || err }), true);
            this.fire('error', { error: err });
        }
    });
    PanelControl.include(L.Evented.prototype);

    /* ------------------------------------------------------------------ */
    /* Autocomplétion                                                      */
    /* ------------------------------------------------------------------ */

    /**
     * Branche une liste d'autocomplétion sur un <input>.
     * opts : { fetch(text) → Promise<items>, onSelect(item), minChars, delay }
     */
    function Autocomplete(input, opts) {
        var minChars = opts.minChars || 3, delay = opts.delay || 250;
        var list = el('ul', 'gpf-ac');
        list.style.display = 'none';
        input.parentNode.appendChild(list);
        var items = [], active = -1, seq = 0;

        function hide() { list.style.display = 'none'; active = -1; }

        function highlight(i) {
            active = i;
            Array.prototype.forEach.call(list.children, function (li, k) {
                L.DomUtil[k === i ? 'addClass' : 'removeClass'](li, 'gpf-active');
            });
        }

        function select(i) {
            var it = items[i];
            if (!it) { return; }
            input.value = it.label;
            hide();
            opts.onSelect(it);
        }

        function show(res) {
            items = res;
            list.innerHTML = '';
            if (!res.length) { hide(); return; }
            res.forEach(function (it, i) {
                var li = el('li', null, list);
                el('span', 'gpf-ac-label', li, it.label);
                if (it.sub) { el('span', 'gpf-ac-sub', li, it.sub); }
                L.DomEvent.on(li, 'mousedown', function (e) { L.DomEvent.stop(e); select(i); });
            });
            list.style.display = 'block';
            active = -1;
        }

        var run = debounce(function () {
            var text = input.value.trim();
            if (text.length < minChars) { hide(); return; }
            var my = ++seq;
            opts.fetch(text).then(function (res) { if (my === seq) { show(res); } })
                .catch(function () { if (my === seq) { hide(); } });
        }, delay);

        L.DomEvent.on(input, 'input', function () { if (opts.onInput) { opts.onInput(); } run(); });
        L.DomEvent.on(input, 'blur', function () { setTimeout(hide, 150); });
        L.DomEvent.on(input, 'keydown', function (e) {
            if (list.style.display === 'none') { return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); highlight(Math.min(active + 1, items.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(Math.max(active - 1, 0)); }
            else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); e.stopPropagation(); select(active); }
            else if (e.key === 'Escape') { hide(); }
        });
        return { hide: hide };
    }

    function pointField(parent, labelText, opts) {
        var wrap = el('div', 'gpf-field', parent);
        if (labelText) { el('label', 'gpf-label', wrap, labelText); }
        var row = el('div', 'gpf-row', wrap);
        var inputWrap = el('div', 'gpf-input-wrap', row);
        var input = el('input', 'gpf-input', inputWrap);
        input.type = 'text';
        input.autocomplete = 'off';
        input.placeholder = opts.placeholder || '';
        Autocomplete(input, {
            fetch: function (txt) { return G.services.complete(txt, { max: 6 }); },
            onSelect: opts.onSelect,
            onInput: opts.onInput
        });
        var pick = button('gpf-btn-icon', row, null, 'pick', t('pick'));
        return { wrap: wrap, row: row, input: input, pickBtn: pick };
    }

    /** Géocodage inverse « adresse la plus proche » pour libeller un point. */
    function labelForPoint(latlng) {
        return G.services.reverse({ latlng: latlng, indexes: ['address'], limit: 1 })
            .then(function (r) { return r.length ? r[0].label : null; })
            .catch(function () { return null; });
    }

    function coordsLabel(ll) { return ll.lat.toFixed(5) + ', ' + ll.lng.toFixed(5); }

    /* ------------------------------------------------------------------ */
    /* LayerSwitcher                                                       */
    /* ------------------------------------------------------------------ */

    var LayerSwitcher = PanelControl.extend({
        options: { position: 'topright', collapsed: true, layers: [] },
        _iconName: 'layers',
        _titleKey: 'layers',
        _cls: 'gpf-layerswitcher',

        initialize: function (opts) {
            L.setOptions(this, opts);
            this._entries = [];
            var self = this;
            (this.options.layers || []).forEach(function (e) {
                if (e.layer && e.layer instanceof L.Layer) { self._register(e.layer, e.config); }
                else { self._register(e); }
            });
        },

        _register: function (layer, config) {
            var o = layer.options || {};
            var cfg = L.extend({
                title: o.title || o.layer || o.layers || 'Layer',
                description: o.description || '',
                legends: o.legend ? [{ url: o.legend }] : [],
                metadata: o.metadata ? [].concat(o.metadata).map(function (m) { return typeof m === 'string' ? { url: m } : m; }) : [],
                quicklookUrl: null,
                removable: false
            }, config || {});
            this._entries.push({ layer: layer, config: cfg });
        },

        _added: function (map) {
            var self = this;
            this._entries.forEach(function (e, i) {
                var wanted = e.config.visibility !== false;
                if (wanted && !map.hasLayer(e.layer)) { map.addLayer(e.layer); }
                if (!wanted && map.hasLayer(e.layer)) { map.removeLayer(e.layer); }
                if (e.config.opacity !== undefined) { self._setOpacity(e.layer, e.config.opacity); }
            });
            this._applyOrder();
            this._render();
        },

        _build: function (body) {
            this._list = el('ul', 'gpf-ls-list', body);
        },

        /** Ajoute une couche (et l'affiche sur la carte). */
        addLayer: function (layer, config) {
            this._register(layer, config);
            if (this._map) {
                if (!this._map.hasLayer(layer) && (!config || config.visibility !== false)) { this._map.addLayer(layer); }
                this._applyOrder();
                this._render();
            }
            return this;
        },

        removeLayer: function (layer) {
            this._entries = this._entries.filter(function (e) { return e.layer !== layer; });
            if (this._map && this._map.hasLayer(layer)) { this._map.removeLayer(layer); }
            this.fire('layerremove', { layer: layer });
            this._applyOrder();
            if (this._list) { this._render(); }
            return this;
        },

        _setOpacity: function (layer, v) {
            if (layer.setOpacity) { layer.setOpacity(v); }
            else if (layer.setStyle) { layer.setStyle({ opacity: v, fillOpacity: v * 0.6 }); }
        },

        _applyOrder: function () {
            var map = this._map;
            this._entries.forEach(function (e, i) {
                if (e.layer.setZIndex) { e.layer.setZIndex(i + 1); }
                else if (map && map.hasLayer(e.layer) && e.layer.bringToFront) { e.layer.bringToFront(); }
            });
        },

        _render: function () {
            var self = this, map = this._map;
            this._list.innerHTML = '';
            var entries = this._entries.slice().reverse(); // la couche du dessus en premier
            entries.forEach(function (e) {
                var li = el('li', 'gpf-ls-item', self._list);
                li.draggable = true;
                li.title = t('moveHint');
                var head = el('div', 'gpf-ls-head', li);
                var cb = el('input', null, head);
                cb.type = 'checkbox';
                cb.checked = map.hasLayer(e.layer);
                L.DomEvent.on(cb, 'change', function () {
                    if (cb.checked) { map.addLayer(e.layer); self._applyOrder(); } else { map.removeLayer(e.layer); }
                    self.fire('visibility', { layer: e.layer, visible: cb.checked });
                });
                el('span', 'gpf-ls-title', head, e.config.title);
                var infoBtn = button('gpf-btn-icon', head, null, 'info', t('info'));
                if (e.config.removable) {
                    var rm = button('gpf-btn-icon', head, null, 'close', t('remove'));
                    L.DomEvent.on(rm, 'click', function () { self.removeLayer(e.layer); });
                }
                var op = el('div', 'gpf-ls-opacity', li);
                el('span', null, op, t('opacity'));
                var range = el('input', null, op);
                range.type = 'range'; range.min = 0; range.max = 100;
                var cur = e.layer.options && e.layer.options.opacity !== undefined ? e.layer.options.opacity : 1;
                range.value = Math.round(cur * 100);
                L.DomEvent.on(range, 'input', function () {
                    self._setOpacity(e.layer, range.value / 100);
                    self.fire('opacity', { layer: e.layer, opacity: range.value / 100 });
                });
                var info = el('div', 'gpf-ls-info', li);
                info.style.display = 'none';
                if (e.config.description) { el('p', null, info, e.config.description); }
                if (e.config.quicklookUrl) { el('img', 'gpf-ls-quicklook', info).src = e.config.quicklookUrl; }
                e.config.legends.forEach(function (lg) {
                    el('div', 'gpf-ls-sub', info, t('legend'));
                    el('img', 'gpf-ls-legend', info).src = lg.url;
                });
                e.config.metadata.forEach(function (m) {
                    var a = el('a', 'gpf-ls-meta', info, m.title || t('metadata'));
                    a.href = m.url; a.target = '_blank'; a.rel = 'noopener';
                });
                if (!e.config.description && !e.config.legends.length && !e.config.metadata.length && !e.config.quicklookUrl) {
                    infoBtn.style.display = 'none';
                }
                L.DomEvent.on(infoBtn, 'click', function () {
                    info.style.display = info.style.display === 'none' ? 'block' : 'none';
                });
                // réordonnancement par glisser-déposer
                L.DomEvent.on(li, 'dragstart', function (ev) {
                    ev.dataTransfer.setData('text/plain', String(self._entries.indexOf(e)));
                    ev.dataTransfer.effectAllowed = 'move';
                });
                L.DomEvent.on(li, 'dragover', function (ev) { ev.preventDefault(); });
                L.DomEvent.on(li, 'drop', function (ev) {
                    ev.preventDefault();
                    var from = parseInt(ev.dataTransfer.getData('text/plain'), 10);
                    var to = self._entries.indexOf(e);
                    if (isNaN(from) || from === to) { return; }
                    var moved = self._entries.splice(from, 1)[0];
                    self._entries.splice(to, 0, moved);
                    self._applyOrder();
                    self._render();
                    self.fire('reorder', { layers: self._entries.map(function (x) { return x.layer; }) });
                });
            });
        }
    });

    /* ------------------------------------------------------------------ */
    /* SearchEngine                                                        */
    /* ------------------------------------------------------------------ */

    var SearchEngine = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            zoomTo: 16,
            marker: true,
            minChars: 3,
            maximumEntries: 8,
            indexes: ['address', 'poi'],       // index interrogés lors de la recherche
            advancedSearch: false,             // affiche des cases pour choisir adresses / lieux / parcelles
            autocomplete: true
        },
        _iconName: 'search',
        _titleKey: 'search',
        _cls: 'gpf-searchengine',

        _build: function (body) {
            var self = this;
            var row = el('div', 'gpf-row', body);
            var wrap = el('div', 'gpf-input-wrap', row);
            var input = this._input = el('input', 'gpf-input', wrap);
            input.type = 'text';
            input.placeholder = t('searchPlaceholder');
            input.autocomplete = 'off';
            var go = button('gpf-btn-primary', row, null, 'search', t('searchBtn'));

            if (this.options.autocomplete) {
                Autocomplete(input, {
                    minChars: this.options.minChars,
                    fetch: function (txt) {
                        return G.services.complete(txt, { max: self.options.maximumEntries });
                    },
                    onSelect: function (it) { self._select(it); }
                });
            }

            if (this.options.advancedSearch) {
                var adv = el('div', 'gpf-checks', body);
                this._checks = {};
                [['address', 'idxAddress'], ['poi', 'idxPoi'], ['parcel', 'idxParcel']].forEach(function (p) {
                    var lb = el('label', null, adv);
                    var cb = el('input', null, lb);
                    cb.type = 'checkbox';
                    cb.checked = self.options.indexes.indexOf(p[0]) >= 0;
                    el('span', null, lb, t(p[1]));
                    self._checks[p[0]] = cb;
                });
            }

            this._results = el('ul', 'gpf-results', body);
            this._msg = el('div', 'gpf-status', body);

            L.DomEvent.on(go, 'click', this._submit, this);
            L.DomEvent.on(input, 'keydown', function (e) { if (e.key === 'Enter' && !e.defaultPrevented) { self._submit(); } });
        },

        _indexes: function () {
            if (!this._checks) { return this.options.indexes; }
            var self = this;
            var r = Object.keys(this._checks).filter(function (k) { return self._checks[k].checked; });
            return r.length ? r : this.options.indexes;
        },

        _submit: function () {
            var self = this, text = this._input.value.trim();
            if (!text) { return; }
            this._results.innerHTML = '';
            this._status(this._msg, t('loading'));
            G.services.search(text, { indexes: this._indexes(), limit: this.options.maximumEntries })
                .then(function (items) {
                    if (!items.length) { self._status(self._msg, t('noResult')); return; }
                    self._status(self._msg, '');
                    if (items.length === 1) { self._select(items[0]); return; }
                    items.forEach(function (it) {
                        var li = el('li', null, self._results);
                        el('span', 'gpf-ac-label', li, it.label);
                        if (it.sub) { el('span', 'gpf-ac-sub', li, it.sub); }
                        L.DomEvent.on(li, 'click', function () { self._select(it); });
                    });
                })
                .catch(function (err) { self._fail(self._msg, err); });
        },

        _select: function (it) {
            var map = this._map;
            this._results.innerHTML = '';
            this._status(this._msg, '');
            this._input.value = it.label;
            if (this.options.zoomTo) { map.setView(it.latlng, this.options.zoomTo); } else { map.panTo(it.latlng); }
            if (this.options.marker) {
                if (this._marker) { this._marker.remove(); }
                var pop = el('b', null, null, it.label);
                this._marker = L.marker(it.latlng).addTo(map).bindPopup(pop);
            }
            this.fire('select', { result: it, latlng: it.latlng });
        },

        _removed: function () {
            if (this._marker) { this._marker.remove(); this._marker = null; }
        },

        clear: function () {
            if (this._marker) { this._marker.remove(); this._marker = null; }
            this._input.value = '';
            this._results.innerHTML = '';
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* ReverseGeocode                                                      */
    /* ------------------------------------------------------------------ */

    var ReverseGeocode = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            indexes: ['address', 'poi', 'parcel'],
            delimitation: 'point',        // 'point' | 'circle' | 'extent'
            maximumResponses: 10,
            zoomTo: 17
        },
        _iconName: 'reverse',
        _titleKey: 'reverse',
        _cls: 'gpf-reverse',

        _build: function (body) {
            var self = this;
            var idx = el('div', 'gpf-checks', body);
            this._checks = {};
            [['address', 'idxAddress'], ['poi', 'idxPoi'], ['parcel', 'idxParcel']].forEach(function (p) {
                var lb = el('label', null, idx);
                var cb = el('input', null, lb);
                cb.type = 'checkbox';
                cb.checked = self.options.indexes.indexOf(p[0]) >= 0;
                el('span', null, lb, t(p[1]));
                self._checks[p[0]] = cb;
            });
            var d = el('div', 'gpf-segment', body);
            this._delim = this.options.delimitation;
            this._delimBtns = {};
            [['point', 'delimPoint'], ['circle', 'delimCircle'], ['extent', 'delimExtent']].forEach(function (p) {
                var b = button('', d, t(p[1]));
                self._delimBtns[p[0]] = b;
                L.DomEvent.on(b, 'click', function () { self._setDelim(p[0]); });
            });
            this._hint = el('div', 'gpf-hint', body);
            this._toggle = button('gpf-btn-primary', body, t('activate'));
            this._clearBtn = button('', body, t('clear'));
            this._msg = el('div', 'gpf-status', body);
            this._results = el('ul', 'gpf-results', body);
            L.DomEvent.on(this._toggle, 'click', function () { self._active ? self._stop() : self._start(); });
            L.DomEvent.on(this._clearBtn, 'click', this.clear, this);
            this._setDelim(this._delim);
        },

        _setDelim: function (d) {
            this._delim = d;
            var self = this;
            Object.keys(this._delimBtns).forEach(function (k) {
                L.DomUtil[k === d ? 'addClass' : 'removeClass'](self._delimBtns[k], 'gpf-on');
            });
            this._hint.textContent = d === 'circle' ? t('reverseHintCircle') : d === 'extent' ? t('reverseHintExtent') : t('reverseHint');
            if (this._active) { this._stop(); this._start(); }
        },

        _indexes: function () {
            var self = this;
            var r = Object.keys(this._checks).filter(function (k) { return self._checks[k].checked; });
            return r.length ? r : this.options.indexes;
        },

        _start: function () {
            var map = this._map;
            this._active = true;
            this._toggle.lastChild.textContent = t('deactivate');
            L.DomUtil.addClass(map.getContainer(), 'gpf-crosshair');
            if (this._delim === 'point') {
                map.on('click', this._onClick, this);
            } else {
                map.dragging.disable();
                map.on('mousedown', this._onDown, this);
            }
        },

        _stop: function () {
            var map = this._map;
            this._active = false;
            this._toggle.lastChild.textContent = t('activate');
            L.DomUtil.removeClass(map.getContainer(), 'gpf-crosshair');
            map.off('click', this._onClick, this);
            map.off('mousedown', this._onDown, this);
            map.off('mousemove', this._onMove, this);
            map.off('mouseup', this._onUp, this);
            map.dragging.enable();
        },

        _onClick: function (e) {
            this._drawShape(null);
            this._query({ latlng: e.latlng }, e.latlng);
        },

        _onDown: function (e) {
            this._origin = e.latlng;
            this._drawShape(null);
            this._map.on('mousemove', this._onMove, this);
            this._map.on('mouseup', this._onUp, this);
        },

        _onMove: function (e) {
            if (!this._origin) { return; }
            this._shapeFor(this._origin, e.latlng, true);
        },

        _onUp: function (e) {
            this._map.off('mousemove', this._onMove, this);
            this._map.off('mouseup', this._onUp, this);
            var o = this._origin;
            this._origin = null;
            if (!o || o.equals(e.latlng)) { return; }
            var shape = this._shapeFor(o, e.latlng, true);
            var geom;
            if (this._delim === 'circle') {
                geom = { type: 'Circle', coordinates: [o.lng, o.lat], radius: Math.round(o.distanceTo(e.latlng)) };
            } else {
                var b = shape.getBounds();
                geom = {
                    type: 'Polygon',
                    coordinates: [[
                        [b.getWest(), b.getSouth()], [b.getEast(), b.getSouth()],
                        [b.getEast(), b.getNorth()], [b.getWest(), b.getNorth()], [b.getWest(), b.getSouth()]
                    ]]
                };
            }
            this._query({ searchgeom: geom }, shape.getBounds().getCenter());
        },

        _shapeFor: function (a, b, draw) {
            var shape;
            if (this._delim === 'circle') {
                shape = L.circle(a, { radius: a.distanceTo(b), className: 'gpf-shape' });
            } else {
                shape = L.rectangle(L.latLngBounds(a, b), { className: 'gpf-shape' });
            }
            return draw ? this._drawShape(shape) : shape;
        },

        _drawShape: function (shape) {
            if (this._shape) { this._shape.remove(); this._shape = null; }
            if (shape) { this._shape = shape.setStyle({ color: '#0b6fa4', weight: 2, fillOpacity: 0.15 }).addTo(this._map); }
            return shape;
        },

        _query: function (q, center) {
            var self = this;
            this._results.innerHTML = '';
            this._status(this._msg, t('loading'));
            G.services.reverse({
                latlng: q.latlng,
                searchgeom: q.searchgeom,
                indexes: this._indexes(),
                limit: this.options.maximumResponses
            }).then(function (items) {
                self._status(self._msg, items.length ? '' : t('noResult'));
                self._show(items);
                self.fire('results', { results: items, center: center });
            }).catch(function (err) { self._fail(self._msg, err); });
        },

        _show: function (items) {
            var self = this;
            if (!this._layer) { this._layer = L.layerGroup().addTo(this._map); }
            this._layer.clearLayers();
            items.forEach(function (it) {
                var m = L.marker(it.latlng).bindPopup(el('b', null, null, it.label));
                m.addTo(self._layer);
                var li = el('li', null, self._results);
                el('span', 'gpf-ac-label', li, it.label);
                var sub = [it.sub, it.distance !== undefined ? it.distance + ' m' : ''].filter(Boolean).join(' · ');
                if (sub) { el('span', 'gpf-ac-sub', li, sub); }
                L.DomEvent.on(li, 'click', function () {
                    self._map.setView(it.latlng, Math.max(self._map.getZoom(), self.options.zoomTo));
                    m.openPopup();
                    self.fire('select', { result: it });
                });
            });
        },

        _removed: function () { this._stop(); this.clear(); },

        clear: function () {
            if (this._layer) { this._layer.clearLayers(); }
            this._drawShape(null);
            this._results.innerHTML = '';
            this._status(this._msg, '');
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* Route                                                               */
    /* ------------------------------------------------------------------ */

    var MODIFIERS = {
        'left': 'left', 'right': 'right', 'slight left': 'slightLeft', 'slight right': 'slightRight',
        'sharp left': 'sharpLeft', 'sharp right': 'sharpRight', 'straight': 'straight'
    };

    function stepName(step) {
        var n = (step.attributes && step.attributes.name) || {};
        return n.nom_1_droite || n.nom_1_gauche || n.cpx_toponyme || '';
    }

    function stepText(step) {
        var ins = step.instruction || {}, type = ins.type, mod = ins.modifier;
        var name = stepName(step);
        var on = name ? ' ' + t('stepOn', { name: name }) : '';
        var dir = MODIFIERS[mod] ? ' ' + t(MODIFIERS[mod]) : '';
        switch (type) {
            case 'depart': return t('stepDepart') + on;
            case 'arrive': return t('stepArrive') + on;
            case 'turn':
                if (mod === 'uturn') { return t('stepUturn') + on; }
                if (mod === 'straight') { return t('stepStraight') + on; }
                return t('stepTurn') + dir + on;
            case 'merge': return t('stepMerge') + on;
            case 'on ramp': return t('stepOnRamp') + on;
            case 'off ramp': return t('stepOffRamp') + on;
            case 'fork': return t('stepFork') + dir + on;
            case 'end of road': return t('stepEndOfRoad') + (dir ? ',' + dir : '') + on;
            case 'roundabout': case 'rotary': case 'roundabout turn':
                return t('stepRoundabout') + (ins.exit ? ', ' + t('stepExit', { n: ins.exit }) : '') + on;
            case 'new name': case 'continue': default:
                return (mod === 'uturn' ? t('stepUturn') : t('stepContinue')) + on;
        }
    }

    var Route = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            exclusions: ['autoroute', 'tunnel', 'pont'],
            profiles: ['car', 'pedestrian'],
            resource: 'bdtopo-osrm',
            fitBounds: true,
            style: { color: '#0b6fa4', weight: 6, opacity: 0.85 }
        },
        _iconName: 'route',
        _titleKey: 'route',
        _cls: 'gpf-route',

        _build: function (body) {
            var self = this;
            this._start = null; this._end = null; this._vias = [];
            this._profile = this.options.profiles[0];

            var seg = el('div', 'gpf-segment', body);
            this._profBtns = {};
            this.options.profiles.forEach(function (p) {
                var b = button('', seg, t(p));
                self._profBtns[p] = b;
                L.DomEvent.on(b, 'click', function () { self._setProfile(p); });
            });

            this._points = el('div', 'gpf-points', body);
            this._startF = this._makeField('start', function (ll) { self._start = ll; self._refreshMarkers(); });
            this._viaBox = el('div', null, this._points);
            this._endF = this._makeField('end', function (ll) { self._end = ll; self._refreshMarkers(); });
            this._addVia = button('gpf-link', body, t('addVia'));
            L.DomEvent.on(this._addVia, 'click', function () { self._vias.push(null); self._renderVias(); });

            var opt = el('div', 'gpf-field', body);
            this._optim = el('select', 'gpf-select', opt);
            [['fastest', 'fastest'], ['shortest', 'shortest']].forEach(function (o) {
                var op = el('option', null, this._optim, t(o[1]));
                op.value = o[0];
            }, this);

            if (this.options.exclusions.length) {
                this._exBox = el('div', 'gpf-checks', body);
                el('span', 'gpf-label', this._exBox, t('exclusions'));
                this._exChecks = {};
                var keys = { autoroute: 'exAutoroute', tunnel: 'exTunnel', pont: 'exPont' };
                this.options.exclusions.forEach(function (x) {
                    var lb = el('label', null, self._exBox);
                    var cb = el('input', null, lb);
                    cb.type = 'checkbox';
                    el('span', null, lb, keys[x] ? t(keys[x]) : x);
                    self._exChecks[x] = cb;
                });
            }

            var actions = el('div', 'gpf-row', body);
            this._go = button('gpf-btn-primary', actions, t('compute'));
            this._clear = button('', actions, t('clear'));
            L.DomEvent.on(this._go, 'click', this.compute, this);
            L.DomEvent.on(this._clear, 'click', this.clear, this);

            this._msg = el('div', 'gpf-status', body);
            this._summary = el('div', 'gpf-summary', body);
            this._steps = el('ol', 'gpf-steps', body);
            this._setProfile(this._profile);
        },

        _makeField: function (kind, setter) {
            var self = this;
            var f = pointField(this._points, null, {
                placeholder: t(kind === 'via' ? 'via' : kind),
                onSelect: function (it) { setter(it.latlng); },
                onInput: function () { setter(null); }
            });
            // l'ordre visuel : départ, étapes, arrivée
            if (kind === 'end') { this._points.appendChild(f.wrap); }
            L.DomEvent.on(f.pickBtn, 'click', function () { self._pick(f, setter); });
            return f;
        },

        _setProfile: function (p) {
            this._profile = p;
            var self = this;
            Object.keys(this._profBtns).forEach(function (k) {
                L.DomUtil[k === p ? 'addClass' : 'removeClass'](self._profBtns[k], 'gpf-on');
            });
            if (this._exBox) { this._exBox.style.display = p === 'car' ? '' : 'none'; }
        },

        _renderVias: function () {
            var self = this;
            this._viaBox.innerHTML = '';
            this._vias.forEach(function (ll, i) {
                var f = pointField(self._viaBox, null, {
                    placeholder: t('via') + ' ' + (i + 1),
                    onSelect: function (it) { self._vias[i] = it.latlng; self._refreshMarkers(); },
                    onInput: function () { self._vias[i] = null; }
                });
                if (ll) { f.input.value = coordsLabel(ll); }
                var rm = button('gpf-btn-icon', f.row, null, 'close', t('removeVia'));
                L.DomEvent.on(rm, 'click', function () { self._vias.splice(i, 1); self._renderVias(); self._refreshMarkers(); });
                L.DomEvent.on(f.pickBtn, 'click', function () {
                    self._pick(f, function (p) { self._vias[i] = p; self._refreshMarkers(); });
                });
            });
        },

        _pick: function (field, setter) {
            var self = this, map = this._map;
            field.input.placeholder = t('pickHint');
            L.DomUtil.addClass(map.getContainer(), 'gpf-crosshair');
            map.once('click', function (e) {
                L.DomUtil.removeClass(map.getContainer(), 'gpf-crosshair');
                field.input.placeholder = '';
                field.input.value = coordsLabel(e.latlng);
                setter(e.latlng);
                labelForPoint(e.latlng).then(function (lbl) { if (lbl && field.input.value === coordsLabel(e.latlng)) { field.input.value = lbl; } });
            });
        },

        _refreshMarkers: function () {
            var self = this, map = this._map;
            if (!this._markers) { this._markers = L.layerGroup().addTo(map); }
            this._markers.clearLayers();
            var add = function (ll, cls, text, setter, field) {
                if (!ll) { return; }
                var m = L.marker(ll, { icon: pointIcon(cls, text), draggable: true }).addTo(self._markers);
                m.on('dragend', function () {
                    setter(m.getLatLng());
                    if (field) { field.value = coordsLabel(m.getLatLng()); }
                    if (self._lastResult) { self.compute(); }
                });
            };
            add(this._start, 'gpf-m-start', 'A', function (p) { self._start = p; }, this._startF.input);
            this._vias.forEach(function (v, i) {
                add(v, 'gpf-m-via', String(i + 1), function (p) { self._vias[i] = p; });
            });
            add(this._end, 'gpf-m-end', 'B', function (p) { self._end = p; }, this._endF.input);
        },

        /** Définit programmatiquement les points. */
        setPoints: function (start, end, via) {
            this._start = start ? L.latLng(start) : null;
            this._end = end ? L.latLng(end) : null;
            this._vias = (via || []).map(L.latLng);
            this._renderVias();
            this._startF.input.value = this._start ? coordsLabel(this._start) : '';
            this._endF.input.value = this._end ? coordsLabel(this._end) : '';
            this._refreshMarkers();
            return this;
        },

        compute: function () {
            var self = this;
            var vias = this._vias.filter(Boolean);
            if (!this._start || !this._end) { this._status(this._msg, t('needPoints'), true); return this; }
            var ex = [];
            if (this._profile === 'car' && this._exChecks) {
                Object.keys(this._exChecks).forEach(function (k) { if (self._exChecks[k].checked) { ex.push(k); } });
            }
            this._status(this._msg, t('loading'));
            G.services.route({
                resource: this.options.resource,
                start: this._start, end: this._end, via: vias,
                profile: this._profile, optimization: this._optim.value, exclusions: ex
            }).then(function (res) {
                self._status(self._msg, '');
                self._lastResult = res;
                self._show(res);
                self.fire('route', { result: res });
            }).catch(function (err) { self._fail(self._msg, err); });
            return this;
        },

        _show: function (res) {
            var self = this, map = this._map;
            if (this._line) { this._line.remove(); }
            this._line = L.geoJSON(res.geometry, { style: this.options.style }).addTo(map);
            if (this.options.fitBounds) { map.fitBounds(this._line.getBounds(), { padding: [40, 40] }); }
            this._summary.innerHTML = '';
            var d = el('span', null, this._summary);
            d.appendChild(document.createTextNode(t('distance') + ' : '));
            el('b', null, d, formatDistance(res.distance));
            var du = el('span', null, this._summary);
            du.appendChild(document.createTextNode(t('duration') + ' : '));
            el('b', null, du, formatDuration(res.duration));
            this._steps.innerHTML = '';
            (res.portions || []).forEach(function (portion) {
                (portion.steps || []).forEach(function (step) {
                    var li = el('li', null, self._steps);
                    el('span', 'gpf-step-text', li, stepText(step));
                    if (step.distance) { el('span', 'gpf-ac-sub', li, formatDistance(step.distance)); }
                    L.DomEvent.on(li, 'click', function () {
                        if (self._hl) { self._hl.remove(); }
                        self._hl = L.geoJSON(step.geometry, { style: { color: '#f08c00', weight: 8, opacity: 0.9 } }).addTo(map);
                        map.fitBounds(self._hl.getBounds(), { maxZoom: 18, padding: [60, 60] });
                    });
                });
            });
        },

        _removed: function () { this.clear(); },

        clear: function () {
            [this._line, this._hl].forEach(function (l) { if (l) { l.remove(); } });
            this._line = this._hl = null;
            if (this._markers) { this._markers.clearLayers(); }
            this._start = this._end = null; this._vias = [];
            this._lastResult = null;
            if (this._viaBox) { this._viaBox.innerHTML = ''; }
            this._startF.input.value = ''; this._endF.input.value = '';
            this._summary.innerHTML = ''; this._steps.innerHTML = '';
            this._status(this._msg, '');
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* Isocurve                                                            */
    /* ------------------------------------------------------------------ */

    var Isocurve = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            resource: 'bdtopo-valhalla',
            profiles: ['car', 'pedestrian'],
            fitBounds: true,
            style: { color: '#c2410c', weight: 2, fillColor: '#f97316', fillOpacity: 0.25 }
        },
        _iconName: 'isocurve',
        _titleKey: 'isocurve',
        _cls: 'gpf-isocurve',

        _build: function (body) {
            var self = this;
            this._point = null;
            this._profile = this.options.profiles[0];
            this._type = 'time';

            var seg = el('div', 'gpf-segment', body);
            this._profBtns = {};
            this.options.profiles.forEach(function (p) {
                var b = button('', seg, t(p));
                self._profBtns[p] = b;
                L.DomEvent.on(b, 'click', function () { self._profile = p; self._sync(); });
            });

            this._field = pointField(body, t('point'), {
                placeholder: t('point'),
                onSelect: function (it) { self._setPoint(it.latlng, false); },
                onInput: function () { self._point = null; }
            });
            L.DomEvent.on(this._field.pickBtn, 'click', function () {
                var map = self._map;
                L.DomUtil.addClass(map.getContainer(), 'gpf-crosshair');
                self._field.input.placeholder = t('pickHint');
                map.once('click', function (e) {
                    L.DomUtil.removeClass(map.getContainer(), 'gpf-crosshair');
                    self._field.input.placeholder = t('point');
                    self._setPoint(e.latlng, true);
                });
            });

            var seg2 = el('div', 'gpf-segment', body);
            this._typeBtns = {};
            [['time', 'time'], ['distance', 'dist']].forEach(function (p) {
                var b = button('', seg2, t(p[1]));
                self._typeBtns[p[0]] = b;
                L.DomEvent.on(b, 'click', function () { self._type = p[0]; self._sync(); });
            });

            var row = el('div', 'gpf-row', body);
            this._value = el('input', 'gpf-input gpf-short', row);
            this._value.type = 'number'; this._value.min = 1; this._value.value = 10;
            this._unit = el('select', 'gpf-select', row);

            var dirRow = el('div', 'gpf-field', body);
            this._dir = el('select', 'gpf-select', dirRow);
            [['departure', 'departure'], ['arrival', 'arrival']].forEach(function (o) {
                el('option', null, self._dir, t(o[1])).value = o[0];
            });

            var actions = el('div', 'gpf-row', body);
            this._go = button('gpf-btn-primary', actions, t('compute'));
            this._clearBtn = button('', actions, t('clear'));
            L.DomEvent.on(this._go, 'click', this.compute, this);
            L.DomEvent.on(this._clearBtn, 'click', this.clear, this);
            this._msg = el('div', 'gpf-status', body);
            this._sync();
        },

        _sync: function () {
            var self = this;
            Object.keys(this._profBtns).forEach(function (k) {
                L.DomUtil[k === self._profile ? 'addClass' : 'removeClass'](self._profBtns[k], 'gpf-on');
            });
            Object.keys(this._typeBtns).forEach(function (k) {
                L.DomUtil[k === self._type ? 'addClass' : 'removeClass'](self._typeBtns[k], 'gpf-on');
            });
            this._unit.innerHTML = '';
            var units = this._type === 'time' ? [['minute', 'minutes'], ['hour', 'hours']] : [['meter', 'meters'], ['kilometer', 'kilometers']];
            units.forEach(function (u) { el('option', null, self._unit, t(u[1])).value = u[0]; });
        },

        _setPoint: function (ll, label) {
            var self = this;
            this._point = ll;
            if (!this._marker) { this._marker = L.marker(ll, { icon: pointIcon('gpf-m-start', 'O'), draggable: true }).addTo(this._map); }
            else { this._marker.setLatLng(ll); }
            this._marker.off('dragend').on('dragend', function () { self._point = self._marker.getLatLng(); });
            if (label) {
                this._field.input.value = coordsLabel(ll);
                labelForPoint(ll).then(function (lbl) { if (lbl) { self._field.input.value = lbl; } });
            }
        },

        /** Définit programmatiquement le point d'origine. */
        setPoint: function (latlng) { this._setPoint(L.latLng(latlng), true); return this; },

        compute: function () {
            var self = this;
            if (!this._point) { this._status(this._msg, t('needPoint'), true); return this; }
            this._status(this._msg, t('loading'));
            G.services.isochrone({
                resource: this.options.resource,
                point: this._point,
                costType: this._type,
                costValue: parseFloat(this._value.value),
                unit: this._unit.value,
                profile: this._profile,
                direction: this._dir.value
            }).then(function (res) {
                self._status(self._msg, '');
                if (self._poly) { self._poly.remove(); }
                self._poly = L.geoJSON(res.geometry, { style: self.options.style }).addTo(self._map);
                if (self.options.fitBounds) { self._map.fitBounds(self._poly.getBounds(), { padding: [30, 30] }); }
                self.fire('isocurve', { result: res, layer: self._poly });
            }).catch(function (err) { self._fail(self._msg, err); });
            return this;
        },

        _removed: function () { this.clear(); },

        clear: function () {
            [this._poly, this._marker].forEach(function (l) { if (l) { l.remove(); } });
            this._poly = this._marker = null;
            this._point = null;
            this._field.input.value = '';
            this._status(this._msg, '');
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* MousePosition                                                       */
    /* ------------------------------------------------------------------ */

    function dms(v, pos, neg, mode) {
        var h = v < 0 ? neg : pos;
        v = Math.abs(v);
        var d = Math.floor(v), m = (v - d) * 60;
        if (mode === 'DM') { return d + '° ' + m.toFixed(4) + '′ ' + h; }
        var mi = Math.floor(m), s = (m - mi) * 60;
        return d + '° ' + mi + '′ ' + s.toFixed(2) + '″ ' + h;
    }

    var SYSTEMS = {
        DD: { label: 'sysDD', format: function (ll) {
            return [[t('lat'), ll.lat.toFixed(6) + '°'], [t('lng'), ll.lng.toFixed(6) + '°']];
        } },
        DM: { label: 'sysDM', format: function (ll) {
            return [[t('lat'), dms(ll.lat, 'N', 'S', 'DM')], [t('lng'), dms(ll.lng, 'E', 'W', 'DM')]];
        } },
        DMS: { label: 'sysDMS', format: function (ll) {
            return [[t('lat'), dms(ll.lat, 'N', 'S')], [t('lng'), dms(ll.lng, 'E', 'W')]];
        } },
        Mercator: { label: 'sysMercator', format: function (ll) {
            var p = L.CRS.EPSG3857.project(ll);
            return [['X', p.x.toFixed(2) + ' m'], ['Y', p.y.toFixed(2) + ' m']];
        } },
        Lambert93: { label: 'sysLambert93', format: function (ll) {
            var p = toLambert93(ll.lat, ll.lng);
            return [['X', p[0].toFixed(2) + ' m'], ['Y', p[1].toFixed(2) + ' m']];
        } }
    };

    var MousePosition = L.Control.extend({
        options: {
            position: 'bottomright',
            collapsed: true,           // le sélecteur de système est replié
            systems: ['DD', 'DMS', 'Lambert93', 'Mercator'],
            system: null,              // système initial (clé), par défaut le premier
            displayAltitude: true,
            altitudeDelay: 300
        },

        initialize: function (opts) {
            L.setOptions(this, opts);
            this._systems = {};
            this._order = [];
            var self = this;
            this.options.systems.forEach(function (s) {
                var def;
                if (typeof s === 'string') {
                    def = SYSTEMS[s];
                    if (!def) { return; }
                    self._systems[s] = def; self._order.push(s);
                } else {
                    // système personnalisé : { key, label, format(latlng) } ou { key, label, proj4, units }
                    var f = s.format;
                    if (!f && s.proj4 && window.proj4) {
                        f = function (ll) {
                            var p = window.proj4('EPSG:4326', s.proj4, [ll.lng, ll.lat]);
                            return [['X', p[0].toFixed(2) + ' ' + (s.units || 'm')], ['Y', p[1].toFixed(2) + ' ' + (s.units || 'm')]];
                        };
                    }
                    if (!f) { return; }
                    self._systems[s.key] = { rawLabel: s.label, format: f };
                    self._order.push(s.key);
                }
            });
            this._current = this.options.system && this._systems[this.options.system] ? this.options.system : this._order[0];
        },

        onAdd: function (map) {
            this._map = map;
            var c = this._container = el('div', 'gpf-control gpf-mouse');
            stopEvents(c);
            this._readout = el('div', 'gpf-mouse-readout', c);
            this._coords = el('div', 'gpf-mouse-coords', this._readout);
            this._alt = el('div', 'gpf-mouse-alt', this._readout);
            this._settings = el('div', 'gpf-mouse-settings', c);
            var sel = this._select = el('select', 'gpf-select', this._settings);
            this._order.forEach(function (k) {
                var d = this._systems[k];
                var o = el('option', null, sel, d.rawLabel || t(d.label));
                o.value = k;
            }, this);
            sel.value = this._current;
            L.DomEvent.on(sel, 'change', function () { this._current = sel.value; this._render(); }, this);
            var btn = this._btn = el('a', 'gpf-toggle', c);
            btn.href = '#'; btn.title = t('settings');
            btn.appendChild(icon('settings'));
            L.DomEvent.on(btn, 'click', function (e) {
                L.DomEvent.stop(e);
                L.DomUtil[L.DomUtil.hasClass(c, 'gpf-open') ? 'removeClass' : 'addClass'](c, 'gpf-open');
            });
            if (this._order.length < 2) { btn.style.display = 'none'; }
            map.on('mousemove', this._onMove, this);
            map.on('mouseout', this._onOut, this);
            this._last = map.getCenter();
            this._render();
            return c;
        },

        onRemove: function (map) {
            map.off('mousemove', this._onMove, this);
            map.off('mouseout', this._onOut, this);
            clearTimeout(this._timer);
        },

        _onOut: function () { clearTimeout(this._timer); },

        _onMove: function (e) {
            this._last = e.latlng;
            this._render();
            if (this.options.displayAltitude) {
                clearTimeout(this._timer);
                var self = this, ll = e.latlng;
                this._timer = setTimeout(function () { self._fetchAlt(ll); }, this.options.altitudeDelay);
            }
        },

        _render: function () {
            if (!this._last) { return; }
            var d = this._systems[this._current];
            this._coords.innerHTML = '';
            d.format(this._last.wrap()).forEach(function (kv) {
                var s = el('span', 'gpf-coord', this._coords);
                el('i', null, s, kv[0]);
                s.appendChild(document.createTextNode(' ' + kv[1]));
            }, this);
            if (this.options.displayAltitude) {
                this._alt.textContent = t('altitude') + ' : ' + (this._altText || '…');
            }
        },

        _fetchAlt: function (ll) {
            var self = this, my = this._seq = (this._seq || 0) + 1;
            G.services.elevation([ll]).then(function (r) {
                if (my !== self._seq) { return; }
                var z = r[0] && r[0].z;
                self._altText = z === null || z === undefined ? t('unavailable') : z.toFixed(1) + ' m';
                self._alt.textContent = t('altitude') + ' : ' + self._altText;
                self.fire('altitude', { latlng: ll, altitude: z });
            }).catch(function () {
                if (my === self._seq) { self._altText = t('unavailable'); self._alt.textContent = t('altitude') + ' : ' + self._altText; }
            });
        }
    });
    MousePosition.include(L.Evented.prototype);

    /* ------------------------------------------------------------------ */
    /* ElevationPath                                                       */
    /* ------------------------------------------------------------------ */

    var ElevationPath = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            sampling: 50,
            mode: 'simple',          // 'simple' ou 'accurate'
            target: null,            // élément DOM (ou id) où afficher le profil, sinon dans le panneau
            style: { color: '#7c3aed', weight: 4, opacity: 0.9 },
            profileHeight: 150
        },
        _iconName: 'elevation',
        _titleKey: 'elevation',
        _cls: 'gpf-elevation',

        _build: function (body) {
            var self = this;
            this._pts = [];
            this._drawing = false;
            this._hint = el('div', 'gpf-hint', body, t('drawHint'));
            var row = el('div', 'gpf-row', body);
            this._toggle = button('gpf-btn-primary', row, t('draw'));
            this._finishBtn = button('', row, t('finish'));
            this._finishBtn.style.display = 'none';
            this._clearBtn = button('', row, t('clear'));
            L.DomEvent.on(this._toggle, 'click', function () { self._drawing ? self._cancelDraw() : self._startDraw(); });
            L.DomEvent.on(this._finishBtn, 'click', function () { self._finish(); });
            L.DomEvent.on(this._clearBtn, 'click', this.clear, this);
            this._msg = el('div', 'gpf-status', body);
            var tgt = this.options.target;
            this._chartBox = (typeof tgt === 'string' ? document.getElementById(tgt) : tgt) || el('div', null, body);
            L.DomUtil.addClass(this._chartBox, 'gpf-profile');
        },

        _startDraw: function () {
            var map = this._map;
            this.clear();
            this._drawing = true;
            this._toggle.lastChild.textContent = t('deactivate');
            this._finishBtn.style.display = '';
            L.DomUtil.addClass(map.getContainer(), 'gpf-crosshair');
            map.doubleClickZoom.disable();
            map.on('click', this._onClick, this);
            map.on('dblclick', this._onDbl, this);
            map.on('mousemove', this._onMove, this);
        },

        _stopDraw: function () {
            var map = this._map;
            this._drawing = false;
            this._toggle.lastChild.textContent = t('draw');
            this._finishBtn.style.display = 'none';
            L.DomUtil.removeClass(map.getContainer(), 'gpf-crosshair');
            map.off('click', this._onClick, this);
            map.off('dblclick', this._onDbl, this);
            map.off('mousemove', this._onMove, this);
            setTimeout(function () { map.doubleClickZoom.enable(); }, 300);
        },

        _cancelDraw: function () { this._stopDraw(); this.clear(); },

        _onClick: function (e) {
            this._pts.push(e.latlng);
            this._redrawLine();
        },

        _onMove: function (e) {
            if (!this._pts.length) { return; }
            if (!this._rubber) { this._rubber = L.polyline([], { color: '#7c3aed', weight: 2, dashArray: '4 6' }).addTo(this._map); }
            this._rubber.setLatLngs([this._pts[this._pts.length - 1], e.latlng]);
        },

        _onDbl: function () {
            // le double-clic déclenche aussi deux clics : on retire le doublon
            if (this._pts.length > 1) { this._pts.pop(); }
            this._finish();
        },

        _redrawLine: function () {
            if (!this._line) { this._line = L.polyline([], this.options.style).addTo(this._map); }
            this._line.setLatLngs(this._pts);
        },

        _finish: function () {
            var self = this;
            this._stopDraw();
            if (this._rubber) { this._rubber.remove(); this._rubber = null; }
            if (this._pts.length < 2) { this._status(this._msg, t('needTwoPoints'), true); return; }
            this._status(this._msg, t('loading'));
            G.services.elevationLine(this._pts, { sampling: this.options.sampling, mode: this.options.mode })
                .then(function (profile) {
                    self._status(self._msg, '');
                    self._profile = profile;
                    self._drawProfile(profile);
                    self.fire('profile', { profile: profile });
                }).catch(function (err) { self._fail(self._msg, err); });
        },

        /** Calcule un profil pour une liste de points existante. */
        setPath: function (latlngs) {
            this.clear();
            this._pts = latlngs.map(L.latLng);
            this._redrawLine();
            this._finish();
            return this;
        },

        _stats: function (profile) {
            var min = Infinity, max = -Infinity, up = 0, down = 0, prev = null;
            profile.forEach(function (p) {
                if (p.z === null) { return; }
                min = Math.min(min, p.z); max = Math.max(max, p.z);
                if (prev !== null) {
                    var d = p.z - prev;
                    if (d > 0) { up += d; } else { down -= d; }
                }
                prev = p.z;
            });
            return {
                min: min, max: max, up: up, down: down,
                length: profile.length ? profile[profile.length - 1].dist : 0
            };
        },

        _drawProfile: function (profile) {
            var self = this, box = this._chartBox;
            box.innerHTML = '';
            var st = this._stats(profile);
            var stats = el('div', 'gpf-stats', box);
            [[t('length'), formatDistance(st.length)], [t('minAlt'), isFinite(st.min) ? Math.round(st.min) + ' m' : '—'],
                [t('maxAlt'), isFinite(st.max) ? Math.round(st.max) + ' m' : '—'],
                [t('ascent'), Math.round(st.up) + ' m'], [t('descent'), Math.round(st.down) + ' m']].forEach(function (kv) {
                var s = el('span', null, stats);
                el('i', null, s, kv[0]);
                s.appendChild(document.createTextNode(' ' + kv[1]));
            });
            if (!isFinite(st.min)) { return; }

            var W = Math.max(box.clientWidth, 260), H = this.options.profileHeight;
            var m = { l: 40, r: 8, t: 8, b: 20 };
            var pw = W - m.l - m.r, ph = H - m.t - m.b;
            var span = Math.max(st.max - st.min, 10);
            var zMin = st.min - span * 0.05, zMax = st.max + span * 0.05;
            var X = function (d) { return m.l + (st.length ? d / st.length : 0) * pw; };
            var Y = function (z) { return m.t + (1 - (z - zMin) / (zMax - zMin)) * ph; };

            var NS = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(NS, 'svg');
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            svg.setAttribute('class', 'gpf-chart');
            var mk = function (tag, attrs, parent, text) {
                var n = document.createElementNS(NS, tag);
                Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
                if (text !== undefined) { n.textContent = text; }
                (parent || svg).appendChild(n);
                return n;
            };
            for (var i = 0; i <= 4; i++) {
                var z = zMin + (zMax - zMin) * i / 4, y = Y(z);
                mk('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, class: 'gpf-grid' });
                mk('text', { x: m.l - 4, y: y + 3, 'text-anchor': 'end', class: 'gpf-axis' }, null, Math.round(z));
            }
            for (var j = 0; j <= 4; j++) {
                var dd = st.length * j / 4;
                mk('text', { x: X(dd), y: H - 5, 'text-anchor': j === 0 ? 'start' : j === 4 ? 'end' : 'middle', class: 'gpf-axis' }, null,
                    st.length >= 1000 ? (dd / 1000).toFixed(1) + ' km' : Math.round(dd) + ' m');
            }
            var pts = profile.filter(function (p) { return p.z !== null; });
            var d = pts.map(function (p, k) { return (k ? 'L' : 'M') + X(p.dist).toFixed(1) + ' ' + Y(p.z).toFixed(1); }).join('');
            mk('path', { d: d + 'L' + X(pts[pts.length - 1].dist).toFixed(1) + ' ' + (m.t + ph) + 'L' + X(pts[0].dist).toFixed(1) + ' ' + (m.t + ph) + 'Z', class: 'gpf-area' });
            mk('path', { d: d, class: 'gpf-curve' });
            var cursor = mk('line', { x1: 0, x2: 0, y1: m.t, y2: m.t + ph, class: 'gpf-cursor', visibility: 'hidden' });
            var dot = mk('circle', { r: 4, class: 'gpf-dot', visibility: 'hidden' });
            var over = mk('rect', { x: m.l, y: m.t, width: pw, height: ph, fill: 'transparent' });
            box.appendChild(svg);
            var tip = el('div', 'gpf-tip', box);
            tip.style.display = 'none';

            L.DomEvent.on(over, 'mousemove', function (ev) {
                var r = svg.getBoundingClientRect();
                var px = (ev.clientX - r.left) * (W / r.width);
                var dist = Math.min(Math.max((px - m.l) / pw, 0), 1) * st.length;
                var best = pts[0];
                pts.forEach(function (p) { if (Math.abs(p.dist - dist) < Math.abs(best.dist - dist)) { best = p; } });
                cursor.setAttribute('x1', X(best.dist)); cursor.setAttribute('x2', X(best.dist));
                cursor.setAttribute('visibility', 'visible');
                dot.setAttribute('cx', X(best.dist)); dot.setAttribute('cy', Y(best.z));
                dot.setAttribute('visibility', 'visible');
                tip.style.display = 'block';
                tip.textContent = Math.round(best.z) + ' m · ' + formatDistance(best.dist);
                if (!self._pos) {
                    self._pos = L.circleMarker(best.latlng, { radius: 6, color: '#fff', weight: 2, fillColor: '#7c3aed', fillOpacity: 1 }).addTo(self._map);
                }
                self._pos.setLatLng(best.latlng);
            });
            L.DomEvent.on(over, 'mouseout', function () {
                cursor.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden');
                tip.style.display = 'none';
                if (self._pos) { self._pos.remove(); self._pos = null; }
            });

            var exp = button('gpf-link', box, t('export'));
            L.DomEvent.on(exp, 'click', function () { self._exportCsv(profile); });
        },

        _exportCsv: function (profile) {
            var csv = 'distance_m;lon;lat;z_m\n' + profile.map(function (p) {
                return [p.dist.toFixed(1), p.latlng.lng.toFixed(6), p.latlng.lat.toFixed(6), p.z === null ? '' : p.z].join(';');
            }).join('\n');
            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
            a.download = 'profil-altimetrique.csv';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
        },

        _removed: function () { if (this._drawing) { this._stopDraw(); } this.clear(); },

        clear: function () {
            if (this._drawing) { this._stopDraw(); }
            [this._line, this._rubber, this._pos].forEach(function (l) { if (l) { l.remove(); } });
            this._line = this._rubber = this._pos = null;
            this._pts = [];
            this._profile = null;
            if (this._chartBox) { this._chartBox.innerHTML = ''; }
            if (this._msg) { this._status(this._msg, ''); }
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* Couche WFS                                                          */
    /* ------------------------------------------------------------------ */

    function propertiesTable(props) {
        var table = el('table', 'gpf-props');
        Object.keys(props || {}).forEach(function (k) {
            var v = props[k];
            if (v === null || v === undefined || typeof v === 'object') { return; }
            var tr = el('tr', null, table);
            el('th', null, tr, k);
            el('td', null, tr, String(v));
        });
        return table;
    }

    /** Couche vectorielle WFS chargée à la volée sur l'emprise visible (GeoJSON). */
    var WFS = L.GeoJSON.extend({
        options: {
            typeName: null,
            count: 1000,          // nombre maximal d'objets par chargement
            minZoom: 10,          // en dessous, rien n'est chargé
            popup: true,          // clic sur un objet : tableau d'attributs
            style: { color: '#0b6fa4', weight: 2, fillOpacity: 0.15 },
            attribution: null,
            title: null
        },

        initialize: function (opts) {
            opts = L.extend({}, opts);
            if (!opts.typeName && opts.layer) { opts.typeName = opts.layer; }
            var self = this;
            var user = opts.onEachFeature;
            opts.attribution = opts.attribution || G.config.attribution;
            opts.title = opts.title || opts.typeName;
            opts.pointToLayer = opts.pointToLayer || function (f, ll) {
                return L.circleMarker(ll, { radius: 5, color: '#0b6fa4', weight: 2, fillOpacity: 0.5 });
            };
            opts.onEachFeature = function (f, layer) {
                if (self.options.popup) { layer.bindPopup(function () { return propertiesTable(f.properties); }, { maxWidth: 320 }); }
                if (user) { user(f, layer); }
            };
            L.GeoJSON.prototype.initialize.call(this, null, opts);
        },

        onAdd: function (map) {
            L.GeoJSON.prototype.onAdd.call(this, map);
            map.on('moveend', this._load, this);
            this._load();
        },

        onRemove: function (map) {
            map.off('moveend', this._load, this);
            this._seq = (this._seq || 0) + 1;
            L.GeoJSON.prototype.onRemove.call(this, map);
            this.clearLayers();
        },

        _load: function () {
            var map = this._map, o = this.options, self = this;
            if (!map) { return; }
            if (map.getZoom() < o.minZoom) {
                this.clearLayers();
                this.fire('toozoom');
                return;
            }
            var b = map.getBounds(), my = this._seq = (this._seq || 0) + 1;
            request(G.config.wfs, {
                SERVICE: 'WFS', VERSION: '2.0.0', REQUEST: 'GetFeature',
                TYPENAMES: o.typeName, OUTPUTFORMAT: 'application/json', SRSNAME: 'EPSG:4326',
                COUNT: o.count,
                BBOX: [b.getSouth(), b.getWest(), b.getNorth(), b.getEast(), 'urn:ogc:def:crs:EPSG::4326'].join(',')
            }).then(function (fc) {
                if (my !== self._seq || !self._map) { return; }
                self.clearLayers();
                self.addData(fc);
                var n = (fc.features || []).length;
                self.fire('load', { count: n });
                if (n >= o.count) { self.fire('truncated', { count: n }); }
            }).catch(function (err) { self.fire('error', { error: err }); });
        }
    });

    G.WFS = WFS;
    G.wfs = function (opts) { return new WFS(opts); };

    /* ------------------------------------------------------------------ */
    /* Recherche de couches (API Recherche, index « geoplateforme »)        */
    /* ------------------------------------------------------------------ */

    function normalizeLayerDoc(d) {
        var bounds = null;
        try {
            if (d.extent && d.extent.coordinates) { bounds = L.geoJSON(d.extent).getBounds(); }
        } catch (e) { /* emprise absente ou invalide */ }
        return {
            id: d.id,
            name: d.layer_name,
            title: d.title || d.layer_name,
            description: d.description || '',
            type: d.type,
            theme: d.theme || '',
            keywords: d.keywords || [],
            bounds: bounds && bounds.isValid() ? bounds : null,
            attribution: d.attribution || null,
            metadata: d.metadata_urls || [],
            srs: d.srs || [],
            url: d.url,
            raw: d
        };
    }

    function searchLayerIndex(criteria, page, size) {
        return request(G.config.search + '?page=' + (page || 1) + '&size=' + (size || 20), null, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(criteria)
        });
    }

    /**
     * Recherche de couches dans l'index de la Géoplateforme.
     * opts : { text, type ('WMTS' | 'WMS' | 'WFS' | 'TMS'…), theme, page, size, open }
     * Le texte est cherché dans le titre, la description et, s'il ressemble à un nom
     * technique, dans le nom de couche. Retourne une Promise de { layers: [...], count }.
     */
    G.services.searchLayers = function (opts) {
        opts = opts || {};
        var base = { open: opts.open !== false };
        if (opts.type) { base.type = opts.type; }
        if (opts.theme) { base.theme = opts.theme; }
        var text = (opts.text || '').trim();
        var queries = [];
        if (!text) {
            queries.push(base);
        } else {
            queries.push(L.extend({ title: text }, base));
            queries.push(L.extend({ description: text }, base));
            if (/^[\w.\-:]+$/.test(text) && /[._:]/.test(text)) { queries.push(L.extend({ layer_name: text }, base)); }
        }
        return Promise.all(queries.map(function (q) {
            return searchLayerIndex(q, opts.page, opts.size).catch(function () { return { documents: [] }; });
        })).then(function (all) {
            var seen = {}, layers = [];
            // le nom technique exact d'abord, puis le titre, puis la description
            all.slice().reverse().forEach(function (r) {
                (r.documents || []).forEach(function (d) {
                    var key = d.type + '|' + d.layer_name;
                    if (seen[key]) { return; }
                    seen[key] = true;
                    layers.push(normalizeLayerDoc(d));
                });
            });
            return { layers: layers, count: layers.length };
        });
    };

    /** Thèmes (INSPIRE) proposés dans le catalogue. */
    var THEMES = [
        'imageryBaseMapsEarthCover', 'elevation', 'boundaries', 'planningCadastre', 'transportation',
        'inlandWaters', 'environment', 'farming', 'biota', 'society', 'structure', 'geoscientificInformation',
        'utilitiesCommunication', 'oceans', 'health', 'economy'
    ];
    var THEME_FR = {
        imageryBaseMapsEarthCover: 'Imagerie et fonds de carte', elevation: 'Altitude', boundaries: 'Limites',
        planningCadastre: 'Urbanisme et cadastre', transportation: 'Transports', inlandWaters: 'Eaux intérieures',
        environment: 'Environnement', farming: 'Agriculture', biota: 'Biodiversité', society: 'Société',
        structure: 'Bâtiments', geoscientificInformation: 'Géosciences', utilitiesCommunication: 'Réseaux et services',
        oceans: 'Océans', health: 'Santé', economy: 'Économie'
    };
    function themeLabel(k) { return G.lang === 'fr' && THEME_FR[k] ? THEME_FR[k] : k; }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /** Crée la couche Leaflet correspondant à un résultat du catalogue (WMTS, WMS ou WFS). */
    G.layerFromCatalog = function (item, opts) {
        var common = {
            title: item.title,
            description: item.description,
            metadata: item.metadata.slice(0, 1).map(function (u) { return { url: u, title: t('metadata') }; })
        };
        if (item.attribution && item.attribution.title) {
            common.attribution = item.attribution.url
                ? '<a href="' + encodeURI(item.attribution.url) + '" target="_blank" rel="noopener">' + escapeHtml(item.attribution.title) + '</a>'
                : escapeHtml(item.attribution.title);
        }
        if (item.type === 'WMTS') { return G.wmts(L.extend({ layer: item.name, resolve: true }, common, opts)); }
        if (item.type === 'WMS') { return G.wms(L.extend({ layers: item.name }, common, opts)); }
        if (item.type === 'WFS') { return G.wfs(L.extend({ typeName: item.name }, common, opts)); }
        return null;
    };

    var LayerCatalog = PanelControl.extend({
        options: {
            position: 'topright',
            collapsed: true,
            types: ['WMTS', 'WMS', 'WFS'],  // types de services proposés
            pageSize: 20,
            minChars: 2,
            layerSwitcher: null,            // LayerSwitcher dans lequel ajouter les couches (sinon directement sur la carte)
            zoomOnAdd: false                // zoomer sur l'emprise de la couche à l'ajout
        },
        _iconName: 'catalog',
        _titleKey: 'catalog',
        _cls: 'gpf-catalog',

        _build: function (body) {
            var self = this;
            this._layers = {};
            this._type = this.options.types[0];
            this._page = 1;

            var wrap = el('div', 'gpf-input-wrap', el('div', 'gpf-row', body));
            this._input = el('input', 'gpf-input', wrap);
            this._input.type = 'search';
            this._input.placeholder = t('catalogPlaceholder');
            this._input.autocomplete = 'off';

            var seg = el('div', 'gpf-segment', body);
            this._typeBtns = {};
            this.options.types.forEach(function (ty) {
                var b = button('', seg, ty);
                self._typeBtns[ty] = b;
                L.DomEvent.on(b, 'click', function () { self._type = ty; self._run(); });
            });

            this._theme = el('select', 'gpf-select', el('div', 'gpf-field', body));
            el('option', null, this._theme, t('allThemes')).value = '';
            THEMES.forEach(function (k) { el('option', null, self._theme, themeLabel(k)).value = k; });

            this._msg = el('div', 'gpf-status', body);
            this._list = el('ul', 'gpf-results gpf-catalog-list', body);
            this._more = button('gpf-link', body, t('more'));
            this._more.style.display = 'none';

            var run = debounce(function () { self._run(); }, 300);
            L.DomEvent.on(this._input, 'input', run);
            L.DomEvent.on(this._theme, 'change', function () { self._run(); });
            L.DomEvent.on(this._more, 'click', function () { self._page++; self._fetch(true); });
            this._syncType();
        },

        _syncType: function () {
            var self = this;
            Object.keys(this._typeBtns).forEach(function (k) {
                L.DomUtil[k === self._type ? 'addClass' : 'removeClass'](self._typeBtns[k], 'gpf-on');
            });
        },

        expand: function () {
            PanelControl.prototype.expand.call(this);
            if (!this._started) { this._started = true; this._run(); }
            return this;
        },

        _run: function () {
            this._page = 1;
            this._syncType();
            this._fetch(false);
        },

        _fetch: function (append) {
            var self = this, my = this._seq = (this._seq || 0) + 1;
            var text = this._input.value.trim();
            if (text && text.length < this.options.minChars) { return; }
            if (!append) { this._list.innerHTML = ''; }
            this._more.style.display = 'none';
            this._status(this._msg, t('loading'));
            G.services.searchLayers({
                text: text, type: this._type, theme: this._theme.value,
                page: this._page, size: this.options.pageSize
            }).then(function (res) {
                if (my !== self._seq) { return; }
                self._status(self._msg, res.count || append ? '' : t('noResult'));
                res.layers.forEach(function (it) { self._renderItem(it); });
                // une page pleine laisse supposer qu'il y a une suite
                self._more.style.display = res.count >= self.options.pageSize ? '' : 'none';
                self.fire('results', { results: res.layers });
            }).catch(function (err) { if (my === self._seq) { self._fail(self._msg, err); } });
        },

        _key: function (it) { return it.type + '|' + it.name; },

        _renderItem: function (it) {
            var self = this;
            var li = el('li', 'gpf-cat-item', this._list);
            var head = el('div', 'gpf-ls-head', li);
            var txt = el('div', 'gpf-cat-text', head);
            el('span', 'gpf-ac-label', txt, it.title);
            el('span', 'gpf-ac-sub', txt, it.name + (it.theme ? ' · ' + themeLabel(it.theme) : ''));
            var key = this._key(it);
            var add = button('gpf-btn-icon', head, null, 'plus', t('addLayer'));
            if (it.bounds) {
                var zoom = button('gpf-btn-icon', head, null, 'extent', t('zoomExtent'));
                L.DomEvent.on(zoom, 'click', function () { self._map.fitBounds(it.bounds, { maxZoom: 14 }); });
            }
            var infoBtn = button('gpf-btn-icon', head, null, 'info', t('info'));
            var info = el('div', 'gpf-ls-info', li);
            info.style.display = 'none';
            if (it.description) { el('p', null, info, it.description); }
            if (it.keywords.length) { el('p', 'gpf-ac-sub', info, it.keywords.join(', ')); }
            it.metadata.slice(0, 1).forEach(function (u) {
                var a = el('a', 'gpf-ls-meta', info, t('metadata'));
                a.href = u; a.target = '_blank'; a.rel = 'noopener';
            });
            L.DomEvent.on(infoBtn, 'click', function () { info.style.display = info.style.display === 'none' ? 'block' : 'none'; });

            var refresh = function () {
                var on = !!self._layers[key];
                add.title = t(on ? 'removeLayer' : 'addLayer');
                L.DomUtil[on ? 'addClass' : 'removeClass'](li, 'gpf-added');
                add.firstChild.innerHTML = ICONS[on ? 'minus' : 'plus'];
            };
            L.DomEvent.on(add, 'click', function () {
                if (self._layers[key]) { self.removeLayer(it); } else { self.addLayer(it); }
                refresh();
            });
            refresh();
            if (it.type === 'TMS') { add.disabled = true; }
        },

        /** Ajoute la couche d'un résultat du catalogue (retourne la couche Leaflet). */
        addLayer: function (item) {
            var key = this._key(item);
            if (this._layers[key]) { return this._layers[key]; }
            var layer = G.layerFromCatalog(item);
            if (!layer) { return null; }
            this._layers[key] = layer;
            var ls = this.options.layerSwitcher;
            if (ls && !this._listening) {
                this._listening = true;
                ls.on('layerremove', function (e) {
                    Object.keys(this._layers).forEach(function (k) { if (this._layers[k] === e.layer) { delete this._layers[k]; } }, this);
                }, this);
            }
            if (ls && ls._map) {
                ls.addLayer(layer, {
                    title: item.title, description: item.description, removable: true,
                    metadata: item.metadata.slice(0, 1).map(function (u) { return { url: u, title: t('metadata') }; })
                });
            } else {
                layer.addTo(this._map);
            }
            if (this.options.zoomOnAdd && item.bounds) { this._map.fitBounds(item.bounds, { maxZoom: 14 }); }
            this.fire('add', { item: item, layer: layer });
            return layer;
        },

        removeLayer: function (item) {
            var key = this._key(item), layer = this._layers[key];
            if (!layer) { return this; }
            delete this._layers[key];
            var ls = this.options.layerSwitcher;
            if (ls && ls._entries.some(function (e) { return e.layer === layer; })) { ls.removeLayer(layer); }
            else if (this._map) { this._map.removeLayer(layer); }
            this.fire('remove', { item: item, layer: layer });
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* FeatureInfo : interrogation d'objets (GetFeatureInfo WMTS / WMS)     */
    /* ------------------------------------------------------------------ */

    function featuresFromInfo(data) {
        if (data && data.features) {
            return data.features.map(function (f) { return f.properties || {}; });
        }
        return [];
    }

    /** Interroge une couche WMTS au point donné. Retourne une Promise de [propriétés]. */
    function wmtsInfo(layer, map, latlng, infoFormat) {
        var o = layer.options;
        var z = Math.round(map.getZoom());
        if (o.maxNativeZoom !== undefined) { z = Math.min(z, o.maxNativeZoom); }
        if (o.minZoom !== undefined && z < o.minZoom) { return Promise.resolve([]); }
        var pt = map.project(latlng.wrap(), z);
        var tile = pt.divideBy(256).floor();
        var params = {
            SERVICE: 'WMTS', REQUEST: 'GetFeatureInfo', VERSION: '1.0.0',
            LAYER: o.layer, STYLE: o.style, FORMAT: o.format,
            TILEMATRIXSET: layer._matrixSet(), TILEMATRIX: z, TILEROW: tile.y, TILECOL: tile.x,
            I: Math.floor(pt.x - tile.x * 256), J: Math.floor(pt.y - tile.y * 256),
            INFOFORMAT: infoFormat
        };
        var url = o.apiKey ? G.config.wmtsPrivate + '?apikey=' + encodeURIComponent(o.apiKey) : G.config.wmts;
        return request(url, params).then(featuresFromInfo);
    }

    /** Interroge une couche WMS au point donné. */
    function wmsInfo(layer, map, latlng, infoFormat) {
        var crs = map.options.crs, size = map.getSize(), b = map.getBounds();
        var nw = crs.project(b.getNorthWest()), se = crs.project(b.getSouthEast());
        var pt = map.latLngToContainerPoint(latlng);
        var wp = layer.wmsParams;
        var v13 = parseFloat(wp.version) >= 1.3;
        var layers = wp.layers;
        // STYLES est obligatoire en WMS 1.3.0, même vide : on le force dans l'URL (qs() ignore les valeurs vides)
        return request(layer._url + (layer._url.indexOf('?') < 0 ? '?' : '&') + 'STYLES=' + encodeURIComponent(wp.styles || ''), {
            SERVICE: 'WMS', VERSION: wp.version, REQUEST: 'GetFeatureInfo',
            LAYERS: layers, QUERY_LAYERS: layers,
            FORMAT: wp.format, INFO_FORMAT: infoFormat,
            CRS: v13 ? crs.code : undefined, SRS: v13 ? undefined : crs.code,
            BBOX: [nw.x, se.y, se.x, nw.y].join(','),
            WIDTH: size.x, HEIGHT: size.y,
            I: v13 ? Math.round(pt.x) : undefined, J: v13 ? Math.round(pt.y) : undefined,
            X: v13 ? undefined : Math.round(pt.x), Y: v13 ? undefined : Math.round(pt.y)
        }).then(featuresFromInfo);
    }

    var FeatureInfo = L.Control.extend({
        options: {
            position: 'topleft',
            infoFormat: 'application/json',
            maxFeatures: 5,       // objets affichés par couche
            filter: null          // function (layer) → boolean : limite les couches interrogées
        },

        onAdd: function (map) {
            this._map = map;
            var c = this._container = el('div', 'gpf-control gpf-featureinfo');
            stopEvents(c);
            var b = this._btn = el('a', 'gpf-toggle', c);
            b.href = '#'; b.title = t('featureInfo');
            b.setAttribute('role', 'button');
            b.appendChild(icon('pointer'));
            L.DomEvent.on(b, 'click', function (e) { L.DomEvent.stop(e); this.toggle(); }, this);
            return c;
        },

        onRemove: function () { this.deactivate(); },

        activate: function () {
            if (this._active) { return this; }
            this._active = true;
            L.DomUtil.addClass(this._container, 'gpf-active');
            L.DomUtil.addClass(this._map.getContainer(), 'gpf-crosshair');
            this._map.on('click', this._onClick, this);
            return this;
        },

        deactivate: function () {
            if (!this._active) { return this; }
            this._active = false;
            L.DomUtil.removeClass(this._container, 'gpf-active');
            L.DomUtil.removeClass(this._map.getContainer(), 'gpf-crosshair');
            this._map.off('click', this._onClick, this);
            this._map.closePopup(this._popup);
            return this;
        },

        toggle: function () { return this._active ? this.deactivate() : this.activate(); },

        _queryable: function () {
            var self = this, out = [];
            this._map.eachLayer(function (l) {
                if (!(l instanceof WMTS || l instanceof WMS)) { return; }
                if (l.options.queryable === false || l.options.opacity === 0) { return; }
                if (self.options.filter && !self.options.filter(l)) { return; }
                out.push(l);
            });
            // couches du dessus en premier
            out.sort(function (a, b) { return (b.options.zIndex || 0) - (a.options.zIndex || 0); });
            return out;
        },

        _onClick: function (e) {
            var self = this, map = this._map, fmt = this.options.infoFormat;
            var layers = this._queryable();
            var popup = this._popup = L.popup({ maxWidth: 340, maxHeight: 320 }).setLatLng(e.latlng)
                .setContent(el('div', 'gpf-status', null, t('loading'))).openOn(map);
            Promise.all(layers.map(function (l) {
                var p = l instanceof WMTS ? wmtsInfo(l, map, e.latlng, fmt) : wmsInfo(l, map, e.latlng, fmt);
                return p.then(function (rows) { return { layer: l, rows: rows }; }, function () { return { layer: l, rows: [] }; });
            })).then(function (res) {
                if (self._popup !== popup) { return; }
                var box = el('div', 'gpf-info');
                var found = res.filter(function (r) { return r.rows.length; });
                found.forEach(function (r) {
                    el('div', 'gpf-info-title', box, r.layer.options.title || r.layer.options.layer || r.layer.options.layers);
                    r.rows.slice(0, self.options.maxFeatures).forEach(function (props) {
                        box.appendChild(propertiesTable(props));
                    });
                });
                if (!found.length) { el('div', 'gpf-status', box, t('noInfo')); }
                popup.setContent(box);
                self.fire('info', { latlng: e.latlng, results: found });
            });
        }
    });
    FeatureInfo.include(L.Evented.prototype);

    /* ------------------------------------------------------------------ */
    /* Measure : distance, surface, azimut                                 */
    /* ------------------------------------------------------------------ */

    function bearing(a, b) {
        var r = Math.PI / 180, dl = (b.lng - a.lng) * r;
        var y = Math.sin(dl) * Math.cos(b.lat * r);
        var x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos(dl);
        return (Math.atan2(y, x) / r + 360) % 360;
    }

    /** Surface (m²) d'un polygone sur la sphère. */
    function sphericalArea(ll) {
        var n = ll.length, r = Math.PI / 180, R = 6371008.8, sum = 0;
        if (n < 3) { return 0; }
        for (var i = 0; i < n; i++) {
            var p1 = ll[i], p2 = ll[(i + 1) % n];
            sum += (p2.lng - p1.lng) * r * (2 + Math.sin(p1.lat * r) + Math.sin(p2.lat * r));
        }
        return Math.abs(sum * R * R / 2);
    }

    function formatArea(m2) {
        if (m2 < 10000) { return m2.toFixed(m2 < 100 ? 1 : 0) + ' m²'; }
        if (m2 < 1e6) { return (m2 / 10000).toFixed(2) + ' ha'; }
        return (m2 / 1e6).toFixed(m2 < 1e8 ? 3 : 1) + ' km²';
    }

    function pathLength(pts) {
        var d = 0;
        for (var i = 1; i < pts.length; i++) { d += pts[i - 1].distanceTo(pts[i]); }
        return d;
    }

    var Measure = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            modes: ['distance', 'area', 'azimuth'],
            style: { color: '#c2410c', weight: 3, opacity: 0.9 }
        },
        _iconName: 'ruler',
        _titleKey: 'measure',
        _cls: 'gpf-measure',

        _build: function (body) {
            var self = this;
            this._pts = [];
            this._mode = this.options.modes[0];
            var seg = el('div', 'gpf-segment', body);
            this._modeBtns = {};
            var labels = { distance: 'mDistance', area: 'mArea', azimuth: 'mAzimuth' };
            this.options.modes.forEach(function (m) {
                var b = button('', seg, t(labels[m]));
                self._modeBtns[m] = b;
                L.DomEvent.on(b, 'click', function () { self._setMode(m); });
            });
            this._hint = el('div', 'gpf-hint', body);
            var row = el('div', 'gpf-row', body);
            this._toggle = button('gpf-btn-primary', row, t('measureStart'));
            this._finishBtn = button('', row, t('finish'));
            this._finishBtn.style.display = 'none';
            this._clearBtn = button('', row, t('clear'));
            L.DomEvent.on(this._toggle, 'click', function () { self._drawing ? self._stopDraw() : self._startDraw(); });
            L.DomEvent.on(this._finishBtn, 'click', function () { self._finish(); });
            L.DomEvent.on(this._clearBtn, 'click', this.clear, this);
            this._result = el('div', 'gpf-measure-result', body);
            this._setMode(this._mode);
        },

        _setMode: function (m) {
            var self = this;
            this._mode = m;
            Object.keys(this._modeBtns).forEach(function (k) {
                L.DomUtil[k === m ? 'addClass' : 'removeClass'](self._modeBtns[k], 'gpf-on');
            });
            this._hint.textContent = m === 'azimuth' ? t('measureHintAz') : t('drawHint');
            if (this._drawing) { this._stopDraw(); this._startDraw(); }
            else { this.clear(); }
        },

        _startDraw: function () {
            var map = this._map;
            this.clear();
            this._drawing = true;
            this._toggle.lastChild.textContent = t('deactivate');
            if (this._mode !== 'azimuth') { this._finishBtn.style.display = ''; }
            L.DomUtil.addClass(map.getContainer(), 'gpf-crosshair');
            map.doubleClickZoom.disable();
            map.on('click', this._onClick, this);
            map.on('dblclick', this._onDbl, this);
            map.on('mousemove', this._onMove, this);
        },

        _stopDraw: function () {
            var map = this._map;
            this._drawing = false;
            this._toggle.lastChild.textContent = t('measureStart');
            this._finishBtn.style.display = 'none';
            L.DomUtil.removeClass(map.getContainer(), 'gpf-crosshair');
            map.off('click', this._onClick, this);
            map.off('dblclick', this._onDbl, this);
            map.off('mousemove', this._onMove, this);
            if (this._rubber) { this._rubber.remove(); this._rubber = null; }
            setTimeout(function () { map.doubleClickZoom.enable(); }, 300);
        },

        _layer: function () {
            if (!this._group) { this._group = L.layerGroup().addTo(this._map); }
            return this._group;
        },

        _onClick: function (e) {
            this._pts.push(e.latlng);
            this._redraw();
            if (this._mode === 'azimuth' && this._pts.length === 2) { this._finish(); }
        },

        _onMove: function (e) {
            if (!this._pts.length) { return; }
            if (!this._rubber) { this._rubber = L.polyline([], { color: '#c2410c', weight: 2, dashArray: '4 6' }).addTo(this._map); }
            var last = this._pts[this._pts.length - 1];
            this._rubber.setLatLngs(this._mode === 'area' && this._pts.length > 1
                ? [last, e.latlng, this._pts[0]] : [last, e.latlng]);
        },

        _onDbl: function () {
            if (this._pts.length > 1) { this._pts.pop(); }
            this._finish();
        },

        _redraw: function () {
            var g = this._layer(), pts = this._pts, self = this;
            g.clearLayers();
            if (this._mode === 'area' && pts.length >= 3) { L.polygon(pts, L.extend({ fillOpacity: 0.15 }, this.options.style)).addTo(g); }
            else if (pts.length >= 2) { L.polyline(pts, this.options.style).addTo(g); }
            var cum = 0;
            pts.forEach(function (p, i) {
                if (i) { cum += pts[i - 1].distanceTo(p); }
                var m = L.circleMarker(p, { radius: 4, color: '#c2410c', weight: 2, fillColor: '#fff', fillOpacity: 1 }).addTo(g);
                if (i && self._mode !== 'azimuth') { m.bindTooltip(formatDistance(cum), { permanent: true, direction: 'right', className: 'gpf-tooltip' }); }
            });
            this._show();
        },

        _show: function () {
            var pts = this._pts, r = this._result;
            r.innerHTML = '';
            var add = function (label, value) {
                var row = el('div', null, r);
                el('span', 'gpf-ac-sub', row, label + ' ');
                el('b', null, row, value);
            };
            if (this._mode === 'distance' && pts.length > 1) {
                add(t('length'), formatDistance(pathLength(pts)));
            } else if (this._mode === 'area' && pts.length > 2) {
                add(t('mArea'), formatArea(sphericalArea(pts)));
                add(t('perimeter'), formatDistance(pathLength(pts.concat([pts[0]]))));
            } else if (this._mode === 'azimuth' && pts.length > 1) {
                var az = bearing(pts[0], pts[1]);
                add(t('mAzimuth'), az.toFixed(2) + '° (' + (az * 400 / 360).toFixed(2) + ' gon)');
                add(t('backAzimuth'), ((az + 180) % 360).toFixed(2) + '°');
                add(t('distance'), formatDistance(pts[0].distanceTo(pts[1])));
            }
        },

        _finish: function () {
            this._stopDraw();
            this._redraw();
            var min = this._mode === 'area' ? 3 : 2;
            if (this._pts.length >= min) {
                this.fire('measure', { mode: this._mode, points: this._pts.slice() });
            }
        },

        _removed: function () { this.clear(); if (this._drawing) { this._stopDraw(); } },

        clear: function () {
            if (this._drawing) { this._stopDraw(); }
            if (this._group) { this._group.clearLayers(); }
            if (this._rubber) { this._rubber.remove(); this._rubber = null; }
            this._pts = [];
            if (this._result) { this._result.innerHTML = ''; }
            return this;
        }
    });

    /* ------------------------------------------------------------------ */
    /* Compare : comparateur à curseur (deux couches côte à côte)           */
    /* ------------------------------------------------------------------ */

    var Compare = PanelControl.extend({
        options: {
            position: 'topright',
            collapsed: true,
            layers: [],       // [{ layer, title }] couches comparables (au moins deux)
            left: 0,          // indice de la couche de gauche
            right: 1,         // indice de la couche de droite
            ratio: 0.5        // position initiale du curseur (0 à 1)
        },
        _iconName: 'compare',
        _titleKey: 'compare',
        _cls: 'gpf-compare',

        initialize: function (opts) {
            L.setOptions(this, opts);
            this._items = (this.options.layers || []).map(function (e) {
                if (e instanceof L.Layer) { e = { layer: e }; }
                var o = e.layer.options || {};
                return { layer: e.layer, title: e.title || o.title || o.layer || o.layers || 'Layer' };
            });
            this._ratio = this.options.ratio;
            this._sel = { left: this.options.left, right: this.options.right };
        },

        _added: function () {
            if (!this.options.collapsed) { this._start(); }
        },

        _build: function (body) {
            var self = this;
            this._selects = {};
            [['left', 'cmpLeft'], ['right', 'cmpRight']].forEach(function (p) {
                var f = el('div', 'gpf-field', body);
                el('label', 'gpf-label', f, t(p[1]));
                var sel = el('select', 'gpf-select', f);
                self._items.forEach(function (it, i) { el('option', null, sel, it.title).value = String(i); });
                sel.value = String(self._sel[p[0]]);
                L.DomEvent.on(sel, 'change', function () {
                    self._release(p[0]);
                    self._sel[p[0]] = parseInt(sel.value, 10);
                    self._apply();
                });
                self._selects[p[0]] = sel;
            });
        },

        expand: function () {
            PanelControl.prototype.expand.call(this);
            this._start();
            return this;
        },

        collapse: function () {
            PanelControl.prototype.collapse.call(this);
            this._stop();
            return this;
        },

        _start: function () {
            if (this._running || this._items.length < 2) { return; }
            var map = this._map;
            this._running = true;
            var bar = this._bar = el('div', 'gpf-swipe', map.getContainer());
            el('div', 'gpf-swipe-handle', bar);
            L.DomEvent.on(bar, 'mousedown touchstart', this._dragStart, this);
            map.on('move zoom resize', this._clip, this);
            this._apply();
        },

        _stop: function () {
            if (!this._running) { return; }
            var map = this._map;
            this._running = false;
            map.off('move zoom resize', this._clip, this);
            this._release('left');
            this._release('right');
            L.DomEvent.off(this._bar, 'mousedown touchstart', this._dragStart, this);
            this._bar.remove();
            this._bar = null;
        },

        _item: function (side) { return this._items[this._sel[side]]; },

        /** Affiche les deux couches choisies et applique le découpage. */
        _apply: function () {
            var map = this._map, self = this;
            ['left', 'right'].forEach(function (side) {
                var it = self._item(side);
                if (it && !map.hasLayer(it.layer)) { map.addLayer(it.layer); it._ours = true; }
            });
            this._bar.style.left = (this._ratio * 100) + '%';
            this._clip();
        },

        _release: function (side) {
            var it = this._item(side);
            if (!it) { return; }
            var c = it.layer.getContainer && it.layer.getContainer();
            if (c) { c.style.clip = ''; }
            if (it._ours) { this._map.removeLayer(it.layer); it._ours = false; }
        },

        _clip: function () {
            var map = this._map;
            if (!this._running) { return; }
            var size = map.getSize();
            var nw = map.containerPointToLayerPoint([0, 0]), se = map.containerPointToLayerPoint(size);
            var x = nw.x + this._ratio * size.x;
            var l = this._item('left').layer, r = this._item('right').layer;
            var lc = l.getContainer && l.getContainer(), rc = r.getContainer && r.getContainer();
            if (lc) { lc.style.clip = 'rect(' + nw.y + 'px,' + x + 'px,' + se.y + 'px,' + nw.x + 'px)'; }
            if (rc) { rc.style.clip = 'rect(' + nw.y + 'px,' + se.x + 'px,' + se.y + 'px,' + x + 'px)'; }
        },

        _dragStart: function (e) {
            L.DomEvent.stop(e);
            var map = this._map;
            map.dragging.disable();
            var self = this;
            var move = function (ev) {
                var p = ev.touches ? ev.touches[0] : ev;
                var rect = map.getContainer().getBoundingClientRect();
                self._ratio = Math.min(Math.max((p.clientX - rect.left) / rect.width, 0), 1);
                self._bar.style.left = (self._ratio * 100) + '%';
                self._clip();
                self.fire('slide', { ratio: self._ratio });
            };
            var up = function () {
                L.DomEvent.off(document, 'mousemove touchmove', move);
                L.DomEvent.off(document, 'mouseup touchend', up);
                map.dragging.enable();
            };
            L.DomEvent.on(document, 'mousemove touchmove', move);
            L.DomEvent.on(document, 'mouseup touchend', up);
        },

        _removed: function () { this._stop(); }
    });

    /* ------------------------------------------------------------------ */
    /* Export : capture PNG et impression                                  */
    /* ------------------------------------------------------------------ */

    function loadImage(src) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () { resolve(img); };
            img.onerror = reject;
            img.src = src;
        });
    }

    function zIndexOf(node) { return parseInt(node.style.zIndex, 10) || 0; }

    /**
     * Dessine la carte dans un <canvas> : tuiles, vecteurs (SVG ou canvas), marqueurs,
     * titre et attributions. Les tuiles doivent être servies avec CORS (c'est le cas
     * de la Géoplateforme ; les couches WMTS/WMS de cette extension activent crossOrigin).
     * opts : { scale (1 par défaut), title }
     */
    G.captureMap = function (map, opts) {
        opts = opts || {};
        var scale = opts.scale || 1;
        var cont = map.getContainer(), cr = cont.getBoundingClientRect();
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(cr.width * scale);
        canvas.height = Math.round(cr.height * scale);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var X = function (r) { return (r.left - cr.left) * scale; };
        var Y = function (r) { return (r.top - cr.top) * scale; };
        var tasks = [];

        // tuiles : couches puis niveaux de zoom, dans l'ordre d'empilement
        var layers = Array.prototype.slice.call(cont.querySelectorAll('.leaflet-tile-pane > .leaflet-layer'));
        layers.sort(function (a, b) { return zIndexOf(a) - zIndexOf(b); });
        layers.forEach(function (layer) {
            var opacity = parseFloat(layer.style.opacity);
            if (isNaN(opacity)) { opacity = 1; }
            var levels = Array.prototype.slice.call(layer.querySelectorAll('.leaflet-tile-container'));
            levels.sort(function (a, b) { return zIndexOf(a) - zIndexOf(b); });
            levels.forEach(function (lv) {
                Array.prototype.forEach.call(lv.querySelectorAll('img.leaflet-tile'), function (img) {
                    if (!img.complete || !img.naturalWidth) { return; }
                    var r = img.getBoundingClientRect();
                    ctx.globalAlpha = opacity;
                    ctx.drawImage(img, X(r), Y(r), r.width * scale, r.height * scale);
                });
            });
        });
        ctx.globalAlpha = 1;

        // vecteurs
        Array.prototype.forEach.call(cont.querySelectorAll('.leaflet-overlay-pane canvas'), function (cv) {
            var r = cv.getBoundingClientRect();
            ctx.drawImage(cv, X(r), Y(r), r.width * scale, r.height * scale);
        });
        Array.prototype.forEach.call(cont.querySelectorAll('.leaflet-overlay-pane svg'), function (svg) {
            var r = svg.getBoundingClientRect();
            var clone = svg.cloneNode(true);
            clone.removeAttribute('style');
            clone.setAttribute('width', r.width);
            clone.setAttribute('height', r.height);
            var data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
            tasks.push(loadImage(data).then(function (img) {
                ctx.drawImage(img, X(r), Y(r), r.width * scale, r.height * scale);
            }, function () { /* SVG illisible : ignoré */ }));
        });

        return Promise.all(tasks).then(function () {
            // marqueurs : images (rechargées en CORS) et pastilles de l'extension
            var markers = [];
            Array.prototype.forEach.call(cont.querySelectorAll('.leaflet-marker-pane img.leaflet-marker-icon, .leaflet-shadow-pane img'), function (img) {
                var r = img.getBoundingClientRect();
                markers.push(fetch(img.src, { mode: 'cors' }).then(function (res) { return res.blob(); })
                    .then(function (b) { return loadImage(URL.createObjectURL(b)); })
                    .then(function (im) { ctx.drawImage(im, X(r), Y(r), r.width * scale, r.height * scale); })
                    .catch(function () { /* icône sans CORS : ignorée */ }));
            });
            Array.prototype.forEach.call(cont.querySelectorAll('.gpf-marker'), function (m) {
                var r = m.getBoundingClientRect();
                var cs = getComputedStyle(m);
                var cx = X(r) + r.width * scale / 2, cy = Y(r) + r.height * scale / 2;
                ctx.beginPath();
                ctx.arc(cx, cy, r.width * scale / 2, 0, 2 * Math.PI);
                ctx.fillStyle = cs.backgroundColor;
                ctx.fill();
                ctx.lineWidth = 2 * scale;
                ctx.strokeStyle = '#fff';
                ctx.stroke();
                ctx.fillStyle = '#fff';
                ctx.font = '700 ' + 12 * scale + 'px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(m.textContent, cx, cy);
            });
            return Promise.all(markers);
        }).then(function () {
            var f = function (px) { return px * scale + 'px sans-serif'; };
            // attributions
            var attr = cont.querySelector('.leaflet-control-attribution');
            if (attr) {
                var text = attr.textContent.replace(/\s+/g, ' ').trim();
                ctx.font = f(11);
                var w = ctx.measureText(text).width + 10 * scale, h = 16 * scale;
                ctx.fillStyle = 'rgba(255,255,255,.8)';
                ctx.fillRect(canvas.width - w, canvas.height - h, w, h);
                ctx.fillStyle = '#333';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, canvas.width - 5 * scale, canvas.height - h / 2);
            }
            // titre
            if (opts.title) {
                ctx.font = '600 ' + f(18);
                var tw = ctx.measureText(opts.title).width + 24 * scale;
                ctx.fillStyle = 'rgba(255,255,255,.88)';
                ctx.fillRect(0, 0, tw, 36 * scale);
                ctx.fillStyle = '#1f2933';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(opts.title, 12 * scale, 18 * scale);
            }
            return canvas;
        });
    };

    var ExportMap = PanelControl.extend({
        options: {
            position: 'topleft',
            collapsed: true,
            filename: 'carte-geoplateforme.png',
            scales: [1, 2]
        },
        _iconName: 'camera',
        _titleKey: 'exportMap',
        _cls: 'gpf-export',

        _build: function (body) {
            var self = this;
            var f = el('div', 'gpf-field', body);
            el('label', 'gpf-label', f, t('mapTitle'));
            this._title = el('input', 'gpf-input', f);
            this._title.type = 'text';
            var f2 = el('div', 'gpf-field', body);
            el('label', 'gpf-label', f2, t('quality'));
            this._scale = el('select', 'gpf-select', f2);
            this.options.scales.forEach(function (s) { el('option', null, self._scale, '×' + s).value = String(s); });
            var row = el('div', 'gpf-row', body);
            var dl = button('gpf-btn-primary', row, t('downloadPng'));
            var pr = button('', row, t('print'));
            this._msg = el('div', 'gpf-status', body);
            L.DomEvent.on(dl, 'click', function () { self._run(false); });
            L.DomEvent.on(pr, 'click', function () { self._run(true); });
        },

        _run: function (print) {
            var self = this;
            this._status(this._msg, t('capturing'));
            G.captureMap(this._map, { scale: parseFloat(this._scale.value), title: this._title.value.trim() })
                .then(function (canvas) {
                    return new Promise(function (resolve, reject) {
                        try { canvas.toBlob(function (b) { b ? resolve(b) : reject(new Error('empty')); }, 'image/png'); }
                        catch (e) { reject(e); }
                    });
                })
                .then(function (blob) {
                    self._status(self._msg, '');
                    var url = URL.createObjectURL(blob);
                    if (print) { self._print(url); }
                    else {
                        var a = document.createElement('a');
                        a.href = url; a.download = self.options.filename;
                        document.body.appendChild(a); a.click(); a.remove();
                        setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
                    }
                    self.fire('export', { blob: blob, print: print });
                })
                .catch(function (err) { self._fail(self._msg, new Error(t('captureFail', { msg: err.message || err }))); });
        },

        _print: function (url) {
            var frame = document.createElement('iframe');
            frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
            document.body.appendChild(frame);
            var doc = frame.contentWindow.document;
            doc.open();
            doc.write('<!doctype html><title>' + escapeHtml(t('exportMap')) + '</title><style>@page{margin:8mm}body{margin:0}img{width:100%}</style>');
            doc.close();
            var img = doc.createElement('img');
            img.onload = function () {
                frame.contentWindow.focus();
                frame.contentWindow.print();
                setTimeout(function () { frame.remove(); URL.revokeObjectURL(url); }, 2000);
            };
            img.src = url;
            doc.body.appendChild(img);
        }
    });

    /* ------------------------------------------------------------------ */
    /* Panoramax : décodeur de tuiles vectorielles (MVT)                    */
    /* ------------------------------------------------------------------ */

    /** Lecteur protobuf minimal (varints et champs délimités). */
    function PbfReader(buf, start, end) {
        this.buf = buf;
        this.pos = start || 0;
        this.end = end === undefined ? buf.length : end;
    }
    PbfReader.prototype.varint = function () {
        var res = 0, shift = 0, b;
        do {
            b = this.buf[this.pos++];
            res += (b & 0x7f) * Math.pow(2, shift);   // pas d'opérateur binaire : valeurs possiblement > 32 bits
            shift += 7;
        } while (b & 0x80);
        return res;
    };
    PbfReader.prototype.skip = function (wire) {
        if (wire === 0) { this.varint(); }
        else if (wire === 1) { this.pos += 8; }
        else if (wire === 2) { this.pos += this.varint(); }
        else if (wire === 5) { this.pos += 4; }
        else { throw new Error('Protobuf: type de champ inconnu ' + wire); }
    };
    PbfReader.prototype.string = function (len) {
        var s = '', i = this.pos, end = this.pos + len, c;
        while (i < end) {
            c = this.buf[i++];
            if (c < 0x80) { s += String.fromCharCode(c); }
            else if (c < 0xe0) { s += String.fromCharCode(((c & 0x1f) << 6) | (this.buf[i++] & 0x3f)); }
            else if (c < 0xf0) { s += String.fromCharCode(((c & 0x0f) << 12) | ((this.buf[i++] & 0x3f) << 6) | (this.buf[i++] & 0x3f)); }
            else {
                var cp = ((c & 0x07) << 18) | ((this.buf[i++] & 0x3f) << 12) | ((this.buf[i++] & 0x3f) << 6) | (this.buf[i++] & 0x3f);
                cp -= 0x10000;
                s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
            }
        }
        this.pos = end;
        return s;
    };

    function zigzag(n) { return (n % 2 === 0) ? n / 2 : -(n + 1) / 2; }

    function decodeValue(r, len) {
        var end = r.pos + len, v = null;
        while (r.pos < end) {
            var tag = r.varint(), f = tag >> 3, w = tag & 7;
            if (f === 1) { v = r.string(r.varint()); }
            else if (f === 2) { v = new DataView(r.buf.buffer, r.buf.byteOffset + r.pos, 4).getFloat32(0, true); r.pos += 4; }
            else if (f === 3) { v = new DataView(r.buf.buffer, r.buf.byteOffset + r.pos, 8).getFloat64(0, true); r.pos += 8; }
            else if (f === 4 || f === 5) { v = r.varint(); }
            else if (f === 6) { v = zigzag(r.varint()); }
            else if (f === 7) { v = r.varint() !== 0; }
            else { r.skip(w); }
        }
        return v;
    }

    function decodeGeometry(cmds, type) {
        // retourne des anneaux/lignes : [[[x, y], ...], ...] (points : [[[x, y]], ...])
        var x = 0, y = 0, out = [], cur = null, i = 0;
        while (i < cmds.length) {
            var head = cmds[i++], cmd = head & 7, count = Math.floor(head / 8);
            if (cmd === 7) { if (cur) { cur.push(cur[0]); } continue; }
            for (var k = 0; k < count; k++) {
                x += zigzag(cmds[i++]);
                y += zigzag(cmds[i++]);
                if (cmd === 1) { cur = [[x, y]]; out.push(cur); }
                else if (cur) { cur.push([x, y]); }
            }
        }
        return out;
    }

    /**
     * Décode une tuile MVT (ArrayBuffer) :
     * { nomDeCouche: { extent, features: [{ type: 1|2|3, properties, geometry }] } }
     */
    G.decodeMVT = function (arrayBuffer) {
        var buf = new Uint8Array(arrayBuffer), r = new PbfReader(buf), layers = {};
        while (r.pos < r.end) {
            var tag = r.varint(), f = tag >> 3, w = tag & 7;
            if (f !== 3) { r.skip(w); continue; }
            var len = r.varint(), end = r.pos + len;
            var name = '', extent = 4096, keys = [], values = [], feats = [];
            while (r.pos < end) {
                var t2 = r.varint(), f2 = t2 >> 3, w2 = t2 & 7;
                if (f2 === 1) { name = r.string(r.varint()); }
                else if (f2 === 3) { keys.push(r.string(r.varint())); }
                else if (f2 === 4) { values.push(decodeValue(r, r.varint())); }
                else if (f2 === 5) { extent = r.varint(); }
                else if (f2 === 2) {
                    var flen = r.varint(), fend = r.pos + flen;
                    var feat = { type: 0, tags: [], cmds: [] };
                    while (r.pos < fend) {
                        var t3 = r.varint(), f3 = t3 >> 3, w3 = t3 & 7;
                        if (f3 === 2 || f3 === 4) {
                            var plen = r.varint(), pend = r.pos + plen, arr = f3 === 2 ? feat.tags : feat.cmds;
                            while (r.pos < pend) { arr.push(r.varint()); }
                        } else if (f3 === 3) { feat.type = r.varint(); }
                        else { r.skip(w3); }
                    }
                    feats.push(feat);
                } else { r.skip(w2); }
            }
            layers[name] = {
                extent: extent,
                features: feats.map(function (ft) {
                    var props = {};
                    for (var i = 0; i < ft.tags.length; i += 2) { props[keys[ft.tags[i]]] = values[ft.tags[i + 1]]; }
                    return { type: ft.type, properties: props, geometry: decodeGeometry(ft.cmds, ft.type) };
                })
            };
        }
        return layers;
    };

    /* ------------------------------------------------------------------ */
    /* Panoramax : couche de couverture et visualiseur de photos            */
    /* ------------------------------------------------------------------ */

    function destination(ll, brg, d) {
        var R = 6371008.8, r = Math.PI / 180;
        var lat1 = ll.lat * r, lon1 = ll.lng * r, b = brg * r, dr = d / R;
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(b));
        var lon2 = lon1 + Math.atan2(Math.sin(b) * Math.sin(dr) * Math.cos(lat1), Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2));
        return L.latLng(lat2 / r, lon2 / r);
    }

    /** Photo Panoramax (item STAC) normalisée. */
    function normalizePicture(f) {
        var p = f.properties || {}, a = f.assets || {};
        var link = function (rel) {
            var l = (f.links || []).filter(function (x) { return x.rel === rel; })[0];
            return l ? l.href : null;
        };
        var io = p['pers:interior_orientation'] || {};
        return {
            id: f.id,
            collection: f.collection,
            latlng: L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0]),
            date: p.datetime || null,
            azimuth: p['view:azimuth'],
            fov: io.field_of_view,
            is360: io.field_of_view === 360,
            producer: (f.providers || []).map(function (x) { return x.name; }).join(', '),
            license: link('license'),
            sd: a.sd && a.sd.href, hd: a.hd && a.hd.href, thumb: a.thumb && a.thumb.href,
            prev: link('prev'), next: link('next'),
            raw: f
        };
    }

    G.services.panoramaxPicture = function (id) {
        return request(G.config.panoramax + '/search', { ids: id, limit: 1 }).then(function (d) {
            if (!d.features || !d.features.length) { throw new Error(t('noResult')); }
            return normalizePicture(d.features[0]);
        });
    };

    G.services.panoramaxItem = function (href) {
        return request(href).then(normalizePicture);
    };

    /**
     * Couverture Panoramax en tuiles vectorielles (MVT) dessinées sur canvas :
     * séquences (lignes) puis photos (points) à partir du zoom 15.
     * Événement : « select » { id, latlng, properties } au clic sur une photo.
     */
    var PanoramaxLayer = L.GridLayer.extend({
        options: {
            title: 'Panoramax',
            description: 'Photos de terrain collaboratives (CC BY-SA 4.0).',
            minZoom: 12,
            maxNativeZoom: 15,
            zIndex: 100,        // au-dessus des fonds de carte (le LayerSwitcher numérote ses couches à partir de 1)
            lineColor: '#d6249f',
            lineWidth: 2,
            pointColor: '#d6249f',
            pointRadius: 3,     // rayon (px écran) des points de prise de vue
            attribution: '<a href="https://panoramax.fr" target="_blank" rel="noopener">Panoramax</a> (CC BY-SA 4.0)'
        },

        initialize: function (opts) {
            L.GridLayer.prototype.initialize.call(this, opts);
            this._data = {};
            this._canvases = {};
        },

        onAdd: function (map) {
            L.GridLayer.prototype.onAdd.call(this, map);
            map.on('click', this._onClick, this);
            map.on('zoomend', this._redraw, this);
            this.on('tileunload', this._unload, this);
        },

        onRemove: function (map) {
            map.off('click', this._onClick, this);
            map.off('zoomend', this._redraw, this);
            this.off('tileunload', this._unload, this);
            L.GridLayer.prototype.onRemove.call(this, map);
            this._data = {};
            this._canvases = {};
        },

        _key: function (c) { return c.z + ':' + c.x + ':' + c.y; },
        _unload: function (e) {
            var k = this._key(e.coords);
            delete this._data[k];
            delete this._canvases[k];
        },

        /** Redessine les tuiles déjà chargées (taille des traits et des points fixe à l'écran). */
        _redraw: function () {
            var self = this, size = this.getTileSize().x, dpr = window.devicePixelRatio || 1;
            Object.keys(this._canvases).forEach(function (k) {
                var cv = self._canvases[k], layers = self._data[k];
                if (!layers) { return; }
                self._draw(cv.getContext('2d'), layers, size, dpr, parseInt(k, 10));
            });
        },

        createTile: function (coords, done) {
            var self = this, size = this.getTileSize();
            var dpr = window.devicePixelRatio || 1;
            var tile = document.createElement('canvas');
            tile.width = size.x * dpr;
            tile.height = size.y * dpr;
            fetch(G.config.panoramax + '/map/' + coords.z + '/' + coords.x + '/' + coords.y + '.mvt')
                .then(function (r) { return r.ok ? r.arrayBuffer() : null; })
                .then(function (buf) {
                    if (!buf) { done(null, tile); return; }
                    var layers = G.decodeMVT(buf);
                    var key = self._key(coords);
                    self._data[key] = layers;
                    self._canvases[key] = tile;
                    self._draw(tile.getContext('2d'), layers, size.x, dpr, coords.z);
                    done(null, tile);
                })
                .catch(function (err) { done(err, tile); });
            return tile;
        },

        _draw: function (ctx, layers, size, dpr, z) {
            var o = this.options;
            // la tuile (zoom natif ≤ 15) est étirée en CSS au-delà : on compense pour garder une taille constante à l'écran
            var sc = this._map ? Math.max(this._map.getZoomScale(this._map.getZoom(), z), 1) : 1;
            // résolution du canvas adaptée à l'étirement (redimensionner efface aussi le dessin précédent)
            var res = dpr * Math.min(sc, 4), cv = ctx.canvas;
            cv.width = Math.round(size * res);
            cv.height = Math.round(size * res);
            ctx.setTransform(res, 0, 0, res, 0, 0);
            var seq = layers.sequences;
            if (seq) {
                var k = size / seq.extent;
                ctx.strokeStyle = o.lineColor;
                ctx.lineWidth = o.lineWidth / sc;
                ctx.lineJoin = ctx.lineCap = 'round';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                seq.features.forEach(function (f) {
                    f.geometry.forEach(function (line) {
                        line.forEach(function (p, i) { i ? ctx.lineTo(p[0] * k, p[1] * k) : ctx.moveTo(p[0] * k, p[1] * k); });
                    });
                });
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            var pics = layers.pictures;
            if (pics) {
                var kp = size / pics.extent;
                pics.features.forEach(function (f) {
                    var p = f.geometry[0] && f.geometry[0][0];
                    if (!p) { return; }
                    var x = p[0] * kp, y = p[1] * kp;
                    ctx.beginPath();
                    ctx.arc(x, y, o.pointRadius / sc, 0, 2 * Math.PI);
                    ctx.fillStyle = f.properties.type === 'equirectangular' ? '#fff' : o.pointColor;
                    ctx.fill();
                    ctx.lineWidth = 1.5 / sc;
                    ctx.strokeStyle = f.properties.type === 'equirectangular' ? o.pointColor : '#fff';
                    ctx.stroke();
                });
            }
        },

        /** Photos proches d'un point (tolérance en pixels écran), de la plus proche à la plus éloignée. */
        getPicturesAt: function (latlng, tol, max) {
            var map = this._map, z = this._tileZoom, found = [];
            if (!map || z === undefined || z < 15) { return found; }
            var native = (tol || 10) / Math.pow(2, map.getZoom() - z);
            var pt = map.project(latlng, z), tx = Math.floor(pt.x / 256), ty = Math.floor(pt.y / 256);
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    var layers = this._data[z + ':' + (tx + dx) + ':' + (ty + dy)];
                    if (!layers || !layers.pictures) { continue; }
                    var ext = layers.pictures.extent;
                    for (var i = 0; i < layers.pictures.features.length; i++) {
                        var f = layers.pictures.features[i], p = f.geometry[0] && f.geometry[0][0];
                        if (!p) { continue; }
                        var gx = (tx + dx) * 256 + p[0] / ext * 256, gy = (ty + dy) * 256 + p[1] / ext * 256;
                        var d = Math.sqrt(Math.pow(gx - pt.x, 2) + Math.pow(gy - pt.y, 2));
                        if (d < native) { found.push({ d: d, properties: f.properties, latlng: map.unproject(L.point(gx, gy), z) }); }
                    }
                }
            }
            found.sort(function (a, b) { return a.d - b.d; });
            return found.slice(0, max || 12);
        },

        /** Photo la plus proche d'un point, ou null. */
        getPictureAt: function (latlng, tol) {
            return this.getPicturesAt(latlng, tol, 1)[0] || null;
        },

        _onClick: function (e) {
            var hits = this.getPicturesAt(e.latlng, 12, 12);
            if (hits.length) {
                this.fire('select', {
                    id: hits[0].properties.id, latlng: hits[0].latlng, properties: hits[0].properties,
                    candidates: hits   // plusieurs photos peuvent se superposer (dates, caméras différentes)
                });
            }
        }
    });

    G.PanoramaxLayer = PanoramaxLayer;
    G.panoramaxLayer = function (o) { return new PanoramaxLayer(o); };

    /* ------------------------------------------------------------------ */
    /* Visualiseur panoramique (photos équirectangulaires à 360°, WebGL)    */
    /* ------------------------------------------------------------------ */

    var PANO_VERT = 'attribute vec2 p; varying vec2 v; void main() { v = p; gl_Position = vec4(p, 0.0, 1.0); }';
    var PANO_FRAG = [
        'precision highp float;',
        'varying vec2 v;',
        'uniform sampler2D tex;',
        'uniform float yaw, pitch, tanHalfFov, aspect;',
        'void main() {',
        '  vec3 d = normalize(vec3(v.x * aspect * tanHalfFov, v.y * tanHalfFov, 1.0));',
        '  float cp = cos(pitch), sp = sin(pitch);',
        '  d = vec3(d.x, d.y * cp + d.z * sp, -d.y * sp + d.z * cp);',
        '  float cy = cos(yaw), sy = sin(yaw);',
        '  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);',
        '  float lon = atan(d.x, d.z);',
        '  float lat = asin(clamp(d.y, -1.0, 1.0));',
        '  gl_FragColor = texture2D(tex, vec2(lon / 6.2831853 + 0.5, 0.5 - lat / 3.1415927));',
        '}'
    ].join('\n');

    /**
     * Petit visualiseur de panoramas équirectangulaires.
     *   var viewer = new L.geoplateforme.PanoramaViewer(element, { yaw: 0, pitch: 0, fov: 75 });
     *   viewer.load(url).then(...);            // l'image doit être servie avec CORS
     *   viewer.on('view', function (e) { e.yaw, e.pitch, e.fov });   // angles en degrés
     *   viewer.destroy();
     * Glisser : orienter ; molette ou pincement : zoom ; double-clic : plein écran.
     */
    var PanoramaViewer = L.Evented.extend({
        options: { yaw: 0, pitch: 0, fov: 75, minFov: 25, maxFov: 100 },

        initialize: function (container, opts) {
            L.setOptions(this, opts);
            this._container = container;
            this._yaw = this.options.yaw;
            this._pitch = this.options.pitch;
            this._fov = this.options.fov;
            this._pointers = {};
            var canvas = this._canvas = el('canvas', 'gpf-pano-canvas', container);
            var gl = this._gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) { throw new Error('WebGL indisponible'); }
            this._program = this._compile(gl);
            this._tex = gl.createTexture();
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            var loc = gl.getAttribLocation(this._program, 'p');
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
            this._u = {};
            var self = this;
            ['tex', 'yaw', 'pitch', 'tanHalfFov', 'aspect'].forEach(function (n) { self._u[n] = gl.getUniformLocation(self._program, n); });

            L.DomEvent.on(canvas, 'pointerdown', this._down, this);
            L.DomEvent.on(canvas, 'pointermove', this._move, this);
            L.DomEvent.on(canvas, 'pointerup pointercancel pointerleave', this._up, this);
            L.DomEvent.on(canvas, 'wheel', this._wheel, this);
            L.DomEvent.on(canvas, 'dblclick', this.toggleFullscreen, this);
            canvas.style.touchAction = 'none';

            if (window.ResizeObserver) {
                this._ro = new ResizeObserver(function () { self._resize(); });
                this._ro.observe(container);
            }
            this._resize();
        },

        _compile: function (gl) {
            var sh = function (type, src) {
                var s = gl.createShader(type);
                gl.shaderSource(s, src);
                gl.compileShader(s);
                if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
                return s;
            };
            var prog = gl.createProgram();
            gl.attachShader(prog, sh(gl.VERTEX_SHADER, PANO_VERT));
            gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, PANO_FRAG));
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { throw new Error(gl.getProgramInfoLog(prog)); }
            gl.useProgram(prog);
            return prog;
        },

        /** Charge l'image (Promise). Elle est réduite si elle dépasse la taille de texture du GPU. */
        load: function (url) {
            var self = this, gl = this._gl;
            return new Promise(function (resolve, reject) {
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function () {
                    if (self._destroyed) { return; }
                    var src = img, max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                    if (img.width > max) {
                        var c = document.createElement('canvas');
                        c.width = max; c.height = Math.round(img.height * max / img.width);
                        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                        src = c;
                    }
                    gl.bindTexture(gl.TEXTURE_2D, self._tex);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    self._loaded = true;
                    self._render();
                    self._emit();
                    resolve(self);
                };
                img.onerror = function () { reject(new Error('Image panoramique illisible')); };
                img.src = url;
            });
        },

        getView: function () { return { yaw: this._yaw, pitch: this._pitch, fov: this._fov }; },

        setView: function (yaw, pitch, fov) {
            if (yaw !== undefined) { this._yaw = ((yaw + 180) % 360 + 360) % 360 - 180; }
            if (pitch !== undefined) { this._pitch = Math.max(-85, Math.min(85, pitch)); }
            if (fov !== undefined) { this._fov = Math.max(this.options.minFov, Math.min(this.options.maxFov, fov)); }
            this._render();
            this._emit();
            return this;
        },

        _emit: function () { this.fire('view', this.getView()); },

        _resize: function () {
            var c = this._container, dpr = window.devicePixelRatio || 1;
            var w = c.clientWidth, h = c.clientHeight;
            if (!w || !h) { return; }
            this._canvas.width = Math.round(w * dpr);
            this._canvas.height = Math.round(h * dpr);
            this._render();
        },

        _render: function () {
            if (this._raf || this._destroyed) { return; }
            var self = this;
            this._raf = requestAnimationFrame(function () {
                self._raf = null;
                if (self._destroyed || !self._loaded) { return; }
                var gl = self._gl, cv = self._canvas, r = Math.PI / 180;
                gl.viewport(0, 0, cv.width, cv.height);
                gl.uniform1i(self._u.tex, 0);
                gl.uniform1f(self._u.yaw, self._yaw * r);
                gl.uniform1f(self._u.pitch, self._pitch * r);
                gl.uniform1f(self._u.tanHalfFov, Math.tan(self._fov * r / 2));
                gl.uniform1f(self._u.aspect, cv.width / cv.height);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            });
        },

        _down: function (e) {
            this._pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
            this._canvas.setPointerCapture(e.pointerId);
            L.DomUtil.addClass(this._canvas, 'gpf-grabbing');
            this._pinch = null;
        },

        _move: function (e) {
            var p = this._pointers[e.pointerId];
            if (!p) { return; }
            var ids = Object.keys(this._pointers);
            if (ids.length === 2) {
                // pincement : zoom
                this._pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
                var a = this._pointers[ids[0]], b = this._pointers[ids[1]];
                var d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
                if (this._pinch) { this.setView(undefined, undefined, this._fov * this._pinch / d); }
                this._pinch = d;
                return;
            }
            var k = this._fov / this._canvas.clientHeight;   // degrés par pixel
            this.setView(this._yaw - (e.clientX - p.x) * k, this._pitch + (e.clientY - p.y) * k);
            p.x = e.clientX; p.y = e.clientY;
        },

        _up: function (e) {
            delete this._pointers[e.pointerId];
            this._pinch = null;
            if (!Object.keys(this._pointers).length) { L.DomUtil.removeClass(this._canvas, 'gpf-grabbing'); }
        },

        _wheel: function (e) {
            L.DomEvent.stop(e);
            this.setView(undefined, undefined, this._fov * (e.deltaY > 0 ? 1.08 : 1 / 1.08));
        },

        toggleFullscreen: function () {
            var c = this._container;
            if (document.fullscreenElement === c) { document.exitFullscreen(); }
            else if (c.requestFullscreen) { c.requestFullscreen(); }
        },

        destroy: function () {
            this._destroyed = true;
            if (this._raf) { cancelAnimationFrame(this._raf); }
            if (this._ro) { this._ro.disconnect(); }
            var ext = this._gl.getExtension('WEBGL_lose_context');
            if (ext) { ext.loseContext(); }
            this._canvas.remove();
            this.off();
        }
    });

    /** Indique si le navigateur peut afficher des panoramas (WebGL). */
    var webglOk = null;
    PanoramaViewer.supported = function () {
        if (webglOk === null) {
            try {
                var c = document.createElement('canvas');
                webglOk = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
            } catch (e) { webglOk = false; }
        }
        return webglOk;
    };

    G.PanoramaViewer = PanoramaViewer;

    var Panoramax = PanelControl.extend({
        options: {
            position: 'topright',
            collapsed: true,
            layer: null,        // PanoramaxLayer existante ; sinon une couche est créée
            coneLength: 30,     // longueur (m) du cône de vue
            panTo: true
        },
        _iconName: 'panoramax',
        _titleKey: 'panoramax',
        _cls: 'gpf-panoramax',

        _build: function (body) {
            var self = this;
            this.layer = this.options.layer || new PanoramaxLayer();
            var lb = el('label', 'gpf-checks', body);
            this._cb = el('input', null, lb);
            this._cb.type = 'checkbox';
            el('span', null, lb, t('showCoverage'));
            L.DomEvent.on(this._cb, 'change', function () {
                self._cb.checked ? self._map.addLayer(self.layer) : self._map.removeLayer(self.layer);
            });
            el('div', 'gpf-hint', body, t('panoHint'));
            this._msg = el('div', 'gpf-status', body);
            this._strip = el('div', 'gpf-pano-strip', body);
            this._view = el('div', 'gpf-pano-view', body);
            this.layer.on('select', function (e) {
                self._renderStrip(e.candidates || [], e.id);
                self.show(e.id);
            });
        },

        expand: function () {
            PanelControl.prototype.expand.call(this);
            if (!this._map.hasLayer(this.layer)) { this._map.addLayer(this.layer); }
            this._cb.checked = true;
            return this;
        },

        _removed: function () {
            this._clearMarks();
            this._destroyViewer();
            if (this._map.hasLayer(this.layer)) { this._map.removeLayer(this.layer); }
        },

        _destroyViewer: function () {
            if (this._viewer) { this._viewer.destroy(); this._viewer = null; }
        },

        /** Vignettes des photos superposées au point cliqué (la photo « 360° » est signalée). */
        _renderStrip: function (cands, currentId) {
            var self = this, strip = this._strip;
            strip.innerHTML = '';
            this._cands = cands;
            if (cands.length < 2) { return; }
            el('div', 'gpf-hint', strip, t('severalPics', { n: cands.length }));
            var row = el('div', 'gpf-pano-thumbs', strip);
            cands.forEach(function (c) {
                var p = c.properties, b = el('button', 'gpf-pano-thumb', row);
                b.type = 'button';
                b.dataset.id = p.id;
                b.title = (p.ts ? p.ts.slice(0, 10) : '') + (p.model ? ' · ' + p.model : '');
                var img = el('img', null, b);
                img.src = G.config.panoramax + '/pictures/' + p.id + '/thumb.jpg';
                img.alt = '';
                img.loading = 'lazy';
                if (p.type === 'equirectangular') { el('span', 'gpf-pano-badge', b, '360°'); }
                if (p.id === currentId) { L.DomUtil.addClass(b, 'gpf-active'); }
                L.DomEvent.on(b, 'click', function () { self._pickCandidate(p.id); });
            });
        },

        _pickCandidate: function (id) {
            Array.prototype.forEach.call(this._strip.querySelectorAll('.gpf-pano-thumb'), function (b) {
                L.DomUtil[b.dataset.id === id ? 'addClass' : 'removeClass'](b, 'gpf-active');
            });
            this.show(id);
        },

        _clearMarks: function () {
            if (this._marks) { this._marks.remove(); this._marks = null; }
        },

        /** Affiche une photo dans le panneau (par identifiant ou objet normalisé). */
        show: function (pic) {
            var self = this;
            if (typeof pic === 'string') {
                this._status(this._msg, t('loading'));
                G.services.panoramaxPicture(pic).then(function (p) { self.show(p); })
                    .catch(function (err) { self._fail(self._msg, err); });
                return this;
            }
            this.expand();
            this._status(this._msg, '');
            this._current = pic;
            this._mark(pic);
            this._destroyViewer();
            var v = this._view;
            v.innerHTML = '';
            var viewer = null;
            if (pic.is360 && PanoramaViewer.supported()) {
                // photo à 360° : visualiseur panoramique, le cône de vue suit la direction regardée
                var box = el('div', 'gpf-pano-360', v);
                try {
                    viewer = this._viewer = new PanoramaViewer(box, { yaw: 0, pitch: 0 });
                    viewer.on('view', function (e) {
                        if (self._markRaf) { return; }
                        self._markRaf = requestAnimationFrame(function () {
                            self._markRaf = null;
                            if (self._current === pic) { self._mark(pic, { azimuth: (pic.azimuth || 0) + e.yaw, fov: e.fov }); }
                        });
                    });
                    viewer.load(pic.sd || pic.hd).catch(function (err) {
                        box.remove();
                        self._destroyViewer();
                        self._fail(self._msg, err);
                    });
                } catch (err) {
                    viewer = null;
                    box.remove();
                    this._viewer = null;
                }
            }
            if (!viewer) {
                var img = el('img', 'gpf-pano-img', v);
                img.src = pic.sd || pic.thumb || '';
                img.alt = '';
            }
            var meta = el('div', 'gpf-pano-meta', v);
            var parts = [];
            if (pic.date) { parts.push(t('capturedOn') + ' ' + new Date(pic.date).toLocaleDateString(G.lang)); }
            if (pic.producer) { parts.push('© ' + pic.producer); }
            el('span', null, meta, parts.join(' · '));
            if (pic.license) {
                var lic = el('a', 'gpf-ls-meta', meta, 'CC BY-SA 4.0');
                lic.href = pic.license; lic.target = '_blank'; lic.rel = 'noopener';
            }
            if (pic.is360) { el('div', 'gpf-hint', v, t(viewer ? 'pano360' : 'pano360Unsupported')); }
            var nav = el('div', 'gpf-row', v);
            var prev = button('', nav, '‹ ' + t('prevPic'));
            var next = button('', nav, t('nextPic') + ' ›');
            prev.disabled = !pic.prev; next.disabled = !pic.next;
            L.DomEvent.on(prev, 'click', function () { self._go(pic.prev); });
            L.DomEvent.on(next, 'click', function () { self._go(pic.next); });
            var open = el('a', 'gpf-ls-meta', v, t('openPanoramax'));
            open.href = G.config.panoramaxViewer + '?focus=pic&pic=' + encodeURIComponent(pic.id);
            open.target = '_blank'; open.rel = 'noopener';
            this.fire('picture', { picture: pic });
            return this;
        },

        _go: function (href) {
            var self = this;
            if (!href) { return; }
            this._status(this._msg, t('loading'));
            G.services.panoramaxItem(href).then(function (p) { self.show(p); })
                .catch(function (err) { self._fail(self._msg, err); });
        },

        /** Position de la photo et cône de vue sur la carte. */
        _mark: function (pic, view) {
            var map = this._map;
            this._clearMarks();
            var g = this._marks = L.layerGroup().addTo(map);
            var style = { color: '#d6249f', weight: 2, fillOpacity: 0.25 };
            // direction : celle regardée dans le visualiseur 360°, sinon celle de la prise de vue
            var az = view ? view.azimuth : pic.azimuth;
            var fov = view ? view.fov : (pic.is360 ? null : pic.fov);
            if (az !== undefined && az !== null && (view || !pic.is360)) {
                var half = (fov || 60) / 2, pts = [pic.latlng];
                for (var a = -half; a <= half; a += 5) { pts.push(destination(pic.latlng, az + a, this.options.coneLength)); }
                L.polygon(pts, style).addTo(g);
            } else {
                L.circle(pic.latlng, L.extend({ radius: this.options.coneLength / 2 }, style)).addTo(g);
            }
            L.circleMarker(pic.latlng, { radius: 5, color: '#fff', weight: 2, fillColor: '#d6249f', fillOpacity: 1 }).addTo(g);
            if (!view && this.options.panTo && !map.getBounds().contains(pic.latlng)) { map.panTo(pic.latlng); }
        }
    });

    /* ------------------------------------------------------------------ */
    /* Exports (fabriques à la mode Leaflet + compatibilité ancienne API)  */
    /* ------------------------------------------------------------------ */

    G.LayerSwitcher = LayerSwitcher;
    G.SearchEngine = SearchEngine;
    G.ReverseGeocode = ReverseGeocode;
    G.Route = Route;
    G.Isocurve = Isocurve;
    G.MousePosition = MousePosition;
    G.ElevationPath = ElevationPath;
    G.LayerCatalog = LayerCatalog;
    G.FeatureInfo = FeatureInfo;
    G.Measure = Measure;
    G.Compare = Compare;
    G.ExportMap = ExportMap;
    G.Panoramax = Panoramax;

    G.layerSwitcher = function (o) { return new LayerSwitcher(o); };
    G.searchEngine = function (o) { return new SearchEngine(o); };
    G.reverseGeocode = function (o) { return new ReverseGeocode(o); };
    G.route = function (o) { return new Route(o); };
    G.isocurve = function (o) { return new Isocurve(o); };
    G.mousePosition = function (o) { return new MousePosition(o); };
    G.elevationPath = function (o) { return new ElevationPath(o); };
    G.layerCatalog = function (o) { return new LayerCatalog(o); };
    G.featureInfo = function (o) { return new FeatureInfo(o); };
    G.measure = function (o) { return new Measure(o); };
    G.compare = function (o) { return new Compare(o); };
    G.exportMap = function (o) { return new ExportMap(o); };
    G.panoramax = function (o) { return new Panoramax(o); };

    // Noms de l'ancienne extension « Géoportail » : L.geoportalLayer / L.geoportalControl / L.geoportalCRS
    L.geoportalLayer = { WMTS: G.wmts, WMS: G.wms };
    L.geoportalControl = {
        LayerSwitcher: G.layerSwitcher,
        SearchEngine: G.searchEngine,
        ReverseGeocode: G.reverseGeocode,
        Route: G.route,
        Isocurve: G.isocurve,
        MousePosition: G.mousePosition,
        ElevationPath: G.elevationPath
    };
    L.geoportalCRS = G.crs;

    return G;
}));
