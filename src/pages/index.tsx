import Head from "next/head";
import game from "../../public/assets/images/console.png";
import pikachu from "../../public/assets/images/pikachu.png";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LineSpinner from "~/components/loaders/line";
import { useCallback, useEffect, useState } from "react";
import type { Pokemon } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";

export default function Home() {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon>();
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const fetchPokemons = async (): Promise<Pokemon[] | undefined> => {
    const response = await fetch("/api/pokemon");
    let pokemons;
    if (response.ok) {
      pokemons = await response.json();
      return pokemons.pokemons;
    }
    return [];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
  });
 
  const handleSlideChange = useCallback((emblaApi: EmblaCarouselType) => {
    if (!data) return;
    
    const index = emblaApi.selectedScrollSnap();
    setCurrentPokemon(data[index]);
  }, [data]);

  useEffect(() => {
    if (!emblaApi || !data) return;

    emblaApi.on("select", handleSlideChange);
    
    setCurrentPokemon(data[emblaApi.selectedScrollSnap()]);

    return () => {
      emblaApi.off("select", handleSlideChange);
    };
  }, [emblaApi, data, handleSlideChange]);



  return (
    <>
      <Head>
        <title>Pokedex</title>
        <meta name="description" content="Condorsoft technical test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative mt-[100px] flex w-full flex-1 items-center justify-center">
        <div id="console" className="relative">
          <Image
            src={game}
            alt="an image of a game console absolute"
            width={713}
            height={520}
            className=""
          />
          {/* top-[154px] left-[58px]  */}
          <div className="main-screen absolute left-[8%] top-[30%] h-fit w-[244px] rounded-[8px] bg-transparent p-[10px] text-black">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LineSpinner color="black" size={40} />
              </div>
            ) : (
              <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                  {data?.map((pokemon, i) => (
                    <div key={i} className="embla__slide">
                      <div className="flex justify-between">
                        <p className="font-semibold">{pokemon?.name}</p>
                        <p>N° {pokemon?.degree.slice(0, 2)}</p>
                      </div>
                      <div className="">
                        <p className="my-[2px] capitalize">{pokemon?.type.slice(0, 10)}</p>
                        <p className="text-xs">
                          {pokemon?.description.slice(0, 90)}
                        </p>
                        <div className="flex">
                          <div className="px-[22px] text-sm">
                            <p className="font-semibold">Height</p>
                            <p className="">{pokemon?.height.slice(0, 8)}</p>
                          </div>

                          <div className="px-[22px] text-sm">
                            <p className="font-semibold">Weight</p>
                            <p className="">
                              {parseFloat(String(pokemon?.weight).slice(0, 4))}{" "}
                              lbs
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* right-[57px] top-[167px] */}
          <div className="absolute poke-screen top-[32%] right-[8%] flex h-[253px] w-[226px] items-center justify-center rounded-[8px] bg-white">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LineSpinner color="black" size={40} />
              </div>
            ) : (
              <div className="w-fit">
                <Image
                  width={144}
                  height={135}
                  src={currentPokemon?.photo ?? pikachu}
                  alt={`image of ${currentPokemon?.name}`}
                />
              </div>
            )}
          </div>

          {/* bottom-[35px] */}
          {/* left-[88px] top-[438px] */}

          <Link
            href={"/pokedex"}
            className="bg-app-yellow console-search absolute bottom-[6.7%] left-[12.5%]  rounded-[8px] px-7 py-3 font-semibold text-black"
          >
            Search
          </Link>
          {/* bottom-[37px] */}
          {/* right-[183px] top-[445px] */}
          <Link
            href={`/pokedex/${currentPokemon?.id}`}
            className="absolute view-more right-[25.7%] bottom-[6.9%] rounded-[8px]  bg-transparent px-[5.5px] py-[7.5px] font-semibold  text-black"
          >
            View more
          </Link>
        </div>
      </div>
    </>
  );
}
