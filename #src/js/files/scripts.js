// Настройки для слайдера фильтра цены:
if (document.querySelector('.price-filter')) {
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



