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

