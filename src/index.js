const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const database = require('../database.json')
const config = require('./config')
const helper = require('./helpers')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const fs = require('fs')
const { year } = require('./keyboard-buttons')





helper.logStart()

mongoose.set("strictQuery", false);

mongoose.connect(config.DB_URL)
	.then(() => console.log('База данных работает'))
	.catch((err) => console.log(err))

require('./models/film.model')

const Film = mongoose.model('films')

database.films.forEach(f => Film(f).save())


// =============================================================
let genreId = ''
let countryId = ''
let prRateId = ''
let lenghtChrId = ''
let yearId = ''
var genre_arr = ['Комедия', 'Драма', 'Хорор']
var country_arr = ['Россия', 'Америка', 'Япония']
var rate_arr = ['6', '7', '8', '9', '10']
var year_arr = ['60ые', '90ые', '00ые', 'Современный фильм']
const bot = new TelegramBot(config.TOKEN, {
	polling: {
		interval: 300,
		autoStart: true
	}
})

bot.onText(/\/start/, msg => {
	genreId = ''
	countryId = ''
	prRateId = ''
	lenghtChrId = ''
	yearId = ''
	console.log(
	// { 'Жанр': genreId },
	// { 'Страна': countryId },
	// { 'Продолжительность фильма не имеет роль': lenghtChrId },
	// { 'Приблизительный рейтинг фильма': prRateId },
	{ 'Время выхода фильма': yearId}
	)
	console.log(msg)
	bot.sendMessage(helper.getChatId(msg), 'Привет, ' + msg.from.first_name + ', чем могу тебе помочь?)', {
		reply_markup: {
			keyboard: keyboard.home,
			one_time_keyboard: true
		}
	})
})

bot.onText(/\/random/, msg => {
	sendRandonFilm(helper.getChatId(msg))
})


bot.on('message', (msg) => {

	switch (msg.text) {
		case kb.home.close:
			bot.sendMessage(helper.getChatId(msg), 'Жаль, что не смог вам помочь. Буду ждать нашей встречи)');
			break;
		case kb.home.randomFilm:
			sendRandonFilm(helper.getChatId(msg));
			break;
		case kb.home.character:
			bot.sendMessage(helper.getChatId(msg), 'Выберите характеристику, по которой вы хотите сделать подбор фильма', {
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Жанр',
								callback_data: 'genreAll'
							}
						],
						[
							{
								text: 'Страна',
								callback_data: 'countryAll'
							}
						],
						[
							{
								text: 'Рейтинг',
								callback_data: 'rateAll'
							}
						],
						[
							{
								text: 'Продолжительность',
								callback_data: 'lengthAll'
							}
						],
						[
							{
								text: 'Года',
								callback_data: 'yearAll'
							}
						],
						[
							{
								text: 'Готово',
								callback_data: 'end'
							}
						]
					]
				}
			});
			break;
		case kb.year.y1:
		case kb.year.y2:
		case kb.year.y3:
		case kb.year.y4:
			yearId = msg.text;
			console.log(yearId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.rate.eight:
		case kb.rate.five:
		case kb.rate.four:
		case kb.rate.free:
		case kb.rate.nine:
		case kb.rate.one:
		case kb.rate.sev:
		case kb.rate.six:
		case kb.rate.ten:
		case kb.rate.two:
			prRateId = msg.text;
			console.log(prRateId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.rate.randomRate:
			prRateId = randomCharacter;
			console.log(prRateId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.length.no:
		case kb.length.yes:
			lenghtChrId = msg.text;
			console.log(lenghtChrId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.genre.horor:
		case kb.genre.comedy:
		case kb.genre.drama:
			genreId = msg.text;
			console.log(genreId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.genre.random_gener:
			genreId = randomCharacter(genre_arr);
			console.log(genreId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.country.rus:
		case kb.country.uk:
		case kb.country.japan:
			countryId = msg.text;
			console.log(countryId);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.country.random_country:
			countryId = randomCharacter(country_arr);
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.end.change:
			chooseCharacter(helper.getChatId(msg));
			break;
		case kb.end.ok: 
			sendFilmsByQuery(helper.getChatId(msg), {genre: genreId, country: countryId, pr_rate: prRateId, year: yearId, length_chr: lenghtChrId})
	}
})

bot.on('callback_query', query => {
	const id = query.message.chat.id
	if (query.data === 'genreAll') {
		bot.sendMessage(id, 'Выберите жанр', {
			reply_markup: {
				keyboard: keyboard.genre,
				one_time_keyboard: true
			}
		})
	} else if (query.data === 'countryAll') {
		bot.sendMessage(id, 'Выберите страну производитель', {
			reply_markup: {
				keyboard: keyboard.country,
				one_time_keyboard: true
			}
		})
	} else if (query.data === 'rateAll') {
		bot.sendMessage(id, 'Выберите рейтинг фильма', {
			reply_markup: {
				keyboard: keyboard.rate,
				one_time_keyboard: true
			}
		})
	} else if (query.data === 'lengthAll') {
		bot.sendMessage(id, 'Много ли у вас свободного времени, чтобы посмотреть фильм продолжительностью более 1,5 часов?', {
			reply_markup: {
				keyboard: keyboard.length,
				one_time_keyboard: true
			}
		})
	} else if (query.data === 'yearAll') {
		bot.sendMessage(id, 'Каких годов фильм вы бы хотели посмотреть?', {
			reply_markup: {
				keyboard: keyboard.year,
				one_time_keyboard: true
			}
		})
	} else if (query.data === 'end') {
		if (genreId === '') {
			genreId = randomCharacter(genre_arr)
		} 
		if (countryId === '') {
			countryId = randomCharacter(country_arr)
		}
		if (prRateId === '') {
			prRateId = randomCharacter(rate_arr)
		}
		if (yearId === '') {
			yearId = randomCharacter(year_arr)
		}
		if (lenghtChrId === '') {
			lenghtChrId = 'Да'
		}
		const html = `
		<strong> Ваш запрос на фильм </strong>
		<u>Жанр:</u> <i>${genreId}</i>
		<u>Страна:</u> <i>${countryId}</i>
		<u>Продолжительность фильма не имеет роли:</u> <i>${lenghtChrId}</i>
		<u>Приблизительный рейтинг фильма:</u> <i>${prRateId}</i>
		<u>Время выхода фильма:</u> <i>${yearId}</i>`
		bot.sendMessage(id, html, {
			parse_mode: 'HTML'
		})
		bot.sendMessage(id, 'Проверьте правильность введенных данных', {
			reply_markup: {
				keyboard: keyboard.end,
				one_time_keyboard: true
			}
		})
	}
})

bot.onText(/\/f(.+)/, (msg, [source, match]) => {
	const filmUuid = helper.getItemUuid(source)
	console.log(filmUuid)
	const chatId = helper.getChatId(msg)

	Film.findOne({ uuid: filmUuid }).then(film => {
		const caption = `Название: ${film.name}\nГод: ${film.year_real}\nРейтинг на Кинопоиске: ${film.rate}\nСтрана: ${film.country}\nЖанр: ${film.genre}\nПродолжительность фильма: ${film.lenght}`

		bot.sendPhoto(chatId, film.picture, {
			caption: caption
		}, {
			parse_mode: 'HTML'
		})
	})
})

function sendFilmsByQuery(chatId, query) {
	Film.find(query).then(films => {
		console.log(films)

		const hlml = films.map((f, i) => {
			return `Ниже представлен список подходящих вам фильмов\nНажмите на ссылку понравившегося вам фильма, чтобы посмотреть подробную информацию о нем\n<b>${i + 1}.</b> ${f.name} - /f${f.uuid}`
		}).join('\n')

		const htmlErr = `<b>В нашей базе еще недостаточно фильмов.</b>\nМы не смогли подобрать фильм по выбранным вами характеристикам`

		bot.sendMessage(chatId, hlml, {
			parse_mode: 'HTML'
		}).catch((err) => bot.sendMessage(chatId, htmlErr, {
			parse_mode: 'HTML'
		}))
	})
}

function sendRandonFilm(chatId) {
	const filmsData = fs.readFileSync('database.json');
	const films = JSON.parse(filmsData);
	const movies = films.films
	const randomIndex = Math.floor(Math.random() * movies.length);
	const randomFilm = movies[randomIndex];
	console.log(randomFilm.name)
	const caption = `
	<b>Надеюсь, вам понравится мой выбор)</b>\n\n<b>Название:</b> ${randomFilm.name}\n<b>Жанр:</b> ${randomFilm.genre}\n<b>Страна:</b> ${randomFilm.country}\n<b>Год выпуска:</b> ${randomFilm.year_real}\n<b>Pейтинг:</b> ${randomFilm.rate}\n<b>Продолжительность фильма:</b> ${randomFilm.lenght}`;
	console.log(caption)
	bot.sendPhoto(chatId, randomFilm.picture, {
		caption: caption,
		parse_mode: 'HTML'
	}
	)
}

function randomCharacter(mas) {
	number = Math.floor(Math.random() * mas.length);
	return mas[number]
}

function chooseCharacter(chatId) {
	bot.sendMessage(chatId, 'Выберите характеристику, по которой вы хотите сделать подбор фильма', {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Жанр',
						callback_data: 'genreAll'
					}
				],
				[
					{
						text: 'Страна',
						callback_data: 'countryAll'
					}
				],
				[
					{
						text: 'Рейтинг',
						callback_data: 'rateAll'
					}
				],
				[
					{
						text: 'Продолжительность',
						callback_data: 'lengthAll'
					}
				],
				[
					{
						text: 'Года',
						callback_data: 'yearAll'
					}
				],
				[
					{
						text: 'Готово',
						callback_data: 'end'
					}
				]
			]
		}
	})
}











