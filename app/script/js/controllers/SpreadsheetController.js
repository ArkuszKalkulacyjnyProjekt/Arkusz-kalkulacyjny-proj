"use strict";

app.controller("spreadsheetController", ["$scope", "spreadsheetFactory",
    function($scope, $spreadsheetFactory) {
        $scope.spreadsheetFactory = $spreadsheetFactory;

        $scope.computeCell = function(cell){
            var cellContent = $scope.spreadsheetFactory.cells[cell];
            return cellContent;
        }
        
    }]);