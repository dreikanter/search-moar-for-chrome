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
  if(url.match(/^https?\:\/\/(www)?\.google\.\w{2,3}\/(search|imgres)\?/))
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

function redirectSearchRequest(tab)
{
  currentEngine = getSearchEngineType(url);
  engine = (currentEngine == "g") ? "y" : "g";
  service = getSearchService(url);
  request = getSearchRequest(currentEngine);

  navigateTo(getSerpUrl(engine, service, request));
}

function getSearchService(url)
{
  if(url.match(/^https?:\/\/(www)?\.google\.\w{2,3}\/search\?.*tbm=isch/) ||
     url.match(/^https?:/\/(www\.|images\.)?yandex\.\w{2,3}\/yandsearch\?/))
  {
    return "images";
  }
  else if(url.match(/^https?:\/\/(www)?\.google\.\w{2,3}\/search\?/))
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
      return "";

    case "y":
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

chrome.tabs.onUpdated.addListener(matchUrl);
chrome.pageAction.onClicked.addListener(redirectSearchRequest); 
