# Behavioral specification

## Yandex

### Service detection

`http://[www.]yandex.ru/.*` — веб-поиск
→ `http://www.google.ru/search?q=111`

`http://images.yandex.ru/.*` — картинко-поиск
→ `http://www.google.ru/search?q=%request%&tbm=isch`

### Search request extraction

Поисковый запрос в элементе `<input name="text" />` (в поиске по вебу и картинкам). Извлекается так:

     '''javascript
     document.getElementsByName("text")[0].value
     '''

Или так (jQuery):

     '''javascript
     $('input[name=text]')
     '''

Альтернативный вариант: поисковый запрос — значение GET-параметра `text`.

### Google

Поисковый запрос находится в элементе `input`, у которого `name="q"`. Извлекается так:

     '''javascript
     document.getElementsByName("q")[0].value
     '''

Или так (jQuery):

     '''javascript
     $('input[name=q]')
     '''

Альтернативный вариант (overcomplicated): если URL начинается с { `http://www.google.(ru|com)/search?`,  `http://images.google.(ru|com)/search?` }, парсим Google SERP URL:

1. Если URL содержит «#», Query = всё, что после «#».
Иначе Query = всё, что после «/search?».
Request = значение параметра «q» в Query.
2. Если домен — images.google.(ru|com), это картинки.
Иначе проверить наличие в Query параметра «tbm».
Если такого параметра нет, это веб.
Если параметр есть и равен «isch», это картинки.
Иначе, URL не актуален.

#### URL parsing aproach

`http://[www.]google.(ru|com)/search.*` — веб-поиск
→ `http://yandex.ru/yandsearch?text=111`

`http://images.google.(ru|com)/search.*` — картинко-поиск
→ `http://images.yandex.ru/yandsearch?text=%request%`
