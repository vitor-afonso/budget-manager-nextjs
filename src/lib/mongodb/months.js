import clientPromise from '@/lib/mongodb/index';

let client;
let db;
let months;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    months = db.collection('months');
  } catch (error) {
    throw new Error('Failed to stablish connection to database.');
  }
}

(async () => {
  await init();
})();

export async function getMonths() {
  try {
    if (!months) await init();
    const result = await months.find({ deleted: false }).toArray();

    // Fetch incomes for each month
    const monthIds = result.map((month) => month._id);
    const incomes = await db
      .collection('incomes')
      .find()
      .map((income) => ({ ...income, _id: income._id.toString(), monthId: income.monthId.toString() }))
      .toArray();

    // Fetch expenses for each month
    const expenses = await db
      .collection('expenses')
      .find()
      .map((expense) => ({ ...expense, _id: expense._id.toString(), monthId: expense.monthId.toString() }))
      .toArray();

    // Merge incomes and expenses with their respective months
    const populatedMonths = result.map((month) => {
      const monthId = month._id.toString();
      const userId = month.userId.toString();
      const monthIncomes = incomes.filter((income) => income.monthId.toString() === monthId);
      const monthExpenses = expenses.filter((expense) => expense.monthId.toString() === monthId);
      return {
        ...month,
        _id: monthId,
        incomes: monthIncomes,
        expenses: monthExpenses,
        userId,
      };
    });
    return { months: populatedMonths };
  } catch (error) {
    return { error: 'Failed to fetch months!' };
  }
}
