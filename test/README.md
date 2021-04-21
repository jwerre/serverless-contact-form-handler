# Serverless Contact Form Handler

Create a simple contact form hander for your static website.

## Setup

### Setup AWS Simple Email Service (SES)

This function uses SES to forward emails to your inbox. If you haven't set up SES for your domain yet be sure and have IAM access to SES and follow the instructions [here](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-set-up.html).

### Create TLS/SSL certificate in Certificate Manager

Once you've decided on a domain name you'll need to set up a TLS certificate in AWS Certificate Manager:

```bash
aws acm request-certificate --region us-west-2 --profile default --domain-name contact.example.com --validation-method DNS
```

If you're using Route53 it should automatically validate; if not you'll need to validate it with your DNS.

### Configure `serverless.yaml`

Make a copy of serverless.example.yaml

```bash
cp serverless.example.yaml serverless.yaml
```

Open `serverless.yaml` and update the following fields

1. `provider.environment.EMAIL`: The email address to send the email to.
1. `provider.environment.ORIGINS`: A comma delimited list of domains the email can be sent from.
1. `custom.customDomain.domainName`: Enter the domain name you'd like to access the endpoint at.
1. `custom.customDomain.certificateName`: Be sure and tag your certificate with a **Name** and enter the value here.

*Optional*: You may want to change the path of the endpoint at `functions.contact.events.path`. The default is `/contact`.

## Deploy

### 1. Install Serverless CLI
Be sure and have the serverless command line installed.

```bash
npm install --global serverless
```

### 2. Create the domain

If you're deploing for the first time set up the custom domain like this:

```bash
serverless create_domain
```

*If you have trouble creating the domain check out [serverless-domain-manager](https://github.com/amplify-education/serverless-domain-manager) for troubleshooting issues.*

### 3. Deploy the function
Once the domain is all set up the execute the following to deploy the function:

```bash
serverless deploy
```

Optionally use the `--stage` flag to deploy to production

```bash
serverless deploy --stage production
```

### 4. Invoke

Once you've deployed the function you can test it out like this.

```bash
serverless invoke serverless-contact-form-handler --path test/invoke.example.json
```


## Test

This function should work once you've set up your SES domain and verified your sending addresses. You may want test it before deploying it. Make a copy of `test/fixtures.examples.json` and edit the file using your own email addresses.

```
cp test/fixtures.examples.json test/fixtures.json
```

Once you've entered your own information in `test/fixtures.json` install the test dependacies and run the test.

```bash
npm install
npm test
```
