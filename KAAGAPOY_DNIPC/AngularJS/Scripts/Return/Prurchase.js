var App = angular.module("App_return", []);
App.controller("Ctrl_return", function ($filter, $scope, $http) {

    var _s = $scope;
    var _h = $http;
    function loadLedger(param) {
        _h.post('loadLedger', {searchD: param}).then(function (d) {
            _s.ledgerDetails = [];
            _s.ledgerDetails = d.data;
            console.log(d.data)
        })
    };
    _s.searchLD = function () {
        loadLedger(_s.txtLedgerID);
    }
    _s.removeProduct = function (data) {
        swal({
            title: "Are you sure?",
            text: "This item will be remove.",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                console.log(data)

                _h.post("RemoveOrder", {
                    ledgerDetailsID: data.ledgerDetailsID,
                    productID: data.productID,
                    qtyToAdd: data.qty,
                    priceID: data.priceID
                }).then(function (d) {
                    loadLedger(_s.txtLedgerID)
                    //console.log(d.data)
                    swal("Updated!", "Your item is delete", "success");
                });

            } else {
                swal("Cancelled", "Your item is safe :)", "error");
            }
        })
    };
    _s.changeProduct = function (data) {
        _s.itemChoose = [[]];
        _s.itemChoose = [data];
        _s.ledgerDetailsID = data.ledgerDetailsID
        console.log(_s.itemChoose);
    }
    //$('.bd-example-modal-sm').on('hidden.bs.modal', function () {
    //    loadVegeProducts();
    //})
    loadVegeProducts();
    function loadVegeProducts() {
        _h.get('loadProducts').then(function (d) {
            _s.prodList = [];
            _s.prodList = d.data;
            console.log(d.data)
        });
    };
    _s.modalConfirmChange = function () {
        if (_s.txtSelectedPrice == null || _s.txtSelectedPrice == "" || _s.txtSelectedPrice == undefined) {
            return
        }
        console.log(_s.txtQTY);
        console.log(_s.txtSelectedPrice);
        console.log(_s.txtProductID);
        console.log(_s.ledgerDetailsID);
       
        _s.minusKGinOverAllStocks = _s.minusKGinOverAllStocks * _s.txtQTY
        console.log(_s.minusKGinOverAllStocks)
        _h.post('changeProduct', {
            qty: _s.txtQTY,
            priceID: _s.txtSelectedPrice,
            productID: _s.txtProductID,
            ledgerDetailsID: _s.ledgerDetailsID,
            minusKGinOverAllStocks: _s.minusKGinOverAllStocks
        }).then(function (d) {
            //console.log(d.data);
            swal("Return Success", "Susccessful update", "success");
            loadLedger(_s.txtLedgerID);
            $('.bd-example-modal-sm').modal('hide');
        })
    }
    _s.selectedProduct = function (per) {
        console.log(per, _s.prodList)
        _s.txtProductID = per.productID;
        var dataholder = _s.prodList.filter(function (d) {
            return d.productID == per.productID;
        });
        console.log(dataholder[0].pricesH, "dataholder");
        _s.viewPrices = dataholder[0].pricesH;
        _s.minusKGinOverAllStocks = dataholder[0].pricesH[0].producePacksInKG ;
        console.log(_s.minusKGinOverAllStocks);
    }
    _s.txtQTY = 0;
    _s.ngPriceChange = function () {
        _s.txtQTY = "";
        _s.txtSelectedPrice = null;
    }
    _s.qtyChange = function (selectedPrice) {
        _s.txtSelectedPrice = selectedPrice
        var dataholder = _s.viewPrices.filter(function (x) {
            return x.priceID == selectedPrice;
        })
        //console.log(dataholder)
        _s.minusKGinOverAllStocks = dataholder[0].producePacksInKG;
        _s.getPrice = dataholder[0].price;
        //_s.getTotal = _s.txtQTY * _s.getPrice
    }
});