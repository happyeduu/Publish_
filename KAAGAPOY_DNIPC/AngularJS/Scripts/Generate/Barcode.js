var App = angular.module("app_barcode", []);
App.controller("Ctrl_barcode", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;

    LoadPasalubong();
    function LoadPasalubong() {
        _h.get('loadProducts').then(function (x) {
            _s.listProducts = [];
            _s.listProducts = x.data;
            console.log(x.data)
        })
    }
    _s.getPriceAndStocks = function (pID) {
        _s.listPrice = [];
        _s.listPrice = _s.listProducts.filter(function (d) {
            return d.productID == pID
        });
        console.log(_s.listPrice[0].pricesH, _s.listPrice, pID)
    }
    _s.generateBarcode = function () {
        var commodityName = $("#selectPName option:selected").text();
        var priceText = $("#selectPrice option:selected").text();
        console.log(commodityName, _s.qty, priceText,_s.priceID)
        var k = [];
        _s.list = []
        var counter = 0
        for (var i = 0; i < _s.qty / 6; i++) {
            //console.log(i,"ako si i")
            var tempArr = []
            for (var c = 0; c < 6 ; c++) {
                //if (d.data[counter]) { }  
                var sad = {
                    name: commodityName,
                    priceID: _s.priceID
                }
                tempArr.push(sad)
                counter = counter + 1;
            }
            _s.list.push(tempArr)
        }
        console.log(_s.list,"hello worlds")
        var abc = 0
        setTimeout(function () {
            for (var a = 0; a < _s.list.length; a++) {
                    var tr = '<tr id="tr' + a + '"> </tr>';
                    $("#tableP").append(tr);
                    for (b = 0; b < _s.list[a].length; b++) {
                        abc = abc + 1;
                        var td = '<td id="td' + abc + '"> </td>'
                        if (a < _s.qty) {
                            //console.log(b, _s.qty, _s.list.length)
                            $("#tr" + a + "").append(td);
                            var html = '<div class="card" style="width:1.3in;height:1.2in;background-color:white;border-style:solid">' +
                                         '<div class="card-img-overlay ">' +
                                         //'<div id="qrcode' + abc + '" style="padding: 5px 5px 5px 25px;"></div>' +
                                         //'<br />' +
                                         '<div style="line-height:100%;">' +
                                         '<p style="font-size:12px;text-align:center">' + priceText + '</p>' +
                                         '<p style="font-size:15px;text-align:center">' + commodityName + '</p>' +
                                         ' <svg   id="barcode' + abc + '"></svg> </div>' +
                                         '</div>' +
                                         '</div>'
                            $("#td" + abc + "").append(html);
                            JsBarcode("#barcode" + abc + "", _s.list[a][b].priceID, {
                                width: 0.9,
                                height: 25,
                                fontSize: 10,
                                marginLeft:-5
                            });
                  
                        }
                    }
                }

        }, 100)
    }
  
});