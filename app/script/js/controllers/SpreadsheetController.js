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
				cellContent = cellContent.replaceAll(",", "+");
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
			
			
			
            cellContent = cellContent.replace("=", "");
            var finalCellContent = cellContent;

            var matches = cellContent.match(/[A-Z]\d+/g);
			console.log("matches" + matches);
            if (matches != null) {
                if(matches.indexOf(cell) > -1)
                    throw new Error("Error: reference to itself");
                for (var i = 0; i < matches.length; i++) {
					//console.log("matche[I]" + matches[i]);
					var matchedCell = matches[i];
					var row = parseInt(matchedCell.substr(1));
					if ($scope.spreadsheetFactory.columns.indexOf(matchedCell.charAt(0)) < 0 || $scope.spreadsheetFactory.rows.indexOf(row) < 0 )
						throw new Error("Error: reference to not existing cell");
                    var referenceCellContent = $scope.spreadsheetFactory.cells[matches[i]];
                    if (typeof referenceCellContent === 'undefined' || referenceCellContent === '') {
                        referenceCellContent = 0;
                    } else {
                        referenceCellContent = $scope.resolveReferenceToCells(referenceCellContent, matches[i]);
						referenceCellContent =  referenceCellContent;
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
				cellContent = $scope.calculate(cellContent, cell)
            }
            if (cellContent === "err"){
                $scope.turnRed()
            }else {
            	$scope.turnDefault()}


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
		
		$scope.calculate = function(cellContent, cell) {
			try {
				var resolveFormula = $scope.resolveReferenceToCells(cellContent, cell);
				console.log(resolveFormula);
				if(resolveFormula.indexOf("+") > -1 || resolveFormula.indexOf("-") > -1 || resolveFormula.indexOf("*") > -1 || resolveFormula.indexOf("/") > -1){
					var result = $parse(resolveFormula)($scope);
					return result ;
				}else {
					return resolveFormula;
				}
			}catch (err){
				console.log(err);
				return "err";
			}			
		};

        String.prototype.replaceAll = function(search, replace) {
            if (replace === undefined) {
                return this.toString();
            }
            return this.split(search).join(replace);
        };
        
    }]);