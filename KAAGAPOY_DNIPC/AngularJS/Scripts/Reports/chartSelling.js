var App = angular.module("App_sellChart", []);
App.controller("Ctrl_sellChart", function ($filter, $scope, $http) {

    var _s = $scope;
    var _h = $http;
    var _bar = null;
    var myChart = null;
    function loadPieChart(label, data) {
        var ctx = document.getElementById('myChart').getContext('2d');
        if (myChart === null) {
        }
        else {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: label,
                datasets: [{
                    label: '# of Votes',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    labels: [
                                {
                                    render: 'label',
                                    fontColor: '#000',
                                    position: 'outside',
                                    fontStyle: 'bold',
                                    outsidePadding: 30,
                                    fontFamily: '"Lucida Console", Monaco, monospace'
                                },
                                {
                                    render: 'percentage',
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontColor: '#000',
                                    fontFamily: '"Lucida Console", Monaco, monospace'

                                }
                    ],
                }
            }
        });
    }
    function init(s, e) {
        var lbl = [];
        var dta = [];
        _h.post('chartSellTopPurCommodity', { startDate: s, endDate: e }).then(function (x) {
            _s.chartTPC = [];
            _s.chartTPC = x.data;
            for (var k = 0; k < _s.chartTPC.length; k++) {
                if (_s.chartTPC[k].classType == null) {
                    _s.chartTPC[k].classType = ""
                }
                lbl.push(_s.chartTPC[k].productName + " " + _s.chartTPC[k].classType)
                dta.push(_s.chartTPC[k].sum)
            }
            loadPieChart(lbl, dta)
        })
        _h.post('chartTableSellPerCom', {startDate: s, endDate: e}).then(function (d) {
            _s.ledgerDetails = [];
            _s.ledgerDetails = d.data;
            _s.resultOfSum = 0;
            _s.resikaSum = 0;
            _s.computeAmount = 0;
            angular.forEach(d.data, function (d) {
                _s.dateNow = d.dateToday
            });
            var arr = []
            _s.dungagSaSumCozOfManualMode = 0;
            for (var x = 0; x < d.data[0].displayLed[0].summariesReport.length; x++) {
                if (d.data[0].displayLed[0].summariesReport[x].categoryID[0] != 1) {
                    if (d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0].length == 0) {
                        _s.dungagSaSumCozOfManualMode += d.data[0].displayLed[0].summariesReport[x].qty;
                    }
                    _s.catchSumOfKilos = d.data[0].displayLed[0].summariesReport[x].producePacksInKG[0] * d.data[0].displayLed[0].summariesReport[x].qty;

                    arr.push({
                        sumOfKilos: _s.catchSumOfKilos,
                        resikoSum: d.data[0].displayLed[0].summariesReport[x].resikoKG,
                        computeAmount: d.data[0].displayLed[0].summariesReport[x].pricePerKG * (d.data[0].displayLed[0].summariesReport[x].qty)
                    });
                }
                else {
                }
            }
            //console.log(arr, "S")
        
            var r = _s.getSum(arr, 'sumOfKilos')
            var s = r + _s.dungagSaSumCozOfManualMode
            _s.resultOfSum = s.toFixed(2)
            _s.resikaSum = _s.getSum(arr, 'resikoSum').toFixed(2);
            _s.computeAmount = _s.getSum(arr, 'computeAmount').toFixed(2);
            console.log(_s.ledgerDetails)
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

    //dont touch this
    _s.curMonth = new Date().getMonth() + 1;
    _s.curYear = new Date().getFullYear();
    _s.curDay = new Date().getDate();
    _s.curDate = new Date(_s.curYear + "-" + _s.curMonth + "-" + _s.curDay);
    _s.selectedDailyReport = "";
    _s.startDate = new Date(_s.curMonth + "/" + 1 + "/" + _s.curYear);
    _s.endDate = new Date(_s.curMonth + "/" + _s.curDay + "/" + _s.curYear);
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

    init(_s.startDate, _s.endDate)
    $('#demo').on('apply.daterangepicker', function () {
        var startDate = new Date($(this).data('daterangepicker').startDate._d);
        var endDate = new Date($(this).data('daterangepicker').endDate._d);
        _s.startDate = startDate;
        _s.endDate = endDate;
        init(startDate, endDate);
    });
    //end
});