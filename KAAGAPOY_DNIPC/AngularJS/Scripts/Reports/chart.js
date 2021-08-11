var App = angular.module("App_chart", []);
App.controller("Ctrl_chart", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;
    var _bar = null;
    //loadPieChart()
    //loadHoriBarChart();
    var myChart = null;
    var _bar2 = null;
    var _ComPer = null;
    function loadPieChart(label, data) {
        var ctx = document.getElementById('myChart').getContext('2d');
        if(myChart === null){
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
    function loadHoriBarChart(lbl,data) {
        var ctx = document.getElementById('horBar').getContext('2d');
        if (_bar === null) {
        }
        else {
            _bar.destroy();
        }
        _bar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: lbl,
                datasets: [{
                    label: '# Commodity Kilos',
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
                    borderWidth: 1,
                }]
            },
            responsive: true,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                plugins: {
                    legends:{
                        display: true,
                        position: 'top',
                    },
                    labels: {
                        render: function (args) {
                            return  args.value ; 
                        },
                        fontStyle: 'bold',
                        outsidePadding: 30,
                        fontFamily: '"Lucida Console", Monaco, monospace',
                    }
                }
            
            }
        });
    }
    function loadBarComPerBene(id, g_data,unit) {
        console.log(unit)

        var ctx = document.getElementById('barComPerPene' + id).getContext('2d');
        if (_ComPer === null) {
            //console.log("wala sulod")
        }
        else {
            //console.log("naa sulod", _ComPer)
        }
            _ComPer = new Chart(ctx, {
            type: 'bar',
            data: g_data,
            responsive: true,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                plugins: {
                    legends: {
                        display: true,
                        position: 'top',
                    },
                    labels: {
                        render: function (args) {
                            console.log(args)
                            if (args.dataset.classType == "") {
                                args.dataset.classType = 'kg';
                                return args.value + ' ' + args.dataset.classType;
                            }
                            else {
                                return args.value + ' ' + args.dataset.classType;
                            }
                        },
                        fontStyle: 'bold',
                        outsidePadding: 30,
                        fontFamily: '"Lucida Console", Monaco, monospace',
                    }
                }

            }
        });
    }
    function init(s, e) {
        var lbl = [];
        var dta = [];
        var rndC =[];
        var rndL = [];
        var backgroundColor = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
        ]
        var borderColor = [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
        ]
        _h.post('chartTopPurCommodity',{ startDate: s, endDate: e }).then(function (x) {
            _s.chartTPC = [];
            _s.chartTPC = x.data;
            //console.log(x.data)
            for (var k = 0; k < _s.chartTPC.length; k++) {
                if (_s.chartTPC[k].classType == null) {
                    _s.chartTPC[k].classType = ""
                }
                lbl.push(_s.chartTPC[k].productName + " " + _s.chartTPC[k].classType)
                dta.push(_s.chartTPC[k].sum)
                //const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

                //const randomRGB = () => `rgb(255, ${randomNum()}, 0.2)`;
                //const randomRGBLine = () => `rgb(255, ${randomNum()}, 1)`;
                //console.log(randomRGB());
                //rndC.push(randomRGB())
                //rndL.push(randomRGBLine())
            }
            loadPieChart(lbl, dta)
        })
        var blbl = [];
        var bdta = [];
        _h.post('chartTopBene', { startDate: s, endDate: e }).then(function (d) {
            _s.chartLTBene = [];
            _s.chartLTBene = d.data
            for (var k = 0; k < _s.chartLTBene.length; k++) {
                blbl.push(_s.chartLTBene[k].producerName)
                bdta.push(_s.chartLTBene[k].sum)
            }
            loadHoriBarChart(blbl, bdta)
        })
        var clbl = [];
        var cdta = [];
        var g_data = {};
        _h.post('chartTopBeneByCom', { startDate: s, endDate: e }).then(function (f) {
            _s.chartPerCom = [];
            _s.chartPerCom = f.data;
            //console.log(f.data);
            $(".col-md-4").remove();

            setTimeout(function () {
                for (var k = 0; k < _s.chartPerCom.length; k++) {
                    var arrs = [];
                    var prodArrs = [];
                    var dataSets = [];
                    var classType = [];
                    clbl.push(_s.chartPerCom[k].producerName)

                    var myCanvas = '<div class="col-md-4"><canvas id="barComPerPene' + k + '"  width="400" height="400"></canvas></div>'
                    $(".hello").append(myCanvas);
                    if (_s.chartPerCom[k].perCom.length > 1) {
                        for (var y = 0; y < _s.chartPerCom[k].perCom.length; y++) {
                            arrs.push(_s.chartPerCom[k].perCom[y].sum)
                            if (_s.chartPerCom[k].perCom[y].classType == null)
                            {
                                _s.chartPerCom[k].perCom[y].classType = ""
                            }
                            classType.push(_s.chartPerCom[k].perCom[y].classType)
                            prodArrs.push(_s.chartPerCom[k].perCom[y].productName + " " + _s.chartPerCom[k].perCom[y].classType)
                            dataSets.push({
                                label: prodArrs[y],
                                backgroundColor: backgroundColor[y],
                                borderColor: borderColor[y],
                                data: [arrs[y]],
                                borderWidth: 1,
                                classType: _s.chartPerCom[k].perCom[y].classType
                            });
                        }
                        g_data = {
                            labels: [clbl[k]],
                            datasets: dataSets,
                        }
                        loadBarComPerBene(k, g_data, classType)
                    }
                    else {
                        if (_s.chartPerCom[k].perCom[0].classType == null) {
                            _s.chartPerCom[k].perCom[0].classType = ""
                        }
                        arrs.push(_s.chartPerCom[k].perCom[0].sum)
                        prodArrs.push(_s.chartPerCom[k].perCom[0].productName + " " + _s.chartPerCom[k].perCom[0].classType)
                        dataSets.push({
                            label: prodArrs[0],
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            data: [arrs[0]],
                            borderWidth: 1,
                            classType: _s.chartPerCom[k].perCom[0].classType
                        });
                        g_data = {
                            labels: [clbl[k]],
                            datasets: dataSets
                        }
                        loadBarComPerBene(k, g_data)
                    }
                }
            }, 100)

        })
    }



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
});