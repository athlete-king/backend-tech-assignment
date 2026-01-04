import { Ajv } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });

addFormats.default(ajv);

const jsonApiSchema = {
  type: 'object',
  required: ['jsonapi'],
  properties: {
    jsonapi: {
      type: 'object',
      required: ['version'],
      properties: {
        version: { type: 'string', pattern: '^\\d+\\.\\d+$' },
      },
      additionalProperties: false,
    },
    data: {
      oneOf: [
        { $ref: '#/definitions/resourceObject' },
        { $ref: '#/definitions/resourceArray' },
        { type: 'null' },
      ],
    },
    errors: {
      type: 'array',
      items: { $ref: '#/definitions/errorObject' },
    },
    meta: { type: 'object' },
    links: { $ref: '#/definitions/links' },
    included: {
      type: 'array',
      items: { $ref: '#/definitions/resourceObject' },
    },
  },
  not: {
    required: ['data', 'errors'],
  },
  definitions: {
    resourceIdentifier: {
      type: 'object',
      required: ['type', 'id'],
      properties: {
        type: { type: 'string' },
        id: { type: 'string' },
        meta: { type: 'object' },
      },
    },
    resourceObject: {
      type: 'object',
      required: ['type', 'id'],
      properties: {
        type: { type: 'string' },
        id: { type: 'string' },
        attributes: { type: 'object' },
        relationships: { type: 'object' },
        links: { $ref: '#/definitions/links' },
        meta: { type: 'object' },
      },
    },
    resourceArray: {
      type: 'array',
      items: { $ref: '#/definitions/resourceObject' },
    },
    relationship: {
      type: 'object',
      properties: {
        data: {
          oneOf: [
            { $ref: '#/definitions/resourceIdentifier' },
            { type: 'array', items: { $ref: '#/definitions/resourceIdentifier' } },
            { type: 'null' },
          ],
        },
        links: { $ref: '#/definitions/links' },
        meta: { type: 'object' },
      },
    },
    links: {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z]+$': {
          oneOf: [
            { type: 'string', format: 'uri' },
            {
              type: 'object',
              required: ['href'],
              properties: {
                href: { type: 'string', format: 'uri' },
                meta: { type: 'object' },
              },
            },
          ],
        },
      },
    },
    errorObject: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        code: { type: 'string' },
        title: { type: 'string' },
        detail: { type: 'string' },
        source: {
          type: 'object',
          properties: {
            pointer: { type: 'string' },
            parameter: { type: 'string' },
          },
        },
        meta: { type: 'object' },
      },
    },
  },
};

export const validateJsonApi = ajv.compile(jsonApiSchema);

export function assertJsonApiCompliant(data: any): void {
  const valid = validateJsonApi(data);
  if (!valid) {
    const errors = validateJsonApi.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
    throw new Error(`JSON:API validation failed: ${errors}`);
  }
}