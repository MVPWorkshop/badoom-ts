import { Request, Response } from 'express';
import { route } from '../../core/http/route';
import { HttpMethod } from '../../core/http/httpMethod';
import requestType from '../../core/http/requestType';
import EchoRequest from '../requests/echoRequest';
import EchoResponse from '../responses/echoResponse';
import NotFoundError from '../errors/notFoundError';
import { Role } from '../../auth/role';

export class Health {

  @route(HttpMethod.GET, '/health')
  async get(req: Request, res: Response) {
    res.json({status: 'OK'});
  }

  @route(HttpMethod.GET, '/api-doc')
  async documentation(req: Request, res: Response) {
    res.json(example);
  }

  @route(HttpMethod.POST, '/health/echo', {role: Role.USER})
  @requestType(EchoRequest)
  async echo(req: Request, res: Response, input: EchoRequest): Promise<EchoResponse | NotFoundError> {
    if (input.message === 'not found') {
      return new NotFoundError();
    }

    return new EchoResponse(input.message);
  }

  @route(HttpMethod.GET, '/health/echo/:message')
  async echoGet(req: Request, res: Response): Promise<EchoResponse> {
    return new EchoResponse(req.params['message']);
  }
}

const example = {
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'title': 'Swagger Petstore',
    'description': 'A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification',
    'termsOfService': 'http://swagger.io/terms/',
    'contact': {
      'name': 'Swagger API Team'
    },
    'license': {
      'name': 'MIT'
    }
  },
  'host': 'petstore.swagger.io',
  'basePath': '/api',
  'schemes': [
    'http'
  ],
  'consumes': [
    'application/json'
  ],
  'produces': [
    'application/json'
  ],
  'paths': {
    '/health': {
      'get': {
        'description': 'Returns all pets from the system that the user has access to',
        'produces': [
          'application/json'
        ],
        'responses': {
          '200': {
            'description': 'A list of pets.',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/Pet'
              }
            }
          }
        }
      }
    }
  },
  'definitions': {
    'Pet': {
      'type': 'object',
      'required': [
        'id',
        'name'
      ],
      'properties': {
        'id': {
          'type': 'integer',
          'format': 'int64'
        },
        'name': {
          'type': 'string'
        },
        'tag': {
          'type': 'string'
        }
      }
    }
  }
};
