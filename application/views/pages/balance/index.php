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
  <div class="row clear-fix">
    <div class="columns small-12 text-center">
      <div class="row" ng-include="getEntryForm()" ng-show="eform"></div>
    </div>
    <div class="columns small-12">
      <div class="row transaction {{item.type}}" ng-repeat="item in items = (account_items | orderBy: 'datetime':true)" ng-include="getBalanceTemplate()" ng-class="{ 'edit-form' : item.edit_item }">
      </div>
    </div>
  </div>
