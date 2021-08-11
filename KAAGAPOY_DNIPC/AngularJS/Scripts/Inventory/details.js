var App = angular.module("App_details", []).filter('sumByColumn', function () {
    return function (collection, column) {
        var total = 0;

        collection.forEach(function (item) {
            total += parseInt(item[column]);
        });

        return total;
    };
});
App.filter('monthname', ['$filter', function ($filter) {
    return function (month) {
        return $filter("date")(new Date(0, month), 'MMMM');
    }
}]);
App.controller("Ctrl_details", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;
    //App
    var d = new Date();
    var n = d.getMonth();
    _s.MonthToday = n
    loadVegeProducts();
    function loadVegeProducts() {
        _h.get('../product/loadProducts').then(function (d) {
            console.log(d.data, "vege products")
            _s.vegeList = [];
            _s.vegeList = d.data;
        });
    };
    _s.toUpdateModalOpen = function (vegeList, priceH) {


        _s.vegeList_productName = vegeList.productName;
        _s.vegeList_stocks = vegeList.stocks + " " + vegeList.unit;
        _s.vegeList_productID = vegeList.productID;
        //_s.vegeList_spoilage = vegeList.spoilage;
        _s.vegelist_stocksOnly = vegeList.stocks;

        _s.priceH_price = priceH.price;
        _s.priceH_producePacks = priceH.producePacks + " " + priceH.unit
        _s.priceH_spoilageInPacks = priceH.spoilageInPacks
        _s.priceH_priceID = priceH.priceID;
        _s.priceH_producePacksInKG = priceH.producePacksInKG;
    }
    _s.removePacks = function (vegeList, priceH) {
        _s.Remove_priceH_priceID = priceH.priceID;
        _s.Remove_vegeList_productID = vegeList.productID;
        _s.Remove_price_producePacksInKG = priceH.producePacksInKG;
        _s.Remove_vegeList_stocks = vegeList.stocks;
    }
    _s.updateStocks = function () {
        _s.producePacksEmpty = 0;
        _s.priceH_producePacksInKG = 0;
        if (_s.txtProductPacks == undefined) {
            swal("ERROR", "Please input necessary fields", "info");
            return;
        }
        if (_s.txtProductUnit == undefined) {
            swal("ERROR", "Please select units", "info");
            return
      
            //else (_s.txtProductPacks > _s.vegelist_stocksOnly) {
            //    swal("ERROR", "You input data greater than actual STOCKS", "info");
                
            //}
        }
        if (_s.txtSpoilagePacks == undefined) {
            _s.txtSpoilagePacks = 0;
        }
        if (_s.txtProductInKG == undefined) {
            //swal("ERROR", "Please input necessary fields", "info");
            //return;
            _s.txtProductInKG = 0;
        }
       
        if (_s.txtProductUnit == "PCK") {
                if (_s.priceH_producePacksInKG == null || _s.priceH_producePacksInKG == 0)
                {
                    _s.priceH_producePacksInKG = _s.txtProductInKG;
                    _s.producePacksEmpty = _s.txtProductPacks * _s.priceH_producePacksInKG;
                }
            console.log(_s.txtProductPacks, "PCK ko bay", _s.txtProductInKG, _s.txtProductPacks * _s.priceH_producePacksInKG, _s.producePacksEmpty)
        }
        if (_s.producePacksEmpty > _s.vegelist_stocksOnly) {
            swal("ERROR", "You input data greater than actual STOCKS [" + _s.vegelist_stocksOnly + "] Current stocks, " + "Total produce by the data you input [" + _s.producePacksEmpty+"]", "info");
            return
        }
        console.log(_s.producePacksEmpty, _s.vegelist_stocksOnly)
        console.log(_s.txtProductPacks, "hih", _s.vegelist_stocksOnly);
        _h.post('updateStocks', {
            priceID: _s.priceH_priceID,
            productID:  _s.vegeList_productID,
            PP: _s.txtProductPacks,
            SP: _s.txtSpoilagePacks,
            description: _s.txtDescriptionPacks,
            productInKg: _s.txtProductInKG,
            productUnit: _s.txtProductUnit
        })
            .then(function (d) {
                swal("Updated!", "Success", "success");
                _s.txtProductPacks = "";
                _s.txtProductInKG = null;
                _s.txtSpoilagePacks = null;
                _s.txtDescriptionPacks = null;
                _s.txtProductUnit = "";
                loadVegeProducts();
            }, errorCallback)
        $("#exampleModal").modal('hide');
    }
    function errorCallback() {
        swal("ERROR", "ERROR IN THE SYSTEM", "error");
    }
    //didid();
    //function didid() {
    //    _h.get('tetetetete').then(function(sa){
    //    //console.log(sa.data)
    //})
    //}
    _s.updateStocksOverAll = function () {

        var objToPush = {
            "salesId": "x",
            "personalInfoId": _s.producerID,
            "commodityId": _s.commodityId,
            "date": _s.DP_datetime,
            "volumeInKilograms": _s.txtStockOverall,
            "seller": "b"
        }
        _s.DosPuntosObjtoPush = objToPush;
        console.log(_s.producerID,'porbida')
        if (_s.isPasalubong == false || _s.isPasalubong == undefined) {
            console.log(_s.producerID)
            if (_s.producerID == null ) {
                swal("ERROR", "YOU DID NOT SELECT PRODUCER", "error")
                return;
            }
        }

        //console.log(_s.txtAmount);
        //console.log(_s.SelectedProducerData);
        console.log(_s.prod_id,
        _s.txtStockOverall,
        _s.txtAmount,
        _s.txtDescription,
        _s.producerID,
         _s.SelectedProducerData,
         _s.cityMunicipality,
        _s.barangay)

        if (_s.DosPuntos == "dosPuntos")
        {
            if (_s.DP_datetime == undefined || _s.DP_datetime == null) {
                swal('INFO', 'Please select Date time again', 'info')
            }
            else {

                _h.post('updateStocksOverAll', {
                    productID: _s.prod_id,
                    stocks: _s.txtStockOverall,
                    amount: _s.txtAmount,
                    description: _s.txtDescription,
                    producerID: _s.producerID,
                    producerName: _s.SelectedProducerData,
                    cityMunicipality: _s.cityMunicipality,
                    barangay: _s.barangay
                }).then(function (d) {

                    loadVegeProducts();
                    _s.producerID = null;
                    //_s.personalInfoId == null;
                    $(".bd-example-modal-md").modal('hide');
                }, errorCallback)

                _h.post(API + 'Sales', _s.DosPuntosObjtoPush).then(function (x) {
                    console.log(x.data)
                });
            }
          
        }
        else {
            console.log("EQWEWQEQWEQWEQWE")
            _h.post('updateStocksOverAll', {
                productID: _s.prod_id,
                stocks: _s.txtStockOverall,
                amount: _s.txtAmount,
                description: _s.txtDescription,
                producerID: _s.producerID,
                producerName: _s.SelectedProducerData,
                cityMunicipality: _s.cityMunicipality,
                barangay: _s.barangay
            }).then(function (d) {
                _s.producerID = null;
                loadVegeProducts();
                $(".bd-example-modal-md").modal('hide');
            }, errorCallback)
        }
    }
    _s.isPasaLB = function () {
        _s.producerID = null;
        _s.searchList = [];
        _s.SelectedProducerData = "";
        _s.nothingToShowSearch = true;
    }
    _s.producerID = "";
    _s.getProductID = function (prod_id, commodityId) {
        _h.post('searchPasalubongProducer', { prodID: prod_id }).then(function (x) {
            _s.producerID = x.data[0].prodID
        })
        _s.prod_id = prod_id;
        _s.searchList = [];
        _s.commodityId = commodityId;

        _s.nothingToShowSearch = true;
        _s.txtStockOverall = ""
        _s.txtAmount = ""
        _s.SelectedProducerData = "";
        _s.txtSearch = "";
        console.log("na click ko");
    }
    _s.nothingToShowSearch = true;

    _s.showDatetime = function(){
        _s.pakitaDate = true;
        _s.nothingToShowSearch = true;

        _s.SelectedProducerData = "";
        _s.producerID = null;
        _s.cityMunicipality = "";
        _s.barangay = "";
        //_s.personalInfoId = null;
    }
    _s.hideDatetime = function () {
        _s.pakitaDate = false;
        _s.nothingToShowSearch = true;

        _s.SelectedProducerData = "";
        _s.producerID = null;
        _s.cityMunicipality = "";
        _s.barangay = "";
        //_s.personalInfoId = null;
    }
    $('input:radio[name="kaagapay"][value="kaagapay"]').prop('checked', true);
    _s.SearhWhoProdcer = function (txtSearch, isKaagapay, isPointSystem) {
        _s.DosPuntos = $('input[name="kaagapay"]:checked').val()
        if (_s.DosPuntos == undefined) {
            swal('ERROR', 'Please select which product come from', 'error')
            return
        }
        console.log(_s.DosPuntos)
         if (_s.DosPuntos == "kaagapay") {
             _h.get(API + 'Producers/Search/' + txtSearch).then(function (x) {
                DosPuntos = "";
                _s.searchList = [];
                _s.searchList = x.data.result;
                _s.nothingToShowSearch = false;
                _s.showCantFindProucer = false;
                console.log(_s.searchList);
            }, errorSearch)
        }
        else {
            _h.get(API + 'PersonalInfoes/' + txtSearch).then(function (d) {
                kaagapay = "";
                _s.searchList = [];
                _s.searchList = d.data.personalInfo
                _s.nothingToShowSearch = false;
                _s.showCantFindProucer = false;
                console.log(_s.searchList);
            }, errorSearch)
        }
    }
    function errorSearch() {
        _s.nothingToShowSearch = false;
        _s.showCantFindProucer = true;
        _s.searchList = [];
        console.log(_s.showCantFindProucer)
        swal('ERROR','Dont leave the search button blank or No result found','error')
    }
    _s.selectedProducer = function (data) {
        if (data.lastname != undefined) {
            _s.SelectedProducerData = data.lastname + ", " + data.firstname;
            _s.cityMunicipality = data.cityMunicipality
            _s.barangay = data.barangay
            _s.producerID = data.producerId

            console.log(_s.barangay, _s.cityMunicipality)
        } else {
            _s.SelectedProducerData = data.lastName + ", " + data.firstName;
            _s.cityMunicipality = data.address.barangay.cityMunicipality.name
            _s.barangay = data.address.barangay.name
            _s.producerID = data.personalInfoId
            // _s.personalInfoId
            console.log(_s.barangay, _s.cityMunicipality)
        }
        //console.log(_s.SelectedProducerData);

    }
    _s.removeSpoilageByKg = function () {
        console.log("!", _s.prod_id, _s.commodityId,_s.txtKG);
        if (_s.txtKG == undefined) {
            _s.txtKG = 0;
        }
        _h.post('removeSpoilageByKg', { prodID: _s.prod_id, txtKG: _s.txtKG, txtDescription: _s.txtDescription }).then(function (x) {
            swal('Success', 'Spoilage added', 'success')
            $("#removeOverAllSpoilage").modal('hide');
            loadVegeProducts();
        })
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
    _s.removeSpoilageItems = function () {
        if (_s.txtSpoilageItems == undefined) {
            _s.txtSpoilageItems = 0;
        }
        var itemCount = _s.Remove_price_producePacksInKG * _s.txtSpoilageItems
        console.log(_s.txtSpoilageItems, _s.Remove_vegeList_productID, _s.Remove_vegeList_stocks)
        if (_s.txtSpoilageItems > _s.Remove_vegeList_stocks) {
            swal('ERROR', 'Please check your inputed data', 'error')
            return
        }
        console.log("kasulod ko")
        _h.post('removeSpoilageItems', {
            priceID: _s.Remove_priceH_priceID,
            prodID: _s.Remove_vegeList_productID,
            txtSpoilageItems: _s.txtSpoilageItems,
            itemCount: itemCount,
            txtDescriptionByItem: _s.txtDescriptionByItem
        }).then(function (d) {
            _s.txtSpoilageItems = null;
            _s.txtDescriptionByItem = '';
            loadVegeProducts();
        }, errorCallback)
        $(".bd-example-modal-sm").modal('hide');
    }
    _s.removeSpoilage = function (vegeList, priceH) {
        //console.log(v, ph)
        var priceID = priceH.priceID;
        swal({
            title: "DELETE",
            text: "Are you sure you want to delete this spoilage data?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes",   
            cancelButtonText: "No",
            closeOnConfirm: true,
            closeOnCancel: true
        },
           function (isConfirm) {
               if (isConfirm) {
                   console.log("DSA",priceID)
                   _h.post('removeSpoilagePerPrice', {priceID: priceID}).then(function (d) {
                       console.log('success')
                       loadVegeProducts();
                   })
               };
           });
    }
    trefMun();
    function trefMun() {
        _h.get('trefMun').then(function (x) {
            _s.municipality = [];
            _s.municipality = x.data;
            console.log(x.data)
        });
    }
    function trefBrgy(param) {
       
    }
    _s.munChange = function (param) {
        _h.post('trefBrgy', { munCode: param }).then(function (x) {
            _s.brgy = [];
            _s.brgy = x.data;
        })
    }
})