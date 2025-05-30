import { create } from "zustand";
import {
  Categoria,
  CategoriaInsert,
  CategoriaQueryParams,
  CategoriaUpdate,
  EditarCategorias,
  EliminarCategorias, EliminarCategoriasTodas,
  InsertarCategorias,
  MostrarCategorias,
} from "../index";

interface CategoriaStore {
  datacategoria: Categoria[] | null;
  categoriaItemSelect: Categoria | null;
  parametros: Record<string, any>;
  mostrarCategorias: (p: CategoriaQueryParams) => Promise<Categoria[]>;
  selectCategoria: (p: Categoria) => void;
  insertarCategorias: (p: CategoriaInsert) => Promise<void>;
  eliminarCategoria: (p: CategoriaQueryParams) => Promise<void>;
  eliminarCategoriasTodas: (p: any) => Promise<void>;
  editarCategoria: (p: CategoriaUpdate) => Promise<void>;
}

export const useCategoriasStore = create<CategoriaStore>((set, get) => ({
  datacategoria: [],
  categoriaItemSelect: null,
  parametros: {},

  mostrarCategorias: async (p: CategoriaQueryParams): Promise<Categoria[]> => {
    const response = await MostrarCategorias(p);
    set({ parametros: p });
    set({ datacategoria: response });
    set({ categoriaItemSelect: response && response[0] });
    return response || [];
  },

  selectCategoria: (p) => {
    set({ categoriaItemSelect: p });
  },

  insertarCategorias: async (p) => {
    await InsertarCategorias(p);
    const { mostrarCategorias, parametros } = get();
    await mostrarCategorias(parametros as CategoriaQueryParams);
  },

  eliminarCategoria: async (p: CategoriaQueryParams) => {
    await EliminarCategorias(p);
    const { mostrarCategorias, parametros } = get();
    await mostrarCategorias(parametros as CategoriaQueryParams);
  },

  eliminarCategoriasTodas: async (p: CategoriaQueryParams) => {
    await EliminarCategoriasTodas(p);
    const { mostrarCategorias, parametros } = get();
    await mostrarCategorias(parametros as CategoriaQueryParams);
  },

  editarCategoria: async (p: CategoriaUpdate) => {
    await EditarCategorias(p);
    const { mostrarCategorias, parametros } = get();
    await mostrarCategorias(parametros as CategoriaQueryParams);
  },
}));
