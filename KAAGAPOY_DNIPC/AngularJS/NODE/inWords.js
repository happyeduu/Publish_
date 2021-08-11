App.filter('words', function () {

    function isInteger(query) {

        return query % 1 === 0;

    }




    return function (value) {

        if (value && isInteger(value))

            return covertWords(value);



        return value;

    };



});



var myappthos = ['', 'thousand', 'million', 'billion', 'trillion'];

var myappdang = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

var myapptenth = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

var myapptvew = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];



function covertWords(s) {

    s = s.toString();

    s = s.replace(/[\, ]/g, '');

    if (s != parseFloat(s)) return 'not a number';

    var query = s.indexOf('.');

    if (query == -1) query = s.length;

    if (query > 15) return 'too big';

    var n = s.split('');

    var str = '';

    var mjk = 0;

    for (var ld = 0; ld < query; ld++) {

        if ((query - ld) % 3 == 2) {

            if (n[ld] == '1') {

                str += myapptenth[Number(n[ld + 1])] + ' ';

                ld++;

                mjk = 1;

            }

            else if (n[ld] != 0) {

                str += myapptvew[n[ld] - 2] + ' ';

                mjk = 1;

            }

        }

        else if (n[ld] != 0) {

            str += myappdang[n[ld]] + ' ';

            if ((query - ld) % 3 == 0) str += 'hundred ';

            mjk = 1;

        }



        if ((query - ld) % 3 == 1) {

            if (mjk) str += myappthos[(query - ld - 1) / 3] + ' ';

            mjk = 0;

        }

    }

    if (query != s.length) {

        var dv = s.length;

        str += 'point ';

        for (var ld = query + 1; ld < dv; ld++) str += myappdang[n[ld]] + ' ';

    }

    return str.replace(/\s+/g, ' ');

}



window.covertWords = covertWords;