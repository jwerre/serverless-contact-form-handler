const AWS = require('aws-sdk');

const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DEFAULT_REGION = 'us-west-2';

class Email {
	
	constructor(options) {
		
		this.region = options.region || DEFAULT_REGION;
		this.sourceEmail = options.sourceEmail;
		this.toEmail = options.toEmail;
		this.fromEmail = options.fromEmail;
		this.name = options.name;
		this.subject = options.subject;
		this.message = options.message;
		
		if (options.profile) {
			AWS.config.credentials = new AWS.SharedIniFileCredentials({
				profile: options.profile
			});
		}
		
		AWS.config.update({
			region: this.region
		});
		
		this.ses = new AWS.SES();
	}
	
	static get  EMAIL_REGEXP () { return EMAIL_REGEXP; }
	
	send () {
		
		let err;

		if (!this.fromEmail || !Email.EMAIL_REGEXP.test(this.fromEmail)) {
			err = new Error('Please tell us your email address so we can get back to you.');
			err.statusCode = 400;
			return Promise.reject( err );
		}

		// if (!this.name || !this.name.length > 1) {
		// 	return Promise.reject( new Error('Please tell us your name.') );
		// }
		if (!this.message || !this.message.length) {
			err = new Error('Please enter a message.');
			err.statusCode = 400;
			return Promise.reject( err );
		}

		const emailParams = {
			Source: this.sourceEmail,
			Destination: {
				ToAddresses: [
					this.toEmail
				]
			},
			ReplyToAddresses: [
				this.fromEmail
			],
			Message: {
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: `${this.message}\n\nMessage sent from ${this.name ? this.name+' at ' : ''}${this.fromEmail}`
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: this.subject
				}
			}
		};

		console.log( require('util').inspect(emailParams, {depth:10, colors:true}) );
		
		return this.ses.sendEmail(emailParams).promise();
	}

}

module.exports = Email;
