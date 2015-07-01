config = {
	'development': {
		mongo: {
			url: 'mongodb://localhost/Soccer',
			port: '3000'
		}
	},
	'production': {
		mongo: {
			url: 'mongodb://localhost/Soccer',
			port: '27017'
		}
	}
}

module.exports = config;