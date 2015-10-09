//obtiene valor de parametros url
var get_query_variable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

var crear_enlace = function (url, type, tem) {
    var template = tem;
    template = template.replace(/{{TYPE}}/g, type).replace(/{{URL}}/g, url);
    return template;
}

var template = '<p><a class="{{TYPE}}" href="{{URL}}" alt="{{URL}}" title="{{URL}}" download>Click para descargar archivo {{TYPE}}</a></p>';


$(document).ready(function () {
    var urlsvideos = get_query_variable("urlsvideo");
    if (urlsvideos) {
        urlsvideos = urlsvideos.split(',');
        for (i in urlsvideos) {        
            var url = decodeURIComponent(urlsvideos[i]);
            $('#contenido').append(crear_enlace(url, 'video', template));            
        }
    }
    var urlssub = get_query_variable("urlssub");
    if (urlssub) {
        urlssub = urlssub.split(',');
        for (i in urlssub) {
            var url = decodeURIComponent(urlssub[i]);
            $('#contenido').append(crear_enlace(url, 'sub', template));
        }
    }
    
    var urlpersonalizado = get_query_variable("urlpersonalizado");
    if (urlpersonalizado) {
        urlpersonalizado = urlpersonalizado.split(',');
        for (i in urlpersonalizado) {
            var url = decodeURIComponent(urlpersonalizado[i]);
            $('#contenido').append(crear_enlace(url, 'personalizado', template));
        }
    }
    



    document.querySelector('#opciones').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});
