# gpf-extensions-leaflet-xp

> **⚠️ Projet expérimental et non officiel.** Cette extension est en cours de développement (version 0.1.0) : l'API publique peut changer sans préavis, elle n'a été testée que manuellement et aucune garantie n'est donnée. Elle s'appuie sur des services de la Géoplateforme et de Panoramax dont le comportement peut évoluer. À valider avant tout usage en production. Retours et signalements bienvenus dans les [issues](https://github.com/IGNF-Xavier/gpf-extensions-leaflet-xp/issues).

Extension [Leaflet](https://leafletjs.com) pour la **Géoplateforme de l'IGN** (`data.geopf.fr`). Elle reprend le périmètre fonctionnel de l'ancienne extension Géoportail pour Leaflet (`geoportal-extensions`), sans dépendre de l'ancien SDK ni d'une clé d'accès pour les ressources publiques, et y ajoute un catalogue de couches, l'interrogation d'objets, les mesures, un comparateur, l'export et Panoramax.

- Cible : **Leaflet 1.9.x** (1.9.4, dernière version stable ; Leaflet 2.0 n'existe qu'en alpha et n'est pas ciblé).
- Aucune autre dépendance (Proj4Leaflet n'est requis que pour le Lambert 93 en CRS de carte).
- Un fichier JS + un fichier CSS, sans étape de build.

## Utilisation

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="dist/leaflet-geoplateforme.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="dist/leaflet-geoplateforme.js"></script>
<script>
  var map = L.map('map', { center: [46.6, 2.5], zoom: 6 });
  L.geoplateforme.wmts({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' }).addTo(map);
  L.geoplateforme.searchEngine().addTo(map);
  L.geoplateforme.mousePosition().addTo(map);
</script>
```

Démonstrations : [examples/index.html](examples/index.html) (tous les contrôles) et [examples/lambert93.html](examples/lambert93.html) (carte en EPSG:2154). Elles doivent être servies en HTTP (`python -m http.server`).

## Correspondance avec l'ancienne extension

| Ancienne extension | Ici |
|---|---|
| `L.geoportalLayer.WMTS` | `L.geoplateforme.wmts` |
| `L.geoportalLayer.WMS` | `L.geoplateforme.wms` |
| `L.geoportalControl.LayerSwitcher` | `L.geoplateforme.layerSwitcher` |
| `L.geoportalControl.SearchEngine` | `L.geoplateforme.searchEngine` |
| `L.geoportalControl.ReverseGeocode` | `L.geoplateforme.reverseGeocode` |
| `L.geoportalControl.Route` | `L.geoplateforme.route` |
| `L.geoportalControl.Isocurve` | `L.geoplateforme.isocurve` |
| `L.geoportalControl.MousePosition` | `L.geoplateforme.mousePosition` |
| `L.geoportalControl.ElevationPath` | `L.geoplateforme.elevationPath` |
| `L.geoportalCRS.EPSG2154` | `L.geoplateforme.crs.EPSG2154` |

Les anciens noms (`L.geoportalLayer`, `L.geoportalControl`, `L.geoportalCRS`) restent disponibles comme alias, ce qui facilite la migration.

## Couches

```js
L.geoplateforme.wmts({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS' });          // format et style connus
L.geoplateforme.wmts({ layer: 'LANDCOVER.CLC18_FR' });                // idem
L.geoplateforme.wmts({ layer: 'UNE.AUTRE.COUCHE', resolve: true });   // complète depuis les capabilities
L.geoplateforme.wms({ layers: 'LIMITES_ADMINISTRATIVES_EXPRESS.LATEST' });
```

Options WMTS : `layer`, `style`, `format`, `tileMatrixSet` (`PM` par défaut, `2154_10cm` si la carte est en EPSG:2154), `apiKey` (ressources privées), `resolve`, `title`, `description`, `legend`, `metadata`, plus toutes les options de `L.TileLayer`.

Une vingtaine de couches courantes ont leur format, style et plage de zooms intégrés (`L.geoplateforme.knownLayers`). Pour les autres, soit on donne `format`/`style`, soit on passe `resolve: true` : les capabilities WMTS (≈ 3 Mo) sont alors chargées une fois, à la demande. `L.geoplateforme.getCapabilities()` donne accès au catalogue complet.

## Contrôles

| Contrôle | Fonction | Options principales |
|---|---|---|
| `layerSwitcher` | Visibilité, opacité, ordre (glisser-déposer), infos, légende, métadonnées | `layers: [{ layer, config: { title, description, legends, metadata, quicklookUrl, visibility, removable } }]`, `collapsed` |
| `searchEngine` | Recherche avec autocomplétion (adresses, lieux, parcelles) | `indexes`, `advancedSearch`, `zoomTo`, `marker`, `minChars`, `maximumEntries` |
| `reverseGeocode` | Localisation par point, cercle ou rectangle | `indexes`, `delimitation` (`point`/`circle`/`extent`), `maximumResponses` |
| `route` | Itinéraire (voiture, piéton, étapes, exclusions, instructions, marqueurs déplaçables) | `exclusions`, `profiles`, `resource`, `fitBounds`, `style` |
| `isocurve` | Isochrone / isodistance | `profiles`, `resource`, `style`, `fitBounds` |
| `mousePosition` | Coordonnées (DD, DM, DMS, Lambert 93, Web Mercator, systèmes personnalisés) et altitude | `systems`, `system`, `displayAltitude`, `altitudeDelay` |
| `elevationPath` | Profil altimétrique d'un tracé, statistiques, export CSV | `sampling`, `mode`, `target`, `profileHeight` |

Contrôles ajoutés par rapport à l'ancienne extension :

| Contrôle | Fonction | Options principales |
|---|---|---|
| `layerCatalog` | Recherche de couches dans l'index de la Géoplateforme (API Recherche), par texte, type (WMTS, WMS, WFS) et thème ; ajout à la carte ou au LayerSwitcher | `layerSwitcher`, `types`, `pageSize`, `zoomOnAdd` |
| `featureInfo` | Clic sur la carte : attributs des couches WMTS/WMS visibles (GetFeatureInfo) | `infoFormat`, `maxFeatures`, `filter` |
| `measure` | Distance, surface (et périmètre), azimut (en degrés et en grades) | `modes`, `style` |
| `compare` | Curseur de comparaison de deux couches, choisies dans une liste | `layers`, `left`, `right`, `ratio` |
| `exportMap` | Capture de la carte en PNG (titre et attributions inclus) ou impression | `filename`, `scales` |
| `panoramax` | Couverture Panoramax (tuiles vectorielles), photo, cône de vue, photo précédente/suivante ; visualiseur panoramique pour les photos à 360° | `layer`, `coneLength`, `panTo` |

Couches supplémentaires : `L.geoplateforme.wfs({ typeName })` (vecteur chargé sur l'emprise visible, clic = attributs) et `L.geoplateforme.panoramaxLayer()`.

Le visualiseur de photos à 360° est aussi utilisable seul (WebGL, sans dépendance) :

```js
var viewer = new L.geoplateforme.PanoramaViewer(document.getElementById('pano'), { yaw: 0, pitch: 0, fov: 75 });
viewer.load('https://…/sd.jpg');            // image équirectangulaire servie avec CORS
viewer.on('view', function (e) { /* e.yaw, e.pitch, e.fov en degrés */ });
```
Glisser pour orienter, molette ou pincement pour zoomer, double-clic pour le plein écran. Dans le contrôle Panoramax, le cône de vue sur la carte suit la direction regardée.

Les contrôles émettent des événements (`select`, `route`, `isocurve`, `profile`, `results`, `error`…) et exposent des méthodes utiles (`route.setPoints()`, `isocurve.setPoint()`, `elevationPath.setPath()`, `clear()`, `expand()`/`collapse()`).

Les services sont aussi utilisables seuls : `L.geoplateforme.services.complete / search / reverse / route / isochrone / elevation / elevationLine / searchLayers / panoramaxPicture`. `L.geoplateforme.captureMap(map, { scale, title })` retourne un `<canvas>`, et `L.geoplateforme.decodeMVT(arrayBuffer)` décode une tuile vectorielle.

## Lambert 93

```html
<script src="https://unpkg.com/proj4@2.9.2/dist/proj4.js"></script>
<script src="https://unpkg.com/proj4leaflet@1.0.2/src/proj4leaflet.js"></script>
```
```js
var map = L.map('map', { crs: L.geoplateforme.crs.EPSG2154, center: [48.85, 2.35], zoom: 12 });
L.geoplateforme.wmts({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2.L93' }).addTo(map);
```

Il faut utiliser les couches publiées en Lambert 93 (suffixe `.L93`).

## Configuration et langue

```js
L.geoplateforme.setConfig({ geocoding: 'https://exemple.fr/geocodage' }); // URLs des services, attribution…
L.geoplateforme.setLang('en');                                            // 'fr' (défaut) ou 'en'
L.geoplateforme.addMessages('fr', { search: 'Trouver un lieu' });         // libellés personnalisés
```

## Services Géoplateforme utilisés

| Besoin | Service |
|---|---|
| Tuiles | `https://data.geopf.fr/wmts` |
| WMS | `https://data.geopf.fr/wms-r/wms` |
| Géocodage | `https://data.geopf.fr/geocodage` (`completion`, `search`, `reverse`) |
| Itinéraire | `https://data.geopf.fr/navigation/itineraire` |
| Isochrone | `https://data.geopf.fr/navigation/isochrone` |
| Altimétrie | `https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest` |
| Catalogue de couches | `https://data.geopf.fr/recherche/api/indexes/geoplateforme` (API Recherche) |
| WFS | `https://data.geopf.fr/wfs/ows` |
| Panoramax | `https://api.panoramax.xyz/api` (méta-catalogue), visualiseur `https://panoramax.ign.fr/` |

## Limites connues

- Pas d'« autoconf » : le service d'autoconfiguration de l'ancien Géoportail n'existe plus sur la Géoplateforme. Les métadonnées de couches viennent d'un catalogue intégré ou des capabilities WMTS.
- L'ancienne extension fonctionnait avec des clés ; ici, seules les ressources publiques sont couvertes d'office (`apiKey` n'est géré que pour le WMTS privé).
- Le géocodage inverse par rectangle est limité par le service à 1 000 m de côté.
- Catalogue : seules les ressources publiques (`open: true`) sont proposées ; les couches TMS (tuiles vectorielles) ne sont pas affichables. Le filtre géographique (`shape`) de l'API Recherche n'a pas donné de résultat lors des essais, il n'est donc pas utilisé.
- Interrogation d'objet : requiert une couche qui déclare un GetFeatureInfo ; les couches sans objets (fonds de carte) ne renvoient rien.
- Capture et impression : les tuiles doivent être servies avec CORS (option `crossOrigin: true`, activée par défaut sur les couches WMTS/WMS). Les icônes de marqueurs sans CORS et les popups ne sont pas dessinées.
- Panoramax : les photos s'affichent à partir du zoom 15 ; les photos à 360° sont affichées par le visualiseur intégré (si WebGL est disponible, sinon image à plat et lien vers Panoramax). Le visualiseur utilise la définition `sd` de la photo, sans suivi de séquence en 360° autre que précédente/suivante. Les tuiles denses (Paris) sont lourdes (plusieurs centaines de Ko).
- Testé sur Leaflet 1.9.4 dans un navigateur Chromium, avec les services réels. Pas de suite de tests automatisés. Les essais ont couvert chaque contrôle par des appels programmatiques ; les interactions à la souris n'ont été exercées que sur le survol (MousePosition).

## Licence

[MIT](LICENSE).
