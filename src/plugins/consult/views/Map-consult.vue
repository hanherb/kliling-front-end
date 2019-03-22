<template lang="pug">
  div
    div( id="map")
</template>

<script>
import graphqlFunction from '~/src/graphqlFunction';
import address from '~/src/address';
import headers from '~/src/headers';

export default {
  name: 'map-consult',
  data() {
    return {
      center: [106.843591, -6.243005],
      zoom: 15,
      rotation: 0,
      doctorLocation: [
        [106.845809, -6.237034],
        [106.833093, -6.241100],
        [106.843201, -6.224070],
      ],
    };
  },

  mounted() {
    this.fetchMap();
  },

  methods: {
    fetchMap() {
      const url_osrm_nearest = '//router.project-osrm.org/nearest/v1/driving/';


      const url_osrm_route = '//router.project-osrm.org/route/v1/driving/';


      const icon_url = '//cdn.rawgit.com/openlayers/ol3/master/examples/data/icon.png';


      const vectorSource = new ol.source.Vector();


      const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
      });


      const styles = {
        route: new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 6, color: [40, 40, 40, 0.8],
          }),
        }),
        icon: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: icon_url,
          }),
        }),
      };

      const map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
          vectorLayer,
        ],
        view: new ol.View({
          projection: 'EPSG:4326',
          center: this.center,
          zoom: this.zoom,
        }),
      });

      // get the route
      const point1 = this.doctorLocation[0];
      const point2 = this.doctorLocation[1];
      const point3 = this.doctorLocation[2];

      fetch(`${url_osrm_route + point1};${point2};${point3}`).then(r => r.json()).then((json) => {
        if (json.code !== 'Ok') {
          return;
        }
        utils.createRoute(json.routes[0].geometry);
      });
      var utils = {
        createFeature(coord) {
          const feature = new ol.Feature({
            type: 'place',
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
          });
          feature.setStyle(styles.icon);
          vectorSource.addFeature(feature);
        },
        createRoute(polyline) {
          // route is ol.geom.LineString
          const route = new ol.format.Polyline({
            factor: 1e5,
          }).readGeometry(polyline, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326',
          });
          const feature = new ol.Feature({
            type: 'route',
            geometry: route,
          });
          feature.setStyle(styles.route);
          vectorSource.addFeature(feature);
        },
        to4326(coord) {
          return ol.proj.transform([
            parseFloat(coord[0]), parseFloat(coord[1]),
          ], 'EPSG:3857', 'EPSG:4326');
        },
      };
    },
  },
};
</script>

<style>
  #map {
    width: 1000px;
    height: 500px;
  }
</style>
