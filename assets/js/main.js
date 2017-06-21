function initMap() {

    /***************** Inicializando el mapa ********************/
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -33.5157491, lng: -70.600865 },
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false
    });


    /***************** Agregando autocompletado de primer input ********************/
    var input = document.getElementById('first-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    /***************** Agregando autocompletado del segundo input ********************/
    var input = document.getElementById('second-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    /***************** Evento para encontrar la localización actual ********************/

    //document.getElementById('encuentrame').addEventListener('click', buscar);


    function buscar() {
        if (navigator.geolocation) {
            // Permite al usuario obtener su ubicacion actual
            navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
        }
    }


    // Permite pedir la ubicación actual cuando la pagina esta cargada
    // window.addEventListener("load", buscar);

    var latitud, longitud;
    var funcionExito = function(posicion) {
        latitud = posicion.coords.latitude;
        longitud = posicion.coords.longitude;

        var miUbicacion = new google.maps.Marker({
            position: { lat: latitud, lng: longitud },
            animation: google.maps.Animation.DROP,
            map: map
        });

        console.info('Exito yeah');
        var miUbicacion = ({
            position: { lat: latitud, lng: longitud },
            animation: google.maps.Animation.DROP,
            map: map
        });

        map.setZoom(17);
        map.setCenter({ lat: latitud, lng: longitud });
    }

    var funcionError = function(error) {
        alert('Tenemos un problema con encontrar tu ubicación');
    }

    /***************** Para trazar la ruta ********************/
    var directionsService = new google.maps.DirectionsService();
    // suppressMarkers: true -> suprimir los iconos por defecto
    var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: false });

    document.getElementById('first-input').addEventListener('change', onChangeHandler);
    document.getElementById('second-input').addEventListener('change', onChangeHandler);

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
            origin: document.getElementById('first-input').value,
            destination: document.getElementById('second-input').value,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var leg = response.routes[0].legs[0];
                makeMarker(leg.start_location, icons.start, '');
                makeMarker(leg.end_location, icons.end, '');
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    directionsDisplay.setMap(map);

    var onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    document.getElementById('btn-ruta').addEventListener('click', onChangeHandler);

    /***************** Para cambiar el icono ********************/
    function makeMarker(position, icon, title) {
        new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: title
        });
    }

};