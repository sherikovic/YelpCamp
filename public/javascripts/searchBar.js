const searchbar = document.querySelector('.search-bar');
searchbar.addEventListener('keydown', (event) => {
	// user hit enter
	if (event.keyCode === 13) {
		const stringEntered = searchbar.value;
		let camps = campgrounds['features'];
		camps = camps.filter((camp) => camp['title'].includes(stringEntered));
	}
});
