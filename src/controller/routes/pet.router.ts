import { FastifyPluginAsync } from "fastify";
import { getPetByIdSchema, getPetsSchema, postPetsSchema } from "../pet.schemas";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";


export const createPetRoute: FastifyPluginAsync = async (app) => {
    const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>()
    // GET /api/pets 
    appWithTypeProvider.get(
        '/',
        { schema: getPetsSchema },
        async () => {
          const pets = await app.petService.getAll();
          return pets;
        })

    // GET /api/pets/id
    appWithTypeProvider.get(
        '/:id',
        { schema: getPetByIdSchema },
        async (request, reply) => {
          const { id } = request.params;
          const result = await app.petService.getById(id);
          if (result.isSuccess) {
            return result.result;
          }else {
            const mapper = {
              notFound: 404,
              alreadyTaken: 400
            }
            reply.status(mapper[result.errorCode])
            return {error: result.reason};
          }
    })

    // post /api/pets
    appWithTypeProvider.post(
        '/',
        { schema: postPetsSchema },
        async (request, reply) => {
          const { body: petToCreate } = request;
    
          const created = await app.petService.create(petToCreate);
          reply.status(201);
          return created;
    })
}
