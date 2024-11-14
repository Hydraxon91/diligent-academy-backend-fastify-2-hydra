import { FastifyInstance, FastifyPluginAsync } from "fastify"
import fp from 'fastify-plugin';

type Options = {
    message: string,
}

const createMessengerPlugin: FastifyPluginAsync<Options> = async (fastify: FastifyInstance, options: Options) => {
    const { message } = options;
  
    fastify.addHook('onRequest', async (request, reply) => {
      console.log(message);
    });
  };

  export default fp(createMessengerPlugin, {
    name: 'createMessengerPlugin',
  });