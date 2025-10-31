import { userRepository } from "../../infrastructure/repositories/users/userRepository.js";

export const UserUseCases = {
    async getAllUsersUseCase(){
        const users = await userRepository.getAll();
        return users;
    },
}