var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];

let foodKind = document.getElementById('kind_food_selector');

function onMapLoad() {

	// Fetching from API
	fetch("http://localhost/mapa/api/apiRestaurants.php").then(response => {
		if (!response.ok) {
			throw Error('ERROR');
		}
		return response.json();
	}).then(data => {
		const html = data.map(apiRestaurants => {

			// Adding markers
			markers.addLayer(L.marker([apiRestaurants.lat, apiRestaurants.lng])).addTo(map);

			map.addLayer(markers);
			// Adding info boxes
			markers.bindPopup(`${apiRestaurants.name}: <br>${apiRestaurants.address}`);

			// Adding to array
			data_markers.push(apiRestaurants);

			return apiRestaurants.kind_food;
		});

		// Getting options
		for (let option in html) {
			let newOption = document.createElement('option');
			let pair = html[option];
			newOption.innerHTML = pair;
			foodKind.options.add(newOption);
		}

	}).catch(error => {
		console.log(error);
	});

}

$('#kind_food_selector').on('change', function () {
	// console.log(this.value);
	render_to_map(data_markers, this.value);
});



function render_to_map(data_markers, filter) {

	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/


}