var App = angular.module("App_trans", []);
App.controller("Ctrl_trans", function ($filter, $scope, $http) {

    var _s = $scope;
    var _h = $http;
    loadLedger();
    function loadLedger() {
        _h.post('exampleCode').then(function (d) {
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
                    if (d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0].length == 0 && d.data[0].displayLed[0].summariesReport[x].unit =='Sack') {
                        _s.dungagSaSumCozOfManualMode += d.data[0].displayLed[0].summariesReport[x].qty;
                    }
                    _s.catchSumOfKilos = d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0] * d.data[0].displayLed[0].summariesReport[x].qty;
                    arr.push({
                        sumOfKilos:_s.catchSumOfKilos
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
        _h.post('specificDate', {searchD:date}).then(function (d) {
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
                        sumOfKilos:_s.catchSumOfKilos
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

            
            console.log(r + _s.dungagSaSumCozOfManualMode, _s.resultOfSum)
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
    //, errorCallback("ERROR", "YES", "error")
});