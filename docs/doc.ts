import 'reflect-metadata';

export interface AdditionalDocData {
  type?: any;
  required?: boolean;
}

export function doc(additionalDocData?: AdditionalDocData): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const additionalData = additionalDocData || {};

    Reflect.defineMetadata('open_api_types:additional_data', additionalData, target, propertyKey);

    return descriptor;
  };
}
