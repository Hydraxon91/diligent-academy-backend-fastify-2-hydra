import { FastifyPluginAsync } from "fastify";
import { getPetByIdSchema, getPetsSchema, postPetsSchema } from "../pet.schemas";
import { PetService } from "../../service/pet.service";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

type PluginOptions = {
    petService: PetService
}

export const createPetRoute: FastifyPluginAsync<PluginOptions> = async (app, {petService}) => {
    const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>()
    // GET /api/pets 
    appWithTypeProvider.get(
        '/api/pets',
        { schema: getPetsSchema },
        async () => {
          const pets = await petService.getAll();
          return pets;
        })

    // GET /api/pets/id
    appWithTypeProvider.get(
        '/api/pets/:id',
        { schema: getPetByIdSchema },
        async (request) => {
          const { id } = request.params;
          const pets = await petService.getById(id);
          return pets;
    })

    // post /api/pets
    appWithTypeProvider.post(
        '/api/pets',
        { schema: postPetsSchema },
        async (request, reply) => {
          const { body: petToCreate } = request;
    
          const created = await petService.create(petToCreate);
          reply.status(201);
          return created;
        })
}
