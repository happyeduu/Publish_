var App = angular.module("App_add", []);
App.controller("Ctrl_add", function ($filter, $scope, $http) {
    var _s = $scope;
    var _h = $http;
    loadVegeProducts();
    _s.activeEdit = true;
    function loadVegeProducts() {
        _h.get('loadProducts').then(function (d) {
            _s.prodList = [];
            _s.prodList = d.data;
            _s.tempArr = [];
            _s.tempArr = d.data;
            console.log(d.data)
        });
    };
    _s.getMarkup = function (r, c) {
        return (((r - c) / c) * 100);
    }
    _s.p_id = "";
    _s.cdmPriceHist = function (p_id) {
        _s.p_id = p_id;
        _s.selectedProdName = ""
        var dataholder = _s.prodList.filter(function (d) {
            if (d.productID == p_id) {
                _s.selectedProd = d.pricesH;
                _s.selectedProdName = d.productName;
                console.log(_s.selectedProd,"ara oh ka klaro ana")
            }
        })
    }
    _s.cmdEditPrice = function (priceID) {
        _s.activeEdit = false;
        _s.ifActiveEdit = true;
    
    }
    _s.cmdCancelEdit = function () {
        _s.activeEdit = true;
        _s.ifActiveEdit = false;
    }
    _s.hardRefresh = function () {
        loadVegeProducts();
        setTimeout(function () {
            _s.cdmPriceHist(_s.p_id);
        }, 1)
    }
    _s.cmdSaveEdit = function (priceID,price) {
        swal({
            title: "Are you sure?",
            text: "This item will be remove.",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
        },
      function (isConfirm) {
          if (isConfirm) {
              _h.post("updateProductPrice", { priceID: priceID, price: price }).then(function (d) {
                  loadVegeProducts();
                  setTimeout(function () {
                      _s.cdmPriceHist(_s.p_id);
                  }, 100)
                  swal("Updated!", "Your item price is updated", "success");
              }, errorCallback);
              
          } else {
              swal("Cancelled", "Your item is safe :)", "error");
          }
      });
    }
    function errorCallback() {
        swal("ERROR", "ERROR IN THE SYSTEM", "error");
    }
    function successCallback(title,msg,type) {
        swal(title,msg,type)
    }
    loadCategory();
    function loadCategory() {
        _h.get("loadCategory").then(function (d) {
            _s.categoryList = [];
            _s.categoryList = d.data;
            //console.log(_s.categoryList);
        });
    }
    getCommodity();
    function getCommodity() {
        _h.get(API + 'Commodities').then(function (x) {
            _s.commodityList = [];
            _s.commodityList = x.data.commodities;
        })
    }
    getProducers();
    function getProducers() {
        _h.get('getProducers').then(function (x) {
            _s.producerList = [];
            _s.producerList = x.data;
        })
    }
    _s.cmdAddProduct = function (per, item) {
        var sel = document.getElementById("selectPName");
        var productName = sel.options[sel.selectedIndex].text;

        _h.post('checkBarcode', { barcodeID: per.barcodeID }).then(function (x) {
            //console.log(x.data)
            if (x.data.length > 0) {
                swal("Barcode Exist", "Please input another barcode, it belongs to " + x.data[0].productName, "error")
                return
            }
            if (per.categoryID == 1) {
                //save sa pasalubong
                console.log("hello?", per, item)
                _h.post('cmdSaveProductPasalubong', { p: per, price: item.retail, cost: item.cost, barcode: per.barcodeID }).then(function (d) {
                    $("#upload").show();
                    $("#reg").hide();
                    console.log('dsadasdasdas')
                })
            }
            else {
                //save as kaagapay
                _h.post('cmdSaveProduct', { p: per, productName: productName, price: item.retail, cost: item.cost, barcode: per.barcodeID }).then(function (d) {
                    $("#upload").show();
                    $("#reg").hide();
                })
            }
        });

        //_h.post("cmdAddProduct", { pname: per.productName, cat: per.catID }).then(function (x) {
        //    alert("update")
        // });
   
    }
    //upload image
    _s.selectPicforUpdate = function (i) {
        _s.idforUpdateImg = i;
        //console.log(i);
        $("#imageBrowes1").click();
    }
    angular.element(document).ready(function () {
        //$('.i-checks').iCheck({
        //    checkboxClass: 'icheckbox_square-green',
        //    radioClass: 'iradio_square-green',
        //});

        $("#imageBrowes1").change(function () {

            $("#loader").show();
            var file = $("#imageBrowes1").get(0).files;
            var sdata = new FormData;
            sdata.append("picture", file[0]);
            sdata.append("productID", _s.idforUpdateImg);
            console.log(_s.idforUpdateImg,"1");
            console.log(file[0],"!");
            //   console.log(sdata);
            $.ajax({

                type: "Post",
                url: "../product/UpdatePic",
                data: sdata,
                contentType: false,
                processData: false,
                success: function (imgId) {
                    _s.candidates = imgId;
                    location.reload();
                    console.log("updated")
                    //loadVegeProducts();   
                    alert("Updated");
                    //$("#uploadedImage").append('<img src="/Test/ImageRetrieve?imgID=' + imgID + '" class="img-responsive thumbnail"/>');
                    //$("#uploadedImage").append('<img src="/UploadedImage/' + response + '" class="img-responsive thumbnail"/>');
                }
            });
            //_s.candidates = imgId;
            location.reload();
            console.log("updated")
            //loadVegeProducts();
            alert("Updated");
        });
        //s.getcandidate(s.eventid);
        // s.getJudgeDet();
    });
    _s.addProductPrice = function (pot) {
        console.log(_s.p_id, pot)
        //cmdAddProductPrices
        _h.post('checkBarcode', { barcodeID: pot.barcodeID }).then(function (x) {
            //console.log(x.data)
            if (x.data.length > 0) {
                swal("Barcode Exist", "Please input another barcode, it belongs to " + x.data[0].productName, "error")
                return
            }
            else {
                _h.post("cmdAddProductPrices", { prod_ID: _s.p_id, price: pot.retail, barcodeID: pot.barcodeID, cost: pot.cost }).then(function (x) {
                    successCallback("Success", "Added successfull", "success");
                }, errorCallback);
            }
        });
    }
    _s.cmdUpdatePriceStatus = function (priceID, status) {
        _h.post('cmdUpdatePriceStatus', { priceID: priceID, status: status }).then(function (d) {
            _s.hardRefresh()
            successCallback("Success", "Update successfull", "success");
        }, errorCallback);
    };
    _s.cmdChangeProductStatus = function (productID, status) {
        _h.post('cmdChangeProductStatus', { productID: productID, status: status }).then(function (g) {
            _s.hardRefresh()
            if (status != false) {
                successCallback("Success", "Deactivated successfull", "warning");
            }
            else {
                successCallback("Success", "Activated successfull", "warning");
            }
        }, errorCallback);
    }
    _s.deactivated_ID = 0;
    _s.loadProductsDeactivated = function () {
        _s.deactivated_ID = 1;
        _h.get('loadProductsDeactivated').then(function (d) {
            _s.prodList = [];
            _s.prodList = d.data;
            console.log("d.data",d.data)
        });
   
    }
    _s.isKaagapay = 0;
    _s.loadProductsActivated = function () {
        _s.deactivated_ID = 0;
        loadVegeProducts();
    }
    _s.showPasalubong = function () {
        _s.isKaagapay = 1;
        _s.prodList = _s.tempArr.filter(function (o) {
            return o.categoryList.categoryID == 1
        })
    }
    _s.showKAAGAPAY = function () {
        _s.isKaagapay = 0;
        _s.prodList = _s.tempArr.filter(function (o) {
            return o.categoryList.categoryID != 1
        })
    }
})