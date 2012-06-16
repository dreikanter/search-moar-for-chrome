# Behavioral specification

## Yandex

Поисковый запрос находится в элементе `<input name="text" />` (в поиске по вебу и картинкам). Извлекается так:

	document.getElementsByName("text")[0].value

Или так (jQuery):

	$('input[name=text]')

Альтернативный вариант: значение GET-параметра `text` из URL-a поисковой выдачи.

Правила редиректа:

1. Веб-поиск: `http://[www.]yandex.ru/.*` редиректим на `http://www.google.ru/search?q=111`
2. Картинко-поиск: `http://images.yandex.ru/.*` редиректим на `http://www.google.ru/search?q=%request%&tbm=isch`

## Google

Поисковый запрос находится в элементе `input`, у которого `name="q"`. Извлекается так:

	document.getElementsByName("q")[0].value

Или так (jQuery):

	$('input[name=q]')

Альтернативный вариант (overcomplicated): если URL начинается с `http://www.google.(ru|com)/search?` или `http://images.google.(ru|com)/search?`, парсим Google SERP URL:

1. Если URL содержит «#», Query = всё, что после «#».
Иначе Query = всё, что после «/search?».
Request = значение параметра «q» в Query.
2. Если домен — images.google.(ru|com), это картинки.
Иначе проверить наличие в Query параметра «tbm».
Если такого параметра нет, это веб.
Если параметр есть и равен «isch», это картинки.
Иначе, URL не актуален.

Правила редиректа:

1. Веб-поиск: `http://[www.]google.(ru|com)/search.*` редиректим на `http://yandex.ru/yandsearch?text=111`
2. Картинко-поиск: `http://images.google.(ru|com)/search.*` редиректим на `http://images.yandex.ru/yandsearch?text=%request%`
