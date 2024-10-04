import React from "react";
import pikachu from "../../public/assets/images/pikachu.png";
import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@prisma/client";

const PokemonCard = (pokemon: Pokemon) => {
  return (
    <Link
      href={`/pokedex/${pokemon.id}`}
      className="bg-input-bg rounded-[16px] px-10 py-5"
    >
      <Image
        src={pokemon?.photo ?? pikachu}
        alt="image of pikachu"
        className="mx-auto mb-[30px]"
        width={144}
        height={135}
      />
      <div className="text-center text-white">
        <p className="text-sm font-semibold">N° {pokemon.degree}</p>
        <p className=" font-bold">{pokemon.name}</p>
        <p className="text-app-orange text-sm capitalize">{pokemon.type}</p>
      </div>
    </Link>
  );
};

export default PokemonCard;
