const assert = require('assert');
const Email = require('../lib/email');
const fixtures = require('./fixtures.json');

process.env.ORIGINS = 'unit.test';
process.env.EMAIL = fixtures.sourceEmail;

const {contact} = require('../server');


describe('EMAIL', function() {
	
	// before( function () { });
	
	it('should not send an email since to address does not exist', async function() {
		
		const args = {...fixtures};
		
		delete args.toEmail;
		
		let result,
			email = new Email(args);
		
		try {
			result = await email.send();
		} catch (err) {
			assert.ok(err);
			assert.strictEqual(err.statusCode, 400);
		}
		
		assert.ifError(result);

	});

	it('should not send an email from server since email message is missing', async function() {
		
		let result,
			args = {
				email: fixtures.fromEmail,
				subject: fixtures.subject,
			};

		try {
			result = await contact({
				headers: {},
				body:JSON.stringify(args)
			});
		} catch (err) {
			assert.fail(err);
		}
		assert.ok(result);
		assert.strictEqual(result.statusCode, 400);

	});

	it('should send an email', async function() {

		let result,
			email = new Email(fixtures);
		
		try {
			result = await email.send();
		} catch (err) {
			assert.fail(err);
		}

		console.log(result);
		
		assert.ok(result);

	});

	it('should send an email from server', async function() {

		let result,
			args = {
				email: fixtures.fromEmail,
				subject: fixtures.subject,
				message: fixtures.message,
			};

		try {
			result = await contact({
				headers: {
					origin: process.env.ORIGINS
				},
				body:JSON.stringify(args)
			});
		} catch (err) {
			assert.fail(err);
		}
		assert.ok(result);
		assert.strictEqual(result.statusCode, 200);
		assert.ok('headers' in result);
		assert.ok( 'Access-Control-Allow-Origin' in result.headers );
		assert.strictEqual( result.headers['Access-Control-Allow-Origin'], process.env.ORIGINS );

	});


});
