import Swal from "sweetalert2";

export const showErrorMessage = (text: string, title: string = "Error"): void => {
  Swal.fire({
    icon: "error",
    title,
    text
  });
};

export const showSuccessMessage = (text: string = "Operación exitosa", timer: number = 1500): void => {
  Swal.fire({
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer
  });
};