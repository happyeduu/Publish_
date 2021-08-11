var App = angular.module("App_index", []);
App.controller("Ctrl_index", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;
    //loadVegeProducts();
    //loadPriceHistory()
    _s.itemCode = "";
    _s.permitteeData = [];
    _s.listItems = [];
    _s.discountAmt = 0;
    function loadVegeProducts(bCode) {
        _h.post('../product/BarcodeloadProducts',{bCode: bCode}).then(function (d) {
            if(d.data[0].producePacks == null || d.data[0].producePacks == 0){
                swal("Notice!","No Available Stocks","info")
                $('#scanBarcode').focus();
                _s.itemCode = "";
            }
            else{
                console.log(d.data)
                //d.data.qty = 1;
                _s.listItems.push(d.data[0]);
                console.log(_s.listItems)
            }
            var uniqueArray = removeDuplicates(_s.listItems, "priceID");
            _s.listItems = uniqueArray
            computSubtotal();
        });

    };
    _s.changeAmount = ""
    _s.cashAmountDetails = function () {
        if (_s.tolDue !== 0) {
            if (_s.cashAmt >= _s.tolDue) {
                _s.cashAmount = _s.cashAmt;
                _s.changeAmount = _s.cashAmount - (_s.tolDue -(_s.tolDue * (_s.discountAmt / 100)))
                //_s.showInputCash = true;
                //_s.cashDetails = false;
            }
            else {
                _s.cashAmount = _s.cashAmt;
                _s.changeAmount = _s.cashAmount - (_s.tolDue -(_s.tolDue * (_s.discountAmt / 100)))
                //_s.cashAmt = "";
            }
        } 
    }
    _s.saveAllDetails = function () {
        console.log(_s.cashAmount,_s.listItems)
        var objToPush = [];
        angular.forEach(_s.listItems, function (value, key) {
            console.log(value.producePacksInKG, "HHHHHHHHHHHHHHHHHHHHHHHHH")
            if(value.producePacksInKG == 0){
                obj = {
                    priceID: value.priceID,
                    productID: value.productID.toString(),
                    qty: value.qty,
                    minusKGinOverAllStocks:  value.qty,
                    pricePerKG: value.price
                };
            }
            else {
                obj = {
                    priceID: value.priceID,
                    productID: value.productID.toString(),
                    qty: value.qty,
                    minusKGinOverAllStocks: value.producePacksInKG * value.qty,
                    price: value.price,
                    produceKG: value.producePacksInKG
                };
            }
       
            objToPush.push(obj)
        });
        console.log(objToPush)
        if(_s.cashAmount == undefined || _s.cashAmount == 0){
            swal("Error!", "No Cash Amount input", "error")
        }
        
        else{
            _h.post("cmdSumbitTransaction", {
                trans : objToPush,
                CashAmount: _s.cashAmount
                //minusKGinOverAllStocks : _s.minusKGinOverAllStocks
            }).then(function(d){
                _s.tr = d.data;
                _s.sTotAmt = _s.subTot;
                _s.totAmt = _s.tolDue;
                //_s.tr[0].logDate = _s.tr[0].logDate != null ? $filter("date")(parseInt(_s.tr[0].logDate.substr(6)),'MM/dd/yyyy'): "";
                //_h.post("printdata?ledgerID=" + 'LIDF744105').then(function(){
                //window.open('../reports/WebForm1.aspx?view=recipe');
                //});
                //JsBarcode("#barcode", ("000000"+s.tr[0].ledgerID).slice(-6), {
                //    width:4,
                //    height: 60,
                //    displayValue: false
                //});
               console.log(_s.tr,"ako si tr")
                setTimeout(function () {
                    window.print();
                }, 100);
                _s.dataTable = [];
                //loadVegeProducts();
                swal("Success!", "Item Purchased", "success");
         
                _s.listItems = [];
                _s.catchArr = [];
                _s.item = {}
                _s.item.productName = "";
                _s.cashAmount = 0;
                _s.changeAmount = 0;
                _s.cashAmt = "";
                _s.totQty = 00;
                _s.subTot = 00;
                _s.tolDue = 00;
                _s.disc = 0;
            });
        }
    }
    _s.removeItem = function (index) {
        _s.listItems.splice(index, 1);
        computSubtotal();
    }

    _s.qtyChange = function (index, ac) {

        if (ac == 1) {
            _s.listItems[index].qty -=  1
        } else if(ac == 2) {
            if(_s.listItems[index].qty > _s.listItems[index].stocks){
            }
            _s.listItems[index].qty += 1
        }
        //console.log("asdasd")
        computSubtotal();
    }
    _s.totQty = 00;
    _s.subTot = 00;
    _s.tolDue = 00;
    _s.disc = 0;
    function computSubtotal() {
        console.log("hoooy!!!!")
        _s.subTot = Math.round(_s.listItems.reduce(function (ac, cu) {
            //console.log(cu.price)
            console.log(cu.qty,ac,'cac')
            return ac + (cu.price * cu.qty);
        }, 0))
        _s.totQty = _s.listItems.reduce(function (ac, cu) {
            return ac + cu.qty;
        },0)
        _s.tolDue = Math.round((_s.subTot - _s.disc).toFixed(2));
        //console.log(_s.tolDue)
        console.log(_s.subTot,_s.tolDue)

    }
    _s.dataTable = [];
    _s.qty = "";
    _s.asd = function(data){
        _s.selected = data
    }
    _s.cmdAddTransaction = function (selected,qty,data) {
        selected = _s.selected
        //console.log(data);
        var stockHolder = data.pricesH.filter(function (d){
            if(d.priceID == selected){

                if(qty > d.producePacks){
                    return swal("Error!", "Invalid Quantity input", "error")
                }
                else {
                    if (selected == undefined) {
                        swal("Oops!", "Please select price!", "error");
                    }
                    else if (qty == "") {
                        swal("Oops!", "Please Enter QTY!", "error");
                    }
                    else {
                        var foundValue = data.pricesH.filter(obj=>obj.priceID=== selected);
           
                        //create obj
                        var objToDisplay = {
                            productName:data.productName,
                            productID:data.productID,
                            priceID:selected,
                            qty:qty,
                            price:foundValue[0].price,
                            producePacks:d.producePacksInKG,
                            minusKGinOverAllStocks: d.producePacksInKG * qty
                        }
                        _s.minusKGinOverAllStocks = foundValue[0].producePacksInKG * qty;
                        _s.productID = data.productID;
                        var dataholder = _s.dataTable.filter(function (p) {
          
                            return p.priceID == selected;
                        });
                        if(dataholder.length > 0){
                            swal("Oops!", "Item already exist!", "error");
                        }
                        else{
                            _s.dataTable.push(objToDisplay)
                
                        }
                        console.log(_s.dataTable);
                        console.log(_s.minusKGinOverAllStocks)
                    }
                }
            }
            //return d.priceID == selected
        })
        //console.log(stockHolder,"ako ni")
       

    }
    _s.cmdSubmitTransaction = function(){
        console.log(_s.dataTable)
        //console.log(_s.minusKGinOverAllStocks)
        _h.post("cmdSumbitTransaction", {
            trans : _s.dataTable
            //minusKGinOverAllStocks : _s.minusKGinOverAllStocks
        }).then(function(x){

            //_h.post("printdata?ledgerID=" + 'LIDF744105').then(function(){
                window.open('../reports/WebForm1.aspx?view=recipe');
            //});
            _s.dataTable = [];
            loadVegeProducts();
            swal("Success!", "Item Purchased", "success");
          
        });
    }
    _s.buttonPrint = function(){
        console.log("ha?")
      
      
    }
    _s.mode = "Text Mode";
    //1 is for Text Mode
    _s.barcodeChange = function(d){
        loadVegeProducts(_s.itemCode)
    }
    _s.changeMode = function(per){
        //console.log("hello world",per.isActive)
        if(per.isActive){
            _s.mode = "Barcode Mode"
            var elem = document.getElementById("scanBarcode");
            elem.onkeydown = function(e){
                if(e.keyCode == 13){
                    loadVegeProducts(_s.itemCode)
                    console.log("E")
                }
            }
        }
        else{
            _s.mode = "Text Mode";
            var elem = document.getElementById("scanBarcode");
            elem.onkeyup = function(e){
                if(e.keyCode == 13){
                    TextloadProducts(_s.itemCode)
                    console.log('ako natawag')
                }
            }   
        }
    }
    var elem = document.getElementById("scanBarcode");
    elem.onkeyup = function(e){
        if(e.keyCode == 13){
            TextloadProducts(_s.itemCode)
            console.log('ako natawag')
        }
    }   
    function TextloadProducts(textCode){
        _h.post('../product/TextloadProducts',{searchCode: textCode}).then(function (d) {
            console.log(d.data)
            //if(d.data.producePacks == null || d.data.producePacks == 0){
               
               
            //    swal("Notice!","No Available Stocks","info")
            //    $('#scanBarcode').focus();
            //    _s.itemCode = "";
            //}
            //else{
                if(_s.listItems.length > 0){
                    for(var o = 0; o < d.data.length; o++){
                        _s.listItems.push(d.data[o])
                        console.log(d.data[o],"DSA")
                    }
                }
                else {
                    //d.data.qty = 1;
                    console.log("hello")
                    _s.listItems = d.data;
                }
                var uniqueArray = removeDuplicates(_s.listItems, "priceID");
                _s.listItems = uniqueArray
                console.log(_s.listItems.length)
                computSubtotal();
            //}
        });
    }
    function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};

        for(var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
    listOfKaagapayProducts();
    function listOfKaagapayProducts(){
        _h.get('../product/loadProductsKaagapayOnly').then(function(d){
            _s.listProducts = [];
            _s.listProducts = d.data;
            console.log("#!2")

        })
    }
    _s.addManualMode = function(item){
        var obj = []
        angular.forEach(_s.catchArr, function(value, key){
            obj = {
                barcodeID: "No Barcode",
                category: ["Veges"],
                price: item.pricePerKG,
                priceID: null,
                producePacks: null,
                producePacksInKG: 0,
                qty:  item.qty,
                productID: item.productID,
                productName: [value.productName],
                stocks:value.stocks,
                stockPrice : value.price
            };
            _s.listItems.push(obj)
        });
        _s.catchArr = [];
        computSubtotal();
        //listOfKaagapayProducts
        _s.listProducts = [];
     
        _h.get('../product/loadProductsKaagapayOnly').then(function(d){
            _s.listProducts = d.data;

        })
        _s.item.pricePerKG = "";
        _s.item.qty ="";
        console.log(_s.listItems,"ako si list")
    }
    _s.focusSelectCommodity = function(){
        document.getElementById("selectPName").focus();
    }
    _s.getStocksOfProduct = function(id){
        _h.post('../product/ManualModeGetStocks',{pid: id}).then(function (d) {
            _s.catchArr = [];
            _s.catchArr = d.data;
        })
    }
})