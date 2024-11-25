import { create } from "zustand";

type State = {
  searchInput: string;
};

type Action = {
  changeSearchInput: (input: string) => void;
};

export const useSearchInputStore = create<State & Action>((set) => ({
  searchInput: "",
  changeSearchInput: (input: string) => set(() => ({ searchInput: input })),
}));
