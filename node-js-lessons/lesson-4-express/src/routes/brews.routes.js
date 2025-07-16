import { Router } from 'express';
import { z } from 'zod';
import { makeClassInvoker } from 'awilix-express';

import BrewsController from '../controllers/brews.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { validateParams } from '../middlewares/validateParams.js';
import rateLimit from '../middlewares/rateLimit.js';
import { registry } from '../docs/registry.js';
import { BrewDTO } from '../dto/brews.dto.js';

const router = Router();
const ctl = makeClassInvoker(BrewsController);

const paramsSchema = z.object({
  id: z.string().describe('Brew ID')
});

router.get('/brews', ctl('index'));
registry.registerPath({
  method: 'get',
  path: '/api/brews',
  tags: ['Brews'],
  request: {
    query: BrewDTO.partial()
  },
  responses: {
    200: {
      description: 'List of brews',
      content: {
        'application/json': {
          schema: z.array(BrewDTO)
        }
      }
    }
  }
});

router.get('/brews/:id', validateParams(paramsSchema), ctl('getById'));
registry.registerPath({
  method: 'get',
  path: '/api/brews/{id}',
  tags: ['Brews'],
  request: {
    params: paramsSchema
  },
  responses: {
    200: {
      description: 'One brew',
      content: {
        'application/json': {
          schema: BrewDTO
        }
      }
    },
    404: { description: 'Brew not found' }
  }
});

router.post('/brews', rateLimit(), validate(BrewDTO), asyncHandler(ctl('create')));
registry.registerPath({
  method: 'post',
  path: '/api/brews',
  tags: ['Brews'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': { schema: BrewDTO }
      }
    }
  },
  responses: {
    201: {
      description: 'Created brew',
      content: {
        'application/json': {
          schema: BrewDTO
        }
      }
    },
    400: { description: 'Validation error' },
    429: { description: 'Too many requests' }
  }
});

router.put('/brews/:id',
  validateParams(paramsSchema),
  validate(BrewDTO),
  asyncHandler(ctl('update'))
);
registry.registerPath({
  method: 'put',
  path: '/api/brews/{id}',
  tags: ['Brews'],
  request: {
    params: paramsSchema,
    body: {
      required: true,
      content: {
        'application/json': { schema: BrewDTO }
      }
    }
  },
  responses: {
    200: { description: 'Updated brew', content: { 'application/json': { schema: BrewDTO } } },
    400: { description: 'Validation error' },
    404: { description: 'Brew not found' }
  }
});

router.delete('/brews/:id', validateParams(paramsSchema), asyncHandler(ctl('delete')));
registry.registerPath({
  method: 'delete',
  path: '/api/brews/{id}',
  tags: ['Brews'],
  request: {
    params: paramsSchema
  },
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Brew not found' }
  }
});

export { router };
