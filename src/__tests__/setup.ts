import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validateJsonApi } from './schemas/jsonapi-schema.js';

dotenv.config({ path: '.env.test' });

import 'jest-extended';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);  
});

afterAll(async () => {  
  await mongoose.disconnect();
  
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterEach(() => {
  console.log('✅ Test completed');
});

expect.extend({
  toBeJsonApiCompliant(received: any) {
    const valid  = validateJsonApi(received);
    const { errors } = validateJsonApi;
    
    if (valid) {
      return {
        message: () => 'expected response not to be JSON:API compliant',
        pass: true,
      };
    } else {
      return {
        message: () => `JSON:API validation failed:\n${errors?.map(e => `  - ${e.message}`).join('\n')}`,
        pass: false,
      };
    }
  },
  
  toHaveJsonApiType(received: any, expectedType: string) {
    if (!received.data) {
      return {
        message: () => 'Response does not have data property',
        pass: false,
      };
    }
    
    const data = Array.isArray(received.data) ? received.data[0] : received.data;
    const actualType = data.type;
    
    if (actualType === expectedType) {
      return {
        message: () => `expected type not to be ${expectedType}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected type to be ${expectedType} but got ${actualType}`,
        pass: false,
      };
    }
  },
  
  toHaveJsonApiError(received: any, expectedStatus?: string) {
    if (!received.errors || !Array.isArray(received.errors)) {
      return {
        message: () => 'Response does not have errors array',
        pass: false,
      };
    }
    
    if (expectedStatus) {
      const hasError = received.errors.some((error: any) => error.status === expectedStatus);
      
      if (hasError) {
        return {
          message: () => `expected not to have error with status ${expectedStatus}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected to have error with status ${expectedStatus}`,
          pass: false,
        };
      }
    }
    
    return {
      message: () => 'expected response not to have errors',
      pass: received.errors.length > 0,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeJsonApiCompliant(): R;
    }
  }
}