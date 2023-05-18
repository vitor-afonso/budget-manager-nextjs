import clientPromise from '.';
let client;
let db;
let months;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    months = await db.collection('months');
  } catch (error) {
    throw new Error('Failed to establish connection to database');
  }
}

(async () => {
  await init();
})();

export async function getMonths() {
  try {
    if (!months) await init();

    // const result = await months.find({ userId: userId, deleted: false }).populate({ path: 'incomes' }).populate({ path: 'expenses' });

    const result = await months
      .find({ deleted: false })
      .map((month) => ({ ...month, _id: month._id.toString() }))
      .toArray();

    return { months: result };
  } catch (error) {
    return { error: `Something went wrong getting months from DB` };
  }
}
