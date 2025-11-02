
export default class UserUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsersUseCase() {
    return await this.userRepository.getAll();
  }

  async getUserByIdUseCase(id) {
    return await this.userRepository.getById(id);
  }

  async createUserUseCase(data) {
    return await this.userRepository.create(data);
  }

  async updateUserUseCase(id, data) {
    return await this.userRepository.update(id, data);
  }

  async patchUserUseCase(id, fields) {
    return await this.userRepository.patch(id, fields);
  }

  async deleteUserUseCase(id) {
    return await this.userRepository.delete(id);
  }
}
