//=================================================================================================================================

function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

//==================================================================================================================================

"use strict";

// МЕНЮ-БУРГЕР и его анимация (в шапке сайта): 

/* 1-получим объект (иконку меню-бургер) Будем искать этот класс: */
const iconMenu = document.querySelector('.icon-menu');
/* 3-найдём и сохраним в константу menuBody объект .menu__body (будет нужно для анимирования появления меню при нажатии на иконке (меню-бургер) */
const menuBody = document.querySelector('.menu__body');
/* 2-проверка: есть ли такой обхект(класс) в константе iconMenu: */
if (iconMenu) {
	/* 4-создаём событие "click" по иконке(меню-бургер): */
	iconMenu.addEventListener("click", function (e) {
		/* 7-запретим скроллить страницу при открытом меню: */
		//обатимся к body и будем добавлять(убирать) технический класс '_lock' при нажатой иконке(меню-бургер):
		//document.body.classList.toggle('_lock');
		/* 5-обращаемся к иконке(меню-бургер) и добавляем(убираем) класс '_active' при нажатии на неё: */
		iconMenu.classList.toggle('_active'); /* чтобы анимнровать иконку(меню-бургер) при нажатии */
		/* 6-обращаемся к объекту .menu__body и добавляем(убираем) класс '_active' при нажатии на неё: */
		menuBody.classList.toggle('_active'); /* чтобы анимировать появление меню при нажати на иконку(меню-бургер) */
	});
}

//===================================== Динамический адаптив (переброска блоков меню в выпадающее меню) =============================

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

//==================================================================================================================================

// ОПРЕДЕЛИМ НА КАКОМ УСТРОЙСТВЕ ОТКРЫТА НАША СТРАНИЦА

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i)
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i)
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i)
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i)
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i)
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

// Выезжающее меню на странице:

// Cделаем проверку: является ли устройство мобильным (реагирует на касание) 3:58:12

if (isMobile.any()) {
	let menuParents = document.querySelectorAll('.menu-page__parent>a');
	for (let index = 0; index < menuParents.length; index++) {
		const menuParent = menuParents[index];
		menuParent.addEventListener("click", function (e) {
			menuParent.parentElement.classList.toggle('_active');
			e.preventDefault();
		});
	}
} else {
	let menuParents = document.querySelectorAll('.menu-page__parent');

	for (let index = 0; index < menuParents.length; index++) {
		const menuParent = menuParents[index];
		menuParent.addEventListener("mouseenter", function (e) {
			menuParent.classList.add('_active');
		});
		menuParent.addEventListener("mouseleave", function (e) {
			menuParent.classList.remove('_active');
		});
	}
}

//=================================================================================================================================

// Меню-бургер на странице: 

let menuPageBurger = document.querySelector('.menu-page__burger');
let menuPageBody = document.querySelector('.menu-page__body');
menuPageBurger.addEventListener("click", function (e) {
	menuPageBurger.classList.toggle('_active');
	//menuPageBody.classList.toggle('_active'); /* отключили открытие меню с использованием файла scss */
	_slideToggle(menuPageBody); /* подключили (вызвали) функцию для плавного движения меню (при показе-уходе) */
});

//=================================================================================================================================

// Выпадающее меню поиска: 

let searchSelect = document.querySelector('.search-page__title');
let categoriesSearch = document.querySelector('.categories-search');
searchSelect.addEventListener("click", function (e) {
	searchSelect.classList.toggle('_active');
	_slideToggle(categoriesSearch); /* подключили (вызвали) функцию для плавного движения меню (при показе-уходе) */
});

//=================================================================================================================================

// Вывод количества категорий, выбранных в меню поиска: 

let checkboxCategories = document.querySelectorAll('.categories-search__checkbox');

for (let index = 0; index < checkboxCategories.length; index++) {
	const checkboxCategory = checkboxCategories[index];
	checkboxCategory.addEventListener("change", function (e) {
		checkboxCategory.classList.toggle('_active');

		let checkboxActiveCategories = document.querySelectorAll('.categories-search__checkbox._active');
		// условие: если выбрано больше ноль категорий
		if (checkboxActiveCategories.length > 0) {
			// переменной добавили технический класс _categories: 
			searchSelect.classList.add('_categories');
			let searchQuantity = searchSelect.querySelector('.search-page__quantity');
			// В HTML выводим атрибут data-text="Выбрано категорий:" и через пробел полученное кол-во выбранных категорий: 
			searchQuantity.innerHTML = searchQuantity.getAttribute('data-text') + ' ' + checkboxActiveCategories.length
		} else {
			// у переменной убрали технический класс _categories: 
			searchSelect.classList.remove('_categories');

		}
	});
}

//==================================================================================================================================

//  Инициализируем SWIPER
let sliders = document.querySelectorAll('.swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');

				}
			}

			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {

		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let sliderScrollitems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollitems.length > 0) {
	for (let index = 0; index < sliderScrollitems.length; index++) {
		const sliderScrollitem = sliderScrollitems[index];
		const sliderScrollBar = sliderScrollitem.querySelectorAll('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollitem, {
			observer: true,
			observeParents: true,
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollBar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}

function sliders_bild_callback(params) { }

//======================================================== mainslider ==========================================================

/* Инициализируем Swiper */
/* 1-проверим существует ли класс '.mainslider': */
// 2-в параметры передали объект, который должен стать слайдером (теперь слайды можно листать перетаскиванием) Дополнительные настройки добавим внутри фигурных скобок

if (document.querySelector('.mainslider')) {
	let mainslider = new Swiper('.mainslider__body', {
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 0,
		// оболочка слайдера адаптирует свою высоту к высоте текущего активного слайда
		autoHeight: true,
		//watchOverflow: true,
		speed: 800,
		//loop: true, /* бесконечный слайд (для правильной работы: добавить min-width: 0; для .page__content (flex-контейнера. в котором лежит оболочка для главного слайдера .page__slider)) */
		//loopAdditionalSlides: 5,
		//preloadImages: false,
		//parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-main__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		pagination: {
			el: '.mainslider__dotts',
			clickable: true,
		},
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		/* navigation: {
			nextEl: '.slider-main .slider-arrow--next',
			prevEl: '.slider-main .slider-arrow--prev',
		} */
		on: {
			lazyImageReady: function () {
				ibg();
			},
		}
	});

	// Добавим картинки не активных слайдов точкам (3:41:29)
	let mainsliderImages = document.querySelectorAll('.mainslider__image ');
	let mainsliderDotts = document.querySelectorAll('.mainslider__dotts .swiper-pagination-bullet');

	for (let index = 0; index < mainsliderImages.length; index++) {
		const mainsliderImage = mainsliderImages[index].querySelector('img').getAttribute('src');
		mainsliderDotts[index].style.backgroundImage = "url('" + mainsliderImage + "')";
	}
}

//======================================================= products-slider ==========================================================
if (document.querySelector('.products-slider')) {
	let productsSlider = new Swiper('.products-slider__item', {
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 0,
		// оболочка слайдера адаптирует свою высоту к высоте текущего активного слайда
		autoHeight: true,
		//watchOverflow: true,
		speed: 800,
		//loop: true, /* бесконечный слайд (для правильной работы: добавить min-width: 0; для .page__content (flex-контейнера. в котором лежит оболочка для главного слайдера .page__slider)) */
		//loopAdditionalSlides: 5,
		//preloadImages: false,
		//parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-main__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		pagination: {
			el: '.products-slider__info',
			type: 'fraction'
		},
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		navigation: {
			nextEl: '.products-slider__arrow--next',
			prevEl: '.products-slider__arrow--prev',
		},
		on: {
			lazyImageReady: function () {
				ibg();
			},
		}
	});
}

//========================================================== brands-slider ========================================================

if (document.querySelector('.brands-slider')) {
	let brandsSlider = new Swiper('.brands-slider__body', {
		observer: true,
		observeParents: true,
		slidesPerView: 3,
		spaceBetween: 0,
		// оболочка слайдера адаптирует свою высоту к высоте текущего активного слайда
		//autoHeight: true,
		//watchOverflow: true,
		speed: 800,
		loop: true, /* бесконечный слайд (для правильной работы: добавить min-width: 0; для .page__content (flex-контейнера. в котором лежит оболочка для главного слайдера .page__slider)) */
		//loopAdditionalSlides: 5,
		//preloadImages: false,
		//parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-main__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		/* pagination: {
			el: '.products-slider__info',
			type: 'fraction'
		}, */
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		navigation: {
			nextEl: '.brands-slider__arrow--next',
			prevEl: '.brands-slider__arrow--prev',
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				autoHeight: true,
			},
			595: {
				slidesPerView: 3,
			},
		},
		on: {
			lazyImageReady: function () {
				ibg();
			},
		}
	});
}

//=========================================== images-product__subslider (5-28:05) =================================================

if (document.querySelector('.images-product')) {
	let imagesSubSlider = new Swiper('.images-product__subslider', {
		observer: true,
		observeParents: true,
		slidesPerView: 4,
		spaceBetween: 0,
		// оболочка слайдера адаптирует свою высоту к высоте текущего активного слайда
		//autoHeight: true,
		//watchOverflow: true,
		speed: 800,
		//loop: true, /* бесконечный слайд (для правильной работы: добавить min-width: 0; для .page__content (flex-контейнера. в котором лежит оболочка для главного слайдера .page__slider)) */
		//loopAdditionalSlides: 5,
		//preloadImages: false,
		//parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-main__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		/* pagination: {
			el: '.products-slider__info',
			type: 'fraction'
		}, */
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		/* navigation: {
			nextEl: '.brands-slider__arrow--next',
			prevEl: '.brands-slider__arrow--prev',
		}, */
		/* breakpoints: {
			320: {
				slidesPerView: 1,
				autoHeight: true,
			},
			595: {
				slidesPerView: 3,
			},
		}, */
		on: {
			lazyImageReady: function () {
				ibg();
			},
		}
	});
	// images-product__mainslider (5-22:40:00):
	let imagesMainSlider = new Swiper('.images-product__mainslider', {
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 0,
		// cвяжем оба слайдера: 
		thumbs: {
			swiper: imagesSubSlider
		},
		// оболочка слайдера адаптирует свою высоту к высоте текущего активного слайда
		//autoHeight: true,
		//watchOverflow: true,
		speed: 800,

		//loop: true, /* бесконечный слайд (для правильной работы: добавить min-width: 0; для .page__content (flex-контейнера. в котором лежит оболочка для главного слайдера .page__slider)) */
		//loopAdditionalSlides: 5,
		//preloadImages: false,
		//parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-main__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		/* pagination: {
			el: '.products-slider__info',
			type: 'fraction'
		}, */
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		/* navigation: {
			nextEl: '.brands-slider__arrow--next',
			prevEl: '.brands-slider__arrow--prev',
		}, */
		/* breakpoints: {
			320: {
				slidesPerView: 1,
				autoHeight: true,
			},
			595: {
				slidesPerView: 3,
			},
		}, */
		on: {
			lazyImageReady: function () {
				ibg();
			},
		}
	});
}

//==================================================================================================================================

// ФУНКЦИЯ УБИРАЕТ ТЕХНИЧЕСКИЙ КЛАСС '_hover'

function _removeClasses(els) {
	for (var i = 0; i < els.length; i++) {
		els[i].classList.remove('_hover')
	}
}

//===================================================================================================================================

//НАПИШЕМ ОБРАБОТКУ НАЖАТИЙ (для работы на мобильных устройствах):

//функция будет срабатывать когда весь контент на странице загрузится
window.onload = function () {

	/*1-организуем прослушивание события "click" на всём документе, вычислять нужные объекты и работать с ними: */
	document.addEventListener("click", documentActions);

	// делегирование события "click"
	function documentActions(e) {

		/* 2- в const targetElement получаем нажатый объект */
		const targetElement = e.target;
		// Условие: появляется выпадающее меню при щелчке на стрелочке (при ширине экрана больше 768px и только сенсорных экранах)
		if (window.innerWidth > 767 && isMobile.any()) {
			/* 3-Условие: если нажатый объект содержит класс 'menu__arrow': */
			if (targetElement.classList.contains('menu__arrow')) {
				/* 4-обращаемся к классу ближайшего родителя '.menu__item' и присваиваем(убираем) технический класс '_hover': */
				targetElement.closest('.menu__item').classList.toggle('_hover');
			}
			// пункты выпадающего меню можно закрывать щелчком в любои месте
			/* if (!targetElement.closest('.menu__item') && document.querySelector('.menu__item._hover')) {
				document.querySelector('.menu__item._hover').classList.remove('_hover');
			} */
			// пункты выпадающего меню можно закрывать щелчком в любои месте
			// Условие: если нажатый объект в родителях не имеет 'menu__item' (не пункт меню и не подменю) и проверим существуют ли объекты 'menu__item' с техническим классом _hover:
			if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
				/* помещаем объкты с техническим классом _hover в функцию _removeClasses и указываем убрать этот технический класс */
				_removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
			}
		}
		// добавляет строчку (поле для ввода) при щелчке на иконке(поиск) на малых экранах
		/* 1-Условие: если нажатый объект содержит класс 'search-form__icon'(соответствует иконке поиска): */
		if (targetElement.classList.contains('search-form__icon')) {
			/* 2-тогда находим объект '.search-form', обращаемся к списку классов classList и убираем(добавляем) технический класс '_active' */
			document.querySelector('.search-form').classList.toggle('_active');
		}
		// убираем строчку (поле для ввода) при щелчке на любом свободном месте
		// Условие: если нажатый объект в родителях не имеет '.search-form' и проверим существуют ли объекты '.search-form' с техническим классом _active:
		else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
			/* указываем убрать этот технический класс у объекта '.search-form' */
			document.querySelector('.search-form').classList.remove('_active');
		}

		// для кнопки под карточками товаров:
		/* 1-просмотрим событие "click" на всём документе и отловим нажатие на нужный объект(кнопку) 'products__more': */
		if (targetElement.classList.contains('products__more')) {
			/* 2-передадим нажатый объект в функцию getProducts: */
			getProducts(targetElement);
			/* 3-отменим действие по умолчанию (что бы страница не перезагружалась): */
			e.preventDefault();
		}

		// добавление товаров в корзину:
		/* 1-просмотрим событие "click" на всём документе и отловим нажатие на нужный объект(кнопку) 'actions-product__button': */
		if (targetElement.classList.contains('actions-product__button')) {
			/* 2- ищем для нажатой конопки среди ближайших родителей обхект 'item-product' и получаем его data-атрибута pid: */
			const productId = targetElement.closest('.item-product').dataset.pid;
			/* 3- кнопку и полученный Id отправляем в функцию addToCart: */
			addToCart(targetElement, productId);
			e.preventDefault(); // отменим действие по умолчанию (что бы страница не перезагружалась)
		}

		// покажем(скроем) выпадающий список корзины:
		// условие: определим нажатый объект .cart-header__icon (иконку корзины) или у нажатого объета в родителях есть объект .cart-header__icon (span с количеством товара): 
		if (targetElement.classList.contains('.cart-header__icon') || targetElement.closest('.cart-header__icon')) {
			// условие: существуют ли товары в выпадающем списке корзины
			if (document.querySelector('.cart-list').children.length > 0) {
				/* 1- для объекта .cart-header добавим(уберём) технический класс '_active': */
				document.querySelector('.cart-header').classList.toggle('_active');
			}
			e.preventDefault(); // отменим действие по умолчанию (что бы страница не перезагружалась)

			// сделаем что бы выпадающий список корзины закрывался при клике на любое другое место: 
			// условие: нажатый злемент не должен содержать в родителях '.cart-header' и также не должен содержать класс: 'actions-product__button'(кнопка добавления в корзину) что бы при нажатии у товара кнопки: добавить в корзину, выпадающий список товаров корзины не закрывался:
		} else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
			/* 2- у объкта '.cart-header' отнимаем технический класс '_active':  */
			document.querySelector('.cart-header').classList.remove('_active');
		}

		// Реализуем функционал удаления из корзины:
		// отловим клик по ссылке '.cart-list__delete': */
		if (targetElement.classList.contains('cart-list__delete')) {
			/* 1- в константу productId сохраняем результат поиска у нажатого элемента(кнопки delete ) родителя с классом .cart-list__item(элемент выпадающего списка товаров в корзине)-его Id: */
			const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
			/* 2- функцию updateCart третим параметром указываем false( т.е. собираемся удалить элемент списка, а не добавить): */
			updateCart(targetElement, productId, false)
			e.preventDefault(); // отменим действие по умолчанию (что бы страница не перезагружалась)
		}

	}

	//================================================== ФУНКЦИИ ==================================================================

	// Изменение свойств Header(шапки) при прохождении контента под ней: 

	const headerElement = document.querySelector('.header');

	//ФУНКЦИЯ, ВЫЗЫВАЕМАЯ В МОМЕНТ СРАБАТЫВАНИЯ:
	const callback = function (entries, observer) {
		/* условие: шапка находится в видимой части экрана: */
		if (entries[0].isIntersecting) {
			/* отнимается технический класс '_scroll' у шапки: */
			headerElement.classList.remove('_scroll');
		} else {
			/* если контент заходит под шапку, то добавляется */
			headerElement.classList.add('_scroll');
		}
	};

	/* отлавливать прокрученные пиксели под шапкой будем с помощью объекта IntersectionObserver, переданного в headerObserver: */
	const headerObserver = new IntersectionObserver(callback);
	/* передаём в функцию observe наш элемент headerElement и она начинает следить за ним: */
	headerObserver.observe(headerElement);


	// Асинхронная (т.к. будем использовать технологию	AJAX с помощью fetch) функция getProducts ********************************
	//	Подгружаем карточки товаров:
	/* 1- получаем в функцию нажатйю кнопку: */
	async function getProducts(button) {
		// условие: у кнопки нет технического класса '_hold': (эта проверка не даст нажать на кнопку множестово раз (деактивирует её), пока не выполнится дествие)
		if (!button.classList.contains('_hold')) {
			/* 2- добавляем технический класса '_hold': */
			button.classList.add('_hold');
			/* 3- в константу получаем путь к файлу: */
			const file = "json/products.json";
			/* 4- отправляем GET-запрос с помощью fetch и сохраняем результат в переменной response: */
			let response = await fetch(file, {
				method: "GET"
			});
			// условие: проверим найден и получен ли файл (всё ok):
			if (response.ok) {
				/* 5- подгружаем в переменную result содержимое переменной response в json-формате: */
				let result = await response.json();
				/* 5- результат отправляем в функцию loadProducts: */
				loadProducts(result);
				/* 6- убираем технический класс '_hold': */
				button.classList.remove('_hold');
				/* 7- удаляем кнопку (т.к. запрос тестовый ( что бы не подгружатись одни и теже товары)): */
				button.remove();
			} else {
				alert("Ошибка")
			}
		}
	}


	/* 1- в функцию loadProducts передаём результат работы предыдущей функции в переменную data: */
	function loadProducts(data) {
		/* 2-создаём объект куда будем товары подгружать: */
		const productsItems = document.querySelector('.products__items');
		/* 3- перебираем элементы массива item с товарами-products в json-файле:*/
		data.products.forEach(item => {
			/* 4- создадим ряд констант, которым присвоим значения каздого товара: */
			const productId = item.id;
			const productUrl = item.url;
			const productImage = item.image;
			const productTitle = item.title;
			const productText = item.text;
			const productPrice = item.price;
			const productOldPrice = item.priceOld;
			const productShareUrl = item.shareUrl;
			const productLikeUrl = item.likeUrl;
			const productLabels = item.labels;

			/* 5- интегрируем эти константы в html-код карточки товара: */
			let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			// проверка: есть ли лейблы:
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label--${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
		<a href="${productUrl}" class="item-product__image ibg">
			<img src="img/products/${productImage}" alt="${productTitle}">
		</a>
	`;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
		<div class="item-product__content">
			<h3 class="item-product__title">${productTitle}</h3>
			<div class="item-product__text">${productText}</div>
		</div>
	`;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price--old">Rp ${productOldPrice}</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button btn btn--white">Add to cart</a>
				<a href="${productShareUrl}" class="actions-product__link icon-share">Share</a>
				<a href="${productLikeUrl}" class="actions-product__link icon-favorite">Like</a>
			</div>
		</div>
	`;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

			// выведем константу productTemplate в html-файл:
			productsItems.insertAdjacentHTML('beforeend', productTemplate);

		});
	}

	// Добавление товаров в корзину при нажатии на кнопку addToCart(нажатой кнопке добавим технический класс '_hold'):

	/* 1- в параметры функции addToCart передаём нажатую кнопку и полученный Id: */
	function addToCart(productButton, productId) {
		// условие: отсутствие у нажатой кнопки технического класса '_hold':
		if (!productButton.classList.contains('_hold')) {
			/* 2- нажатой кнопке добавим технический класс '_hold': */
			productButton.classList.add('_hold');
			/* 3- нажатой кнопке добавим технический класс '_fly': */
			productButton.classList.add('_fly');

			// Создадим ряд констант:
			/* 4- константа cart будет содержать объект в шапке с икрнкой корзины: */
			const cart = document.querySelector('.cart-header__icon');
			/* 5- константа product будет содержать объект у которого в data-атрибуте есть полученный уникальный Id: */
			const product = document.querySelector(`[data-pid="${productId}"]`);

			/* 6- в константу попадёт объект внутри конкретного продукта с классом '.item-product__image' (картинка того товара у которого нажали кнопку addToCart): */
			const productImage = product.querySelector('.item-product__image');

			// Для создания эффекта летящей картинки, сделаем клон(дубль) картинки донного товара:			
			/* 7- создаём константу productImageFly, в которой обращаемся к productImage и клонируем этот объект: */
			const productImageFly = productImage.cloneNode(true);

			// Получим размеры и координаты картинки товара:
			/* 8- создаём константы, которым присваиваем ширину, высоту оригинальной картинки, позицию сверху и слева: */
			const productImageFlyWidth = productImage.offsetWidth;
			const productImageFlyHeight = productImage.offsetHeigth;
			const productImageFlyTop = productImage.getBoundingClientRect().top;
			const productImageFlyLeft = productImage.getBoundingClientRect().left;

			// Применим полученные размеры для клонированной картинки:
			/* 9- меняем у неё класс на класс: */
			productImageFly.setAttribute('class', '_flyImage _ibg');
			/* 10- присваиваем полученные размеры и позицию клонированной картинке: */

			productImageFly.style.cssText =
				`
		left: ${productImageFlyLeft}px;
		top: ${productImageFlyTop}px;
		width:${productImageFlyWidth}px;
		height: ${productImageFlyHeight}px;
			`;

			/* 11- поместим клон картинки в самый конец тега body: */
			document.body.append(productImageFly);

			// отправим клон картинки в корзину: 
			/* 12-получаем координаты корзины: */
			const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			/* 13- присваиваем клону картинки новые значения и укажем. что картинка будет лететь и уменьшаться: */
			productImageFly.style.cssText =
				`
		left: ${cartFlyLeft}px;
		top: ${cartFlyTop}px;		
		opacity: 0;
		width: 0;
		height: 0px;
		`;
			// выведем количество товара в корзине
			/* 14-отловим момент когда клон карточки товара долетит до корзины: */
			productImageFly.addEventListener('transitionend', function () {
				// проверка: существует ли у нажатой кнопки технический класс '_fly'(клон карточки товара долетел):
				if (productButton.classList.contains('_fly')) {
					/* 15- удаляем клон карточки товара из body: */
					productImageFly.remove();
					/* 16- в функцию updateCart пердаём кнопку и Id товара: */
					updateCart(productButton, productId);
					/* 17- убираем у кнопки технический класс '_fly' */
					productButton.classList.remove('_fly');
				}
			});
		}

	}

	// функция UpdateCart будет формировать(добавлять и удалять( с использованием параметра productAdd)) в корзине количество товаров и список товаров
	function updateCart(productButton, productId, productAdd = true) {
		// находим и сохраняем:
		const cart = document.querySelector('.cart-header'); // общую оболочку карзины,
		const cartIcon = cart.querySelector('.cart-header__icon'); // иконку корзины,
		const cartQuantity = cartIcon.querySelector('span'); // указатель количества товара рядом с корзиной,
		const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`); // товар ,находящийся в списке внутри корзины,
		const cartList = document.querySelector('.cart-list');

		// Добавляем товар (параметр productAdd = true):
		if (productAdd) {
			// проверка: существует ли 'span' со списком товаров:
			if (cartQuantity) {
				/* добавляем +1 к уже существующему количеству товаров: */
				cartQuantity.innerHTML = ++cartQuantity.innerHTML;
			} else {
				/* если нет, тогда создаём такой 'span' со значением 1 */
				cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`)
			}

			// Формируем список товаров в корзине:
			//проверка: есть ли спиок(товар в списке):
			if (!cartProduct) {
				//если нет, тогда формируем его:
				/* 1- в константу product получаем объект оригинального товара: */
				const product = document.querySelector(`[data-pid="${productId}"]`);
				/* 2- получаем его картинку: */
				const cartProductImage = product.querySelector('.item-product__image').innerHTML;
				/* 3- получаем его название: */
				const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
				/* 4- в константу формируем HTML-код карточки добавляемого товара, который будем добавлять(выводить) в список: */
				const cartProductContent = `
				<a href="" class="cart-list__image ibg">${cartProductImage}</a>
				<div class="cart-list__body">
					<a href="" class="cart-list__title">${cartProductTitle}</a>
					<div class="cart-list__quantity">Quantity: <span>1</span></div>
					<a href="" class="cart-list__delete">Delete</a>
				</div>
			`;
				// интегрируем полученные данные в HTML-код:
				/* 5- формируем список и вставляем HTML-код карточки товара переданного вкорзину: */
				cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}
				</li>`);
			} else {
				// если такой товар в корине есть:
				/* 6- в константу cartProductQuantity получаем количество этого товара в корзине: */
				const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
				/* 7- добавляем +1 товар: */
				cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
			}

			// после всех действий, отнимаем тезнический класс '_hold' (что бы могли добавлять этот товар в корзину ещё раз):
			productButton.classList.remove('_hold');
		} else {

			// добавим функционал удаления из корзины:
			/* 1- в константу cartProductQuantity получаем количество этого товара в корзине: */
			const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			/* 2- убираем -1 товар: */
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
			// проверка: если количество товара ноль:
			if (!parseInt(cartProductQuantity.innerHTML)) {
				/* 3- удаляем этот товар: */
				cartProduct.remove();
			}

			// уменьшаем на единицу общее количество товара:
			const cartQuantityValue = --cartQuantity.innerHTML;
			// проверка: если общее количество товара больше нуля:
			if (cartQuantityValue) {
				/* 4-изменяем значение в кружке(span): */
				cartQuantity.innerHTML = cartQuantityValue;
			} else {
				/* 5- если товара нет, удаляем кружок(span): */
				cartQuantity.remove();
				/* 6- убираем тезнический класс _active у выпадающего списка товаров корзины: */
				cart.classList.remove('_active');
			}

		}
	}

	//***************************************** Галлерея (срабатыает при движении курсора) ***************************************

	/* 1- получим в константу furniture тело галлереи: */
	const furniture = document.querySelector('.furniture__body');
	// проверка на существоввание такого объекта и на то что экран не сенсорный:
	if (furniture && !isMobile.any()) {
		/* 2- добавим константу furnitureItems в которую передадим объект который будет двигаться: */
		const furnitureItems = document.querySelector('.furniture__items');
		/* 3- передадим в константу коллекцию всех колонок(что бы высчитать ширину контента галлереи):  */
		const furnitureColumn = document.querySelectorAll('.furniture__column');

		/* 4- в константу передадим скорость анимации (получим из data-атрибута у объета '.furniture__body'): */
		const speed = furniture.dataset.speed;
		/* 5- объявим пременные позиции и процентной позиции: */
		let positionX = 0;
		let coordXprocent = 0;

		// создадим главную функцию:
		function setMouseGalleryStyle() {
			/* 6-вычислим актуальный размер всего контента(перберём все колонки и выислим их общий размер): */
			let furnitureItemsWidth = 0;
			furnitureColumn.forEach(element => {
				furnitureItemsWidth += element.offsetWidth;
			});

			/* 7- получим разницу ширины всего контента и видимой части: */
			const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
			/* 8- в константу distX передаём смещение положения курсора(чтобы галлерея двигалась, реагируя на смещение кусора от середины экрана): */
			const distX = Math.floor(coordXprocent - positionX);

			/* 9- сохраним в переменной positionX с учётом скорости: */
			positionX = positionX = (distX * speed);
			/* 10- вычисляем позицию относительно раницы ширин: */
			let position = furnitureDifferent / 200 * positionX;
			/* 11- обращаемся к объекту, который собираемся двигать и присваиваем полученное значение со знаком минус(чтобы галлерея длигалась в противоположную движению курсора сторону): */
			furnitureItems.style.cssText = ` transform: translate3d(${-position}px,0, 0); `;
			/* 12- запустим аниацию внутри данной функции: */
			// будем запускать анимацию, только если есть ,что двигать (модуль const distX больше нуля):
			if (Math.abs(distX) > 0) {
				requestAnimationFrame(setMouseGalleryStyle);
			} else {
				// иначе (distX) дойдёт до нуля, у обекта '.furniture__body' убираем технический класс '_init'
				furniture.classList.remove('_init');
			}
		}

		// запустим прослушку движения мыши в '.furniture__body':
		furniture.addEventListener("mousemove", function (e) {
			/* 13- получаем видимую ширину: */
			const furnitureWidth = furniture.offsetWidth;
			/* 14- вчисляем ноль, (когда курсор посередине): */
			const coordX = e.pageX - furnitureWidth / 2;
			/* 15- получаем проценты: */
			coordXprocent = coordX / furnitureWidth * 200;

			//запускаем анимацию, когда у '.furniture__body' нет технического класса '_init':
			if (!furniture.classList.contains('_init')) {
				requestAnimationFrame(setMouseGalleryStyle);
				furniture.classList.add('_init');
			}
		});
	}

}


//==================================================================================================================================



// SlideToggle (функции, которые позволяют нам анимировать (скрывать и показывать) объкты)

/* функция _slideUp, анимированно скрывает объект */
let _slideUp = (target, duration = 500) => {
	/* добавим проверку: если у объкта нет технического класса _slide: */
	//if (!target.classList.contains('_slide')) {
	/* добавим этот класс */
	//target.classList.add('_slide');
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {

		target.style.display = 'none'; // вместо target.hidden = true;
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
//}

/* функция _slideUp, анимированно показывает объект */
let _slideDown = (target, duration = 500) => {
	/* добавим проверку: если у объкта нет технического класса _slide: */
	//if (!target.classList.contains('_slide')) {
	/* добавим этот класс */
	//target.classList.add('_slide');
	//if (target.hidden) {
	//target.hidden = false;
	//}
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
//}

/* функция _slideToggle вызывает функции _slideDown или _slideUp, когда нужно показать или скрыть обьект */
let _slideToggle = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (window.getComputedStyle(target).display === 'none') {
			/* if (target.hidden) { */
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}
/* } */






//================================================== Главный слайдер =============================================================

/* 1-проверим существует ли класс '.slider-main__body': */
if (document.querySelector('.slider-main__body')) {
	new Swiper('.slider-main__body', {
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 32,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSlides: 5,
		preloadImages: false,
		parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-main__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		pagination: {
			el: '.controls-slider-main__dotts',
			clickable: true,
		},
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		navigation: {
			nextEl: '.slider-main .slider-arrow--next',
			prevEl: '.slider-main .slider-arrow--prev',
		}
	});
}

//===================================================== Room слайдер =============================================================

/* 1-проверим существует ли класс '.slider-rooms__body': */
if (document.querySelector('.slider-rooms__body')) {
	new Swiper('.slider-rooms__body', {
		observer: true,
		observeParents: true,
		slidesPerView: 'auto',
		spaceBetween: 24,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSlides: 5,
		preloadImages: false,
		parallax: true, // для применения это эффекта нужно добавить в html-файле к slider-rooms__content атрибуты: data-swiper-parallax-opacity="0" data-swiper-parallax-x="-100%" ( когда слайд становится активным: контентная часть слайда движется по оси X движестя влево и проявляется(становится не прохрачной))
		// Dotts
		pagination: {
			el: '.slider-rooms__dotts',
			clickable: true,
		},
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		navigation: {
			nextEl: '.slider-rooms .slider-arrow--next',
			prevEl: '.slider-rooms .slider-arrow--prev',
		}
	});
}

//===================================================== Tips cлайдер =============================================================

/* 1-проверим существует ли класс '.slider-tips__body': */
if (document.querySelector('.slider-tips__body')) {
	new Swiper('.slider-tips__body', {
		observer: true,
		observeParents: true,
		slidesPerView: 3,
		spaceBetween: 32,
		watchOverflow: true,
		speed: 800,
		loop: true,

		// Dotts
		pagination: {
			el: '.slider-tips__dotts',
			clickable: true,
		},
		//Arrows
		// обратимся к конкретным кнопкам, указав в начале класс родителя:
		navigation: {
			nextEl: '.slider-tips .slider-arrow--next',
			prevEl: '.slider-tips .slider-arrow--prev',
		},
		breakpoints: {
			320: {
				slidesPerView: 1.1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 32,
			}
		}
	});
}

// *********************************** Применение класса "ibg" для картинок (адаптив изображения): ********************************

function ibg() {

	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}

ibg();

// *******************************************************************************************************************************

// Подключение плагинов(библиотек): 

// nouislider (фильтр цены): 
/*! nouislider - 14.6.2 - 9/16/2020 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        window.noUiSlider = factory();
    }
})(function() {
    "use strict";

    var VERSION = "14.6.2";

    //region Helper Methods

    function isValidFormatter(entry) {
        return typeof entry === "object" && typeof entry.to === "function" && typeof entry.from === "function";
    }

    function removeElement(el) {
        el.parentElement.removeChild(el);
    }

    function isSet(value) {
        return value !== null && value !== undefined;
    }

    // Bindable version
    function preventDefault(e) {
        e.preventDefault();
    }

    // Removes duplicates from an array.
    function unique(array) {
        return array.filter(function(a) {
            return !this[a] ? (this[a] = true) : false;
        }, {});
    }

    // Round a value to the closest 'to'.
    function closest(value, to) {
        return Math.round(value / to) * to;
    }

    // Current position of an element relative to the document.
    function offset(elem, orientation) {
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var pageOffset = getPageOffset(doc);

        // getBoundingClientRect contains left scroll in Chrome on Android.
        // I haven't found a feature detection that proves this. Worst case
        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
            pageOffset.x = 0;
        }

        return orientation
            ? rect.top + pageOffset.y - docElem.clientTop
            : rect.left + pageOffset.x - docElem.clientLeft;
    }

    // Checks whether a value is numerical.
    function isNumeric(a) {
        return typeof a === "number" && !isNaN(a) && isFinite(a);
    }

    // Sets a class and removes it after [duration] ms.
    function addClassFor(element, className, duration) {
        if (duration > 0) {
            addClass(element, className);
            setTimeout(function() {
                removeClass(element, className);
            }, duration);
        }
    }

    // Limits a value to 0 - 100
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }

    // Wraps a variable as an array, if it isn't one yet.
    // Note that an input array is returned by reference!
    function asArray(a) {
        return Array.isArray(a) ? a : [a];
    }

    // Counts decimals
    function countDecimals(numStr) {
        numStr = String(numStr);
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }

    // http://youmightnotneedjquery.com/#add_class
    function addClass(el, className) {
        if (el.classList && !/\s/.test(className)) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    }

    // http://youmightnotneedjquery.com/#remove_class
    function removeClass(el, className) {
        if (el.classList && !/\s/.test(className)) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(
                new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
                " "
            );
        }
    }

    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
    function hasClass(el, className) {
        return el.classList
            ? el.classList.contains(className)
            : new RegExp("\\b" + className + "\\b").test(el.className);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset(doc) {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
        var x = supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat
                ? doc.documentElement.scrollLeft
                : doc.body.scrollLeft;
        var y = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
                ? doc.documentElement.scrollTop
                : doc.body.scrollTop;

        return {
            x: x,
            y: y
        };
    }

    // we provide a function to compute constants instead
    // of accessing window.* as soon as the module needs it
    // so that we do not compute anything if not needed
    function getActions() {
        // Determine the events to bind. IE11 implements pointerEvents without
        // a prefix, which breaks compatibility with the IE10 implementation.
        return window.navigator.pointerEnabled
            ? {
                  start: "pointerdown",
                  move: "pointermove",
                  end: "pointerup"
              }
            : window.navigator.msPointerEnabled
                ? {
                      start: "MSPointerDown",
                      move: "MSPointerMove",
                      end: "MSPointerUp"
                  }
                : {
                      start: "mousedown touchstart",
                      move: "mousemove touchmove",
                      end: "mouseup touchend"
                  };
    }

    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // Issue #785
    function getSupportsPassive() {
        var supportsPassive = false;

        /* eslint-disable */
        try {
            var opts = Object.defineProperty({}, "passive", {
                get: function() {
                    supportsPassive = true;
                }
            });

            window.addEventListener("test", null, opts);
        } catch (e) {}
        /* eslint-enable */

        return supportsPassive;
    }

    function getSupportsTouchActionNone() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }

    //endregion

    //region Range Calculation

    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }

    // (percentage) How many percent is this value of this range?
    function fromPercentage(range, value, startRange) {
        return (value * 100) / (range[startRange + 1] - range[startRange]);
    }

    // (percentage) Where is this value on this range?
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
    }

    // (value) How much is this percentage on this range?
    function isPercentage(range, value) {
        return (value * (range[1] - range[0])) / 100 + range[0];
    }

    function getJ(value, arr) {
        var j = 1;

        while (value >= arr[j]) {
            j += 1;
        }

        return j;
    }

    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
    function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) {
            return 100;
        }

        var j = getJ(value, xVal);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
    }

    // (value) Input a percentage, find where it is on the specified range.
    function fromStepping(xVal, xPct, value) {
        // There is no range group that fits 100
        if (value >= 100) {
            return xVal.slice(-1)[0];
        }

        var j = getJ(value, xPct);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
    }

    // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {
        if (value === 100) {
            return value;
        }

        var j = getJ(value, xPct);
        var a = xPct[j - 1];
        var b = xPct[j];

        // If 'snap' is set, steps are used as fixed points on the slider.
        if (snap) {
            // Find the closest position, a or b.
            if (value - a > (b - a) / 2) {
                return b;
            }

            return a;
        }

        if (!xSteps[j - 1]) {
            return value;
        }

        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
    }

    function handleEntryPoint(index, value, that) {
        var percentage;

        // Wrap numerical input in an array.
        if (typeof value === "number") {
            value = [value];
        }

        // Reject any invalid input, by testing whether value is an array.
        if (!Array.isArray(value)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
        }

        // Covert min/max syntax to 0 and 100.
        if (index === "min") {
            percentage = 0;
        } else if (index === "max") {
            percentage = 100;
        } else {
            percentage = parseFloat(index);
        }

        // Check for correct input.
        if (!isNumeric(percentage) || !isNumeric(value[0])) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
        }

        // Store values.
        that.xPct.push(percentage);
        that.xVal.push(value[0]);

        // NaN will evaluate to false too, but to keep
        // logging clear, set step explicitly. Make sure
        // not to override the 'step' setting with false.
        if (!percentage) {
            if (!isNaN(value[1])) {
                that.xSteps[0] = value[1];
            }
        } else {
            that.xSteps.push(isNaN(value[1]) ? false : value[1]);
        }

        that.xHighestCompleteStep.push(0);
    }

    function handleStepPoint(i, n, that) {
        // Ignore 'false' stepping.
        if (!n) {
            return;
        }

        // Step over zero-length ranges (#948);
        if (that.xVal[i] === that.xVal[i + 1]) {
            that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];

            return;
        }

        // Factor to range ratio
        that.xSteps[i] =
            fromPercentage([that.xVal[i], that.xVal[i + 1]], n, 0) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);

        var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
        var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
        var step = that.xVal[i] + that.xNumSteps[i] * highestStep;

        that.xHighestCompleteStep[i] = step;
    }

    //endregion

    //region Spectrum

    function Spectrum(entry, snap, singleStep) {
        this.xPct = [];
        this.xVal = [];
        this.xSteps = [singleStep || false];
        this.xNumSteps = [false];
        this.xHighestCompleteStep = [];

        this.snap = snap;

        var index;
        var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

        // Map the object keys to an array.
        for (index in entry) {
            if (entry.hasOwnProperty(index)) {
                ordered.push([entry[index], index]);
            }
        }

        // Sort all entries by value (numeric sort).
        if (ordered.length && typeof ordered[0][0] === "object") {
            ordered.sort(function(a, b) {
                return a[0][0] - b[0][0];
            });
        } else {
            ordered.sort(function(a, b) {
                return a[0] - b[0];
            });
        }

        // Convert all entries to subranges.
        for (index = 0; index < ordered.length; index++) {
            handleEntryPoint(ordered[index][1], ordered[index][0], this);
        }

        // Store the actual step values.
        // xSteps is sorted in the same order as xPct and xVal.
        this.xNumSteps = this.xSteps.slice(0);

        // Convert all numeric steps to the percentage of the subrange they represent.
        for (index = 0; index < this.xNumSteps.length; index++) {
            handleStepPoint(index, this.xNumSteps[index], this);
        }
    }

    Spectrum.prototype.getDistance = function(value) {
        var index;
        var distances = [];

        for (index = 0; index < this.xNumSteps.length - 1; index++) {
            // last "range" can't contain step size as it is purely an endpoint.
            var step = this.xNumSteps[index];

            if (step && (value / step) % 1 !== 0) {
                throw new Error(
                    "noUiSlider (" +
                        VERSION +
                        "): 'limit', 'margin' and 'padding' of " +
                        this.xPct[index] +
                        "% range must be divisible by step."
                );
            }

            // Calculate percentual distance in current range of limit, margin or padding
            distances[index] = fromPercentage(this.xVal, value, index);
        }

        return distances;
    };

    // Calculate the percentual distance over the whole scale of ranges.
    // direction: 0 = backwards / 1 = forwards
    Spectrum.prototype.getAbsoluteDistance = function(value, distances, direction) {
        var xPct_index = 0;

        // Calculate range where to start calculation
        if (value < this.xPct[this.xPct.length - 1]) {
            while (value > this.xPct[xPct_index + 1]) {
                xPct_index++;
            }
        } else if (value === this.xPct[this.xPct.length - 1]) {
            xPct_index = this.xPct.length - 2;
        }

        // If looking backwards and the value is exactly at a range separator then look one range further
        if (!direction && value === this.xPct[xPct_index + 1]) {
            xPct_index++;
        }

        var start_factor;
        var rest_factor = 1;

        var rest_rel_distance = distances[xPct_index];

        var range_pct = 0;

        var rel_range_distance = 0;
        var abs_distance_counter = 0;
        var range_counter = 0;

        // Calculate what part of the start range the value is
        if (direction) {
            start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
        } else {
            start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
        }

        // Do until the complete distance across ranges is calculated
        while (rest_rel_distance > 0) {
            // Calculate the percentage of total range
            range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];

            // Detect if the margin, padding or limit is larger then the current range and calculate
            if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
                // If larger then take the percentual distance of the whole range
                rel_range_distance = range_pct * start_factor;
                // Rest factor of relative percentual distance still to be calculated
                rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
                // Set start factor to 1 as for next range it does not apply.
                start_factor = 1;
            } else {
                // If smaller or equal then take the percentual distance of the calculate percentual part of that range
                rel_range_distance = ((distances[xPct_index + range_counter] * range_pct) / 100) * rest_factor;
                // No rest left as the rest fits in current range
                rest_factor = 0;
            }

            if (direction) {
                abs_distance_counter = abs_distance_counter - rel_range_distance;
                // Limit range to first range when distance becomes outside of minimum range
                if (this.xPct.length + range_counter >= 1) {
                    range_counter--;
                }
            } else {
                abs_distance_counter = abs_distance_counter + rel_range_distance;
                // Limit range to last range when distance becomes outside of maximum range
                if (this.xPct.length - range_counter >= 1) {
                    range_counter++;
                }
            }

            // Rest of relative percentual distance still to be calculated
            rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
        }

        return value + abs_distance_counter;
    };

    Spectrum.prototype.toStepping = function(value) {
        value = toStepping(this.xVal, this.xPct, value);

        return value;
    };

    Spectrum.prototype.fromStepping = function(value) {
        return fromStepping(this.xVal, this.xPct, value);
    };

    Spectrum.prototype.getStep = function(value) {
        value = getStep(this.xPct, this.xSteps, this.snap, value);

        return value;
    };

    Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
        var j = getJ(value, this.xPct);

        // When at the top or stepping down, look at the previous sub-range
        if (value === 100 || (isDown && value === this.xPct[j - 1])) {
            j = Math.max(j - 1, 1);
        }

        return (this.xVal[j] - this.xVal[j - 1]) / size;
    };

    Spectrum.prototype.getNearbySteps = function(value) {
        var j = getJ(value, this.xPct);

        return {
            stepBefore: {
                startValue: this.xVal[j - 2],
                step: this.xNumSteps[j - 2],
                highestStep: this.xHighestCompleteStep[j - 2]
            },
            thisStep: {
                startValue: this.xVal[j - 1],
                step: this.xNumSteps[j - 1],
                highestStep: this.xHighestCompleteStep[j - 1]
            },
            stepAfter: {
                startValue: this.xVal[j],
                step: this.xNumSteps[j],
                highestStep: this.xHighestCompleteStep[j]
            }
        };
    };

    Spectrum.prototype.countStepDecimals = function() {
        var stepDecimals = this.xNumSteps.map(countDecimals);
        return Math.max.apply(null, stepDecimals);
    };

    // Outside testing
    Spectrum.prototype.convert = function(value) {
        return this.getStep(this.toStepping(value));
    };

    //endregion

    //region Options

    /*	Every input option is tested and parsed. This'll prevent
        endless validation in internal methods. These tests are
        structured with an item for every option available. An
        option can be marked as required by setting the 'r' flag.
        The testing function is provided with three arguments:
            - The provided value for the option;
            - A reference to the options object;
            - The name for the option;

        The testing function returns false when an error is detected,
        or true when everything is OK. It can also modify the option
        object, to make sure all values can be correctly looped elsewhere. */

    //region Defaults

    var defaultFormatter = {
        to: function(value) {
            return value !== undefined && value.toFixed(2);
        },
        from: Number
    };

    var cssClasses = {
        target: "target",
        base: "base",
        origin: "origin",
        handle: "handle",
        handleLower: "handle-lower",
        handleUpper: "handle-upper",
        touchArea: "touch-area",
        horizontal: "horizontal",
        vertical: "vertical",
        background: "background",
        connect: "connect",
        connects: "connects",
        ltr: "ltr",
        rtl: "rtl",
        textDirectionLtr: "txt-dir-ltr",
        textDirectionRtl: "txt-dir-rtl",
        draggable: "draggable",
        drag: "state-drag",
        tap: "state-tap",
        active: "active",
        tooltip: "tooltip",
        pips: "pips",
        pipsHorizontal: "pips-horizontal",
        pipsVertical: "pips-vertical",
        marker: "marker",
        markerHorizontal: "marker-horizontal",
        markerVertical: "marker-vertical",
        markerNormal: "marker-normal",
        markerLarge: "marker-large",
        markerSub: "marker-sub",
        value: "value",
        valueHorizontal: "value-horizontal",
        valueVertical: "value-vertical",
        valueNormal: "value-normal",
        valueLarge: "value-large",
        valueSub: "value-sub"
    };

    //endregion

    function validateFormat(entry) {
        // Any object with a to and from method is supported.
        if (isValidFormatter(entry)) {
            return true;
        }

        throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
    }

    function testStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
        }

        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
        parsed.singleStep = entry;
    }

    function testKeyboardPageMultiplier(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'keyboardPageMultiplier' is not numeric.");
        }

        parsed.keyboardPageMultiplier = entry;
    }

    function testKeyboardDefaultStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'keyboardDefaultStep' is not numeric.");
        }

        parsed.keyboardDefaultStep = entry;
    }

    function testRange(parsed, entry) {
        // Filter incorrect input.
        if (typeof entry !== "object" || Array.isArray(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
        }

        // Catch missing start or end.
        if (entry.min === undefined || entry.max === undefined) {
            throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
        }

        // Catch equal start or end.
        if (entry.min === entry.max) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
        }

        parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
    }

    function testStart(parsed, entry) {
        entry = asArray(entry);

        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (!Array.isArray(entry) || !entry.length) {
            throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
        }

        // Store the number of handles.
        parsed.handles = entry.length;

        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }

    function testSnap(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.snap = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
        }
    }

    function testAnimate(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.animate = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
        }
    }

    function testAnimationDuration(parsed, entry) {
        parsed.animationDuration = entry;

        if (typeof entry !== "number") {
            throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
        }
    }

    function testConnect(parsed, entry) {
        var connect = [false];
        var i;

        // Map legacy options
        if (entry === "lower") {
            entry = [true, false];
        } else if (entry === "upper") {
            entry = [false, true];
        }

        // Handle boolean options
        if (entry === true || entry === false) {
            for (i = 1; i < parsed.handles; i++) {
                connect.push(entry);
            }

            connect.push(false);
        }

        // Reject invalid input
        else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
            throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
        } else {
            connect = entry;
        }

        parsed.connect = connect;
    }

    function testOrientation(parsed, entry) {
        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
            case "horizontal":
                parsed.ort = 0;
                break;
            case "vertical":
                parsed.ort = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
        }
    }

    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
        }

        // Issue #582
        if (entry === 0) {
            return;
        }

        parsed.margin = parsed.spectrum.getDistance(entry);
    }

    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
        }

        parsed.limit = parsed.spectrum.getDistance(entry);

        if (!parsed.limit || parsed.handles < 2) {
            throw new Error(
                "noUiSlider (" +
                    VERSION +
                    "): 'limit' option is only supported on linear sliders with 2 or more handles."
            );
        }
    }

    function testPadding(parsed, entry) {
        var index;

        if (!isNumeric(entry) && !Array.isArray(entry)) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
            );
        }

        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
            );
        }

        if (entry === 0) {
            return;
        }

        if (!Array.isArray(entry)) {
            entry = [entry, entry];
        }

        // 'getDistance' returns false for invalid values.
        parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];

        for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
            // last "range" can't contain step size as it is purely an endpoint.
            if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
                throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
            }
        }

        var totalPadding = entry[0] + entry[1];
        var firstValue = parsed.spectrum.xVal[0];
        var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];

        if (totalPadding / (lastValue - firstValue) > 1) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
        }
    }

    function testDirection(parsed, entry) {
        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
            case "ltr":
                parsed.dir = 0;
                break;
            case "rtl":
                parsed.dir = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
        }
    }

    function testBehaviour(parsed, entry) {
        // Make sure the input is a string.
        if (typeof entry !== "string") {
            throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
        }

        // Check if the string contains any keywords.
        // None are required.
        var tap = entry.indexOf("tap") >= 0;
        var drag = entry.indexOf("drag") >= 0;
        var fixed = entry.indexOf("fixed") >= 0;
        var snap = entry.indexOf("snap") >= 0;
        var hover = entry.indexOf("hover") >= 0;
        var unconstrained = entry.indexOf("unconstrained") >= 0;

        if (fixed) {
            if (parsed.handles !== 2) {
                throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
            }

            // Use margin to enforce fixed state
            testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }

        if (unconstrained && (parsed.margin || parsed.limit)) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit"
            );
        }

        parsed.events = {
            tap: tap || snap,
            drag: drag,
            fixed: fixed,
            snap: snap,
            hover: hover,
            unconstrained: unconstrained
        };
    }

    function testTooltips(parsed, entry) {
        if (entry === false) {
            return;
        }

        if (entry === true) {
            parsed.tooltips = [];

            for (var i = 0; i < parsed.handles; i++) {
                parsed.tooltips.push(true);
            }
        } else {
            parsed.tooltips = asArray(entry);

            if (parsed.tooltips.length !== parsed.handles) {
                throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
            }

            parsed.tooltips.forEach(function(formatter) {
                if (
                    typeof formatter !== "boolean" &&
                    (typeof formatter !== "object" || typeof formatter.to !== "function")
                ) {
                    throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
                }
            });
        }
    }

    function testAriaFormat(parsed, entry) {
        parsed.ariaFormat = entry;
        validateFormat(entry);
    }

    function testFormat(parsed, entry) {
        parsed.format = entry;
        validateFormat(entry);
    }

    function testKeyboardSupport(parsed, entry) {
        parsed.keyboardSupport = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
        }
    }

    function testDocumentElement(parsed, entry) {
        // This is an advanced option. Passed values are used without validation.
        parsed.documentElement = entry;
    }

    function testCssPrefix(parsed, entry) {
        if (typeof entry !== "string" && entry !== false) {
            throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
        }

        parsed.cssPrefix = entry;
    }

    function testCssClasses(parsed, entry) {
        if (typeof entry !== "object") {
            throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
        }

        if (typeof parsed.cssPrefix === "string") {
            parsed.cssClasses = {};

            for (var key in entry) {
                if (!entry.hasOwnProperty(key)) {
                    continue;
                }

                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
            }
        } else {
            parsed.cssClasses = entry;
        }
    }

    // Test all developer settings and parse to assumption-safe values.
    function testOptions(options) {
        // To prove a fix for #537, freeze options here.
        // If the object is modified, an error will be thrown.
        // Object.freeze(options);

        var parsed = {
            margin: 0,
            limit: 0,
            padding: 0,
            animate: true,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter
        };

        // Tests are executed in the order they are presented here.
        var tests = {
            step: { r: false, t: testStep },
            keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
            keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
            start: { r: true, t: testStart },
            connect: { r: true, t: testConnect },
            direction: { r: true, t: testDirection },
            snap: { r: false, t: testSnap },
            animate: { r: false, t: testAnimate },
            animationDuration: { r: false, t: testAnimationDuration },
            range: { r: true, t: testRange },
            orientation: { r: false, t: testOrientation },
            margin: { r: false, t: testMargin },
            limit: { r: false, t: testLimit },
            padding: { r: false, t: testPadding },
            behaviour: { r: true, t: testBehaviour },
            ariaFormat: { r: false, t: testAriaFormat },
            format: { r: false, t: testFormat },
            tooltips: { r: false, t: testTooltips },
            keyboardSupport: { r: true, t: testKeyboardSupport },
            documentElement: { r: false, t: testDocumentElement },
            cssPrefix: { r: true, t: testCssPrefix },
            cssClasses: { r: true, t: testCssClasses }
        };

        var defaults = {
            connect: false,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: true,
            cssPrefix: "noUi-",
            cssClasses: cssClasses,
            keyboardPageMultiplier: 5,
            keyboardDefaultStep: 10
        };

        // AriaFormat defaults to regular format, if any.
        if (options.format && !options.ariaFormat) {
            options.ariaFormat = options.format;
        }

        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach(function(name) {
            // If the option isn't set, but it is required, throw an error.
            if (!isSet(options[name]) && defaults[name] === undefined) {
                if (tests[name].r) {
                    throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
                }

                return true;
            }

            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
        });

        // Forward pips options
        parsed.pips = options.pips;

        // All recent browsers accept unprefixed transform.
        // We need -ms- for IE9 and -webkit- for older Android;
        // Assume use of -webkit- if unprefixed and -ms- are not supported.
        // https://caniuse.com/#feat=transforms2d
        var d = document.createElement("div");
        var msPrefix = d.style.msTransform !== undefined;
        var noPrefix = d.style.transform !== undefined;

        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";

        // Pips don't move, so we can place them using left/top.
        var styles = [["left", "top"], ["right", "bottom"]];

        parsed.style = styles[parsed.dir][parsed.ort];

        return parsed;
    }

    //endregion

    function scope(target, options, originalOptions) {
        var actions = getActions();
        var supportsTouchActionNone = getSupportsTouchActionNone();
        var supportsPassive = supportsTouchActionNone && getSupportsPassive();

        // All variables local to 'scope' are prefixed with 'scope_'

        // Slider DOM Nodes
        var scope_Target = target;
        var scope_Base;
        var scope_Handles;
        var scope_Connects;
        var scope_Pips;
        var scope_Tooltips;

        // Slider state values
        var scope_Spectrum = options.spectrum;
        var scope_Values = [];
        var scope_Locations = [];
        var scope_HandleNumbers = [];
        var scope_ActiveHandlesCount = 0;
        var scope_Events = {};

        // Exposed API
        var scope_Self;

        // Document Nodes
        var scope_Document = target.ownerDocument;
        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
        var scope_Body = scope_Document.body;

        // Pips constants
        var PIPS_NONE = -1;
        var PIPS_NO_VALUE = 0;
        var PIPS_LARGE_VALUE = 1;
        var PIPS_SMALL_VALUE = 2;

        // For horizontal sliders in standard ltr documents,
        // make .noUi-origin overflow to the left so the document doesn't scroll.
        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;

        // Creates a node, adds it to target, returns the new node.
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");

            if (className) {
                addClass(div, className);
            }

            addTarget.appendChild(div);

            return div;
        }

        // Append a origin to the base
        function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin);
            var handle = addNodeTo(origin, options.cssClasses.handle);

            addNodeTo(handle, options.cssClasses.touchArea);

            handle.setAttribute("data-handle", handleNumber);

            if (options.keyboardSupport) {
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                // 0 = focusable and reachable
                handle.setAttribute("tabindex", "0");
                handle.addEventListener("keydown", function(event) {
                    return eventKeydown(event, handleNumber);
                });
            }

            handle.setAttribute("role", "slider");
            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");

            if (handleNumber === 0) {
                addClass(handle, options.cssClasses.handleLower);
            } else if (handleNumber === options.handles - 1) {
                addClass(handle, options.cssClasses.handleUpper);
            }

            return origin;
        }

        // Insert nodes for connect elements
        function addConnect(base, add) {
            if (!add) {
                return false;
            }

            return addNodeTo(base, options.cssClasses.connect);
        }

        // Add handles to the slider base.
        function addElements(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);

            scope_Handles = [];
            scope_Connects = [];

            scope_Connects.push(addConnect(connectBase, connectOptions[0]));

            // [::::O====O====O====]
            // connectOptions = [0, 1, 1, 1]

            for (var i = 0; i < options.handles; i++) {
                // Keep a list of all added handles.
                scope_Handles.push(addOrigin(base, i));
                scope_HandleNumbers[i] = i;
                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
            }
        }

        // Initialize a single slider.
        function addSlider(addTarget) {
            // Apply classes and data to the target.
            addClass(addTarget, options.cssClasses.target);

            if (options.dir === 0) {
                addClass(addTarget, options.cssClasses.ltr);
            } else {
                addClass(addTarget, options.cssClasses.rtl);
            }

            if (options.ort === 0) {
                addClass(addTarget, options.cssClasses.horizontal);
            } else {
                addClass(addTarget, options.cssClasses.vertical);
            }

            var textDirection = getComputedStyle(addTarget).direction;

            if (textDirection === "rtl") {
                addClass(addTarget, options.cssClasses.textDirectionRtl);
            } else {
                addClass(addTarget, options.cssClasses.textDirectionLtr);
            }

            return addNodeTo(addTarget, options.cssClasses.base);
        }

        function addTooltip(handle, handleNumber) {
            if (!options.tooltips[handleNumber]) {
                return false;
            }

            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }

        function isSliderDisabled() {
            return scope_Target.hasAttribute("disabled");
        }

        // Disable the slider dragging if any handle is disabled
        function isHandleDisabled(handleNumber) {
            var handleOrigin = scope_Handles[handleNumber];
            return handleOrigin.hasAttribute("disabled");
        }

        function removeTooltips() {
            if (scope_Tooltips) {
                removeEvent("update.tooltips");
                scope_Tooltips.forEach(function(tooltip) {
                    if (tooltip) {
                        removeElement(tooltip);
                    }
                });
                scope_Tooltips = null;
            }
        }

        // The tooltips option is a shorthand for using the 'update' event.
        function tooltips() {
            removeTooltips();

            // Tooltips are added with options.tooltips in original order.
            scope_Tooltips = scope_Handles.map(addTooltip);

            bindEvent("update.tooltips", function(values, handleNumber, unencoded) {
                if (!scope_Tooltips[handleNumber]) {
                    return;
                }

                var formattedValue = values[handleNumber];

                if (options.tooltips[handleNumber] !== true) {
                    formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                }

                scope_Tooltips[handleNumber].innerHTML = formattedValue;
            });
        }

        function aria() {
            bindEvent("update", function(values, handleNumber, unencoded, tap, positions) {
                // Update Aria Values for all handles, as a change in one changes min and max values for the next.
                scope_HandleNumbers.forEach(function(index) {
                    var handle = scope_Handles[index];

                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

                    var now = positions[index];

                    // Formatted value for display
                    var text = options.ariaFormat.to(unencoded[index]);

                    // Map to slider range values
                    min = scope_Spectrum.fromStepping(min).toFixed(1);
                    max = scope_Spectrum.fromStepping(max).toFixed(1);
                    now = scope_Spectrum.fromStepping(now).toFixed(1);

                    handle.children[0].setAttribute("aria-valuemin", min);
                    handle.children[0].setAttribute("aria-valuemax", max);
                    handle.children[0].setAttribute("aria-valuenow", now);
                    handle.children[0].setAttribute("aria-valuetext", text);
                });
            });
        }

        function getGroup(mode, values, stepped) {
            // Use the range.
            if (mode === "range" || mode === "steps") {
                return scope_Spectrum.xVal;
            }

            if (mode === "count") {
                if (values < 2) {
                    throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
                }

                // Divide 0 - 100 in 'count' parts.
                var interval = values - 1;
                var spread = 100 / interval;

                values = [];

                // List these parts and have them handled as 'positions'.
                while (interval--) {
                    values[interval] = interval * spread;
                }

                values.push(100);

                mode = "positions";
            }

            if (mode === "positions") {
                // Map all percentages to on-range values.
                return values.map(function(value) {
                    return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
                });
            }

            if (mode === "values") {
                // If the value must be stepped, it needs to be converted to a percentage first.
                if (stepped) {
                    return values.map(function(value) {
                        // Convert to percentage, apply step, return to value.
                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                    });
                }

                // Otherwise, we can simply use the values.
                return values;
            }
        }

        function generateSpread(density, mode, group) {
            function safeIncrement(value, increment) {
                // Avoid floating point variance by dropping the smallest decimal places.
                return (value + increment).toFixed(7) / 1;
            }

            var indexes = {};
            var firstInRange = scope_Spectrum.xVal[0];
            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
            var ignoreFirst = false;
            var ignoreLast = false;
            var prevPct = 0;

            // Create a copy of the group, sort it and filter away all duplicates.
            group = unique(
                group.slice().sort(function(a, b) {
                    return a - b;
                })
            );

            // Make sure the range starts with the first element.
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }

            // Likewise for the last one.
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }

            group.forEach(function(current, index) {
                // Get the current step and the lower + upper positions.
                var step;
                var i;
                var q;
                var low = current;
                var high = group[index + 1];
                var newPct;
                var pctDifference;
                var pctPos;
                var type;
                var steps;
                var realSteps;
                var stepSize;
                var isSteps = mode === "steps";

                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                if (isSteps) {
                    step = scope_Spectrum.xNumSteps[index];
                }

                // Default to a 'full' step.
                if (!step) {
                    step = high - low;
                }

                // Low can be 0, so test for false. Index 0 is already handled.
                if (low === false) {
                    return;
                }

                // If high is undefined we are at the last subrange. Make sure it iterates once (#1088)
                if (high === undefined) {
                    high = low;
                }

                // Make sure step isn't 0, which would cause an infinite loop (#654)
                step = Math.max(step, 0.0000001);

                // Find all steps in the subrange.
                for (i = low; i <= high; i = safeIncrement(i, step)) {
                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;

                    steps = pctDifference / density;
                    realSteps = Math.round(steps);

                    // This ratio represents the amount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepSize = pctDifference / realSteps;

                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (q = 1; q <= realSteps; q += 1) {
                        // The ratio between the rounded value and the actual size might be ~1% off.
                        // Correct the percentage offset by the number of points
                        // per subrange. density = 1 will result in 100 points on the
                        // full range, 2 for 50, 4 for 25, etc.
                        pctPos = prevPct + q * stepSize;
                        indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                    }

                    // Determine the point type.
                    type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;

                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    if (!index && ignoreFirst && i !== high) {
                        type = 0;
                    }

                    if (!(i === high && ignoreLast)) {
                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                        indexes[newPct.toFixed(5)] = [i, type];
                    }

                    // Update the percentage count.
                    prevPct = newPct;
                }
            });

            return indexes;
        }

        function addMarking(spread, filterFunc, formatter) {
            var element = scope_Document.createElement("div");

            var valueSizeClasses = [];
            valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
            valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
            valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;

            var markerSizeClasses = [];
            markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
            markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
            markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;

            var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
            var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];

            addClass(element, options.cssClasses.pips);
            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

            function getClasses(type, source) {
                var a = source === options.cssClasses.value;
                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
            }

            function addSpread(offset, value, type) {
                // Apply the filter function, if it is set.
                type = filterFunc ? filterFunc(value, type) : type;

                if (type === PIPS_NONE) {
                    return;
                }

                // Add a marker for every point
                var node = addNodeTo(element, false);
                node.className = getClasses(type, options.cssClasses.marker);
                node.style[options.style] = offset + "%";

                // Values are only appended for points marked '1' or '2'.
                if (type > PIPS_NO_VALUE) {
                    node = addNodeTo(element, false);
                    node.className = getClasses(type, options.cssClasses.value);
                    node.setAttribute("data-value", value);
                    node.style[options.style] = offset + "%";
                    node.innerHTML = formatter.to(value);
                }
            }

            // Append all points.
            Object.keys(spread).forEach(function(offset) {
                addSpread(offset, spread[offset][0], spread[offset][1]);
            });

            return element;
        }

        function removePips() {
            if (scope_Pips) {
                removeElement(scope_Pips);
                scope_Pips = null;
            }
        }

        function pips(grid) {
            // Fix #669
            removePips();

            var mode = grid.mode;
            var density = grid.density || 1;
            var filter = grid.filter || false;
            var values = grid.values || false;
            var stepped = grid.stepped || false;
            var group = getGroup(mode, values, stepped);
            var spread = generateSpread(density, mode, group);
            var format = grid.format || {
                to: Math.round
            };

            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));

            return scope_Pips;
        }

        // Shorthand for base dimensions.
        function baseSize() {
            var rect = scope_Base.getBoundingClientRect();
            var alt = "offset" + ["Width", "Height"][options.ort];
            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }

        // Handler for attaching events trough a proxy.
        function attachEvent(events, element, callback, data) {
            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList

            var method = function(e) {
                e = fixEvent(e, data.pageOffset, data.target || element);

                // fixEvent returns false if this event has a different target
                // when handling (multi-) touch events;
                if (!e) {
                    return false;
                }

                // doNotReject is passed by all end events to make sure released touches
                // are not rejected, leaving the slider "stuck" to the cursor;
                if (isSliderDisabled() && !data.doNotReject) {
                    return false;
                }

                // Stop if an active 'tap' transition is taking place.
                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (data.hover && e.buttons) {
                    return false;
                }

                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                // touch-action: manipulation, but that allows panning, which breaks
                // sliders after zooming/on non-responsive pages.
                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                if (!supportsPassive) {
                    e.preventDefault();
                }

                e.calcPoint = e.points[options.ort];

                // Call the event handler with the event [ and additional data ].
                callback(e, data);
            };

            var methods = [];

            // Bind a closure on the target for every event type.
            events.split(" ").forEach(function(eventName) {
                element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
                methods.push([eventName, method]);
            });

            return methods;
        }

        // Provide a clean event with standardized offset values.
        function fixEvent(e, pageOffset, eventTarget) {
            // Filter the event to register the type, which can be
            // touch, mouse or pointer. Offset changes need to be
            // made on an event specific basis.
            var touch = e.type.indexOf("touch") === 0;
            var mouse = e.type.indexOf("mouse") === 0;
            var pointer = e.type.indexOf("pointer") === 0;

            var x;
            var y;

            // IE10 implemented pointer events with a prefix;
            if (e.type.indexOf("MSPointer") === 0) {
                pointer = true;
            }

            // Erroneous events seem to be passed in occasionally on iOS/iPadOS after user finishes interacting with
            // the slider. They appear to be of type MouseEvent, yet they don't have usual properties set. Ignore
            // events that have no touches or buttons associated with them. (#1057, #1079, #1095)
            if (e.type === "mousedown" && !e.buttons && !e.touches) {
                return false;
            }

            // The only thing one handle should be concerned about is the touches that originated on top of it.
            if (touch) {
                // Returns true if a touch originated on the target.
                var isTouchOnTarget = function(checkTouch) {
                    return (
                        checkTouch.target === eventTarget ||
                        eventTarget.contains(checkTouch.target) ||
                        (checkTouch.target.shadowRoot && checkTouch.target.shadowRoot.contains(eventTarget))
                    );
                };

                // In the case of touchstart events, we need to make sure there is still no more than one
                // touch on the target so we look amongst all touches.
                if (e.type === "touchstart") {
                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

                    // Do not support more than one touch per handle.
                    if (targetTouches.length > 1) {
                        return false;
                    }

                    x = targetTouches[0].pageX;
                    y = targetTouches[0].pageY;
                } else {
                    // In the other cases, find on changedTouches is enough.
                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

                    // Cancel if the target touch has not moved.
                    if (!targetTouch) {
                        return false;
                    }

                    x = targetTouch.pageX;
                    y = targetTouch.pageY;
                }
            }

            pageOffset = pageOffset || getPageOffset(scope_Document);

            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }

            e.pageOffset = pageOffset;
            e.points = [x, y];
            e.cursor = mouse || pointer; // Fix #435

            return e;
        }

        // Translate a coordinate in the document to a percentage on the slider
        function calcPointToPercentage(calcPoint) {
            var location = calcPoint - offset(scope_Base, options.ort);
            var proposal = (location * 100) / baseSize();

            // Clamp proposal between 0% and 100%
            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
            // are used (e.g. contained handles feature)
            proposal = limit(proposal);

            return options.dir ? 100 - proposal : proposal;
        }

        // Find handle closest to a certain percentage on the slider
        function getClosestHandle(clickedPosition) {
            var smallestDifference = 100;
            var handleNumber = false;

            scope_Handles.forEach(function(handle, index) {
                // Disabled handles are ignored
                if (isHandleDisabled(index)) {
                    return;
                }

                var handlePosition = scope_Locations[index];
                var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);

                // Initial state
                var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;

                // Difference with this handle is smaller than the previously checked handle
                var isCloser = differenceWithThisHandle < smallestDifference;
                var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;

                if (isCloser || isCloserAfter || clickAtEdge) {
                    handleNumber = index;
                    smallestDifference = differenceWithThisHandle;
                }
            });

            return handleNumber;
        }

        // Fire 'end' when a mouse or pen leaves the document.
        function documentLeave(event, data) {
            if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
                eventEnd(event, data);
            }
        }

        // Handle movement on document for handle and range drag.
        function eventMove(event, data) {
            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons and .which zero on mousemove.
            // Firefox breaks the spec MDN defines.
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
                return eventEnd(event, data);
            }

            // Check if we are moving up or down
            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

            // Convert the movement into a percentage of the slider width/height
            var proposal = (movement * 100) / data.baseSize;

            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
        }

        // Unbind move events on document, call callbacks.
        function eventEnd(event, data) {
            // The handle is no longer active, so remove the class.
            if (data.handle) {
                removeClass(data.handle, options.cssClasses.active);
                scope_ActiveHandlesCount -= 1;
            }

            // Unbind the move and end events, which are added on 'start'.
            data.listeners.forEach(function(c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            });

            if (scope_ActiveHandlesCount === 0) {
                // Remove dragging class.
                removeClass(scope_Target, options.cssClasses.drag);
                setZindex();

                // Remove cursor styles and text-selection events bound to the body.
                if (event.cursor) {
                    scope_Body.style.cursor = "";
                    scope_Body.removeEventListener("selectstart", preventDefault);
                }
            }

            data.handleNumbers.forEach(function(handleNumber) {
                fireEvent("change", handleNumber);
                fireEvent("set", handleNumber);
                fireEvent("end", handleNumber);
            });
        }

        // Bind move events on document.
        function eventStart(event, data) {
            // Ignore event if any handle is disabled
            if (data.handleNumbers.some(isHandleDisabled)) {
                return false;
            }

            var handle;

            if (data.handleNumbers.length === 1) {
                var handleOrigin = scope_Handles[data.handleNumbers[0]];

                handle = handleOrigin.children[0];
                scope_ActiveHandlesCount += 1;

                // Mark the handle as 'active' so it can be styled.
                addClass(handle, options.cssClasses.active);
            }

            // A drag should never propagate up to the 'tap' event.
            event.stopPropagation();

            // Record the event listeners.
            var listeners = [];

            // Attach the move and end events.
            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                // The event target has changed so we need to propagate the original one so that we keep
                // relying on it to extract target touches.
                target: event.target,
                handle: handle,
                listeners: listeners,
                startCalcPoint: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handleNumbers: data.handleNumbers,
                buttonsProperty: event.buttons,
                locations: scope_Locations.slice()
            });

            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            // We want to make sure we pushed the listeners in the listener list rather than creating
            // a new one as it has already been passed to the event handlers.
            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

            // Text selection isn't an issue on touch devices,
            // so adding cursor styles can be skipped.
            if (event.cursor) {
                // Prevent the 'I' cursor and extend the range-drag cursor.
                scope_Body.style.cursor = getComputedStyle(event.target).cursor;

                // Mark the target with a dragging state.
                if (scope_Handles.length > 1) {
                    addClass(scope_Target, options.cssClasses.drag);
                }

                // Prevent text selection when dragging the handles.
                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                // The 'cursor' flag is false.
                // See: http://caniuse.com/#search=selectstart
                scope_Body.addEventListener("selectstart", preventDefault, false);
            }

            data.handleNumbers.forEach(function(handleNumber) {
                fireEvent("start", handleNumber);
            });
        }

        // Move closest handle to tapped location.
        function eventTap(event) {
            // The tap event shouldn't propagate up
            event.stopPropagation();

            var proposal = calcPointToPercentage(event.calcPoint);
            var handleNumber = getClosestHandle(proposal);

            // Tackle the case that all handles are 'disabled'.
            if (handleNumber === false) {
                return false;
            }

            // Flag the slider as it is now in a transitional state.
            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
            if (!options.events.snap) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            setHandle(handleNumber, proposal, true, true);

            setZindex();

            fireEvent("slide", handleNumber, true);
            fireEvent("update", handleNumber, true);
            fireEvent("change", handleNumber, true);
            fireEvent("set", handleNumber, true);

            if (options.events.snap) {
                eventStart(event, { handleNumbers: [handleNumber] });
            }
        }

        // Fires a 'hover' event for a hovered mouse/pen position.
        function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint);

            var to = scope_Spectrum.getStep(proposal);
            var value = scope_Spectrum.fromStepping(to);

            Object.keys(scope_Events).forEach(function(targetEvent) {
                if ("hover" === targetEvent.split(".")[0]) {
                    scope_Events[targetEvent].forEach(function(callback) {
                        callback.call(scope_Self, value);
                    });
                }
            });
        }

        // Handles keydown on focused handles
        // Don't move the document when pressing arrow keys on focused handles
        function eventKeydown(event, handleNumber) {
            if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
                return false;
            }

            var horizontalKeys = ["Left", "Right"];
            var verticalKeys = ["Down", "Up"];
            var largeStepKeys = ["PageDown", "PageUp"];
            var edgeKeys = ["Home", "End"];

            if (options.dir && !options.ort) {
                // On an right-to-left slider, the left and right keys act inverted
                horizontalKeys.reverse();
            } else if (options.ort && !options.dir) {
                // On a top-to-bottom slider, the up and down keys act inverted
                verticalKeys.reverse();
                largeStepKeys.reverse();
            }

            // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            var key = event.key.replace("Arrow", "");

            var isLargeDown = key === largeStepKeys[0];
            var isLargeUp = key === largeStepKeys[1];
            var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
            var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
            var isMin = key === edgeKeys[0];
            var isMax = key === edgeKeys[1];

            if (!isDown && !isUp && !isMin && !isMax) {
                return true;
            }

            event.preventDefault();

            var to;

            if (isUp || isDown) {
                var multiplier = options.keyboardPageMultiplier;
                var direction = isDown ? 0 : 1;
                var steps = getNextStepsForHandle(handleNumber);
                var step = steps[direction];

                // At the edge of a slider, do nothing
                if (step === null) {
                    return false;
                }

                // No step set, use the default of 10% of the sub-range
                if (step === false) {
                    step = scope_Spectrum.getDefaultStep(
                        scope_Locations[handleNumber],
                        isDown,
                        options.keyboardDefaultStep
                    );
                }

                if (isLargeUp || isLargeDown) {
                    step *= multiplier;
                }

                // Step over zero-length ranges (#948);
                step = Math.max(step, 0.0000001);

                // Decrement for down steps
                step = (isDown ? -1 : 1) * step;

                to = scope_Values[handleNumber] + step;
            } else if (isMax) {
                // End key
                to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
            } else {
                // Home key
                to = options.spectrum.xVal[0];
            }

            setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);

            fireEvent("slide", handleNumber);
            fireEvent("update", handleNumber);
            fireEvent("change", handleNumber);
            fireEvent("set", handleNumber);

            return false;
        }

        // Attach events to several slider parts.
        function bindSliderEvents(behaviour) {
            // Attach the standard drag event to the handles.
            if (!behaviour.fixed) {
                scope_Handles.forEach(function(handle, index) {
                    // These events are only bound to the visual handle
                    // element, not the 'real' origin element.
                    attachEvent(actions.start, handle.children[0], eventStart, {
                        handleNumbers: [index]
                    });
                });
            }

            // Attach the tap event to the slider base.
            if (behaviour.tap) {
                attachEvent(actions.start, scope_Base, eventTap, {});
            }

            // Fire hover events
            if (behaviour.hover) {
                attachEvent(actions.move, scope_Base, eventHover, {
                    hover: true
                });
            }

            // Make the range draggable.
            if (behaviour.drag) {
                scope_Connects.forEach(function(connect, index) {
                    if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                        return;
                    }

                    var handleBefore = scope_Handles[index - 1];
                    var handleAfter = scope_Handles[index];
                    var eventHolders = [connect];

                    addClass(connect, options.cssClasses.draggable);

                    // When the range is fixed, the entire range can
                    // be dragged by the handles. The handle in the first
                    // origin will propagate the start event upward,
                    // but it needs to be bound manually on the other.
                    if (behaviour.fixed) {
                        eventHolders.push(handleBefore.children[0]);
                        eventHolders.push(handleAfter.children[0]);
                    }

                    eventHolders.forEach(function(eventHolder) {
                        attachEvent(actions.start, eventHolder, eventStart, {
                            handles: [handleBefore, handleAfter],
                            handleNumbers: [index - 1, index]
                        });
                    });
                });
            }
        }

        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);

            // If the event bound is 'update,' fire it immediately for all handles.
            if (namespacedEvent.split(".")[0] === "update") {
                scope_Handles.forEach(function(a, index) {
                    fireEvent("update", index);
                });
            }
        }

        // Undo attachment of event
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0];
            var namespace = event && namespacedEvent.substring(event.length);

            Object.keys(scope_Events).forEach(function(bind) {
                var tEvent = bind.split(".")[0];
                var tNamespace = bind.substring(tEvent.length);

                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                    delete scope_Events[bind];
                }
            });
        }

        // External event handling
        function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach(function(targetEvent) {
                var eventType = targetEvent.split(".")[0];

                if (eventName === eventType) {
                    scope_Events[targetEvent].forEach(function(callback) {
                        callback.call(
                            // Use the slider public API as the scope ('this')
                            scope_Self,
                            // Return values as array, so arg_1[arg_2] is always valid.
                            scope_Values.map(options.format.to),
                            // Handle index, 0 or 1
                            handleNumber,
                            // Un-formatted slider values
                            scope_Values.slice(),
                            // Event is fired by tap, true or false
                            tap || false,
                            // Left offset of the handle, in relation to the slider
                            scope_Locations.slice(),
                            // add the slider public API to an accessible parameter when this is unavailable
                            scope_Self
                        );
                    });
                }
            });
        }

        // Split out the handle positioning logic so the Move event can use it, too
        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
            var distance;

            // For sliders with multiple handles, limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
            if (scope_Handles.length > 1 && !options.events.unconstrained) {
                if (lookBackward && handleNumber > 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, 0);
                    to = Math.max(to, distance);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, 1);
                    to = Math.min(to, distance);
                }
            }

            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmovable.
            if (scope_Handles.length > 1 && options.limit) {
                if (lookBackward && handleNumber > 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, 0);
                    to = Math.min(to, distance);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, 1);
                    to = Math.max(to, distance);
                }
            }

            // The padding option keeps the handles a certain distance from the
            // edges of the slider. Padding must be > 0.
            if (options.padding) {
                if (handleNumber === 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], 0);
                    to = Math.max(to, distance);
                }

                if (handleNumber === scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], 1);
                    to = Math.min(to, distance);
                }
            }

            to = scope_Spectrum.getStep(to);

            // Limit percentage to the 0 - 100 range
            to = limit(to);

            // Return false if handle can't move
            if (to === reference[handleNumber] && !getValue) {
                return false;
            }

            return to;
        }

        // Uses slider orientation to create CSS rules. a = base value;
        function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }

        // Moves handle(s) by a percentage
        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
        function moveHandles(upward, proposal, locations, handleNumbers) {
            var proposals = locations.slice();

            var b = [!upward, upward];
            var f = [upward, !upward];

            // Copy handleNumbers so we don't change the dataset
            handleNumbers = handleNumbers.slice();

            // Check to see which handle is 'leading'.
            // If that one can't move the second can't either.
            if (upward) {
                handleNumbers.reverse();
            }

            // Step 1: get the maximum percentage that any of the handles can move
            if (handleNumbers.length > 1) {
                handleNumbers.forEach(function(handleNumber, o) {
                    var to = checkHandlePosition(
                        proposals,
                        handleNumber,
                        proposals[handleNumber] + proposal,
                        b[o],
                        f[o],
                        false
                    );

                    // Stop if one of the handles can't move.
                    if (to === false) {
                        proposal = 0;
                    } else {
                        proposal = to - proposals[handleNumber];
                        proposals[handleNumber] = to;
                    }
                });
            }

            // If using one handle, check backward AND forward
            else {
                b = f = [true];
            }

            var state = false;

            // Step 2: Try to set the handles with the found percentage
            handleNumbers.forEach(function(handleNumber, o) {
                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
            });

            // Step 3: If a handle moved, fire events
            if (state) {
                handleNumbers.forEach(function(handleNumber) {
                    fireEvent("update", handleNumber);
                    fireEvent("slide", handleNumber);
                });
            }
        }

        // Takes a base value and an offset. This offset is used for the connect bar size.
        // In the initial design for this feature, the origin element was 1% wide.
        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
        function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }

        // Updates scope_Locations and scope_Values, updates visual state
        function updateHandlePosition(handleNumber, to) {
            // Update locations.
            scope_Locations[handleNumber] = to;

            // Convert the value to the slider stepping/range.
            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

            var translation = 10 * (transformDirection(to, 0) - scope_DirOffset);
            var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";

            scope_Handles[handleNumber].style[options.transformRule] = translateRule;

            updateConnect(handleNumber);
            updateConnect(handleNumber + 1);
        }

        // Handles before the slider middle are stacked later = higher,
        // Handles after the middle later is lower
        // [[7] [8] .......... | .......... [5] [4]
        function setZindex() {
            scope_HandleNumbers.forEach(function(handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = zIndex;
            });
        }

        // Test suggested values and apply margin, step.
        // if exactInput is true, don't run checkHandlePosition, then the handle can be placed in between steps (#436)
        function setHandle(handleNumber, to, lookBackward, lookForward, exactInput) {
            if (!exactInput) {
                to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);
            }

            if (to === false) {
                return false;
            }

            updateHandlePosition(handleNumber, to);

            return true;
        }

        // Updates style attribute for connect nodes
        function updateConnect(index) {
            // Skip connects set to false
            if (!scope_Connects[index]) {
                return;
            }

            var l = 0;
            var h = 100;

            if (index !== 0) {
                l = scope_Locations[index - 1];
            }

            if (index !== scope_Connects.length - 1) {
                h = scope_Locations[index];
            }

            // We use two rules:
            // 'translate' to change the left/top offset;
            // 'scale' to change the width of the element;
            // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
            var connectWidth = h - l;
            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";

            scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
        }

        // Parses value passed to .set method. Returns current value if not parse-able.
        function resolveToValue(to, handleNumber) {
            // Setting with null indicates an 'ignore'.
            // Inputting 'false' is invalid.
            if (to === null || to === false || to === undefined) {
                return scope_Locations[handleNumber];
            }

            // If a formatted number was passed, attempt to decode it.
            if (typeof to === "number") {
                to = String(to);
            }

            to = options.format.from(to);
            to = scope_Spectrum.toStepping(to);

            // If parsing the number failed, use the current value.
            if (to === false || isNaN(to)) {
                return scope_Locations[handleNumber];
            }

            return to;
        }

        // Set the slider value.
        function valueSet(input, fireSetEvent, exactInput) {
            var values = asArray(input);
            var isInit = scope_Locations[0] === undefined;

            // Event fires by default
            fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;

            // Animation is optional.
            // Make sure the initial values were set before using animated placement.
            if (options.animate && !isInit) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
            scope_HandleNumbers.forEach(function(handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
            });

            var i = scope_HandleNumbers.length === 1 ? 0 : 1;

            // Secondary passes. Now that all base values are set, apply constraints.
            // Iterate all handles to ensure constraints are applied for the entire slider (Issue #1009)
            for (; i < scope_HandleNumbers.length; ++i) {
                scope_HandleNumbers.forEach(function(handleNumber) {
                    setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
                });
            }

            setZindex();

            scope_HandleNumbers.forEach(function(handleNumber) {
                fireEvent("update", handleNumber);

                // Fire the event only for handles that received a new value, as per #579
                if (values[handleNumber] !== null && fireSetEvent) {
                    fireEvent("set", handleNumber);
                }
            });
        }

        // Reset slider to initial values
        function valueReset(fireSetEvent) {
            valueSet(options.start, fireSetEvent);
        }

        // Set value for a single handle
        function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
            // Ensure numeric input
            handleNumber = Number(handleNumber);

            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
                throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
            }

            // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
            // The exactInput argument can be used to ignore slider stepping (#436)
            setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);

            fireEvent("update", handleNumber);

            if (fireSetEvent) {
                fireEvent("set", handleNumber);
            }
        }

        // Get the slider value.
        function valueGet() {
            var values = scope_Values.map(options.format.to);

            // If only one handle is used, return a single value.
            if (values.length === 1) {
                return values[0];
            }

            return values;
        }

        // Removes classes from the root and empties it.
        function destroy() {
            for (var key in options.cssClasses) {
                if (!options.cssClasses.hasOwnProperty(key)) {
                    continue;
                }
                removeClass(scope_Target, options.cssClasses[key]);
            }

            while (scope_Target.firstChild) {
                scope_Target.removeChild(scope_Target.firstChild);
            }

            delete scope_Target.noUiSlider;
        }

        function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber];
            var nearbySteps = scope_Spectrum.getNearbySteps(location);
            var value = scope_Values[handleNumber];
            var increment = nearbySteps.thisStep.step;
            var decrement = null;

            // If snapped, directly use defined step value
            if (options.snap) {
                return [
                    value - nearbySteps.stepBefore.startValue || null,
                    nearbySteps.stepAfter.startValue - value || null
                ];
            }

            // If the next value in this step moves into the next step,
            // the increment is the start of the next step - the current value
            if (increment !== false) {
                if (value + increment > nearbySteps.stepAfter.startValue) {
                    increment = nearbySteps.stepAfter.startValue - value;
                }
            }

            // If the value is beyond the starting point
            if (value > nearbySteps.thisStep.startValue) {
                decrement = nearbySteps.thisStep.step;
            } else if (nearbySteps.stepBefore.step === false) {
                decrement = false;
            }

            // If a handle is at the start of a step, it always steps back into the previous step first
            else {
                decrement = value - nearbySteps.stepBefore.highestStep;
            }

            // Now, if at the slider edges, there is no in/decrement
            if (location === 100) {
                increment = null;
            } else if (location === 0) {
                decrement = null;
            }

            // As per #391, the comparison for the decrement step can have some rounding issues.
            var stepDecimals = scope_Spectrum.countStepDecimals();

            // Round per #391
            if (increment !== null && increment !== false) {
                increment = Number(increment.toFixed(stepDecimals));
            }

            if (decrement !== null && decrement !== false) {
                decrement = Number(decrement.toFixed(stepDecimals));
            }

            return [decrement, increment];
        }

        // Get the current step size for the slider.
        function getNextSteps() {
            return scope_HandleNumbers.map(getNextStepsForHandle);
        }

        // Updateable: margin, limit, padding, step, range, animate, snap
        function updateOptions(optionsToUpdate, fireSetEvent) {
            // Spectrum is created using the range, snap, direction and step options.
            // 'snap' and 'step' can be updated.
            // If 'snap' and 'step' are not passed, they should remain unchanged.
            var v = valueGet();

            var updateAble = [
                "margin",
                "limit",
                "padding",
                "range",
                "animate",
                "snap",
                "step",
                "format",
                "pips",
                "tooltips"
            ];

            // Only change options that we're actually passed to update.
            updateAble.forEach(function(name) {
                // Check for undefined. null removes the value.
                if (optionsToUpdate[name] !== undefined) {
                    originalOptions[name] = optionsToUpdate[name];
                }
            });

            var newOptions = testOptions(originalOptions);

            // Load new options into the slider state
            updateAble.forEach(function(name) {
                if (optionsToUpdate[name] !== undefined) {
                    options[name] = newOptions[name];
                }
            });

            scope_Spectrum = newOptions.spectrum;

            // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.padding = newOptions.padding;

            // Update pips, removes existing.
            if (options.pips) {
                pips(options.pips);
            } else {
                removePips();
            }

            // Update tooltips, removes existing.
            if (options.tooltips) {
                tooltips();
            } else {
                removeTooltips();
            }

            // Invalidate the current positioning so valueSet forces an update.
            scope_Locations = [];
            valueSet(optionsToUpdate.start || v, fireSetEvent);
        }

        // Initialization steps
        function setupSlider() {
            // Create the base element, initialize HTML and set classes.
            // Add handles and connect elements.
            scope_Base = addSlider(scope_Target);

            addElements(options.connect, scope_Base);

            // Attach user events.
            bindSliderEvents(options.events);

            // Use the public value method to set the start values.
            valueSet(options.start);

            if (options.pips) {
                pips(options.pips);
            }

            if (options.tooltips) {
                tooltips();
            }

            aria();
        }

        setupSlider();

        // noinspection JSUnusedGlobalSymbols
        scope_Self = {
            destroy: destroy,
            steps: getNextSteps,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: valueSetHandle,
            reset: valueReset,
            // Exposed for unit testing, don't use this in your application.
            __moveHandles: function(a, b, c) {
                moveHandles(a, b, scope_Locations, c);
            },
            options: originalOptions, // Issue #600, #678
            updateOptions: updateOptions,
            target: scope_Target, // Issue #597
            removePips: removePips,
            removeTooltips: removeTooltips,
            getTooltips: function() {
                return scope_Tooltips;
            },
            getOrigins: function() {
                return scope_Handles;
            },
            pips: pips // Issue #594
        };

        return scope_Self;
    }

    // Run the standard initializer
    function initialize(target, originalOptions) {
        if (!target || !target.nodeName) {
            throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
        }

        // Throw an error if the slider was already initialized.
        if (target.noUiSlider) {
            throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
        }

        // Test the options and create the slider environment;
        var options = testOptions(originalOptions, target);
        var api = scope(target, options, originalOptions);

        target.noUiSlider = api;

        return api;
    }

    // Use an object instead of a function for future expandability;
    return {
        // Exposed for unit testing, don't use this in your application.
        __spectrum: Spectrum,
        version: VERSION,
        // A reference to the default classes, allows global changes.
        // Use the cssClasses option for changes to one slider.
        cssClasses: cssClasses,
        create: initialize
    };
});

// wNumb (форматирование цены  в фильтре цен (показывает без копеек)):
!function(e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():window.wNumb=e()}(function(){"use strict";var o=["decimals","thousand","mark","prefix","suffix","encoder","decoder","negativeBefore","negative","edit","undo"];function w(e){return e.split("").reverse().join("")}function h(e,t){return e.substring(0,t.length)===t}function f(e,t,n){if((e[t]||e[n])&&e[t]===e[n])throw new Error(t)}function x(e){return"number"==typeof e&&isFinite(e)}function n(e,t,n,r,i,o,f,u,s,c,a,p){var d,l,h,g=p,v="",m="";return o&&(p=o(p)),!!x(p)&&(!1!==e&&0===parseFloat(p.toFixed(e))&&(p=0),p<0&&(d=!0,p=Math.abs(p)),!1!==e&&(p=function(e,t){return e=e.toString().split("e"),(+((e=(e=Math.round(+(e[0]+"e"+(e[1]?+e[1]+t:t)))).toString().split("e"))[0]+"e"+(e[1]?e[1]-t:-t))).toFixed(t)}(p,e)),-1!==(p=p.toString()).indexOf(".")?(h=(l=p.split("."))[0],n&&(v=n+l[1])):h=p,t&&(h=w((h=w(h).match(/.{1,3}/g)).join(w(t)))),d&&u&&(m+=u),r&&(m+=r),d&&s&&(m+=s),m+=h,m+=v,i&&(m+=i),c&&(m=c(m,g)),m)}function r(e,t,n,r,i,o,f,u,s,c,a,p){var d,l="";return a&&(p=a(p)),!(!p||"string"!=typeof p)&&(u&&h(p,u)&&(p=p.replace(u,""),d=!0),r&&h(p,r)&&(p=p.replace(r,"")),s&&h(p,s)&&(p=p.replace(s,""),d=!0),i&&function(e,t){return e.slice(-1*t.length)===t}(p,i)&&(p=p.slice(0,-1*i.length)),t&&(p=p.split(t).join("")),n&&(p=p.replace(n,".")),d&&(l+="-"),""!==(l=(l+=p).replace(/[^0-9\.\-.]/g,""))&&(l=Number(l),f&&(l=f(l)),!!x(l)&&l))}function i(e,t,n){var r,i=[];for(r=0;r<o.length;r+=1)i.push(e[o[r]]);return i.push(n),t.apply("",i)}return function e(t){if(!(this instanceof e))return new e(t);"object"==typeof t&&(t=function(e){var t,n,r,i={};for(void 0===e.suffix&&(e.suffix=e.postfix),t=0;t<o.length;t+=1)if(void 0===(r=e[n=o[t]]))"negative"!==n||i.negativeBefore?"mark"===n&&"."!==i.thousand?i[n]=".":i[n]=!1:i[n]="-";else if("decimals"===n){if(!(0<=r&&r<8))throw new Error(n);i[n]=r}else if("encoder"===n||"decoder"===n||"edit"===n||"undo"===n){if("function"!=typeof r)throw new Error(n);i[n]=r}else{if("string"!=typeof r)throw new Error(n);i[n]=r}return f(i,"mark","thousand"),f(i,"prefix","negative"),f(i,"prefix","negativeBefore"),i}(t),this.to=function(e){return i(t,n,e)},this.from=function(e){return i(t,r,e)})}});

// Подключение js-файлов: 
// Подключение кнопки-счётчика (5-45:22): 
let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
	for (let index = 0; index < quantityButtons.length; index++) {
		const quantityButton = quantityButtons[index];
		quantityButton.addEventListener("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
			if (quantityButton.classList.contains('quantity__button--plus')) {
				value++;
			} else {
				value = value - 1;
				if (value < 1) {
					value = 1
				}
			}
			quantityButton.closest('.quantity').querySelector('input').value = value;
		});
	}
}
// Настройки для слайдера фильтра цены: 
const priceSlider = document.querySelector('.price-filter__slider');

noUiSlider.create(priceSlider, {
	start: [0, 200000],
	connect: true,
	tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })], //форматирование цен под ползунками в фильтре
	range: {
		'min': [0],
		'max': [200000]
	}
});

// При указании цены в полях для ввода, точки переместятся соответственно (4-1:17:25)
const priceStart = document.getElementById('price-start');
const priceEnd = document.getElementById('price-end');
priceStart.addEventListener('change', setPriceValues);
priceEnd.addEventListener('change', setPriceValues);

function setPriceValues() {
	let priceStartValue;
	let priceEndValue;
	if (priceStart.value != '') {
		priceStartValue = priceStart.value;
	}
	if (priceEnd.value != '') {
		priceEndValue = priceEnd.value;
	}
	priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
}

//=================================================================================================================================

// При нажатии на заголовок ФИЛЬТР ТОВАРОВ выезжает фильтр (на малых экранах) 4-2:16:09 :

if (isMobile.any()) {
	const filterTitle = document.querySelector('.filter__title');
	filterTitle.addEventListener("click", function (e) {
		filterTitle.classList.toggle('_active');
		_slideToggle(filterTitle.nextElementSibling);
	});
}




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
