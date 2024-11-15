import { httpErrors } from "@fastify/sensible";
import { PetToCreate } from "../entity/pet.type";
import { PetRepository } from "../repository/pet.repository"

export class PetNotFoundError extends Error {}

export class PetTakenError extends Error {}

export class PetService {
  private readonly repository;

  constructor(repository: PetRepository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.read();
  }

  async getById(id: number) {
    const pet = await this.repository.readById(id);
    if(!pet) {
      //should return 404
      // throw httpErrors.notFound('Pet not found')
      throw new PetNotFoundError('Pet not found')
      // throw new Error('Pet not found');
    }
    return pet;
  }

  async create(pet: PetToCreate) {
    return await this.repository.create(pet);
  }

  async adopt(petId: number, ownerId: number) {
    const pet = await this.repository.readById(petId);
    if (!pet) {
      //should return 404
      // throw httpErrors.notFound('Pet does not exists.')
      throw new PetNotFoundError('Pet does not exists.')
      // throw new Error('Pet does not exists.');
    }
    if(pet.ownerId !== null) {
      //should return 400
      // throw httpErrors.badRequest('Pet has already have an owner.')
      throw new PetTakenError();
      // throw new Error('Pet has already have an owner.')
    }
    const adopted = await this.repository.update(petId, { ownerId })
    if (!adopted) {
      //should return 400
      // throw httpErrors.badRequest('Pet could not be adopted, because it is disappeared.');
      throw new PetNotFoundError('Pet not found')
      //throw new Error('Pet could not be adopted, because it is disappeared.');
    }
    return adopted;
  }
}