import create from 'zustand';
import { persist } from 'zustand/middleware';
const useSearch = create((set) => ({
  searchResult: null,
  setSearchResult: (searchResult) => set(
    (state) => ({
      ...state,
      searchResult
    })
  ),
  clearSearch: () => set(
    (state) => ({
      ...state,
      searchResult: null
    })
  )
}));
export default useSearch;