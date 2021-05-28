<template>
  <div id="app">
      <input
              id="start-input"
              class="controls"
              type="text"
              placeholder="Sart position"
      />
      <input
              id="end-input"
              class="controls"
              type="text"
              placeholder="End position"
      />
      <div id="map"></div>
  </div>
</template>

<script>

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

                this.origin.query = `${position.coords.latitude}, ${position.coords.longitude}`;
                this.initMap();
            })
      }
    },
      initMap() {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({draggable: true});

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

          const start = document.getElementById("start-input");
          const end = document.getElementById("end-input");
          const startSearchBox = new google.maps.places.SearchBox(start);
          const endSearchBox = new google.maps.places.SearchBox(end);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(start);
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(end);
          // Bias the SearchBox results towards current map's viewport.
          map.addListener("bounds_changed", () => {
              startSearchBox.setBounds(map.getBounds());
              endSearchBox.setBounds(map.getBounds());
          });

          startSearchBox.addListener("places_changed", () => {
              const places = startSearchBox.getPlaces();
              this.origin.query = `${places[0].geometry.location.lat()}, ${places[0].geometry.location.lng()}`;
              this.calculateAndDisplayRoute(directionsService, directionsRenderer);

              if (places.length == 0) {
                  return;
              }

              // For each place, get the icon, name and location.
              const bounds = new google.maps.LatLngBounds();
              places.forEach((place) => {
                  if (!place.geometry || !place.geometry.location) {
                      console.log("Returned place contains no geometry");
                      return;
                  }
                  const icon = {
                      url: place.icon,
                      size: new google.maps.Size(71, 71),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(17, 34),
                      scaledSize: new google.maps.Size(25, 25),
                  };

                  if (place.geometry.viewport) {
                      // Only geocodes have viewport.
                      bounds.union(place.geometry.viewport);
                  } else {
                      bounds.extend(place.geometry.location);
                  }
              });
              map.fitBounds(bounds);
          });
          endSearchBox.addListener("places_changed", () => {
              const places = endSearchBox.getPlaces();

              this.destination.query = `${places[0].geometry.location.lat()}, ${places[0].geometry.location.lng()}`;
              this.calculateAndDisplayRoute(directionsService, directionsRenderer);

              if (places.length == 0) {
                  return;
              }

              // For each place, get the icon, name and location.
              const bounds = new google.maps.LatLngBounds();
              places.forEach((place) => {
                  if (!place.geometry || !place.geometry.location) {
                      console.log("Returned place contains no geometry");
                      return;
                  }
                  const icon = {
                      url: place.icon,
                      size: new google.maps.Size(71, 71),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(17, 34),
                      scaledSize: new google.maps.Size(25, 25),
                  };

                  if (place.geometry.viewport) {
                      // Only geocodes have viewport.
                      bounds.union(place.geometry.viewport);
                  } else {
                      bounds.extend(place.geometry.location);
                  }
              });
              map.fitBounds(bounds);
          });
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
      },
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
