import MetadataKeys from './keys';
import { ClassType } from '../types';

export type Provider = ClassType;

type Metadata = {
  controllers?: ClassType[];
  providers?: Provider[];
  imports?: ClassType[];
};

export function Module(metadata: Metadata) {
  return function (target: ClassType) {
    Reflect.defineMetadata(MetadataKeys.MODULE, metadata, target);
  };
}
