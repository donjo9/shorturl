import faunadb from "faunadb";
import React from "react";
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const q = faunadb.query;

import { useRouter } from "next/router";

const Redirect = ({ ctx }) => {
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.push("/new/url");
    return;
  }
};

Redirect.getInitialProps = async ({ res, query }) => {
  // We check for ctx.res to make sure we're on the server.
  if (res) {
    console.dir(query);
    let url = {};
    try {
      url = await client.query(
        q.Get(q.Match(q.Index("byShortId"), query.redirect))
      );
    } catch (error) {
      console.error(error);
    }
    console.log(url);
    if (url.data) {
      res.writeHead(302, { Location: url.data.url });
    } else {
      res.writeHead(302, { Location: `${baseUrl}/404` });
    }
    res.end();
  }
  return {};
};

export default Redirect;
