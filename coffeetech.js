var mod = angular.module( 'coffeetech', [] );

mod.factory( 'Github', function() {
    return new Github({});
});

mod.factory( 'Geo', [ '$window', function( $window ) {
    return $window.navigator.geolocation;
} ] );

mod.controller( 'GithubCtrl', [ '$scope', 'Github', 'Geo', function( $scope, ghs, Geo ) {
    $scope.init = function() {
        $scope.getCurrentLocation( function( position ) {
            $scope.lat = position.coords.latitude || position.coords.lat;
            $scope.lng = position.coords.longitude || position.coords.lng;
            $scope.repo = ghs.getRepo( "xrd", "spa.coffeete.ch" ); // # <1>
            $scope.repo.read( "gh-pages", "cities.json", function(err, data) { // # <2>
                $scope.cities = JSON.parse( data ); // # <3>
                // Determine our current city
                $scope.detectCurrentCity();
                $scope.$apply();
            });
        });
    };

    $scope.getCurrentLocation = function( cb ) {
        if( undefined != Geo ) {
            Geo.getCurrentPosition( cb, $scope.geolocationError );
        } else {
            console.error('not supported');
        }
        
    };

    $scope.detectCurrentCity = function() {
        // Calculate the distance from our current position and use
        // this to determine which city we are closest to and within
        // 25 miles
        for( var i = 0; i < $scope.cities.length; i++ ) {
            var dist = $scope.calculateDistance( $scope.lat, $scope.lng, $scope.cities[i].lat, $scope.cities[i].lng );
            if( dist < 25 ) {
                $scope.city = $scope.cities[i];
                break;
            }
        }
    }

    toRad = function(Value) {
        return Value * Math.PI / 180;
    };
    
    $scope.calculateDistance = function( lat1, lon1, lat2, lon2 ) {
        R = 6371;
        dLat = toRad(lat2 - lat1);
        dLon = toRad(lon2 - lon1);
        lat1 = toRad(lat1);
        lat2 = toRad(lat2);
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c;
        return d;
    }

    $scope.loadCity = function( city ) {
        $scope.repo.read( "gh-pages", city + ".json", function(err, data) { // # <2>
            $scope.shops = JSON.parse( data ); // # <3>
            $scope.$apply();
        });
    }
    
    $scope.geolocationError = function( error ) {
        console.log( "Inside failure" );
    };
    

} ] );

