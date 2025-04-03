import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "tipo" 100px
    "area2" 50px
    "main" auto;

  .header {
    grid-area: header;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    align-items: center;
  }

  .tipo {
    grid-area: tipo;
    display: flex;
    align-items: center;
  }

  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
    h1 {
      font-size: 2rem;
      margin-left: 1rem;
    }
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
  }
  .main {
    grid-area: main;
    padding: 1rem;

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .account-card {
      background: ${({ theme }) => theme.bg};
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .balance {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0.5rem 0;
      }

      .card-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        margin-top: 1rem;

        button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          
          &:hover {
            background: ${({ theme }) => theme.bgAlpha};
          }
        }
      }
    }
  }
`;

export const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
`;