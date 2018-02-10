"use strict";

app.controller("spreadsheetController", ["$scope", "$parse", "$http", "spreadsheetFactory",
    function($scope, $parse, $http, $spreadsheetFactory) {
        $scope.spreadsheetFactory = $spreadsheetFactory;
        $http.get('php/cells.php').then(function (response) {
            $scope.spreadsheetFactory.cells = response.data;
        });

        $scope.resolveReferenceToCells = function (cellContent, cell) {
            if (cellContent.charAt(0) != '='){
                return cellContent;
            }
			var string = cellContent,
				sum = "SUM",
				dif = "DIF",
				mul = "MUL",
				div = "DIV";
			if (cellContent.includes(sum))
			{
				cellContent = cellContent.replace("=SUM(", "=");
				cellContent = cellContent.replace(",", "+");
				cellContent = cellContent.replace(")", ""); 
			}
			else if (cellContent.includes(dif))
			{
				cellContent = cellContent.replace("=DIF(", "=");
				cellContent = cellContent.replace(",", "-");
				cellContent = cellContent.replace(")", "");
			}
			else if (cellContent.includes(mul))
			{
				cellContent = cellContent.replace("=MUL(", "=");
				cellContent = cellContent.replace(",", "*");
				cellContent = cellContent.replace(")", "");
			}
			else if (cellContent.includes(div))
			{
				cellContent = cellContent.replace("=DIV(", "=");
				cellContent = cellContent.replace(",", "/");
				cellContent = cellContent.replace(")", "");
			}
			
			
			console.log("cellContent" + cellContent);
            cellContent = cellContent.replace("=", "");
            var finalCellContent = cellContent;

            var matches = cellContent.match(/[A-Z]\d+/g);
            if (matches != null) {
                if(matches.indexOf(cell) > -1)
                    throw new Error("Error: reference to itself");

                for (var i = 0; i < matches.length; i++) {
                    var referenceCellContent = $scope.spreadsheetFactory.cells[matches[i]];
                    if (typeof referenceCellContent === 'undefined' || referenceCellContent === '') {
                        referenceCellContent = 0;
                    } else {
                        referenceCellContent = $scope.resolveReferenceToCells(referenceCellContent, matches[i]);
                    }

                    finalCellContent = finalCellContent.replace(matches[i], referenceCellContent);
                }
            }

            return finalCellContent;
        };

        $scope.computeCell = function(cell){
            var cellContent = $scope.spreadsheetFactory.cells[cell];

            if (typeof cellContent === 'undefined'){
                return cellContent;
            }		
		
            if (cellContent.charAt(0) == "=") {
				return calculate(cellContent, cell)
            }
            return cellContent;
        };

        $scope.updateCells = function(){
            $http.post('php/save.php', {json: $scope.spreadsheetFactory.cells})
                .then(
                    function(response){
                        console.log(response.data)
                    },
                    function(response){
                        console.log(response);
                    }
                );
        };
		
		
		function calculate(cellContent, cell) {
			try {
				var resolveFormula = $scope.resolveReferenceToCells(cellContent, cell);
				//console.log(resolveFormula);
				if(resolveFormula.indexOf("+") > -1 || resolveFormula.indexOf("+") > -1 || resolveFormula.indexOf("-") > -1 || resolveFormula.indexOf("*") > -1 || resolveFormula.indexOf("/") > -1){
					var result = $parse(resolveFormula)($scope);
					return (result) ? result : "err" ;
				}else {
					return resolveFormula;
				}
			}catch (err){
				console.log(err);
				return "err";
			}			
		}
        
    }]);