<section role="main" class="outer-wrap" ng-app="MainApp" ng-controller="BalanceController">
  <nav class="navigation" role="navigation">
    <div class="row">
      <div class="small-5 columns">
        <a class="button tiny" ng-click="showEntryForm()">Add Item</a>
      </div>
      <div class="small-7 columns text-right">
        <h5 class="acnt-balance">{{balance | currency}}</h5>
      </div>
    </div>
  </nav>
  <div class="row date-filter collapse">
    <div class="small-5 columns">
      <input class="datepicker" type="text" placeholder="Start Date" ng-model="start_date">
    </div>
    <div class="small-5 columns">
      <input class="datepicker" type="text" placeholder="End Date" ng-model="end_date" data-value="getDate()">
    </div>
    <div class="small-2 columns">
      <button class="button tiny postfix" ng-click="filterDate(start_date, end_date)">Filter</button>
    </div>
  </div>
  <div class="row clear-fix">
    <div class="columns small-12 text-center">
      <div class="row" ng-include="getEntryForm()" ng-show="eform"></div>
    </div>
    <div class="columns small-12">
      <div class="row transaction {{item.type}}" ng-repeat="item in items = (account_items | orderBy: 'datetime':true)" ng-include="getBalanceTemplate()" ng-class="{ 'edit-form' : item.edit_item }">
      </div>
    </div>
  </div>
