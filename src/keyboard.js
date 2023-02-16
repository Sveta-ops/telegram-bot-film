const kb = require('./keyboard-buttons')

module.exports = {
	home: [
		[kb.home.character],
		[kb.home.randomFilm],
		[kb.home.close]
	],
	genre: [
		[kb.genre.horor],
		[kb.genre.comedy],
		[kb.genre.drama],
		[kb.genre.random_gener]
	],
	country: [
		[kb.country.rus],
		[kb.country.uk],
		[kb.country.japan],
		[kb.country.random_country]
	],
	rate: [
		[kb.rate.one, kb.rate.two, kb.rate.free],
		[kb.rate.four, kb.rate.five, kb.rate.six],
		[kb.rate.sev, kb.rate.eight, kb.rate.nine],
		[kb.rate.ten]
	],
	length: [
		[kb.length.yes],
		[kb.length.no]
	],
	year: [
		[kb.year.y1],
		[kb.year.y2],
		[kb.year.y3],
		[kb.year.y4]
	],
	end:[
		[kb.end.ok],
		[kb.end.change]
	]
}