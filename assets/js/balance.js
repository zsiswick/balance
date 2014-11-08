var environ = window.location.host;

if (environ === "localhost") {
  var baseurl = window.location.protocol + "//" + window.location.host + "/" + "balance/";
} else {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
}


//var baseurl = window.location.protocol + "//" + window.location.host + "/" + "balance/";
var accountBalance = 0;

var app = angular.module('balanceApp', [])
  .controller('BalanceController', ['$scope', '$http', function($scope, $http) {

    $scope.getDate = function () {
      var currentDate = new Date();
      var d = currentDate.getDate();
      day = (d < 10 ? '0' : '') + d;
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      return year + "-" + month + "-" + day;
    }

    $scope.categories = [
       {name:'ATM Withdraw', fa:'fa-credit-card', color:'magenta'},
       {name:'Clothing', fa:'fa-gift', color:'purple'},
       {name:'Deposit', fa:'fa-money', color:'green'},
       {name:'Entertainment', fa:'fa-headphones', color:'black'},
       {name:'Fee', fa:'fa-credit-card', color:'magenta'},
       {name:'Groceries', fa:'fa-shopping-cart', color:'grass'},
       {name:'Household', fa:'fa-home', color:'orange'},
       {name:'Medical', fa:'fa-medkit', color:'blood'},
       {name:'Payment', fa:'fa-money', color:'green'},
       {name:'Personal', fa:'fa-child', color:'blue'},
       {name:'Travel', fa:'fa-car', color:'cyan'},
       {name:'Utility', fa:'fa-bolt', color:'yellow'}
     ];

    $scope.filterCat = function (catName, prop) {
      var search = $scope.categories.filter(function (cat) { return cat.name == catName });
      //console.log(search[0][prop]);
      return search[0][prop];
    }


    // GET BALANCE JSON
    $scope.loadBalance = function () {
     $http.get(baseurl+'index.php/balance/get_balance_json/').success(function(data) {
       if (typeof data === "undefined" || data == "null" || !data.length) {
         console.log("no data loaded, sample data used...");

         $scope.account_items = [];

         $scope.account_items.unshift({date: $scope.getDate(), description: "Sample Deposit", category: "Deposit", amount: "327.56", type: "credit", balance: $scope.accountBalance(0, 327.56, "credit") });

          $scope.defaultCategory = $scope.categories[2];

       } else {
         console.log("data loaded!");
         console.log(data);
         $scope.account_items = data;
         $scope.calcAccountBalance();
       }
     });
    };
    $scope.loadBalance(); //initial load

    $scope.updateItem = function(id, date, amount, type, description, category, update) {

      category = typeof category !== 'undefined' ? category : 'Fee';
      update = typeof update !== 'undefined' ? update : 'false'; // set this to false by default
      id = typeof id !== 'undefined' ? id : null; // set this to false by default

      $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: baseurl+'index.php/balance/set_item',
        method: "POST",
        data: $.param({
          "id" : id,
          "date" : date,
          "amount" : amount,
          "type" : type,
          "description" : description,
          "category" : category,
          "update" : update
        }),
      })
      .success(function(data) {
        console.log(data);
      });
    };

    $scope.addItemRow = function(date, amount, type, description, category) {

      $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: baseurl+'index.php/balance/set_item',
        method: "POST",
        data: $.param({
          "date" : date,
          "amount" : amount,
          "type" : type,
          "description" : description,
          "category" : category
        }),
      })
      .success(function(data) {

        iid = String(data.id);
        data.id = iid;
        $scope.account_items.push(data);
        $scope.calcAccountBalance();

      });
    };

    $scope.accountBalance = function (prevAmount, amount, type) {

      if (type == "credit") {
        num = prevAmount + amount;
      } else {
        num = prevAmount - amount;
      }
      return num;
    }

    $scope.getBalanceTemplate = function() {
      return baseurl+'assets/html/balance-row.html';
    }

    $scope.getEntryForm = function() {
      return baseurl+'assets/html/entry-form.html';
    }

    $scope.showEntryForm = function() {
      $scope.eform = true;
    }

    $scope.hideEntryForm = function() {
      $scope.eform = false;
    }

    $scope.showEditItem = function(item){
      item.edit_item = true;
    }

    $scope.hideEditItem = function(item){
      item.edit_item = false;
    }

    $scope.addEntry = function(idescription, icategory, iamount, idate, ttype) {

      console.log(idescription);

      ttype = typeof ttype !== 'undefined' ? ttype : 'debit'; // set to debit by default

      $scope.calcAccountBalance();
      $scope.addItemRow(idate, iamount, ttype, idescription, icategory);
    }

    $scope.calcAccountBalance = function () {

      for (index = 0; index < $scope.account_items.length; ++index) {

        if ( index == 0 ) {

          if ($scope.account_items[index].type == "credit") {
            num = +accountBalance + +$scope.account_items[index].amount;
          } else {
            num = +accountBalance - +$scope.account_items[index].amount;
          }

        } else {
          if ($scope.account_items[index].type == "credit") {
            num = +$scope.account_items[index - 1].balance + +$scope.account_items[index].amount;
          } else {
            num = +$scope.account_items[index - 1].balance - +$scope.account_items[index].amount;
          }
        }
        num = parseFloat((num * 100) / 100).toFixed(2);
        $scope.account_items[index].balance = num;
      }
    }

    $scope.editEntry = function(idescription, icategory, iamount, idate, ttype, item) {

      ttype = typeof ttype !== 'undefined' ? ttype : 'debit'; // set to debit by default

      $.extend(true, item, {
        date: idate,
        description: idescription,
        category: icategory,
        amount: parseFloat((iamount * 100) / 100).toFixed(2),
        type: ttype
      });
      console.log($scope.account_items);
      $scope.updateItem(item.id, idate, iamount, ttype, idescription, icategory, "true");
      $scope.calcAccountBalance();
    }

}]);

app.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return;
      }

      ngModelCtrl.$parsers.push(function(val) {
        var clean = val.replace( /[^0-9.]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});
