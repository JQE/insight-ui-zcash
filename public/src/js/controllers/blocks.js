'use strict';

angular.module('insight.blocks').controller('BlocksController', 
  function($window, $scope, $rootScope, $routeParams, $location, Global, Block, Blocks, BlockByHeight, BlocksByIndex) {
  $scope.global = Global;
  $scope.loading = false;

  if ($routeParams.blockHeight) {
    BlockByHeight.get({
      blockHeight: $routeParams.blockHeight
    }, function(hash) {
      $location.path('/block/' + hash.blockHash);
    }, function() {
      $rootScope.flashMessage = 'Bad Request';
      $location.path('/');
    });
  }
  
  $scope.list = function() {
    $scope.loading = true;      

    $rootScope.titleDetail = $scope.Detail;
	if ($routeParams.high) {
		BlocksByIndex.get({
			high: $routeParams.high,
		}, function(res) {
			$scope.loading = false;
			$scope.blocks = res.blocks;
			$scope.pagination = res.pagination;
		});
	} else {
		Blocks.get({
		  high: $routeParams.high,
		  low: $routeParams.low
		}, function(res) {
		  $scope.loading = false;
		  $scope.blocks = res.blocks;
		  $scope.pagination = res.pagination;
		});
	}
  };
  

  $scope.findOne = function() {
    $scope.loading = true;

    Block.get({
      blockHash: $routeParams.blockHash
    }, function(block) {
      $rootScope.titleDetail = block.height;
      $rootScope.flashMessage = null;
      $scope.loading = false;
      $scope.block = block;
    }, function(e) {
      if (e.status === 400) {
        $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
      }
      else if (e.status === 503) {
        $rootScope.flashMessage = 'Backend Error. ' + e.data;
      }
      else {
        $rootScope.flashMessage = 'Block Not Found';
      }
      $location.path('/');
    });
  };

  $scope.params = $routeParams;

});
