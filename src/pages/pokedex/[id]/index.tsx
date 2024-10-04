import React, { useState } from "react";
import { ArrowBigRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pokemon } from "@prisma/client";
import NoDataComponent from "~/components/no-data-component";
import LineSpinner from "~/components/loaders/line";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import pencil from "public/assets/svgs/pencil.svg";
import trash from "public/assets/svgs/trash.svg";

const ViewMorePage = () => {
  const router = useRouter();

  const params = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const id = params?.id;

  const getPokemon = async (): Promise<Pokemon | undefined> => {
    const response = await fetch(`/api/pokemon/${id}`);
    let pokemons;
    if (response.ok) {
      pokemons = await response.json();
      return pokemons;
    }
    return undefined;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["pokemons", id],
    queryFn: getPokemon,
    enabled: !!id,
  });

  const deletePokemon = async (id: number): Promise<void> => {
    const response = await fetch(`/api/pokemon/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete Pokémon");
    }

    return response.json();
  };

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: (id: number) => deletePokemon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
      setOpen(false);
      router.push("/pokedex");
    },
    onError: (error) => {
      console.error("Error deleting Pokémon:", error);
    },
  });

  return (
    <section className="px-2 lg:px-0">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="bg-overlay container mx-auto mt-9 rounded-[8px] px-[30px] py-[30px] xl:px-[50px] xl:py-[45px]">
          <div className="mb-[15px] flex items-center justify-between">
            <button onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>

            {data && (
              <div className="flex gap-5">
                <Link
                  href={`/pokedex/${data?.id}/edit`}
                  className="bg-input-bg flex items-center gap-[10px] rounded-[8px] px-[22px] py-[10px] text-white"
                >
                  <Image alt="pencil" src={pencil} width={18} height={18} />
                  Edit
                </Link>
                <DialogTrigger>
                  <button className="bg-input-bg flex items-center gap-[10px] rounded-[8px] px-[22px] py-[10px] text-white">
                    <Image alt="pencil" src={trash} width={18} height={18} />
                    Delete
                  </button>
                </DialogTrigger>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <LineSpinner color="white" size={70} />
            </div>
          ) : data ? (
            <div className="grid-cols-2 gap-[10px] lg:grid">
              <div className="flex items-center justify-center mb-4 lg:mb-0">
                {data?.photo && (
                  <Image
                    src={data?.photo}
                    alt="image of pikachu"
                    width={476}
                    height={447}
                    className="pokemon-image"
                  />
                )}
              </div>
              <div className="text-white">
                <div className="bg-input-bg rounded-[8px] p-5">
                  <div className="">
                    <h2>{data?.name}</h2>
                    <p>N° {data?.degree}</p>
                  </div>
                  <p className="text-app-orange my-3 capitalize">{data?.type}</p>
                  <p>{data?.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-[30px] text-sm lg:grid-cols-3 xl:grid-cols-4">
                    <div className="">
                      <p className="font-semibold">Height</p>
                      <p className="font-[350]">{data?.height}</p>
                    </div>
                    <div className="">
                      <p className="font-semibold">Weight</p>
                      <p className="font-[350]">{data?.weight} lbs</p>
                    </div>
                    <div className="">
                      <p className="font-semibold">Gender Ratio</p>
                      <p className="font-[350]">
                        {data?.female_gender_ratio}%{" "}
                        <span className="text-[10px]">♂</span>{" "}
                        {data?.male_gender_ratio}%{" "}
                        <span className="text-[10px]">♀</span>
                      </p>
                    </div>
                  </div>

                  <div className="ld:grid-cols-3 mt-3 grid grid-cols-2 gap-[30px] text-sm">
                    <div className="">
                      <p className="font-semibold">Abilities</p>
                      <p className="font-[350]">{data?.abilities.join(", ")}</p>
                    </div>
                    <div className="">
                      <p className="font-semibold">Egg Groups</p>
                      <p className="font-[350]">
                        {data?.egg_groups.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 text-sm">
                    <div className="">
                      <p className="font-semibold">Evolutions</p>
                      <p className="font-[350]">
                        {data?.evolution_description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-[10px]">
                    {data?.evolution_photo[0] && (
                      <Image
                        width={120}
                        height={120}
                        src={data?.evolution_photo[0]}
                        alt="poke"
                        className="h-[120px] w-[120px]"
                      />
                    )}
                    <ArrowBigRight className="block h-10 w-10  fill-white  text-white md:block xl:block" />
                    {data?.evolution_photo[1] && (
                      <Image
                        width={120}
                        height={120}
                        src={data?.evolution_photo[1]}
                        alt="poke"
                        className="h-[120px] w-[120px]"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fle-col flex h-[400px] items-center justify-center">
              <NoDataComponent text="Pokemon not found..." />
            </div>
          )}
        </div>

        <DialogContent className="font-sans">
          <DialogHeader className="">
            <DialogTitle className="text-muted mb-4">Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              pokemon from the server.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white px-4 py-2"
            >
              Close
            </button>
            <button
              disabled={isPending}
              onClick={() => deleteMutation(Number(id))}
              className="bg-input-bg mb-4 rounded-lg border px-4 py-2  text-white md:mb-0"
            >
              {isPending ? <LineSpinner color="black" size={15} /> : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ViewMorePage;
