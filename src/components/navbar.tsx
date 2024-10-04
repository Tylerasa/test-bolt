import React from "react";
import pokemon from "../../public/assets/images/pokemon.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const pathname = usePathname();
  console.log("pathname", pathname)
  return (
    <nav className="bg-overlay flex w-full items-center justify-center py-5 text-white">
      <div className="inline-flex flex-col items-center ">
        <Image
          alt="an image of the ppokemon logo"
          src={pokemon}
          width={108}
          height={40}
        />
        <div className="mt-[10px] inline-flex gap-8">
          <Link
            href={"/"}
            className={`px-6 underline-offset-[4px]  ${
              pathname == "/" ? "opacity-80 underline underline-offset-[4px]" : "opacity-80"
            }  hover:underline`}
          >
            Home
          </Link>
          <Link
            href={"/pokedex"}
            className={`px-6   ${
              pathname?.startsWith("/pokedex") ? "opacity-80 underline underline-offset-[4px]" : "opacity-100"
            }  hover:underline`}
          >
            Pokedex
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
