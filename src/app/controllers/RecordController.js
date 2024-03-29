import * as yup from 'yup';
import Account from '../models/Account';
import Record from '../models/Record';
import CreditCard from '../models/CreditCard';
import RecordService from '../services/RecordService';

class RecordController {
  async store(req, res) {
    console.log(req.body);

    const validation = yup.object().shape({
      description: yup.string().notRequired(),
      value: yup.number().required(),
      type: yup.number().required(),
      recordDate: yup.date().required(),
      category: yup.object().required(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const accountId = req.body.account ? req.body.account.id : null;
    const creditCardId = req.body.creditCard ? req.body.creditCard.id : null;

    if (accountId) {
      const accountExists = await Account.findOne({ where: { id: accountId } });

      if (!accountExists) {
        return res.status(400).json({ error: 'Account does not exists' });
      }
    } else {
      const creditCardExits = await CreditCard.findOne({ where: { id: creditCardId } });

      if (!creditCardExits) {
        return res.status(400).json({ error: 'Credit card does not exists' });
      }
    }

    const recordRequest = req.body;
    recordRequest.account_id = accountId;
    recordRequest.credit_card_id = creditCardId;
    recordRequest.categoryId = recordRequest.category.id;

    if (recordRequest.type === 1 && recordRequest.value > 0) {
      recordRequest.value *= -1;
    }

    const record = await Record.create(recordRequest);

    return res.json(record);
  }

  async getTransactionsRecords(req, res) {
    const transactions = await RecordService.getTransactionsRecords(req.userId, new Date(req.query.date));

    return res.json(transactions);
  }
}

export default new RecordController();
