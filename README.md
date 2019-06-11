## The project is under development and can change

## Intro

Power-SQS is a set of powerful functions to deal with AWS SQS. It includes stream to read messages, move messagezs from one SQS to another or to a persistent data store.

## How to install

```javascript
npm install power-sqs
```

```javascript
yarn add power-sqs
```

## How To Use

Power SQS provides following functions to deal with AWS SQS

### getSQSReader
Returns a readable stream of messages with long polling of 10 seconds. The object mode is enabled in the stream and returns the complete data object returned from the AWS.

The messgages in the pushed chunk can be accessed via the the Messages. It only pushes the data if it has any number of Messages attached to it otherwise it will keep on polling the SQS.

```javascript
const {getSQSReader} = require("power-sqs");

const config = {"url": "your sqs url"};
const sqsReader = getSQSReader(config);

// returns a Node.js readable stream.

sqsReader.pipe("stream of your choice.")

```

### getSQSMessageRemover
Returns a Writable stream for removing SQS messages in bulk. 

The chunk should be an object woth the Messages as the key to remove the data. Twhe chunk should follwo the same structure as returned by the AWS sqs while reading the message.

The max number of batch allowed as per AWS is 10. Each message should have its MessageId and ReceiptHandle to delete the message.

```javascript
const {getSQSMessageRemover, getSQSReader} = require("power-sqs");

const config = {"url": "your sqs url"};
const sqsReader = getSQSReader(config);
const sqsMessageRemover = getSQSMessageRemover(config);


// reades and removes the message from SQS
sqsReader.pipe(sqsMessageRemover);

```

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
