# @multicloud Demo

This project shows an easy example on how to create a Serverless REST API that supports multi-cloud deployment to Azure & AWS.  The project is built using the Serverless framwork and the CSE @multicloud library **(coming soon!)**

## Pre-requisites

1. Node.js `v8.5.0` or later.
1. Serverless CLI `v1.9.0` or later. You can run `npm install -g serverless` to install it.
1. An Azure and/or AWS account(s) *(For Deployment)*

## Setup

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
To deploy to Azure you will need an Azure account and have your credentials configured correctly. See the [quick start](https://serverless.com/framework/docs/providers/azure/guide/quick-start/) for more information.
```bash
npm run deploy:azure
```

### Deploying to AWS
To deploy to AWS you will need an AWS account and have your credentials configured correctly. See the [quick start](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) for more information.
```bash
npm run deploy:aws
```

## FAQs
The **@multicloud** NPM packages referenced in this project are not yet available on the public NPM registry.  These packages will be available soon.