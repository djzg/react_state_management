import { useState, useEffect, createContext, useContext, useReducer, useCallback } from 'react'


interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

// gets pokemon.json and sets it into an array
function usePokemonSource(): {
  pokemon: Pokemon[];
  search: string;
  setSearch: (search:string) => void;
} {
  // const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  //const [search, setSearch] = useState("");

  type PokemonState = {
    pokemon: Pokemon[];
    search: string;
  }

  type PokemonAction = { type: 'setPokemon'; payload: Pokemon[] } | { type: 'setSearch'; payload: string }


  const [{ pokemon, search }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch(action.type) {
        case "setPokemon":
          return { ...state, pokemon: action.payload};
        case "setSearch":
          return { ...state, search: action.payload};
      }
    }, {
    pokemon: [],
    search: "foo",
  })

  useEffect(() => {
    fetch('/pokemon.json')
      .then((response) => response.json())
      .then((data) => dispatch({
        type: 'setPokemon',
        payload: data,
      }));
  }, []);

  const setSearch = useCallback((search:string) => {
    dispatch({
      type: 'setSearch',
      payload: search,
    });
  }, []);

  return { pokemon, search, setSearch };
}

// creating a context
const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
    {} as unknown as ReturnType<typeof usePokemonSource>
  );

export function usePokemon() {
  return useContext(PokemonContext);
}

// main render
export function PokemonProvider({ children }: {children: React.ReactNode;}) {
  const { pokemon } = usePokemonSource();
  return (
    <PokemonContext.Provider value={usePokemonSource()}>
      {children}
    </PokemonContext.Provider>
  )
}