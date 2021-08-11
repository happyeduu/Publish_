var App = angular.module("app_addStock", []);
App.controller("Ctrl_addStock", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;

    _s.nothingToShowSearch = true;
    loadVegeProducts();
    function loadVegeProducts() {
        _h.get('../product/loadProducts').then(function (d) {
            console.log(d.data, "vege products")
            _s.vegeList = [];
            var dataholder = d.data.filter(function (x) {
                return x.categoryList.categoryID == 2
            })
            _s.vegeList = dataholder;

            _s.tempArr = [];
            _s.tempArr = d.data;
        });
    };
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

    $('input:radio[name="kaagapay"][value="kaagapay"]').prop('checked', true);
    _s.SearhWhoProdcer = function (txtSearch, isKaagapay, isPointSystem) {
        _s.DosPuntos = $('input[name="kaagapay"]:checked').val()
        if (_s.DosPuntos == undefined) {
            swal('ERROR', 'Please select which product come from', 'error')
            return
        }
        console.log(_s.DosPuntos)
        if (_s.DosPuntos == "kaagapay") {

            _h.get('searchNVB/?search=' + txtSearch).then(function (x) {
                DosPuntos = "";
                _s.searchListNVB = [];
                _s.searchListNVB = x.data;
                _s.nothingToShowSearch = false;
                _s.showCantFindProucer = false;
                console.log(x.data, txtSearch)
                errorSearchNVB(txtSearch)

            })

        }
        else {
            _h.get(API+'POMembers/' + txtSearch).then(function (d) {
                kaagapay = "";
                //_s.searchListNVB = [];
                _s.searchList = [];
                _s.searchList = d.data.poMembers;
                //_s.searchListNVB =""
                console.log(_s.searchListNVB,"DASDASDAS")
                _s.nothingToShowSearch = false;
                //_s.showCantFindProucer = false;
                console.log(_s.searchList, "sad", txtSearch);
             
            }, errorSearch)
        }
    }
    //errorSearchNVB()
    function errorSearchNVB(txtSearch) {
        _h.get(API + 'Producers/Search/' + txtSearch).then(function (x) {
            DosPuntos = "";
            _s.searchList = [];
            _s.searchList = x.data.result;
            _s.nothingToShowSearch = false;
            _s.showCantFindProucer = false;
            console.log(_s.searchList);
        }, errorSearch)
    }
    function errorSearch() {
        _s.nothingToShowSearch = false;
        _s.showCantFindProucer = true;
        _s.SelectedProducerData = "";
        _s.searchList = [];
        console.log(_s.showCantFindProucer)
        //swal('ERROR', 'Dont leave the search button blank or No result found', 'error')
    }
    _s.isPasalubong = false;
    _s.isPasaLB = function () {
        //_s.tempArr = _s.tempArr;
        //$('input:radio[name="kaagapay"][value="kaagapay"]').prop('checked', true);
        _s.pakitaDate = false
        _s.vegeList = _s.tempArr.filter(function (x) {
            return x.categoryList.categoryID == 1
        });
        
        _s.producerID = null;
        _s.searchList = [];
        _s.SelectedProducerData = "";
        _s.nothingToShowSearch = true;
        _s.cityMunicipality = undefined;
        _s.barangay = undefined;
        _s.producerID = undefined;
    }
    _s.selectedProducer = function (data) {
        if (_s.pakitaDate) {
            _s.SelectedProducerData = data.lastname + ", " + data.firstname;
            _s.cityMunicipality = data.address.barangay.cityMunicipality.name
            _s.barangay = data.address.barangay.name
            _s.producerID = data.poMemberId
            console.log(_s.barangay, _s.cityMunicipality)
        } else {
            _s.brgyCode = data.brgyCode;
            console.log(data, 'ako natawag', _s.brgyCode)

            _s.SelectedProducerData = data.lastname + ", " + data.firstname;
            _s.cityMunicipality = data.cityMunicipality
            _s.barangay = data.barangay
            _s.producerID = data.producerId

            if (_s.cityMunicipality == undefined && _s.barangay == undefined && _s.producerID == undefined) {
                _s.cityMunicipality = data.cityMunDesc;
                _s.barangay = data.brgyDesc;
                _s.producerID = data.beneficiaryID;
                //console.log(_s.barangay, _s.cityMunicipality)
            }
            console.log(_s.barangay, _s.cityMunicipality, _s.producerID)
            // _s.personalInfoId
        }
        //console.log(_s.SelectedProducerData);
    }
    _s.holdObjectDatas = [];
    _s.DosPuntosObjtoPush = [];
    _s.addStocks = function (per) {
        //console.log(_s.per.txtStockOverall, "per.txtStockOverall")
        if (_s.per.txtStockOverall == undefined) {
            _s.txtStockFiltered = true
            return
        }
     
        if (_s.per.txtAmount == undefined) {
            _s.txtAmountFiltered = true
            return
        }
     
        if (_s.isPasalubong == false || _s.isPasalubong == undefined) {
            console.log(_s.producerID,"EWQEWQ")
            if (_s.producerID == null) {
                swal("ERROR", "YOU DID NOT SELECT PRODUCER", "error")
                return;
            }
        }
        var commodityName = $("#selectCat4 option:selected").text();

        objToDisplay = {
            producerID: _s.producerID,
            Beneficiary: _s.SelectedProducerData,
            Commodity: commodityName,
            classType: per.class,
            address: _s.barangay + ", " + _s.cityMunicipality,
            kilo: per.txtStockOverall,
            amount: per.txtAmount,
            description: per.txtDescription,
            cityMunicipality: _s.cityMunicipality,
            barangay: _s.barangay,
            productID: per.productID,
            stocks: per.txtStockOverall,
            producerName: _s.SelectedProducerData,
            logDate: _s.KP_Datetime,
            priceID: per.priceID,
            producePacks: per.txtStockOverall,
            brgyCode: _s.brgyCode
        }
    
        if (_s.pakitaDate) {
            _s.SelectedProducerData = undefined
            _s.cityMunicipality = undefined
            _s.barangay = undefined
            var objToPush = {
                "salesId": "x",
                "poMemberId": _s.producerID,
                "commodityId": _s.commodityId,
                "date": _s.DP_datetime,
                "volumeInKilograms": per.txtStockOverall,
                "marketPrice": per.txtAmount,
                "seller": "b"
            }

            _s.DosPuntosObjtoPush.push(objToPush);
            console.log(_s.DosPuntosObjtoPush,"hoy PO")
        }
     
        //console.log(_s.producerID, per, 'porbida')
        if (_s.DosPuntos == "dosPuntos") {
            if (_s.DP_datetime == undefined || _s.DP_datetime == null) {
                swal('INFO', 'Please select Date time again', 'info')
                return
            }
        }
        else {
            if (_s.KP_Datetime == undefined) {
                swal("ERROR", "Time is Important", "error")
                return
            }
        }
        var dataHolder = _s.holdObjectDatas.filter(function (x) {
            //console.log(_s.holdObjectDatas, "hoy")
     
            return x.producerID == _s.producerID && x.productID == per.productID && x.classType == per.class
        })
        
        console.log(dataHolder,"dataHolder")
        //_s.holdObjectDatas.push(per);
        if (dataHolder.length > 0) {
            new PNotify({
                title: 'Error Notice',
                text: 'Duplicate Entry of data.',
                addclass: 'bg-danger'
            });
       }
        else {
            _s.per.class = undefined
            _s.per.txtAmount = undefined
            _s.per.txtStockOverall = undefined
           _s.holdObjectDatas.push(objToDisplay);
       }
    }
    _s.updateStocksOverAll = function (per) {
        console.log(_s.holdObjectDatas," _s.holdObjectDatas")

        //console.log(_s.txtAmount);
        console.log(_s.DosPuntosObjtoPush);
        console.log(_s.holdObjectDatas);
        if (_s.DosPuntos == "dosPuntos") {
            if (_s.DP_datetime == undefined || _s.DP_datetime == null) {
                swal('INFO', 'Please select Date time again', 'info')
            }
            else {
                _h.post('updateStocksOverAll', {
                    inventLogs: _s.holdObjectDatas,
                    //priceID: per.priceID,
                    //PP:
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
            console.log("EQWEWQEQWEQWEQWE", _s.holdObjectDatas)
            _h.post('updateStocksOverAll', { inventLogs: _s.holdObjectDatas }).then(function (d) {
                _s.producerID = null;
                loadVegeProducts();
                _s.holdObjectDatas = [];
                swal("Success", "Stocks Added", "success");
                $(".bd-example-modal-md").modal('hide');
            }, errorCallback)
        }
    }
    function errorCallback() {
        swal("ERROR", "ERROR IN THE SYSTEM", "error");
    }
    _s.showDatetime = function () {
        _s.vegeList = _s.tempArr.filter(function (x) {
            return x.categoryList.categoryID == 3
        })
        _s.pakitaDate = true;
        _s.nothingToShowSearch = true;
        console.log('ako mani')
        _s.SelectedProducerData = "";
        _s.producerID = null;
        _s.cityMunicipality = "";
        _s.barangay = "";
        _s.vegeList = _s.vegeList.filter(function (x) {
            return x.categoryList.categoryID == 3
        })
        //_s.personalInfoId = null;
    }
    _s.hideDatetime = function () {
        _s.vegeList = _s.tempArr.filter(function (x) {
            return x.categoryList.categoryID == 2
        })
        console.log(_s.vegeList)
        _s.pakitaDate = false;
        _s.nothingToShowSearch = true;

        _s.SelectedProducerData = "";
        _s.producerID = null;
        _s.cityMunicipality = "";
        _s.barangay = "";
        //_s.personalInfoId = null;
    }
    _s.getCommodity = function (per) {
        angular.forEach(_s.vegeList, function (x) {
            if (x.productID == per.productID) {
                _s.commodityId = x.commodityId
                if (x.categoryList.categoryID == 2) {
                    console.log("hello wt")
                }
            }
        })
        var dataholder = _s.vegeList.filter(function (f) {
            return f.productID == per.productID
        })
        _s.pricesH = [];
        _s.pricesH = dataholder[0].pricesH
        console.log(_s.pricesH, _s.vegeList)
    }

    //ref
    trefMun();
    function trefMun() {
        _h.get('trefMun').then(function (x) {
            _s.municipality = [];
            _s.municipality = x.data;
        });
    }

    _s.munChange = function (param) {
        console.log(param)
        _h.post('trefBrgy', { munCode: param }).then(function (x) {
            _s.brgy = [];
            _s.brgy = x.data;
        })
    }
    _s.addNonBeneficiary = function () {
        console.log(_s.s)
        _h.post('cmdAddNonVerifiedBeneficiary', { NVB: _s.s }).then(function (x) {
            $("#manualModal").modal('hide');
            _s.s.firstname = null;
            _s.s.middlename = null;
            _s.s.lastname = null;
            console.log(x.data)
        })
    }
    _s.removeItem = function (index) {
        _s.holdObjectDatas.splice(index, 1);
    }
})