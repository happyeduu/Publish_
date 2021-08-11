var App = angular.module("App_bulkSales", []);
App.controller("Ctrl_bulkSales", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;
    loadLedger();
    function loadLedger() {
        _h.post('BulkSalesINV').then(function (d) {
            _s.ledgerDetails = [];
            _s.ledgerDetails = d.data;
            console.log(d.data, "hei")
            angular.forEach(d.data, function (d) {
                _s.dateNow = d.dateToday
            });
            //_s.showSumOfKilos = _s.getSum(d.data[0].displayLed.summariesReport, "producePacksInKG[0]");
            //console.log(_s.showSumOfKilos)
            var arr = []
            _s.dungagSaSumCozOfManualMode = 0;
            for (var x = 0; x < d.data[0].displayLed[0].summariesReport.length; x++) {
                if (d.data[0].displayLed[0].summariesReport[x].categoryID[0] != 1) {
                    if (d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0].length == 0) {
                        _s.dungagSaSumCozOfManualMode += d.data[0].displayLed[0].summariesReport[x].qty;
                    }
                    _s.catchSumOfKilos = d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0] * d.data[0].displayLed[0].summariesReport[x].qty + d.data[0].displayLed[0].summariesReport[x].resikoKG;
                    arr.push({
                        sumOfKilos:_s.catchSumOfKilos,
                        resikoSum : d.data[0].displayLed[0].summariesReport[x].resikoKG,
                        computeAmount: d.data[0].displayLed[0].summariesReport[x].pricePerKG * (d.data[0].displayLed[0].summariesReport[x].qty)
                    });
                    //console.log("hi napud", _s.catchSumOfKilos, _s.dungagSaSumCozOfManualMode)
                }
                else {
                    //console.log("?",d.data[0].displayLed[0].summariesReport[x].categoryID != 1)
                }
            }
            console.log(arr,_s.dungagSaSumCozOfManualMode)
            var r = _s.getSum(arr,'sumOfKilos')
            var s = r + _s.dungagSaSumCozOfManualMode
            _s.resultOfSum = s.toFixed(2)
            _s.resikaSum = _s.getSum(arr,'resikoSum').toFixed(2);
            _s.computeAmount = _s.getSum(arr,'computeAmount').toFixed(2);
            console.log(r + _s.dungagSaSumCozOfManualMode, _s.resultOfSum)


        })
    };
    _s.getSumOfKilos = function (key) {
        return this.reduce((a, b) => a + (b[key] || 0), 0);
    }
    function errorCallback(title,msg,type) {
        swal(title, msg, type);
    }
    _s.getSum = function (items, prop) {
        if (items == null) {
            return 0;
        }
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };
    _s.changeDate = function (date) {
        console.log(date)
        _s.resultOfSum = 0
        _s.resikaSum =0
        _s.computeAmount = 0
        _h.post('specificDateBulkSales', {searchD:date}).then(function (d) {
            _s.ledgerDetails = [];
            _s.ledgerDetails = d.data;
            angular.forEach(d.data, function (d) {
                _s.dateNow = d.dateToday
            });
            //_s.showSumOfKilos = _s.getSum(d.data[0].displayLed.summariesReport, "producePacksInKG[0]");
            //console.log(_s.showSumOfKilos)
            var arr = []
            _s.dungagSaSumCozOfManualMode = 0;
            for (var x = 0; x < d.data[0].displayLed[0].summariesReport.length; x++) {
                if (d.data[0].displayLed[0].summariesReport[x].categoryID[0] != 1) {
                    if (d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0].length == 0) {
                        _s.dungagSaSumCozOfManualMode += d.data[0].displayLed[0].summariesReport[x].qty;
                    }
                    _s.catchSumOfKilos = d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0] * d.data[0].displayLed[0].summariesReport[x].qty;

                    arr.push({
                        sumOfKilos:_s.catchSumOfKilos,
                        resikoSum : d.data[0].displayLed[0].summariesReport[x].resikoKG,
                        computeAmount: d.data[0].displayLed[0].summariesReport[x].pricePerKG * (d.data[0].displayLed[0].summariesReport[x].qty)
                    });
                    //console.log("hi napud", _s.catchSumOfKilos, _s.dungagSaSumCozOfManualMode)
                }
                else {
                    //console.log("?",d.data[0].displayLed[0].summariesReport[x].categoryID != 1)
                }
            }
            console.log(arr,"S")
            var r = _s.getSum(arr,'sumOfKilos')
            var s = r + _s.dungagSaSumCozOfManualMode
            _s.resultOfSum = s.toFixed(2)
            _s.resikaSum = _s.getSum(arr,'resikoSum').toFixed(2);
            _s.computeAmount = _s.getSum(arr,'computeAmount').toFixed(2);
            console.log(_s.ledgerDetails)
        })
    }
    _s.hideWhenPrint = true;
    _s.printPage = function () {
        _s.showPrintData = true;
        _s.hideWhenPrint = false;
        //window.print();
    }
    _s.GoBack = function () {
        _s.showPrintData = false;
        _s.hideWhenPrint = true;
    }
});