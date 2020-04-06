import {Reader} from "./operations/reader";
import * as Highland from "highland";

interface IConfig {
  "url": string
}

interface ISinkConfig {
  "source": IConfig,
  "destination": IConfig
}

interface ISingleOpResponse {
  "failed": object[] | [],
  "successful": object[] | [],
  "entries"? : object[] | []
}

interface ISendMessageOpts {
  "encode": boolean
}

interface IReceiveMessagesResponse {
  "Messages": object[]
}

export function deleteMessages(queueUrl: string, messages: object[]) : Promise<ISingleOpResponse>;
export function receiveMessages(queueUrl: string) : Promise<IReceiveMessagesResponse>;
export function sendMessages(queueUrl: string, messages: any[], options?: ISendMessageOpts) : Promise<ISingleOpResponse>;
export function sendFifoMessages(queueUrl: string, group: string, messages: any[], options?: ISendMessageOpts) : Promise<ISingleOpResponse>;
export function getSQSReader(config: IConfig) : Reader;
export function getSQSBulkReader(config: IConfig) : Reader;
export function getSQSPowerReader(config: IConfig) : Highland;
export function initSinkToSQS(config: ISinkConfig): undefined;
