import { HttpMethod } from '../http/httpMethod';
import HttpResponse from '../http/httpResponse';
import 'reflect-metadata';
import { AdditionalDocData } from './doc';

const packageJson = require('../../../../package.json');

enum ComponentType {
  SCHEMA = 'schemas',
  RESPONSE = 'responses',
}

interface Property {
  type?: string;
  $ref?: string;
  items?: { [key: string]: string };
}

export class Component {
  public type: string;
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

export class HttpSchema {
  public schema: { [key: string]: string } = {};
}

export class RequestBody {
  public content: { [contentType: string]: HttpSchema };

  constructor(requestComponentPath: string) {
    const requestSchema = new HttpSchema();
    requestSchema.schema['$ref'] = requestComponentPath;

    this.content = {
      'application/json': requestSchema,
    };
  }
}

export class ResponseInfo {
  public content: { [contentType: string]: HttpSchema };

  constructor(responseComponentPath: string) {
    const responseSchema = new HttpSchema();
    responseSchema.schema['$ref'] = responseComponentPath;

    this.content = {
      'application/json': responseSchema,
    };
  }
}

export class Method {
  public doc?: Doc;
  public requestBody?: RequestBody;
  public responses: { [responseCode: number]: ResponseInfo } = {};
}

export class Path {
  public methods: { [method in HttpMethod]?: Method };

  constructor() {
    this.methods = {};
  }

  public toJSON(): any {
    return this.methods;
  }
}

export class OpenAPI {
  public openapi: string = '3.0.0';
  public info: Info = new Info(packageJson.version, packageJson.name);
  public paths: { [path: string]: Path };
  public components: { [componentType in ComponentType]: { [component: string]: Component } };

  constructor() {
    this.components = {
      'schemas': {},
      'responses': {},
    };
    this.paths = {};
  }

  public addPath(route: string, method: HttpMethod, responseCode: number, responseComponentPath: string, requestComponentPath?: string): void {
    if (!this.paths.hasOwnProperty(route)) {
      this.paths[route] = new Path();
    }

    if (this.paths[route].methods[method] === undefined) {
      this.paths[route].methods[method] = new Method();
    }

    this.paths[route].methods[method].responses[responseCode] = new ResponseInfo(responseComponentPath);

    if (requestComponentPath) {
      this.paths[route].methods[method].requestBody = new RequestBody(requestComponentPath);
    }
  }

  public addComponent(component: any): string {
    const possiblePrimitiveType = mapPrimitiveType(component.name);
    if (possiblePrimitiveType && possiblePrimitiveType !== 'array') {
      return possiblePrimitiveType;
    }

    let componentType: ComponentType = ComponentType.SCHEMA;

    const componentInstance = new component();

    if (componentInstance instanceof HttpResponse) {
      componentType = ComponentType.RESPONSE;
    }

    if (this.components[componentType][component.name]) {
      return OpenAPI.getComponentPath(componentType, component.name);
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

      openApiComponent.properties[propName] = getTypeData(metadata, additionalTypeData);
    });

    this.components[componentType][component.name] = openApiComponent;

    return OpenAPI.getComponentPath(componentType, component.name);
  }

  private static getComponentPath(componentType: ComponentType, componentName: string): string {
    return `#/components/${componentType}/${componentName}`;
  }
}

const primitiveTypeMap: { [typeName: string]: string } = {
  'Number': 'number',
  'String': 'string',
  'Date': 'date-time',
  'Array': 'array',
  'Object': 'object',
};

function getTypeData(type: any, additionalData?: AdditionalDocData): Property {
  const possiblePrimitiveType = mapPrimitiveType(type.name);

  if (possiblePrimitiveType && possiblePrimitiveType !== 'array') {
    return {type: possiblePrimitiveType};
  }

  if (possiblePrimitiveType === 'array' && !additionalData.type) {
    return {type: 'array', items: {'type': openAPI.addComponent(type)}};
  }

  if (possiblePrimitiveType === 'array' && additionalData.type) {
    const items: { [key: string]: string } = {};
    const subtypePath = openAPI.addComponent(additionalData.type);

    if (isComponent(subtypePath)) {
      items['$ref'] = subtypePath;
    } else {
      items['type'] = subtypePath;
    }

    return {type: 'array', items: items};
  }

  return {$ref: openAPI.addComponent(type)};
}

function mapPrimitiveType(typeName: string): string | undefined {
  if (!primitiveTypeMap[typeName]) {
    return undefined;
  }

  return primitiveTypeMap[typeName];
}

function isComponent(possibleComponentPath: string): boolean {
  return possibleComponentPath.length && possibleComponentPath[0] === '#';
}

const openAPI = new OpenAPI();

export default openAPI;
