var App = angular.module("App_inventory", []);
App.controller("Ctrl_inventory", function ($filter, $scope, $http) {

    var _s = $scope;
    var _h = $http;
    function loadInventoryLogs(s, e) {
        console.log(s, e)
        _h.post('loadInventoryLogs', { startDate: s, endDate: e }).then(function (d) {
            _s.inventoryLogs = [];
            _s.inventoryLogs = d.data;

            _s.amountTotal += _s.getSum(d.data.grandTotal, 'amount')
            _s.dateNow = new Date()

        })
    }
    function groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
            var key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }
    _s.getSum = function (items, prop) {
        if (items == null) {
            return 0;
        }
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };

    _s.loadInventoryLogsPasalubong = function (d,s,e) {
        if (d != undefined || d == " ") {
            _h.post('loadInventoryLogsPasalubongDate', { searchD: d }).then(function (d) {
                _s.inventoryLogs = [];
                _s.inventoryLogs = d.data;
                _s.hideMe = false;
                _s.hideMeNot = true;
                console.log(d.data)
            })
        }
        else {
            _h.post('loadInventoryLogsPasalubong', { startDate: _s.startDate, endDate: _s.endDate }).then(function (d) {
                _s.inventoryLogs = [];
                _s.inventoryLogs = d.data;
                _s.hideMe = false;
                _s.hideMeNot = true;
                console.log(d.data)
            });
        }

        console.log('kani kay pasalubong')
    }
    _s.removeDate = function () {
        _s.hideMe = true;
        _s.hideMeNot = false;
        loadInventoryLogs();
        _s.searchD = null;
    }
    _s.curMonth = new Date().getMonth() + 1;
    _s.curYear = new Date().getFullYear();
    _s.curDay = new Date().getDate();
    _s.curDate = new Date(_s.curYear + "-" + _s.curMonth + "-" + _s.curDay);
    _s.selectedDailyReport = "";
    _s.startDate = new Date(_s.curMonth + "/" + 1 + "/" + _s.curYear);
    _s.endDate = new Date(_s.curMonth + "/" + _s.curDay + "/" + _s.curYear);
    _s.toShowstartDate = _s.curMonth + "/" + 1 + "/" + _s.curYear;
    _s.toShowendDate = _s.curMonth + "/" + _s.curDay + "/" + _s.curYear;
    $('#demo').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: _s.startDate,
        endDate: _s.endDate,
        locale: {
            format: 'MM/DD/YYYY'
        }
    });

    loadInventoryLogs(_s.startDate, _s.endDate);
    $('#demo').on('apply.daterangepicker', function () {
        timepicker:false
        var startDate = new Date($(this).data('daterangepicker').startDate._d);
        var endDate = new Date($(this).data('daterangepicker').endDate._d);
        loadInventoryLogs(startDate, endDate);
        _s.printDate = "";
        _s.printDate = startDate.toLocaleDateString() + ' - ' + endDate.toLocaleDateString()
        _s.startDate = startDate;
        _s.endDate = endDate;
    });

 
    console.log(_s.startDate, _s.endDate);
   
    
    //$('#demo').on('apply.daterangepicker', function ()({
    //    "startDate": _s.toShowstartDate,
    //    "endDate": _s.toShowendDate
    //}, function (start, end, label) {
    //    console.log('New date range selected: ' + start.format('MM/DD/YYYY') + ' to ' + end.format('MM/DD/YYYY') + ' (predefined range: ' + label + ')');
    //    //loadInventoryLogs(start.format('MM/DD/YYYY'), end.format('MM/DD/YYYY'));
    //    var startDate = new Date($(this).data('daterangepicker').startDate._d);
    //    var endDate = new Date($(this).data('daterangepicker').endDate._d);
    //    _s.printDate = start.format('DD/MM/YYYY') + '-' + end.format('DD/MM/YYYY')
    //});
    _s.changeDate = function (d) {
        console.log(d, "test")
        if (d != undefined && _s.hideMeNot == true) {
            _h.post('loadInventoryLogsPasalubongDate', { searchD: d }).then(function (d) {
                _s.inventoryLogs = [];
                _s.inventoryLogs = d.data;
                //_s.hideMe = true;
                //_s.hideMeNot = false;
                console.log(d.data)
            })
        }
        else {
            _h.post('loadInventoryLogsSpecificDate', { searchD: d }).then(function (d) {
                _s.inventoryLogs = [];
                _s.inventoryLogs = d.data;
                //_s.hideMe = true;
                //_s.hideMeNot = false;
                console.log(d.data)
            })
        }
    }
    _s.hideMe = true;
    _s.showAll = function (d) {

        //_s.searchD = "";
        _s.search = "";
        _s.hideMe = true;
        _s.hideMeNot = false;

        var det = d;
        console.log('na click ko', d)
        if (d == undefined || d == "") {
            loadInventoryLogs(_s.startDate, _s.endDate);
        }
        else {
            _h.post('loadInventoryLogsSpecificDate', { searchD: d }).then(function (d) {
                _s.inventoryLogs = [];
                _s.inventoryLogs = d.data;
                //_s.hideMe = true;
                //_s.hideMeNot = false;
                console.log(d.data)
            })
        }
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
});