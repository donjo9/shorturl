import Head from "next/head";
import styled from "styled-components";
import { useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/router";

const baseUrl = process.env.VERCEL_URL ? process.env.VERCEL_URL : process.env.NEXT_PUBLIC_DEV_URL;

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
  width: 80%;
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

const Home = () => {
  const [newSlug, setNewSlug] = useState("");
  const [saveError, setSaveError] = useState("");
  const router = useRouter();
  //console.log("Path: ", baseUrl);
  const formik = useFormik({
    initialValues: {
      url: "",
      slug: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.url) {
        errors.url = "Url is required";
      } else if (!urlValidator.test(values.url)) {
        errors.url = "Invalid Url";
      }
      return errors;
    },
    onSubmit: async (vales) => {
      console.dir(vales);
      setNewSlug("");
      const response = await fetch(`/api/save`, {
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
      const resJson = await response.json();
      console.log(resJson);
      if (resJson.error) {
        setSaveError(resJson.error);
      } else {
        setNewSlug(resJson.slug);
      }
    },
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
          <label htmlFor="name">Optional slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.slug}
          />
          <Button type="submit">Submit</Button>
        </Form>

        {newSlug ? (
          <div>
            {baseUrl}/{newSlug}
          </div>
        ) : null}
        {saveError ? <div>{saveError}</div> : null}
      </Main>
    </>
  );
};

export default Home;
