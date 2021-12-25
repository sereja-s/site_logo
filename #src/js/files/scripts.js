// Настройки для слайдера фильтра цены: 
const priceSlider = document.querySelector('.price-filter');

noUiSlider.create(priceSlider, {
	start: [20, 80],
	range: {
		'min': [0],
		'max': [100]
	}
});

