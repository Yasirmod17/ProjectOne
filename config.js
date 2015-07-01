config = {
	'development': {
		mongo: {
			url: 'mongodb://localhost/Soccer',
			port: '3000'
		}
	},
	'production': {
		mongo: {
			url: 'mongodb://heroku_d079jmlp:rsscua61q4uc7jm02m6h4qtvp2@ds063449.mongolab.com:63449/heroku_d079jmlp',
			port: '3000'
		}
	}
}

module.exports = config;