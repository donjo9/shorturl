import faunadb from "faunadb";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefhijkmnpqrstuABCDEFGHJKMNPQRSTUVW', 6)

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
const q = faunadb.query;

export default async (req, res) => {
  const { query, method, body } = req;

  console.dir(body);
  switch (method) {
    case "POST":
      const shortid = nanoid();
      const qres = await client.query(
        q.Create(q.Collection("urls"), {
          data: { ...body, shortid },
        })
      );
      console.dir(qres);
      console.log(JSON.stringify(qres, null, 4));
      res.status(200).json({});
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
