const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const FilmSchema = new Schema ({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
		year_real: {
			type: String,
        required: true
		},
		rate: {
			type: String,
        required: true
		},
		pr_rate: {
			type: String,
        required: true
		},
		length_chr: {
			type: [String],
        required: true
		},
		lenght: {
			type: String,
        required: true
		}
})

mongoose.model('films', FilmSchema)