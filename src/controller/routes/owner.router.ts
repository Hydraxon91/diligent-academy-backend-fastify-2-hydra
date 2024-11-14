import { FastifyPluginAsync } from "fastify";
import { putPetsToOwnersSchema } from "../pet.schemas";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { OwnerService } from "../../service/owner.service";
import { PetService } from "../../service/pet.service";
import { getOwnerByIdSchema, getOwnersSchema, postOwnerSchema } from "../owner.schemas";



export const createOwnerRoutes: FastifyPluginAsync = async (app) => {
    const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>()
    // POST '/api/owners/:ownerId/pets/:petId'
    appWithTypeProvider.put(
        '/api/owners/:ownerId/pets/:petId',
        { schema: putPetsToOwnersSchema },
        async (request) => {
          const { petId, ownerId } = request.params;
          const updated = await app.petService.adopt(petId, ownerId);
          return updated;
        }
      )

    // GET '/api/owners'
    appWithTypeProvider.get(
        '/api/owners',
        { schema: getOwnersSchema },
        async () => {
          return await app.ownerService.getAll();
        }
      )

    // GET '/api/owners/id'
    appWithTypeProvider.get(
        '/api/owners/:id',
        { schema: getOwnerByIdSchema },
        async (request) => {
          const { id } = request.params;
          return await app.ownerService.getById(id);
        }
      )

    // post /api/owners

    appWithTypeProvider.post(
        '/api/owners',
        { schema: postOwnerSchema },
        async (request, reply) => {
          const ownerProps = request.body;
          const created = await app.ownerService.create(ownerProps);
          reply.status(201);
          return created;
        }
      )
    
}
