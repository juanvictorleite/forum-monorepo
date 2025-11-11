import type { UseCaseError } from "@/core";

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super(`Credentials are not valid.`);
  }
}
