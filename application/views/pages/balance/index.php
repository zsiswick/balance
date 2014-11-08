<div class="row" ng-app="balanceApp" ng-controller="BalanceController">
  <div class="columns small-12 text-center">
    <a class="button" ng-click="showEntryForm()">Add Entry</a>
    <div class="row" ng-include="getEntryForm()" ng-show="eform"></div>
  </div>
  <div class="columns small-12">
    <div class="row transaction {{item.type}}" ng-repeat="item in account_items" ng-include="getBalanceTemplate()"></div>
  </div>
</div>
