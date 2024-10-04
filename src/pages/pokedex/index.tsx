import type { Pokemon } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, ListFilter, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "~/components/input";
import PokemonCard from "~/components/pokemon-card";
import debounce from "lodash/debounce";
import LineSpinner from "~/components/loaders/line";
import NoDataComponent from "~/components/no-data-component";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select";

const debouncedSearch = debounce((searchFn, query) => searchFn(query), 400);

const TYPES = [
  { key: "Normal", value: "normal" },
  { key: "Fire", value: "fire" },
  { key: "Water", value: "water" },
  { key: "Electric", value: "electric" },
  { key: "Grass", value: "grass" },
  { key: "Ice", value: "ice" },
  { key: "Fighting", value: "fighting" },
  { key: "Poison", value: "poison" },
  { key: "Ground", value: "ground" },
  { key: "Flying", value: "flying" },
  { key: "Psychic", value: "psychic" },
  { key: "Bug", value: "bug" },
  { key: "Rock", value: "rock" },
  { key: "Ghost", value: "ghost" },
  { key: "Dragon", value: "dragon" },
  { key: "Dark", value: "dark" },
  { key: "Steel", value: "steel" },
  { key: "Fairy", value: "fairy" },
];

const PokedexSearchPage = () => {
  const { watch, register } = useForm();
  const queryClient = useQueryClient();

  const search = watch("search");

  const searchPokemons = async (
    query: string,
    isFilter?: boolean,
    type?: string,
  ): Promise<Pokemon[] | undefined> => {
    const params = {
      ...(isFilter ? { filter: type } : {}),
      ...(query ? { search: query } : {}),
    };

    try {
      const url = `/api/pokemon?${new URLSearchParams(params).toString()}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        return data?.pokemons;
      }
      return [];
    } catch (error) {
      console.error("Error searching Pokémon:", error);
      return [];
    }
  };

  const { mutate: searchMutation, isPending } = useMutation({
    mutationFn: (variables: {
      query: string;
      isFilter?: boolean;
      type?: string;
    }) => searchPokemons(variables.query, variables.isFilter, variables.type),
    onSuccess: (data) => {
      queryClient.setQueryData(["pokemons"], data);
    },
  });

  const fetchPokemons = async (): Promise<Pokemon[] | undefined> => {
    const response = await fetch("/api/pokemon");
    if (response.ok) {
      const data = await response.json();
      return data.pokemons;
    }
    return undefined;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
  });

  useEffect(() => {
    if (search) {
      debouncedSearch(() => searchMutation({ query: search }), search);
    } else {
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
    }

    return () => debouncedSearch.cancel();
  }, [search]);

  const filterType = (value: string) => {
    searchMutation({ query: "", isFilter: true, type: value });
  };

  return (
    <section className="px-2 lg:px-0">
      <div className="bg-overlay container mx-auto mt-9 rounded-[8px] px-[30px] py-[50px] md:px-[56px]">
        <h1 className="text-2xl font-bold text-white">Pokedex</h1>
        <div className="mb-[50px] mt-4 flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="flex gap-[23px]">
            <Input
              icon={Search}
              t="text"
              placeholder="Search pokemon"
              className="w-[400px] lg:w-[575px]"
              registerField={register("search")}
            />

            <Select onValueChange={filterType}>
              <SelectTrigger className="">
                <button className="text-input-placeholder bg-input-bg flex items-center gap-[10px] rounded-[8px] px-[22px] py-[10px]">
                  <ListFilter className="h-5 w-5 text-white" />
                  <span className="hidden md:block">Type</span>
                </button>
              </SelectTrigger>
              <SelectContent className="bg-input-bg border-input-bg text-white">
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {TYPES.map((t, i) => (
                    <SelectItem key={i} value={t.value}>
                      {t.key}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Link
            href="/pokedex/create-new"
            className="bg-input-bg flex items-center gap-[10px] rounded-[8px] px-[22px] py-[10px] text-white"
          >
            <CirclePlus className="stroke-input-bg h-6 w-6 fill-white" />
            <span className="block md:hidden lg:block">Create New</span>
          </Link>
        </div>

        {isLoading || isPending ? (
          <div className="flex justify-center">
            <LineSpinner color="white" size={70} />
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid gap-[23px]  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.map((pokemon, i) => <PokemonCard {...pokemon} key={i} />)}
          </div>
        ) : (
          <div className="">
            <NoDataComponent text="no pokemons found..." />
          </div>
        )}
      </div>
    </section>
  );
};

export default PokedexSearchPage;
