<script setup lang="ts">
  export let classes = ""; // TODO: find this
  import L from "leaflet";
  import { lat, lng } from "../stores/images";
  let elbiMap;
  let marker;

  let tileOut, tileIn;
  let x: number;
  let y: number;

  function createMap(container: any) {
    elbiMap = L.map(container, {
      zoomControl: false,
      preferCanvas: true,
      maxZoom: 22,
      minZoom: 15,
    })
      .setView([14.165525661643589, 121.24215602874757], 10)
      .on("click", (e) => console.log(e.latlng.lat, e.latlng.lng))
      .on("zoom", (e) => handleZoomChange(e.target._zoom));

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(elbiMap);
    addMarker();
  }

  function handleZoomChange(level: number) {
    if (level < 19 && tileIn !== undefined) {
      tileOut = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(elbiMap);
      elbiMap.removeLayer(tileIn);
      tileIn = undefined;
    } else if (level >= 19 && tileOut !== undefined) {
      tileIn = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 22,
      }).addTo(elbiMap);
      elbiMap.removeLayer(tileOut);
      tileOut = undefined;
    }
  }

  $: {
    removeMarker();
    x = $lat;
    y = $lng;
    addMarker();
  }

  const removeMarker = () => marker?.removeFrom(elbiMap);
  const addMarker = () => {
    if (x && y && elbiMap) {
      marker = L.marker([x, y]).addTo(elbiMap);
      elbiMap.setView([x, y], 10);
    }
  };
</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
{#if x && y}
  <div class="map {classes} h-40" id="map" use:createMap />
{:else}
  <p class="text-center">No Location</p>
{/if}

<style>
  .map {
    width: 100%;
    /* height: 100%; */
  }
</style>
