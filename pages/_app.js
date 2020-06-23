import App from "next/app";
import React from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root {
}
html,body {
        background-color: #333346;
        color: white;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        font-family: sans-serif;
        margin: 0px;
        padding: 0px;
        position: relative;
    }
    *, :after, :before {
        box-sizing: inherit;
    }
    #__next {
        height: 100vh;
        min-height: 100vh;
    }`;
function MyApp({ Component, pageProps }) {
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;