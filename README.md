# @multicloud Demo

This project show an easy example on how to create a Serverless REST API that supports multi-cloud deployment to Azure & AWS.  The project is built using the Serverless framwork and the CSE @multicloud library

## Pre-requisites

1. Node.js `v8.5.0` or later.
1. Serverless CLI `v1.9.0` or later. You can run `npm install -g serverless` to install it.
1. An Azure account. If you don't already have one, you can sign up for a [free trial](https://azure.microsoft.com/en-us/free/) that includes \$200 of free credit.

## Running Locally

Clone the repository
```bash
git clone https://github.com/wbreza/multicloud-demo.git
```

### Navigate to directory
```
cd multicloud-demo
```

### Install Dependencies
```bash
npm ci
```

### Run Unit Tests
```
npm run test
```

### Run Locally
```bash
npm start
```

### Deploying to Azure
```bash
npm run deploy:azure
```

### Deploying to AWS
```bash
npm run deploy:aws
```

## Advanced Authentication

The getting started walkthrough illustrates the interactive login experience,
which is recommended for most users. However, if you'd prefer to create an Azure
[service principal](http://bit.ly/2wLVE7k)
yourself, you can indicate that this plugin should use its credentials instead,
by setting the following environment variables:

**Bash**

```bash
export azureSubId='<subscriptionId>'
export azureServicePrincipalTenantId='<tenantId>'
export azureServicePrincipalClientId='<servicePrincipalName>'
export azureServicePrincipalPassword='<password>'
```

**Powershell**

```powershell
$env:azureSubId='<subscriptionId>'
$env:azureServicePrincipalTenantId='<tenantId>'
$env:azureServicePrincipalClientId='<servicePrincipalName>'
$env:azureServicePrincipalPassword='<password>'
```

## FAQs
The **@multicloud** NPM packages referenced in this project are not yet available on the public NPM registry.  These packages will be available soon.