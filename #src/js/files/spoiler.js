"use strict"

// SPOILERS

/* получаем коллекцию всех объектов, у которых есть data-атрибут: spoilers */
const spoilersArray = document.querySelectorAll('[data-spoilers]');

/* проверяем есть ли такие объкты */
if (spoilersArray.length > 0) {
	/* переведём все полученные объкты(коллекцию) в массив и разделим на 2-ва массива: с простыми спойлерами и спойлерами, работающими по определённым условиям: */

	// Получим обычные спройлеры:
	const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
		//проверим осутствие параметров у атрибута data-spoilers объектов
		/* обращаемся к элементу массива.заходим в его data-атрибут.обращаемся к конкретному атрибуту spoilers.преобразуем содержимое в массив с разделителем (запятая) и запрашиваем 1-ю ячейку с индеком [0] Атрибут НЕ должен содержать первого параметра (данных в этой ячейке), тогда этот объект(элементу массива) попадёт в const spoilersRegular */
		return !item.dataset.spoilers.split(",")[0];
	});
	//Инициализация обычных спойлеров:
	/* Если такие объекты(элементы массива) существуют */
	if (spoilersRegular.length > 0) {
		initSpoilers(spoilersRegular);
	}

	// Получим спройлеры с медиа-запросами:
	const spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
		return item.dataset.spoilers.split(",")[0];
	});
	//Инициализация спройлеров с медиа-запросами:
	if (spoilersMedia.length > 0) {
		/* создаём константу с пустым массивом (его мы будем наполнять параметрами): */
		const breakpointsArray = [];
		/* переберём (с помощью forEach) массив объктов, которые мы собрали: */
		spoilersMedia.forEach(item => {
			/* обращаемся к data-атрибуту spoilers и сохраним в константе строку с параметрами для каждого объкта: */
			const params = item.dataset.spoilers;
			/*создаём пустой объкт и будем его наполнять: */
			const breakpoint = {};
			/* преобразовываем строку внутри params в массив (с помощью split) с разделителем (запятая) и сохраняем в константе: */
			const paramsArray = params.split(",");
			/*  для пустого объкта breakpoint создаём значение value и присваиваем туда нулевую ячейку массива (ширина экрана): */
			breakpoint.value = paramsArray[0];
			/* соэраним значение min для этого объекта ( по умолчанию будет-max) */
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			/* сохраним сам объект */
			breakpoint.item = item;
			/* заполненный значениями объект breakpoint добавляем в массив breakpointsArray: */
			breakpointsArray.push(breakpoint);
		});

		// Что бы учесть повторения, получаем уникальные брейкпоинты:
		/* сохраним в переменной, переделанный с помощью метода map массив breakpointsArray*/
		let mediaQueries = breakpointsArray.map(function (item) {
			/* соберём строку с медиа-запросом: */
			return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
		});
		/* через переменную mediaQueries(массив), обращаемся к функции и фильтруем массив и возвращаем уникальные значения и сохраняем внутри массива mediaQueries*/
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		/* пробежимся по массиву mediaQueries, который мы собрали.убрали все дубли и т.д. ,с помощью forEach ( по всем брейкпоинтам */
		mediaQueries.forEach(breakpoint => {
			/* в константу получаем строку(одну запись данного массива), которую преобразуем в массив с помощью разделителя (запятая) */
			const paramsArray = breakpoint.split(",");
			/*  в константу получаем первый параметр массива параметров (число-ширина экрана) */
			const mediaBreakpoint = paramsArray[1];
			/* в константу получаем второй параметр массива параметров (число-ширина экрана) */
			const mediaType = paramsArray[2];
			/* в константу сохраним результат работы метода matchMedia, который будет слушать ширину жкрана и отрабатывать если сработает тот или иной брейк поинт В параметры(в скобках) указываем нулевой параметр массива (строка, которую мы форировали ранее)*/
			const matchMedia = window.matchMedia(paramsArray[0]);
			// Соберём массив обектов, которые соответствуют данному брейкпоинту, фильтруем и сохраним в константу
			const spoilersArray = breakpointsArray.filter(function (item) {
				/* если совпадает и число и тип, то объект попадает в массив spoilersArray */
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});

			// Создадим событие,которое будет отрабатывать при достижении условия брейкпоинта:
			matchMedia.addListener(function () {
				initSpoilers(spoilersArray, matchMedia);
			});
			initSpoilers(spoilersArray, matchMedia); // функция так же отработает при загрузке страницы
		});
	}

	// Функции (методы) для работы спойлеров:

	// ИНИЦИАЛИЗАЦИЯ
	function initSpoilers(spoilersArray, matchMedia = false/* по умолчанию */) {
		/* пробежимся по каждому элементу(spoilersBlock) массива*/
		spoilersArray.forEach(spoilersBlock => {
			/* сделаем проверку: если matchMedia не false(имеет значение), то присваиваем имя item объкту spoilersBlock, иначе оставляем без именений*/
			spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
			/* сделаем условное ветвление: если наш брейкпоинт сработал(matchMedia.matches вернёт false) или были переданы обычные спойлеры(без медиа-запросов) т.е. matchMedia НЕ true(false), тогда: */
			if (matchMedia.matches || !matchMedia) {
				/* оболочке спойлера присваивается технический класс '_init': */
				spoilersBlock.classList.add('_init');
				/* отправляем данный объект в функцию: */
				initSpoilerBody(spoilersBlock);
				/* На объкт spoilersBlock вешаем событие "click" и вызываем функцию: */
				spoilersBlock.addEventListener("click", setSpoilerAction);
			} else {
				/* иначе */
				/* отбираем у блока технический класс '_init': */
				spoilersBlock.classList.remove('_init');
				/* передаём в функцию объкт и параметр false: */
				initSpoilerBody(spoilersBlock, false);
				/* убираем событие "click" на блоке: */
				spoilersBlock.removeEventListener("click", setSpoilerAction);
			}
		});
	}
	// РАБОТА С КОНТЕНТОМ СПОЙЛЕРА
	function initSpoilerBody(spoilersBlock, hideSpoilerBody = true/* по умолчанию*/) {
		/* получим все заголовки спойлеров внутри конкретного блока: */
		const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
		/* проверяем есть ли у нас такие заголовки: */
		if (spoilerTitles.length > 0) {
			spoilerTitles.forEach(spoilerTitle => {
				if (hideSpoilerBody/* true */) {
					/* у этого заголовка убираем атрибут 'tabindex'(возможность перехода по данным заголовкам по щелчку на Tab): */
					spoilerTitle.removeAttribute('tabindex');
					/* проверка: есть ли у заголовка НЕТ класса '_active': */
					if (!spoilerTitle.classList.contains('_active')) {
						/* тогда мы скрываем контентную часть: обращаемся к заголовку spoilerTitle, далее к nextElementSibling(следующий элемент после заголовка) и используем атрибут hidden со значением true: */
						spoilerTitle.nextElementSibling.hidden = true;
					}
				} else {
					/* Если у нас не сработал брейкпоинт, нам нужно отобразить спойлер в виде обычного блока: */
					/* тогда добабляем атрибут tabindex со значением -1 */
					spoilerTitle.setAttribute('tabindex', '-1');
					/* показываем контентные блоки, если они бвли скрыты: */
					spoilerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	/* добавим функцию, которая исполняется при щелчке на заголовке спойлера */
	function setSpoilerAction(e) {
		// Используем делегирование событий
		/* В константу el получаем нажатый объект: */
		const el = e.target;
		/* проверяем есть ли у самого объкта атрибут data-spoiler или у ближайшего родителя*/
		if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
			const spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
			/* получаем в константу ближайший родительский блок данного спойлера */
			const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
			/* в константу сохраняем результат проверки: нужно ли добавлять данному блоку функционал аккордеона или нет: */
			const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;
			/* проверка: есть ли у родителя в данный момент какие-нибудь объкты внутри с классом '._slide': */
			if (!spoilersBlock.querySelectorAll('._slide').length) {
				/* проверка на аккордион: если oneSpoiler=true и у нажатой кнопки нет класса '_active',тогда нам нужно все остальные спойлеры скрыть(используем функцию hideSpoilersBody, в которую передаём родительский объект): */
				if (oneSpoiler && !spoilerTitle.classList.contains('_active')) {
					hideSpoilersBody(spoilersBlock);
				}
				spoilerTitle.classList.toggle('_active');
				_slideToggle(spoilerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpoilersBody(spoilersBlock) {
		/* в константу получим активный(открытый) спойлер внутри родительского объекта: */
		const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');
		/* если такой есть: */
		if (spoilerActiveTitle) {
			/* убираем класс _active и скрываем все элементы */
			spoilerActiveTitle.classList.remove('_active');
			_slideUp(spoilerActiveTitle.nextElementSibling, 500);
		}
	}
}