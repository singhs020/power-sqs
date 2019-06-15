import {Reader} from "./operations/reader";

interface IConfig {
  "url": string
}

interface ISinkConfig {
  "source": IConfig,
  "destination": IConfig
}

export function getSQSReader(config: IConfig) : Reader;
export function getSQSBulkReader(config: IConfig) : Reader;
export function initSinkToSQS(config: ISinkConfig): undefined;
