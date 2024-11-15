import { httpErrors } from "@fastify/sensible";
import { Pet, PetToCreate } from "../entity/pet.type";
import { PetRepository } from "../repository/pet.repository"
import { AppError } from "./app.error";

type ErrorCodes = 'notFound' | 'alreadyTaken'

type SuccessResult<ResultType> = {
  isSuccess: true,
  result: ResultType
}

type ErrorResult = {
  isSuccess: false,
  reason: string,
  errorCode: ErrorCodes
}

type Result<SuccessResultType> = SuccessResult<SuccessResultType> | ErrorResult;

export class PetNotFoundError extends AppError {}
export class PetTakenError extends AppError {}

export class PetService {
  private readonly repository;

  constructor(repository: PetRepository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.read();
  }

  async getById(id: number): Promise<Result<Pet>> {
    const pet = await this.repository.readById(id);
    if(!pet) {
      //should return 404
      // throw httpErrors.notFound('Pet not found')
      return {
        isSuccess: false,
        reason: 'Pet not found',
        errorCode: 'notFound'
      }

      //throw new PetNotFoundError('notFound', 'Pet not found')
      
      // throw new Error('Pet not found');
    }
    return {
      isSuccess: true,
      result: pet
    }
  }

  async create(pet: PetToCreate) {
    return await this.repository.create(pet);
  }

  async adopt(petId: number, ownerId: number) {
    const pet = await this.repository.readById(petId);
    if (!pet) {
      //should return 404
      // throw httpErrors.notFound('Pet does not exists.')
      throw new PetNotFoundError('notFound','Pet does not exists.')
      // throw new Error('Pet does not exists.');
    }
    if(pet.ownerId !== null) {
      //should return 400
      // throw httpErrors.badRequest('Pet has already have an owner.')
      throw new PetTakenError('alreadyTaken', 'Pet already has an owner');
      // throw new Error('Pet has already have an owner.')
    }
    const adopted = await this.repository.update(petId, { ownerId })
    if (!adopted) {
      //should return 400
      // throw httpErrors.badRequest('Pet could not be adopted, because it is disappeared.');
      throw new PetNotFoundError('notFound', 'Pet not found')
      //throw new Error('Pet could not be adopted, because it is disappeared.');
    }
    return adopted;
  }
}