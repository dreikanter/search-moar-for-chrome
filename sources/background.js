function matchUrl(tabId, changeInfo, tab)
{
  switch(getSearchEngineType(tab.url))
  {
    case "g":
      showPageActionIcon(tabId, "y", "Search with Yandex");
      break;

    case "y":
      showPageActionIcon(tabId, "g", "Search with Google");
      break;

    default:
      hidePageActionIcon(tabId);
      break;
  }
}

function getSearchEngineType(url)
{
  if(url.match(/^https?:\/\/(www)?\.google\.\w{2,3}\/(search\?|imgres\?|webhp#)/))
  {
    return "g";
  }
  else if (url.match(/^https?:\/\/(www\.|images\.)?yandex\.\w{2,3}\/yandsearch\?/))
  {
    return "y";
  }

  return "";
}

function showPageActionIcon(tabId, iconId, title)
{
  iconPath = (iconId == "y" || iconId == "g") ?
    ("icons/icon-" + iconId + "-18.png") : "";

  chrome.pageAction.show(tabId);
  chrome.pageAction.setIcon({ tabId: tabId, path: iconPath});
  chrome.pageAction.setTitle({ tabId: tabId, title: title });
}

function hidePageActionIcon(tabId)
{
  chrome.pageAction.hide(tabId);
}

String.prototype.format = function() {
    var formatted = this;
    for(arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function onPageIconClick(tab)
{
  chrome.tabs.executeScript(tab.id, {file: 'querygetter.js'});

  // currentEngine = getSearchEngineType(tab.url);
  // engine = (currentEngine == "g") ? "y" : "g";
  // service = getSearchService(tab.url);
  // request = getSearchRequest(currentEngine);
  // trueValues = [currentEngine, engine, service, request];
  // alert(trueValues.join("\n"));

  // navigateTo(getSerpUrl(engine, service, request));
}

function getSearchService(url)
{
  if(url.match(/^https?:\/\/(www)?\.google\.\w{2,3}\/(search|imgres)\?.*tbm=isch/) ||
     url.match(/^https?:\/\/(www\.|images\.)?yandex\.\w{2,3}\/yandsearch\?/))
  {
    return "images";
  }
  else if(url.match(/^https?:\/\/(www)?\.google\.\w{2,3}\/(search\?|webhp#)/) ||
          url.match(/^https?:\/\/(www\.)?yandex\.\w{2,3}\/yandsearch\?/))
  {
    return "web";
  }

  return "";
}

function getSearchRequest(searchEngine)
{
  switch(searchEngine)
  {
    case "g":
      elements = document.getElementsByName('q');
      alert(elements[0].value);
      console.log(elements[0].value);

      //alert($('input[name="q"]').val());
      return "";

    case "y":
      alert($('input[name="text"]').attr('value'));
      return "";

    default:
      return "";
  }
}

function getSerpUrl(engine, service, request)
{
  if(engine == "g")
  {
    if(service == "web")
    {
      // Yandex web search
      return "http://yandex.ru/yandsearch?clid=1806159&text=" + request;
    }
    else
    {
      // Yandex image search
      return "http://images.yandex.ru/yandsearch?text=" + request + "&stype=image&from=os";
    }
  }
  else
  {
    if(service == "web")
    {
      // Google web search
      return "http://google.com/search?q=" + request;
    }
    else
    {
      // Google images search
      return "https://www.google.com/search?tbm=isch&q=" + request;
    }
  }
}

function navigateTo(url)
{
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
}

// Search requests receiver from content script
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    alert(request.serchQuery);
  });

chrome.tabs.onUpdated.addListener(matchUrl);
chrome.pageAction.onClicked.addListener(onPageIconClick);
