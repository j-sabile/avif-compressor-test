<script lang="ts">
  export let show: boolean;
  export let dialog;
  import { images, currImg } from "../../stores/images";
  import { onMount } from "svelte";
  import L from "leaflet";

  let map: L.Map;
  let marker: L.Marker;

  let inputValue = {
    lat: "",
    lng: "",
  };

  $: {
    inputValue.lat = $currImg.newLat ?? "";
    inputValue.lng = $currImg.newLng ?? "";
    addMarker($currImg.newLat, $currImg.newLng);
  }

  onMount(() => {
    map = L.map("map").setView([14.167634216839854, 121.24323035411682], 19);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e) => addMarker(e.latlng.lat, e.latlng.lng));
  });

  const addMarker = (lat: any, lng: any) => {
    marker?.remove();

    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!map || isNaN(latNum) || isNaN(lngNum)) return;
    marker = L.marker([lat, lng]).addTo(map);
    map.panTo([lat, lng]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    images.changeLocationCurrImg(inputValue.lat, inputValue.lng);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    show = false;
    dialog.close();
  };

  const handleInputChange = (event: Event, type: string) => {
    const val = (event.target as HTMLInputElement).value;
    if (type === "lat" && val.includes(", ")) {
      const temp = val.split(", ");
      inputValue.lat = temp[0];
      inputValue.lng = temp[1];
    } else inputValue[type] = val;
    if (map) addMarker(Number(inputValue.lat), Number(inputValue.lng));
  };
</script>

<form class="flex flex-col justify-center items-center gap-6 p-4" on:submit={handleSave}>
  <h2 class="font-medium text-3xl text-start w-full">Edit Location</h2>
  <div class="flex flex-row items-center gap-4 text-lg w-full">
    <label for="lat" class="">Latitude:</label>
    <input
      type="text"
      id="lat"
      value={inputValue.lat}
      on:input={(e) => handleInputChange(e, "lat")}
      class="w-72 px-4 py-1 border-[#DDD] border rounded"
    />
  </div>
  <div class="flex flex-row items-center gap-4 text-lg w-full">
    <label for="lng" class="">Longitude:</label>
    <input
      type="text"
      id="lng"
      value={inputValue.lng}
      on:input={(e) => handleInputChange(e, "lng")}
      class="w-72 px-4 py-1 border-[#DDD] border rounded"
    />
  </div>
  <div style="width:100%;height:300px;postion:relative">
    <div id="map"></div>
  </div>
  <div class="flex flex-row justify-end items-start gap-2 w-full">
    <button type="button" class="font-semibold text-lg px-6 py-2 rounded" on:click={handleCloseModal}>Cancel</button>
    <button type="submit" class="bg-white text-black font-semibold text-lg px-6 py-2 rounded" on:click={handleSave}>Save</button>
  </div>
</form>

<style>
  #map {
    height: 300px;
    width: 100%;
    border-radius: 8px;
  }
</style>
