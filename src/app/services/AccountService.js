import Account from '../models/Account';
import Record from '../models/Record';

class AccountService {
  async overview(userId) {
    const accounts = await this.getAccountsWithRealValue(userId);
    const overallBalance = Number(
      accounts.reduce((realValueAcumulated, account) => realValueAcumulated + Number(account.realValue), 0).toFixed(2)
    );

    return { overallBalance, accounts };
  }

  async getAccountsWithRealValue(userId) {
    let accounts = await Account.findAll({ where: { user_id: userId } });

    accounts = await Promise.all(
      accounts.map(async account => {
        const sum = await Record.sum('value', { where: { account_id: account.id } });
        account.realValue = Number((Number(account.balance) + Number(sum)).toFixed(2));

        return account;
      })
    );

    return accounts;
  }

  async getSimpleAccounts(userId) {
    const accounts = await Account.findAll({ where: { user_id: userId }, attributes: ['id', 'name', 'type'] });

    return accounts;
  }
}

export default new AccountService();
