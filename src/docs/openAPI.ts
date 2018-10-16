import { HttpMethod } from '../http/httpMethod';
import HttpResponse from '../http/httpResponse';
import 'reflect-metadata';
import { AdditionalDocData } from './doc';

enum ComponentType {
  SCHEMA = 'schemas',
  RESPONSE = 'responses',
}

interface Property {
  type: string;
}

export class Component {
  public type: string = 'object';
  public properties: { [propName: string]: Property } = {};
}

export interface Doc {
  summary?: string;
  description?: string;
}

export class Info {
  public version: string;
  public title: string;

  constructor(version: string, title: string) {
    this.version = version;
    this.title = title;
  }
}

export class Method {
  public doc?: Doc;
}

export class Path {
  public methods: Map<HttpMethod, Method>;
}

export class OpenAPI {
  public openapi: string = '3.0.0';
  public paths: { [path: string]: Path };
  public components: { [componentType: string]: { [component: string]: Component } };

  public addPath(route: string, path: Path): void {
    if (this.paths[route] !== undefined) {
      throw new Error(`Route: [${route}] already registered`);
    }

    this.paths[route] = path;
  }

  public addComponent(component: any): string {
    let componentType: ComponentType = ComponentType.SCHEMA;

    const componentInstance = new component();

    if (componentInstance instanceof HttpResponse) {
      componentType = ComponentType.RESPONSE;
    }

    const openApiComponent: Component = new Component();

    Object.getOwnPropertyNames(componentInstance).forEach(propName => {
      const metadata = Reflect.getMetadata('design:type', component.prototype, propName);

      if (!metadata) {
        return;
      }

      const additionalTypeData: AdditionalDocData = Reflect.getMetadata(
        'open_api_types:additional_data',
        component.prototype,
        propName
      );

      const typeString: string = getTypeString(metadata.name, additionalTypeData);

      // const typeName: string = mapPrimitiveType()

      // openApiComponent.properties[propName] = {
      //   type:
      // };

      // console.log(componentType, propName, metadata.name, additionalTypeData);
    });

    return '';
  }
}

const primitiveTypeMap: { [typeName: string]: string } = {
  'Number': 'number',
  'String': 'string',
  'Date': 'date-time',
  'Array': 'array',
};

function getTypeString(type: string, additionalData?: AdditionalDocData): string {
  return '';
}

function mapPrimitiveType(typeName: string): string | undefined {
  if (!primitiveTypeMap[typeName]) {
    return undefined;
  }

  return primitiveTypeMap[typeName];
}

const openAPI = new OpenAPI();

export default openAPI;
