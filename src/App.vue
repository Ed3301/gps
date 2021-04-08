<template>
  <div id="app">
<!--    <GmapMap-->
<!--            id="map"-->
<!--            :center="initialPosition"-->
<!--            :zoom="9"-->
<!--            map-type-id="roadmap"-->
<!--    >-->
<!--      <GmapMarker-->
<!--              :position="{lat: 40.2212737, lng: 44.6657528}"-->
<!--              :clickable="true"-->
<!--      />-->

<!--      <DirectionsRender-->
<!--                :travelMode="'DRIVING'"-->
<!--                :origin="{query: '40.2212737, 44.6657528'}"-->
<!--                :destination="{query: '40.1706605, 44.5105709'}"-->
<!--      />-->
<!--    </GmapMap>-->
<!--      <div id="panel"></div>-->
        <div id="map"></div>
  </div>
</template>

<script>
import Vue from 'vue';
// import * as VueGoogleMaps from 'vue2-google-maps';
// import DirectionsRender from "./components/directionsRender";

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyCwpN-RMCyjzcvMzyzSZzQBz2iyr1I7rRU',
//     libraries: 'places',
//   },
// });

export default {
  name: 'App',
  data() {
    return {
        initialPosition: {
            lat: 0,
            lng: 0
        },
        origin: {
            query: ''
        },
        destination: {
          query: ''
        }
    }
  },
  async mounted() {
    await this.setCurrentUserLocation();
    // await this.initMap();
  },
  methods: {
    async setCurrentUserLocation() {

        if(navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(position => {
            this.initialPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            console.log(1);

            this.origin.query = `${position.coords.latitude}, ${position.coords.longitude}`;
            this.initMap();
        })
      }
    },
      initMap() {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({draggable: true});
          console.log(2);

          const map = new google.maps.Map(document.getElementById("map"), {
              zoom: 9,
              center: this.initialPosition,
          });
          const marker = new google.maps.Marker({
              position: this.initialPosition,
              map,
              title: "A",
          });
          map.addListener('click', (e) => {
              marker.setMap(null);
              // map.setZoom(9);
              this.destination.query = `${e.latLng.lat()}, ${e.latLng.lng()}`;
              this.calculateAndDisplayRoute(directionsService, directionsRenderer);
          });

          directionsRenderer.setMap(map);
          // this.calculateAndDisplayRoute(directionsService, directionsRenderer);
      },
      calculateAndDisplayRoute(directionsService, directionsRenderer) {
          directionsService.route(
              {
                  origin: this.origin,
                  destination: this.destination,
                  travelMode: google.maps.TravelMode.DRIVING,
              },
              (response, status) => {
                  if (status === "OK") {
                      directionsRenderer.setDirections(response);
                  } else {
                      window.alert("Directions request failed due to " + status);
                  }
              }
          );
      }
  }
}
</script>

<style>
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
    }
    #map {
        width: 100%;
        height: 500px;
    }

</style>
