const Email = require('./lib/email');

const ORIGINS = (process.env.ORIGINS && process.env.ORIGINS.length) 
	? process.env.ORIGINS.split(',') 
	: [];

function responseHandler (statusCode, payload, req) {
	
	if (payload instanceof Error) {
		console.error(payload);
		payload = payload.message;
	}
		
	const origin = ORIGINS.includes(req.headers.origin) ? req.headers.origin : 'Origin';

	const res = {
		statusCode: statusCode,
		headers: {
			// 'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Headers': 'x-requested-with',
		},
		body: JSON.stringify(payload)
	};

	return Promise.resolve(res);
	
}

module.exports.contact = async function (request) {

	// console.log('POST :: /contact');
	// console.log(request.body);
		
	const body = Object.prototype.toString.call(request.body) === '[object String]' ? JSON.parse(request.body) : request.body;
		
	let response, args = {
		sourceEmail: process.env.EMAIL,
		toEmail: process.env.EMAIL,
		fromEmail: body.email,
		name: body.name,
		subject: body.subject || `Message from ${process.env.DOMAIN}`,
		message: body.message,
	};
	
	const email = new Email(args);

	try {
		
		response = await email.send();

	} catch (err) {
		
		return responseHandler(err.statusCode || 500, err, request);

	}
	
	return responseHandler(200, response, request);

};
