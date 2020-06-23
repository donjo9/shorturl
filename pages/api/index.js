import faunadb from "faunadb";
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const q = faunadb.query;

export default async (req, res) => {
  const {
    query: { pid },
  } = req;

  const queryRes = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("urls"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )
  const sites = queryRes.data.map(s => s.data);      
  console.dir(sites);

  res.end(JSON.stringify(sites));
};
