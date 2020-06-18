let map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});

let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

// Global variables
let markers = L.markerClusterGroup();
let data_markers = [];
let cuisine = [];
let foodKind = document.getElementById('kind_food_selector');

function onMapLoad() {

	// Ajax call to API
	$.ajax({
		type: "POST",
		url: 'http://localhost/mapa/api/apiRestaurants.php',
		data: String,
		success: null,
		dataType: 'json'
	})

		// Callbacks
		.done(function (data) {
			data_markers = data;
			console.log("Success");

			// Looping throw markers
			$.each(data_markers, function (index) {

				// Splitting strings (cuisines)
				data_markers[index].kind_food.split(',').forEach(function (item) {

					// Looping throw cuisines
					if (!cuisine.includes(item)) {

						// Pushing into cuisine array
						cuisine.push(item);

						// Generating option (select)
						if (index === 0) $(foodKind).html(new Option('Select cuisine Type', 'All'));
						$(foodKind).append(new Option(item));

						// Calling "render_to_map" function
						render_to_map(data_markers, 'All');
					}
				});
			});

			// Error message
		}).fail(function () {
			console.log('error');
		});
}

// Calling "render_to_map" function, when cuisine is selected
$(foodKind).on('change', function () {
	console.log(this.value);
	render_to_map(data_markers, this.value);
});

// Rendering to Map
function render_to_map(data_markers, filter) {

	// Clearing Markers
	markers.clearLayers();
	map.closePopup();

	// Adding Layer Group
	$.each(data_markers, function (index) {

		// Filtering and splitting strings (cuisines)
		if (filter === 'All' || data_markers[index].kind_food.split(',').includes(filter)) {

			// Adding the selected cuisine 
			let marker = L.marker([data_markers[index].lat, data_markers[index].lng])
				.bindPopup(`
					<strong style='color: #84b819'>
					${data_markers[index].name}: <br> 
					Address: ${data_markers[index].address}
				`);

			// Adding markers
			map.addLayer(markers);
			markers.addLayer(marker);
		}
	});
}    