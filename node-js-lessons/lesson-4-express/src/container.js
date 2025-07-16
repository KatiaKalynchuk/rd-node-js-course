import { createContainer, asClass } from 'awilix';
import { BrewsModel } from './models/brews.model.js';
import { BrewsService } from './services/brews.service.js';
import BrewsController from './controllers/brews.controller.js';

export const container = createContainer({
  injectionMode: 'PROXY',
}).register({
  brewsController: asClass(BrewsController).scoped(),
  brewsService: asClass(BrewsService).scoped(),
  brewsModel: asClass(BrewsModel).singleton(),
});

export default container;
