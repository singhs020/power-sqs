import {Reader} from "./operations/reader";
import * as Highland from "highland";

interface IConfig {
  "url": string
}

interface ISinkConfig {
  "source": IConfig,
  "destination": IConfig
}

export function getSQSReader(config: IConfig) : Reader;
export function getSQSBulkReader(config: IConfig) : Reader;
export function getSQSPowerReader(config: IConfig) : Highland;
export function initSinkToSQS(config: ISinkConfig): undefined;
