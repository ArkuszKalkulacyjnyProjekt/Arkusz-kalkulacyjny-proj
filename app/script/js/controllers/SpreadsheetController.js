"use strict";

app.controller("spreadsheetController", ["$scope", "spreadsheetFactory",
    function($scope, $parse, $spreadsheetFactory) {
        $scope.spreadsheetFactory = $spreadsheetFactory;

        
    }]);