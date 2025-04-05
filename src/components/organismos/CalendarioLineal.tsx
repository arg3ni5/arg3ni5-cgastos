import styled from "styled-components";
import { MdOutlineNavigateNext, MdArrowBackIos } from "react-icons/md";
import { JSX, useEffect } from "react";
import { ConvertirCapitalize, useOperaciones } from "../../index";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface CalendarioLinealProps {
  value: Dayjs;
  setValue: (value: Dayjs) => void;
}

export const CalendarioLineal = ({
  value,
  setValue,
}: CalendarioLinealProps): JSX.Element => {
  const { colorCategoria, setMes, setAño } = useOperaciones();

  const IniciarCalendario = (): void => {
    setValue(dayjs());
    setMes(dayjs().month() + 1);
    setAño(dayjs().year());
  };

  const adelante = (): void => {
    setValue(value.add(1, 'month'));
    setMes(value.month() + 2);
    setAño(value.year());
  };

  const atras = (): void => {
    setValue(value.subtract(1, 'month'));
    setMes(value.month());
    setAño(value.year());
  };

  useEffect(() => {
    IniciarCalendario();
  }, []);

  return (
    <Container className="wrapper" $colortext={colorCategoria}>
      <header>

        <div className="subcontainer">
          <span onClick={atras} className="atras">
            <MdArrowBackIos />
          </span>
          <section className="contentValue">
            <p>{ConvertirCapitalize(value.format('MMMM YYYY'))}</p>
          </section>

          <span onClick={adelante} className="adelante">
            <MdOutlineNavigateNext />
          </span>
        </div>
      </header>
    </Container>
  );
};

interface ContainerProps {
  $colortext: string;
}
const Container = styled.div<ContainerProps>`
  width: 450px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  header {
    display: flex;
    align-items: center;
    padding: 25px 30px 10px;
    justify-content: space-between;
    height: 100%;

    .subcontainer {
     
      display: flex;
      color: ${(props) => props.$colortext};
      align-items: center;
      justify-content: center;
     
      .contentValue {
        border: 2px solid ${(props) => props.$colortext};
        border-radius: 30px;
        text-align: center;
        display: flex;
        align-items: center;
        padding: 10px;
      }
      .atras {
        cursor: pointer;
        margin-left: 20px;
        svg {
          width: 30px;
          height: 30px;
        }
      }
      .adelante {
        cursor: pointer;
          margin-right:20px;
        svg {
          width: 45px;
          height: 45px;
        }
      }
    }
    .current-date {
      font-size: 1.45rem;
      font-weight: 500;
    }
  }
`;
