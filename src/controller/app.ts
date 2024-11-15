import fastify from 'fastify';
import { PetNotFoundError, PetService, PetTakenError } from '../service/pet.service';
import { PetRepository } from '../repository/pet.repository';
import { DbClient } from '../db';

import { OwnerRepository } from '../repository/owner.repository';
import { OwnerService } from '../service/owner.service';
import { createPetRoute } from './routes/pet.router';
import { createOwnerRoutes } from './routes/owner.router';
import createMessengerPlugin from '../service/messenger.plugin';
import { httpErrors } from '@fastify/sensible';

type Dependencies = {
  dbClient: DbClient;
}

declare module 'fastify'{
  interface FastifyInstance{
    petService: PetService
    ownerService: OwnerService
  }
}

export default function createApp(options = {}, dependencies: Dependencies) {
  const { dbClient } = dependencies;

  const petRepository = new PetRepository(dbClient);
  const petService = new PetService(petRepository);
  const ownerRepository = new OwnerRepository(dbClient);
  const ownerService = new OwnerService(ownerRepository);

  const app = fastify(options);

  app.decorate('petService', petService)
  app.decorate('ownerService', ownerService)
  app.setErrorHandler((error)=>{
    if(error instanceof PetNotFoundError){
      return httpErrors.notFound('Pet not found')
    } else if(error instanceof PetTakenError){
      return httpErrors.badRequest('Pet is already taken')
    }else {
      return httpErrors.internalServerError('Something went wrong')
    } 
  })
  
  app.register(createPetRoute, { prefix: '/api/pets' })
  app.register(createOwnerRoutes, { prefix: '/api/owners'})
  app.register(createMessengerPlugin, { message: 'Hello, World!' }); //hook it on a plugin
  return app;
}