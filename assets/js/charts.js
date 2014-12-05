var environ = window.location.host;

if (environ === "localhost") {
  var baseurl = window.location.protocol + "//" + window.location.host + "/" + "balance/";
} else {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
}

var app = angular.module('ChartsApp', [])
  .controller('ChartsController', ['$scope', '$http', function($scope, $http) {


    $scope.getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $scope.combineCategories = function (balance) {

      var res = {};

      balance.forEach(function (el) {
        res[el.category] = (res[el.category])
          ? res[el.category] += +el.amount
          : +el.amount;
      })

      res = Object.keys(res).map(function (el) {
        return {value: res[el], color: $scope.getRandomColor(), highlight: "#FF5A5E", label: el};
      })
      return res;

    }

    $scope.sum = [];
    // GET BALANCE JSON
    $scope.loadBalance = function () {
     $http.get(baseurl+'index.php/balance/get_balance_json/').success(function(data) {

       $scope.accountData = [];

       if (typeof data === "undefined" || data == "null" || !data.length) {

         console.log("no data...")
         // DO SOMETHING IF NO DATA

       } else {
         //console.log("data loaded!");
         $scope.sum = $scope.combineCategories(data);


           var ctx = document.getElementById("chart-area").getContext("2d");
           console.log($scope.sum);
           window.myDoughnut = new Chart(ctx).Doughnut($scope.sum, {responsive : true, legend: true});
       }
     });
    };
    $scope.loadBalance();

}]);
