var App = angular.module("app_selling", []);
App.controller("Ctrl_selling", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;
    loadVegeProducts();
    function loadVegeProducts() {
        _h.get('../product/loadProducts').then(function (d) {
            console.log(d.data, "vege products")
            _s.vegeList = [];
            var dataholder = d.data.filter(function (x) {
                return x.categoryList.categoryID == 2 && x.stocks > 0
            })
            _s.vegeList = dataholder;
        });
    };
    _s.stockOfCom = 0;
    _s.unitOfCom ="KG"
    _s.getCommodity = function (per) {
        var holder = _s.vegeList.filter(function (d) {
            return d.productID == per.productID
        })
        _s.stockOfCom = holder[0].stocks
        _s.unitOfCom = holder[0].unit
       
        _s.f.txtKGresiko = "";
        _s.f.txtResiko = "";
        _s.f.txtAmount = "";
        _s.f.txtDateResika = "";
        _s.f.classType = "";
    }
    _s.resika = function () {
        console.log("!", _s.prod_id, _s.commodityId, _s.txtKGresika, _s.txtPriceresika, _s.txtResika, _s.txtDescriptionresika)

        //if (_s.txtKGresika == undefined) {
        //    _s.txtKGresika = 0;
        //    _s.txtResika = 0;
        //}
        _h.post('resika', {
            prodID: _s.prod_id, txtKGresika: _s.txtKGresika + _s.txtResika,
            txtPriceresika: _s.txtPriceresika, txtResika: _s.txtResika,
            txtDescriptionresika: _s.txtDescriptionresika,
            txtDateResika: _s.txtDateResika
        }).then(function (x) {
            swal('Success', 'Resiko added', 'success')
            _s.txtKGresika = null;
            _s.txtPriceresika = null;
            _s.txtResika = null;
            _s.txtDescriptionresika = null;

            $("#resika").modal('hide');
            loadVegeProducts();
        })
    }
    _s.getSum = function (items, prop) {
        if (items == null) {
            return 0;
        }
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };
    _s.List_bulkResiko = [];
    var tempArr = [];
    _s.addResiko = function () {
        var commodityName = $("#selectCom option:selected").text();
        var objRe_arrange = {
            productName: commodityName,
            productID: _s.f.productID,
            txtKGresiko: _s.f.txtKGresiko,
            txtResiko: _s.f.txtResiko,
            txtAmount: _s.f.txtAmount,
            txtDateResika: _s.f.txtDateResika,
            kg_price: _s.f.txtKGresiko * _s.f.txtAmount,
            classType: _s.f.classType,
            minusKG: _s.f.txtKGresiko + _s.f.txtResiko
        }
        if (_s.List_bulkResiko.length > 0) {
            if (_s.List_bulkResiko[0].productID != _s.f.productID) {
                swal('Warning', 'Unable to add items becuase it is not the same in previous one.', 'warning')
            }
            else {
                _s.List_bulkResiko.push(objRe_arrange)
             
                _s.totalPrice_resiko = _s.getSum(_s.List_bulkResiko, 'kg_price')
                _s.stockOfCom -= _s.f.txtKGresiko + _s.f.txtResiko
                _s.f.txtKGresiko = "";
                _s.f.txtResiko = "";
            }
        }
        else {
                _s.List_bulkResiko.push(objRe_arrange);
               
                _s.totalPrice_resiko = _s.getSum(_s.List_bulkResiko, 'kg_price')
                _s.stockOfCom -= _s.f.txtKGresiko + _s.f.txtResiko
                _s.f.txtKGresiko = "";
                _s.f.txtResiko = "";
        }
    }
    _s.totalPrice_resiko = 0;
    _s.removeItem = function (index,per) {
        _s.List_bulkResiko.splice(index, 1);
        _s.totalPrice_resiko = _s.getSum(_s.List_bulkResiko, 'kg_price')
        _s.stockOfCom = _s.stockOfCom + per.txtKGresiko + per.txtResiko
        console.log(index)
    }
    _s.bulkSelling = function () {
        console.log(_s.List_bulkResiko)
        _h.post('bulkResiko', { br: _s.List_bulkResiko }).then(function (x) {
            swal('Success', 'Resiko added', 'success')
            loadVegeProducts();
            _s.List_bulkResiko = [];
            _s.totalPrice_resiko = 0;
        });
    }
});