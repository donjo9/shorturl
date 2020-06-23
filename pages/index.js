import Head from "next/head";
import styled from "styled-components";
import { useFormik } from "formik";
import faunadb from "faunadb";
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const q = faunadb.query;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const urlValidator = /^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

const Main = styled.main`
  margin: 15px auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  label {
    padding: 0.5rem 0;
  }
`;

const Button = styled.button`
  cursor: pointer;
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #40405e;
  color: white;
  border: 0;
  border-radius: 10px;
  transition: background-color 200ms ease-in-out;
  :hover {
    background-color: #39395c;
  }
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 20px 0;
`;

const TableData = styled.td`
  margin: 0px 100px;
`;

const TableHeader = styled.th`
  text-align: left;
  margin: 0px 100px;
`;

const ErrorField = styled.div`
  padding: 0 1rem;
  color: #f55d42;
  display: inline-block;
`;

export default function Home({ sites }) {
  const formik = useFormik({
    initialValues: {
      url: "",
      name: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.url) {
        errors.url = "Url is required";
      } else if (!urlValidator.test(values.url)) {
        errors.url = "Invalid Url";
      }
      return errors;
    },
    onSubmit: async (vales) => {
      console.dir(vales);
      const response = await fetch(`${baseUrl}/api/save`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(vales),
      });
    },
  });
  console.log(baseUrl);
  const sitesList = sites.map((site) => {
    return (
      <tr key={site.shortid}>
        <TableData>{site.name}</TableData>
        <TableData>{site.url}</TableData>
        <TableData><a href={`${baseUrl}/${site.shortid}`}>{`${baseUrl}${site.shortid}`}</a></TableData>
      </tr>
    );
  });
  return (
    <>
      <Head>
        <title>lvl42 Url Shortner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1>Add new site</h1>
        <Form onSubmit={formik.handleSubmit}>
          <label htmlFor="name">
            Site Name
            {formik.errors.name && formik.touched.name ? (
              <ErrorField>{formik.errors.name}</ErrorField>
            ) : null}
          </label>

          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <label htmlFor="Url">
            Site URL{" "}
            {formik.errors.url && formik.touched.url ? (
              <ErrorField>{formik.errors.url}</ErrorField>
            ) : null}
          </label>

          <input
            id="url"
            name="url"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.url}
          />
          <Button type="submit">Submit</Button>
        </Form>
        <Table>
          <thead>
            <tr>
              <TableHeader>Navn</TableHeader>
              <TableHeader>Url</TableHeader>
              <TableHeader>Short Url</TableHeader>
            </tr>
          </thead>
          <tbody>{sitesList}</tbody>
        </Table>
      </Main>
    </>
  );
}

export async function getStaticProps(context) {
 
  const queryRes = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("urls"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )
  const sites = queryRes.data.map(s => s.data);  

  return {
    props: { sites }, // will be passed to the page component as props
  };
}
