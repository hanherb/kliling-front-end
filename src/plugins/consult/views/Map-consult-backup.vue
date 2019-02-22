<template lang="pug">
  vl-map( :load-tiles-while-animating="true" :load-tiles-while-interacting="true" id="map")
    vl-view( :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation")
    vl-layer-tile( id="osm")
        vl-source-osm
    div( v-for="docloc in doctorLocation")
      vl-feature
        vl-geom-point( :coordinates="[docloc.location[0], docloc.location[1]]")
        vl-style-box
          vl-style-icon( src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png" :scale="0.1" :anchor="[0.5, 0.5]" :size="[440, 500]")
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
      zoom: 16,
      rotation: 0,
      doctorLocation: [],
    };
  },

  created() {
    this.fetchDoctorLocation();
  },

  methods: {
    fetchDoctorLocation() {
      const doctorA = {
        name: 'Budi',
        location: [106.843591, -6.243005],
      };

      const doctorB = {
        name: 'Junaidi',
        location: [106.8393773, -6.240744],
      };

      this.doctorLocation.push(doctorA);
      this.doctorLocation.push(doctorB);
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
