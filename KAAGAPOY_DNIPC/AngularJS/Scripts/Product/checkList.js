var App = angular.module("app_checkList", []);
App.controller("Ctrl_checkList", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;

    console.log("WEA")
    _s.showPrintData = false;
    _s.printPage = function () {
        _s.showPrintData = true;
        _s.hideWhenPrint = true;
        //window.print();
        console.log("asd")
    };
    test();
    function test() {
        console.log("DASDSADSADASDASDASDASDAS")
    }
});