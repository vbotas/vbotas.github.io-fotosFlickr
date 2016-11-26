var busqueda = function() {
	var entrada = document.getElementById('direccion');

	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' +
		entrada.value, function(data) {
			var elementos = [];

		$.each(data, function(key,val) {
			elementos.push(
				"<li><a href='#' onclick='elijeDireccion(" +
				val.lat + ", " + val.lon + ", \"" + val.type + 
				"\");return false;'>" + val.display_name + '</a></li>');
		});
		
		console.log(elementos);
		$('#resultados').empty();
		$('#fotos').empty();

		if (elementos.length != 0) {
			$('<p>', {html: 'Resultados encontrados: '}).appendTo('#resultados');
			$('<ol>', {
				'class': 'nueva-lista',
				html: elementos.join('')}).appendTo('#resultados');
		} else {
			$('<p>', {html: 'No se encontraron resultados'}).appendTo('#resultados');
		}
		$('<p>', {html: '<button id="cerrar" type="button">Cerrar</buttton>'}).appendTo('#resultados');
		$('#cerrar').click(function () {
			$('#resultados').empty();
			$('#fotos').empty();
		});
		fotos_flickr();
	});
};

var elijeDireccion = function (lat, lng, type) {

	var localizacion = new L.LatLng(lat, lng);
	console.log(localizacion);
	console.log(mapa);
	mapa.panTo(localizacion);
};

var fotos_flickr = function () {
	var entrada_fotos = document.getElementById('#fotos');
	var ciudad = $('#direccion').val();
	$.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?', {
		tags: ciudad,
		tagmode: "any",
		format: "json"}).done(function( data ) {

			$.each( data.items, function( i, item ) {
				$( "<img>" ).attr( "src", item.media.m ).appendTo( "#fotos" );
				if ( i === 10 ) {
					return false;
				};
			});
		});
};

$(document).ready(function() {

	mapa = L.map('mapa');
	console.log(mapa);

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    }).addTo(mapa);
    console.log('El mapa es: ' + mapa);

    mapa.locate({setView: true, maxZoom: 15});

    var localizacion_encontrada = function (e) {
    	var radio = e.accuracy;
    	L.marker(e.latlng).addTo(mapa)
    		.bindPopup('Estás a: ' + radio + ' metros de este punto.<br />' + 'Latitud: ' + e.latlng.lat + '<br />Longitud: ' + e.latlng.lng)
    		.openPopup();

    	L.circle(e.latlng, radio).addTo(mapa);
    }

    var error_localizacion = function (e) {
    	alert(e.message);
    }

    mapa.on('locationfound', localizacion_encontrada);
    mapa.on('locationerror', error_localizacion);

    var mostrar_popup = function(e) {
    	L.popup()
    		.setLatLng(e.latlng)
    		.setContent('Coodernadas: <br />' + 'Latitud: ' + e.latlng.lat + '<br />Longitud: ' + e.latlng.lng)
    		.openOn(mapa);
    console.log(e.latlng);
    }
    mapa.on('click', mostrar_popup);

    $('#botonBuscar').click(function () {
    	var ciudad = $('#direccion').val();
    	console.log(ciudad);
    	busqueda();
    })
});