import { MapElementFactory } from "vue2-google-maps";

export default MapElementFactory({
    name: "DirectionsRender",

    ctr() {
        // eslint-disable-next-line no-undef
        return google.maps.DirectionsRenderer;
    },

    events: ['directions_changed'],

    mappedProps: {},

    props: {
        origin: { type: Object },
        destination: { type: Object },
        travelMode: { type: String }
    },

    beforeCreate (options) {
        options.markerOptions = {
            draggable: true,
        }
    },

    afterCreate(DirectionsRender) {
        // eslint-disable-next-line no-undef
        let directionsService = new google.maps.DirectionsService();
        this.$watch(
            () => [this.origin, this.destination, this.travelMode],
            () => {
                let { origin, destination, travelMode } = this;
                if (!origin || !destination || !travelMode) return;

                directionsService.route(
                    {
                        origin,
                        destination,
                        travelMode
                    },
                    (response, status) => {
                        if (status !== "OK") return;
                        DirectionsRender.setDirections(response);
                    }
                );
            }
        );
    }
});