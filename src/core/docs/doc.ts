import 'reflect-metadata';

export interface AdditionalDocData {
  type?: any;
  required?: boolean;
}

export function doc(additionalDocData?: AdditionalDocData): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (additionalDocData && additionalDocData.type) {
      Reflect.defineMetadata('open_api_types:additional_data', additionalDocData, target, propertyKey);
    }

    return descriptor;
  };
}
