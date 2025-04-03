import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Spinner,
  useOperaciones,
  Btnsave,
  useUsuariosStore,
  useCuentaStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import Emojipicker from "emoji-picker-react";

export function RegistrarCuentas({ onClose, dataSelect, accion }) {
  const { insertarCuenta, actualizarCuenta } = useCuentaStore();
  const { datausuarios } = useUsuariosStore();
  const [showPicker, setShowPicker] = useState(false);
  const [emojiselect, setEmojiselect] = useState("💰");
  const [estadoProceso, setEstadoproceso] = useState(false);
  const { tipo } = useOperaciones();

  const onEmojiClick = (emojiObject) => {
    setEmojiselect(() => emojiObject.emoji);
    setShowPicker(false);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const insertar = async (data) => {
    const cuentaData = {
      descripcion: data.descripcion,
      saldo_actual: Number(data.saldo_actual),
      icono: emojiselect,
      idusuario: datausuarios.id,
      tipo: tipo
    };

    try {
      setEstadoproceso(true);
      if (accion === "Editar") {
        await actualizarCuenta(dataSelect.id, cuentaData);
      } else {
        await insertarCuenta(cuentaData);
      }
      setEstadoproceso(false);
      onClose();
    } catch (error) {
      alert("Error al procesar la cuenta");
      setEstadoproceso(false);
    }
  };

  useEffect(() => {
    if (accion === "Editar") {
      setEmojiselect(dataSelect.icono);
    }
  }, []);

  return (
    <Container>
      {estadoProceso && <Spinner />}

      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion === "Editar"
                ? "Editar cuenta"
                : "Registrar nueva cuenta"}
            </h1>
          </section>

          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            <div>
              <InputText
                defaultValue={dataSelect?.descripcion}
                register={register}
                placeholder="Nombre de la cuenta"
                errors={errors}
                style={{ textTransform: "capitalize" }}
              />
            </div>
            <div>
              <InputText
                type="number"
                defaultValue={dataSelect?.saldo_actual}
                register={register}
                placeholder="Saldo inicial"
                errors={errors}
              />
            </div>
            <div>
              <ContentTitle>
                <input
                  readOnly={true}
                  value={emojiselect}
                  type="text"
                  onClick={() => setShowPicker(!showPicker)}
                />
                <span>Icono</span>
              </ContentTitle>
              {showPicker && (
                <ContainerEmojiPicker>
                  <Emojipicker onEmojiClick={onEmojiClick} />
                </ContainerEmojiPicker>
              )}
            </div>
            <div className="btnguardarContent">
              <Btnsave
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#DAC1FF"
              />
            </div>
          </section>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  svg {
    font-size: 25px;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 40px;
    font-size: 28px;
  }
`;

const ContainerEmojiPicker = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;