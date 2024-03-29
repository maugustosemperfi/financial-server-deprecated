import Bank from '../models/Bank';

class BankService {
  async store(bank) {
    const savedBank = await Bank.create(bank);

    return savedBank;
  }

  async getAll() {
    return Bank.findAll({ order: [['id', 'ASC']] });
  }
}

export default new BankService();
