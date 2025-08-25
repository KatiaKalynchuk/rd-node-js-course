import MetadataKeys from './keys';
import { ClassType } from '../types';

type Metadata = {
  imports?: Array<ClassType>;
  controllers?: Array<ClassType>;
  providers?: Array<ClassType>;
  exports?: Array<ClassType>;
};

export function Module(metadata: Metadata) {
  return function (target: ClassType) {
    Reflect.defineMetadata(MetadataKeys.MODULE, metadata, target);
  };
}
