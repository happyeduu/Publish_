var App = angular.module("app_spoilage", []);
App.controller("Ctrl_spoilage", function ($filter, $scope, $http) {

    var _s = $scope;
    var _h = $http;
    function loadProductWithSpoilage(month) {
        _h.post('loadProductWithSpoilage', {month:month}).then(function (x) {
            _s.productWithSpoilage = [];
            _s.productWithSpoilage = x.data;
            console.log(x.data)
        })
   
    }
    loadProducts();
    function loadProducts() {
        _h.get('../product/loadProducts').then(function (g) {
            _s.listProducts = [];
            _s.listProducts = g.data;
        })
    }
    _s.curMonth = new Date().getMonth() + 1;
    loadProductWithSpoilage(_s.curMonth)
    _s.removeSpoilageByKg = function () {
        console.log("!", _s.productID, _s.txtKG, _s.txtDescription);
        if (_s.txtKG == undefined) {
            _s.txtKG = 0;
        }
        _h.post('removeSpoilageByKg', { prodID: _s.productID, txtKG: _s.txtKG, txtDescription: _s.txtDescription }).then(function (x) {
            swal('Success', 'Spoilage added', 'success')
            $("#exampleModalLabel").modal('hide');
            loadProductWithSpoilage();
        })
    }
});