import faunadb from "faunadb";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefhijkmnpqrstuABCDEFGHJKMNPQRSTUVW",
  6
);

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
const q = faunadb.query;

export default async (req, res) => {
  const { query, method, body } = req;

  console.dir(body);
  switch (method) {
    case "POST":
      try {
        let { slug, url } = body;
        if (!slug) {
          slug = nanoid();
        }

        const qres = await client.query(
          q.Create(q.Collection("urls"), {
            data: { url, slug },
          })
        );
        console.dir(qres);
        console.log(JSON.stringify(qres, null, 4));
        res.status(200).json({ slug: qres.data.slug });
        break;
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
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
