'use strict';

//Burger Button
const burgerBtn = document.querySelector('.jsBurgerBtn');
const headerMenu = document.querySelector('.jsHederMenu');
const body = document.querySelector('.body');

burgerBtn.addEventListener('click', ()=> {
	
	if (window.innerWidth <= 1024) {
	
		if(headerMenu.classList.contains('mobile-menu--active')) {
			body.style.overflow='auto';
			headerMenu.classList.remove('mobile-menu--active');
			burgerBtn.classList.remove('mobile-menu--active');
		} else {
			headerMenu.classList.add('mobile-menu--active');
			burgerBtn.classList.add('mobile-menu--active');
			body.style.overflow='hidden';
		}
	}

});