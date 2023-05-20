async function getData() {
  const res = await fetch('http://localhost:3000/api/months?userId=64623b1099fb59513caf45c0');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Home() {
  const { data } = await getData();

  console.log('First month incomes =>', data[0].userId);

  return (
    <main>
      <h1>Current Month</h1>
      {data.map((month: any) => {
        return (
          <>
            {month.incomes.map((income: any) => (
              <>
                <p key={income._id}>Category {income.category}</p> <p>Amount: {income.amount}</p>
              </>
            ))}
          </>
        );
      })}
    </main>
  );
}
