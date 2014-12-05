$(document).foundation();

var environ = window.location.host;

if (environ === "localhost") {
  var baseurl = window.location.protocol + "//" + window.location.host + "/" + "balance/";
} else {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
}

var app = angular.module('MainApp', ['ngRoute'])
  .controller('BalanceController', ['$scope', '$http', function($scope, $http) {

    $scope.balance = 0;

    $scope.getTime = function () {
      var currentDate = new Date();
      var hours = ((currentDate.getHours() < 10)?"0":"") + currentDate.getHours();
      var minutes = ((currentDate.getMinutes() < 10)?"0":"") + currentDate.getMinutes();
      var seconds = ((currentDate.getSeconds() < 10)?"0":"") + currentDate.getSeconds();

      return hours + ":" + minutes + ":" + seconds;
    }

    $scope.getDate = function () {
      var currentDate = new Date();
      var d = currentDate.getDate();
      day = (d < 10 ? '0' : '') + d;
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      var hours = ((currentDate.getHours() < 10)?"0":"") + currentDate.getHours();
      var minutes = ((currentDate.getMinutes() < 10)?"0":"") + currentDate.getMinutes();
      var seconds = ((currentDate.getSeconds() < 10)?"0":"") + currentDate.getSeconds();

      return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
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
       {name:'Payment', fa:'fa-money', color:'magenta'},
       {name:'Personal', fa:'fa-child', color:'blue'},
       {name:'Travel', fa:'fa-car', color:'cyan'},
       {name:'Utility', fa:'fa-bolt', color:'yellow'}
     ];

    $scope.filterCat = function (catName, prop) {
      var search = $scope.categories.filter(function (cat) { return cat.name == catName });
      return search[0][prop];
    }

    // TODO Move function to balance model
    $scope.calcAccountBalance = function (items) {

      $scope.balance = 0;

      for (var index = items.length; index--;) {

        if (items[index].type == "debit") {
          $scope.balance -= +items[index].amount;
          items[index].balance = parseFloat(($scope.balance * 100) / 100).toFixed(2);
        }
        if (items[index].type == "credit") {
          $scope.balance += +items[index].amount;
          items[index].balance = parseFloat(($scope.balance * 100) / 100).toFixed(2);
        }
      }
    }

    // GET BALANCE JSON
    $scope.loadBalance = function () {
     $http.get(baseurl+'index.php/balance/get_balance_json/').success(function(data) {

       $scope.defaultCategory = $scope.categories[2];
       $scope.account_items = [];

       if (typeof data === "undefined" || data == "null" || !data.length) {
         console.log("no data loaded, sample data used...");
         $scope.account_items.pop({date: $scope.getDate(), description: "Sample Deposit", category: "Deposit", amount: "327.56", type: "credit", balance: $scope.accountBalance(0, "327.56", "credit") });

       } else {
         console.log("data loaded!");
         console.log(data);
         $scope.account_items = data;
         $scope.calcAccountBalance($scope.account_items);
       }
     });
    };
    $scope.loadBalance(); //initial load

    $scope.updateItem = function(id, amount, type, description, note, category, update, datetime) {

      category = typeof category !== 'undefined' ? category : 'Fee';
      update = typeof update !== 'undefined' ? update : 'false'; // set this to false by default
      id = typeof id !== 'undefined' ? id : null; // set this to false by default

      $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: baseurl+'index.php/balance/set_item',
        method: "POST",
        data: $.param({
          "id" : id,
          "amount" : amount,
          "type" : type,
          "description" : description,
          "note" : note,
          "category" : category,
          "update" : update,
          "datetime" : datetime + " " + $scope.getTime()
        }),
      })
      .success(function(data) {
        //console.log(data);
      });
    };

    $scope.addItemRow = function(amount, type, description, category, datetime, note, items) {

      obj = {"datetime": datetime + " " + $scope.getTime(), "description": description, "category": category, "amount": amount, "type": type};
      $scope.account_items.unshift(obj);
      items.unshift(obj);
      $scope.calcAccountBalance(items);

      $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: baseurl+'index.php/balance/set_item',
        method: "POST",
        data: $.param({
          "amount" : amount,
          "type" : type,
          "description" : description,
          "note" : note,
          "category" : category,
          "datetime" : datetime + " " + $scope.getTime(),
        }),
      })
      .success(function(data) {

        iid = String(data.id);
        data.id = iid;
        items[0].id = iid;
        $scope.account_items[0].id = iid;
      });
    };

    $scope.dtime = $scope.getDate();

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

    $scope.addEntry = function(idescription, icategory, iamount, ttype, datetime, note, items) {
      ttype = typeof ttype !== 'undefined' ? ttype : 'debit'; // set to debit by default
      $scope.addItemRow(iamount, ttype, idescription, icategory, datetime, note, items);
    }

    $scope.editEntry = function(item, items, datetime) {

      ttype = typeof ttype !== 'undefined' ? ttype : 'debit'; // set to debit by default

      $.extend(true, item, {
        description: item.description,
        category: item.category,
        amount: parseFloat((item.amount * 100) / 100).toFixed(2),
        type: item.type,
        datetime: datetime + " " + $scope.getTime()
      });
      $scope.updateItem(item.id, item.amount, item.type, item.description, item.note, item.category, "true", datetime);
      $scope.calcAccountBalance(items);
    }

    $scope.deleteItem = function(item, index, items) {

      $scope.account_items.splice(index, 1);
      items.splice(index, 1);
      $scope.calcAccountBalance(items);

      $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: baseurl+'index.php/balance/delete_item',
        method: "POST",
        data: $.param({
          "id" : item.id
        }),
      })
      .success(function(data) {
        // silently succeed...
      });
    }

    $scope.filterDate = function(start_date, end_date) {
      $http.get(baseurl+'index.php/balance/get_balance_by_date/'+start_date+'/'+end_date).success(function(data) {

        $scope.defaultCategory = $scope.categories[2];
        $scope.account_items = [];

        console.log(data);
        $scope.account_items = data;
        $scope.calcAccountBalance($scope.account_items);
      });
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
