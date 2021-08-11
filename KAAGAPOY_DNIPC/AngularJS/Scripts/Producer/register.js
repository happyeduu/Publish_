var App = angular.module("app_reg", []);
App.controller("ctrl_reg", function ($filter, $scope, $http) {


    var _s = $scope;
    var _h = $http;
    _s.prodquery = "";
    _s.loadProducer =  function loadProducers(){
        _s.prodlazyindex = _s.producers.length;
        console.log(_s.producers[_s.producers.length - 1].prodID, "DSADADASDAS")
        _h.post("loadProducer23", { q: _s.prodquery, p: 12, i: _s.producers[_s.producers.length - 1].prodID }).then(function (d) {
            _s.producers = _s.producers.concat(d.data);
            console.log(_s.producers)
        });
    }
    _s.pageLoad = function () {
        console.log("kani natawag", _s.prodquery)
        _h.post("loadProducer23", { q: _s.prodquery, p: 12, i: 0 }).then(function (d) {
            _s.producers = d.data;
            //_s.prodlazyindex = d.data.result.length;
            console.log(d.data)
        });
    }
    _s.addProducer = function (d) {
        _h.post('cmdSaveProducers', { producer: d }).then(function (d) {
            swal("Success", "Successfully Saved", "info");
            $("#addProducer").modal('hide');
            loadProducers();
        });
    }

    _s.searchProducer = function () {
        _h.post("loadProducer23", { q: _s.prodquery, p: 12, i: 0 }).then(function (d) {
            _s.producers = d.data;
            if (d.data.length > 0) {
                $("#prodNoResult").hide();


            } else {
                $("#prodNoResult").show();
            }
            console.log(d.data.length)
        });
    }
    _s._searchAgain = function () {
        _s.prodquery = "";
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
            _s.loadProducer();
            console.log("hakdog")
        }
    });
});
