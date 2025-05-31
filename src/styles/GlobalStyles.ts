import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
        font-family: 'Inter', sans-serif;
        overscroll-behavior: none;
    }
    html, body {
        overscroll-behavior: none; /* Desactiva rebote visual */
    }


    body {
        overflow-x: hidden;
    }

    * {
        box-sizing: border-box;
    }
`;
