var mod = angular.module( 'coffeetech', [] )
mod.controller( 'ShopsCtrl', function( $scope ) {
  var github = new Github({} );
  var repo = github.getRepo( "xrd", "spa.coffeete.ch" ); 
  repo.contents( "gh-pages", "portland.json", function(err, data) { 
    $scope.shops = JSON.parse( data );
    $scope.$digest();
  }, false );
})
