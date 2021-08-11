var App = angular.module("App_inventoryEnd", []);
App.filter('monthname', ['$filter', function ($filter) {
    return function (month) {
        return $filter("date")(new Date(0, month), 'MMMM');
    }
}]);
App.controller("Ctrl_inventoryEnd", function ($filter, $scope, $http) {

    var _s = $scope;
    var _h = $http;
    //loadInventoryLogs2()
    function loadInventoryLogs2() {
        var data;
        _h.get('inventoryEndCall').then(function (d) {
            //console.log(d.data)
            _s.inventoryEnd = [];

            data = d.data[0].displayLed[0].summariesReport
            //date is 03 or march
            console.log(data)
            _s.grandTotal = d.data[0].grandTotal;
            _s.sumOfAllKilos = d.data[0].displayLed[0].sumOfKilos
            console.log(_s.sumOfAllKilos)
            _s.MonthName = d.data[0].Month - 1
            var newArr = [];
            var obj = [];
            var computeAllKilos = [];
            angular.forEach(data, function (value, key) {
                var exists = false;
                angular.forEach(newArr, function (val2, key) {
                    if (value.productID == val2.productID) {
                        exists = true
                        var sum = value.sumOfKilos + val2.sumOfKilos
                        obj = {
                            price: value.price,
                            producePacksInKG: value.producePacksInKG,
                            productID: value.productID,
                            productName: value.productName,
                            qty: value.qty,
                            sumOfKilos: sum,
                            unit: value.unit,
                            stocks: value.stocks,
                            spoilage: value.spoilage,
                            PackSpoilage: value.PackSpoilage,
                            grandTotalSalesPerProd: value.grandTotalSalesPerProd,
                            categoryID: value.categoryID
                        };
                        computeAllKilos.push(obj)
                    }

                });
                if (exists == false && value.productID != "") {
                    newArr.push(value);
                }
            });
            var onlyInA = computeAllKilos.filter(comparer(newArr));
            var onlyInB = newArr.filter(comparer(computeAllKilos));
            result = onlyInA.concat(onlyInB);

            for (c = 0; c < result.length; c++) {
                computeAllKilos.push(result[c])
            }
            console.log(computeAllKilos, 'test', newArr)
            _s.spoilageTotal = _s.getSum(computeAllKilos, "PackSpoilage");
            _s.inventoryEnd = computeAllKilos;
            return newArr;
        })
    }
    hello()
    function hello() {
        var data;
        console.log('this is test call')
        _h.get('example2').then(function (d) {
            _s.inventoryEnd = [];
            _s.inventoryEnd = d.data;
            _s.spoilageTotal = _s.getSum(d.data, "spoilageKG");
            _s.sumOfAllKilos = _s.getSum(d.data, "SumOfKilos");
            _s.sumResiko = _s.getSum(d.data, "resiko");
            _s.grandTotal = _s.getSum(d.data, "totalPricerPerProd");
            console.log(d.data)
        })
    }
    function comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return other.value == current.value && other.productID == current.productID
            }).length == 0;
        }
    }
    _s.getSum = function (items, prop) {
        if (items == null) {
            return 0;
        }
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };
    _s.changeMonth = function (searchM) {
        console.log(searchM);
    }
    _s.monthlyReportShow = true;
    _s.detailedReportShow = false;
    _s.cmdDetailedReport = function () {
        console.log(_s.monthNumT,"EWQE")
        if (_s.monthNumT == undefined) {
            var d = new Date();
            var n = d.getMonth();
            //console.log(n + 1)
            _s.monthNumT = n + 1;
        }
        if (_s.monthlyReportShow == true) {
            _h.post('detailedLedgerReportPerMonthByMonth', { month: _s.monthNumT }).then(function (d) {
                console.log("hello world","RQWRQWRdsadasdsad")
                //console.log(d.data)
                _s.MonthName = _s.monthNumT - 1
                _s.detailedReport = [];
                _s.detailedReport = d.data;
                _s.detailedReportShow = true
                _s.monthlyReportShow = false;
            })
        }
        else {
            _h.get('detailedLedgerReportPerMonth').then(function (d) {
                console.log("hello world")
                console.log(d.data)
                _s.detailedReport = [];
                _s.detailedReport = d.data;
                _s.detailedReportShow = true;
                //_s.showThisTable = true;
                _s.monthlyReportShow = false;
            })
        }
    }
    _s.cmdMonthlyReport = function (d) {
        //loadInventoryLogs2();
        _s.detailedReportShow = false;
        _s.monthlyReportShow = true;
    }
    _s.monthChange = function (monthNum) {
        _s.monthNumT = monthNum
        _s.total = 0;
        console.log(monthNum,"@")
        if (_s.monthlyReportShow == false) {
            _h.post('detailedLedgerReportPerMonthByMonth', { month: monthNum }).then(function (d) {
                console.log("hello world")
                console.log(d.data)
                _s.MonthName = _s.monthNumT - 1
                _s.detailedReport = [];
                _s.detailedReport = d.data;
                _s.detailedReportShow = true
                _s.monthlyReportShow = false;
            })
        }
        else {
            _h.post('inventoryEndCallByMonth', { month: monthNum }).then(function (d) {
                _s.inventoryEnd = [];
                _s.inventoryEnd = d.data;
                _s.spoilageTotal = _s.getSum(d.data, "spoilageKG");
                _s.sumOfAllKilos = _s.getSum(d.data, "SumOfKilos");
                _s.grandTotal = _s.getSum(d.data, "totalPricerPerProd");
            })
        };
    }
    _s.hideWhenPrint = true;
    _s.print = function (d) {
        _s.hideWhenPrint = false;
        _s.showPrintData = true;
        console.log("DSA");
    }
    _s.back = function (d) {
        _s.hideWhenPrint = true;
        _s.showPrintData = false;
    }
})