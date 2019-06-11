import {Reader} from "./operations/reader";
import {Remover} from "./operations/remover";

interface IConfig {
  "url": string
}

interface ISinkConfig {
  "source": IConfig,
  "destination": IConfig
}

export function getSQSReader(config: IConfig) : Reader;
export function getSQSMessageRemover(config: IConfig) : Remover;
export function initSinkToSQS(config: ISinkConfig): undefined;
