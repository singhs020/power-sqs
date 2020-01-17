[![Travis badge](https://travis-ci.org/singhs020/power-sqs.svg?branch=master)][![Greenkeeper badge](https://badges.greenkeeper.io/singhs020/power-sqs.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/power-sqs.png?downloads=true)](https://www.npmjs.com/package/power-sqs/)

## power-sqs

Power-SQS is a set of powerful functions to deal with AWS SQS. It includes stream to read messages, move messagezs from one SQS to another or to a persistent data store.

If you just want to use sink operations, there is an option availble to use them via cli. Please see [power-sqs-cli](https://www.npmjs.com/package/power-sqs-cli)

## How to install

```javascript
npm install power-sqs
```

```javascript
yarn add power-sqs
```

## How To Use

Power SQS provides following functions to deal with AWS SQS

## Reader

### getSQSReader
Returns a readable stream of messages with long polling of 10 seconds. The object mode is enabled in the stream and pushes single message across the pipe.

```javascript
const {getSQSReader} = require("power-sqs");

const config = {"url": "your sqs url"};
const sqsReader = getSQSReader(config);

// returns a Node.js readable stream.

sqsReader.pipe("stream of your choice.")

```

### getSQSPowerReader
Returns a highland stream. The stream can then be used to apply transformers like filter, map, find and etc to generate a stream of data before piping it to another stream.

Please see [highland transformers](https://highlandjs.org/#Transforms) for more information.

```javascript
const {getSQSPowerReader} = require("power-sqs");

const config = {"url": "your sqs url"};
const sqsReader = getSQSPowerReader(config);

// returns a Node.js readable stream.

sqsReader.filter(() => {
  // filter logic
}).pipe("stream of your choice");

```

### getSQSBulkReader
Returns a readable stream of messages with long polling of 10 seconds. The object mode is enabled in the stream and returns the complete data object returned from the AWS.

The messgages in the pushed chunk can be accessed via the the Messages. It only pushes the data if it has any number of Messages attached to it otherwise it will keep on polling the SQS.

```javascript
const {getSQSBulkReader} = require("power-sqs");

const config = {"url": "your sqs url"};
const sqsReader = getSQSBulkReader(config);

// returns a Node.js readable stream.

sqsReader.pipe("stream of your choice.")

```

## Sink

### initSinkToSQS
Allows you to move messages from one SQS to another in same AWS Account.

```javascript
const {initSinkToSQS} = require("power-sqs");

const source = {"url": "your sqs url"};
const destination = {"url": "your sqs url"};
const config = {source, destination};

initSinkToSQS(config);

```

### Support or Contact

Having trouble with power-sqs or have any questions? Please raise an issue.
