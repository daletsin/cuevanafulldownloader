
//regexp extensiones permitidas
var regexpvideo = /\.mp4\?|\.mp4$|\.flv\?|\.flv$|googlevideo\.com\/videoplayback\?|googlevideo\.com\/videoplayback$|\.3gp\?|\.3gp$|\.mov\?|\.mov$|\.avi\?|\.avi$|\.wmv\?|\.wmv$|\.webm\?|\.webm$|www(.*)uptobox\.com\/stream|content\-na\.drive\.amazonaws\.com\/cdproxy\/templink/;
var regexpsub = /\.srt\?|\.srt$|\.vtt\?|\.vtt$|zate\.tv\/files\/srt_encode\.php/;
var regexpsubzate = /zate\.tv\/files\/srt_encode\.php/;

//objetos url
var urlvideos = {};
var urlsub = {};
var urlpersonalizado = {};

var Validador = function () {
    //obtiene parametro de un string tipo querystring
    this.get_querystring_variable = function (variable, query) {
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    //filtra url válidas (general)
    this.validar_url = function (details, regexp, type) {
        var urlzate = false;
        if (urlzate = this.validar_url_zate(details, regexpsubzate, type)) {
            return urlzate;
        }else if(details.url.match(regexp)) {
            var u = details.url.split('?');
            if (u[0].match(regexp) && details.type != 'xmlhttprequest') {
                console.log(details);
                return details.url;
            }
        }
        return false;
    }

    //filtra url validas (zate.tv)
    this.validar_url_zate = function (details, regexp, type) {
        var u = details.url.split('?');
        if (type == 'sub' && u[0].match(regexpsubzate)) {
            console.log(details);
            return this.get_querystring_variable('url', u[1]);
        }
    }
}

//crear parametros necesarios para url del popup
var crear_url_popup = function (tabid) {
    var url = 'popup.html?init=1';
    if (urlvideos[tabid] != undefined) {
        url += '&urlsvideo=' + urlvideos[tabid];
    }
    if (urlsub[tabid] != undefined) {
        url += '&urlssub=' + urlsub[tabid];
    }
    if (urlpersonalizado[tabid] != undefined) {
        url += '&urlpersonalizado=' + urlpersonalizado[tabid];
    }
    return url;
}


//crear badge
var crear_badge = function(tabid){
    var cant_badge_sub = 0;
    var cant_badge_videos = 0;
    var cant_badge_personalizado = 0;
    var total_badge = 0;
    var badge = {};
    if (urlvideos[tabid] != undefined) {
        cant_badge_videos += urlvideos[tabid].length;
    }
    if (urlsub[tabid] != undefined) {
        cant_badge_sub += urlsub[tabid].length;
    }
    if (urlpersonalizado[tabid] != undefined) {
        cant_badge_personalizado += urlpersonalizado[tabid].length;
    }
    
    total_badge = cant_badge_sub + cant_badge_videos + cant_badge_personalizado;
    if (total_badge == 0) {
        badge.text = '';
    } else {
        badge.text = total_badge.toString();
    }    
    badge.tabId = tabid;
    chrome.browserAction.setBadgeText(badge);

}


//WebRequests
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
      var url = false;
      var validador = new Validador();
      if (details.tabId > 0) {
          //si es video
          if (url = validador.validar_url(details, regexpvideo, 'video')) {
              
              if (!urlvideos.hasOwnProperty(details.tabId)) {
                  //creo array de urls
                  urlvideos[details.tabId] = [];
              }
              //si no existe esta url en el array la agrego
              if (urlvideos[details.tabId].indexOf(encodeURIComponent(url)) == -1) {
                  //agrego url al array
                  urlvideos[details.tabId].push(encodeURIComponent(url));
              }
            //objeto popup
            var popup = {};
            popup.tabId = details.tabId;
            popup.popup = crear_url_popup(details.tabId);
            crear_badge(details.tabId);
            chrome.browserAction.setPopup(popup);
              

          }
          //si es sub
          if (url = validador.validar_url(details, regexpsub, 'sub')) {
              
              if (!urlsub.hasOwnProperty(details.tabId)) {
                  //creo array de urls
                  urlsub[details.tabId] = [];
              }
              //si no existe esta url en el array la agrego
              if (urlsub[details.tabId].indexOf(encodeURIComponent(url)) == -1) {
                  //agrego url al array
                  urlsub[details.tabId].push(encodeURIComponent(url));
              }
            //objeto popup
            var popup = {};
            popup.tabId = details.tabId;
            popup.popup = crear_url_popup(details.tabId);
            crear_badge(details.tabId);
            chrome.browserAction.setPopup(popup);
              

          }
          //si es personalizado
          chrome.storage.sync.get({
              codigo: ''
          }, function (items) {
              if (items.codigo != '') {
                  var regexppersonalizado = new RegExp(items.codigo, "i");
              }
              if (regexppersonalizado != undefined) {
                  if (url = validador.validar_url(details, regexppersonalizado, 'personalizado')) {

                      if (!urlpersonalizado.hasOwnProperty(details.tabId)) {
                          //creo array de urls
                          urlpersonalizado[details.tabId] = [];
                      }
                      //si no existe esta url en el array la agrego
                      if (urlpersonalizado[details.tabId].indexOf(encodeURIComponent(url)) == -1) {
                          //agrego url al array
                          urlpersonalizado[details.tabId].push(encodeURIComponent(url));
                      }
                      //objeto popup
                      var popup = {};
                      popup.tabId = details.tabId;
                      popup.popup = crear_url_popup(details.tabId);
                      crear_badge(details.tabId);
                      chrome.browserAction.setPopup(popup);
                  }
              }
          });          
      }      
  },
  {urls: ["<all_urls>"]
  });

//Reiniciar urls al actualizar tab
chrome.tabs.onUpdated.addListener(function (tabid, changeinfo, tab) {
    urlsub[tabid] = [];
    urlvideos[tabid] = [];
    crear_badge(tabid);
})

