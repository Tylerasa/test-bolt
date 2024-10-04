import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "~/components/file-upload";
import Input from "~/components/input";
import Textarea from "~/components/textarea";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LineSpinner from "~/components/loaders/line";
import { toast } from "sonner";
import type { Pokemon } from "@prisma/client";

const EditPokemonPage = () => {
  const params = useParams();

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

  const { data } = useQuery({
    queryKey: ["pokemons", id],
    queryFn: getPokemon,
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = (data: any) => {
    if (!isDirty) {
      return;
    }
    const formData = new FormData();

    Object.keys(dirtyFields).forEach((key) => {
      if (key === "photo" || key === "evolution_photo") {
        const files = data[key] as FileList;

        Array.from(files).forEach((file: File) => {
          formData.append(`${key}[]`, file);
        });
      } else if (key === "egg_groups" || key === "abilities") {
        const list = data[key].split(", ").map((l: string) => l.trim());
        formData.append(key, JSON.stringify(list));
      } else {
        formData.append(key, data[key]);
      }
    });

    mutate(formData);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (updatedPokemon: FormData) => {
      const response = await fetch(`/api/pokemon/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
        body: updatedPokemon,
      });

      if (!response.ok) {
        throw new Error("Failed to update Pokémon");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast("Pokemon updated");
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
      queryClient.setQueryData(["pokemons", data.id], data);
      router.push("/pokedex");
    },
  });

  useEffect(() => {
    if (data) {
      const { evolution_photo, photo, ...rest } = data;
      const resetData = { ...rest };
      if (evolution_photo) {
        const initialPreviews = evolution_photo.map((url) => ({
          url,
          name: url.split("/").pop() ?? "Image",
          isDefault: true,
        }));

        const dataTransfer = new DataTransfer();
        initialPreviews.forEach((preview) => {
          const file = new File([""], preview.name, { type: "image/jpeg" });
          dataTransfer.items.add(file);
        });

        //@ts-ignore
        resetData.evolution_photo = dataTransfer.files;
      }

      if (photo) {
        const preview = {
          url: photo,
          name: photo.split("/").pop() ?? "Image",
          isDefault: true,
        };

        const dataTransfer = new DataTransfer();
        const file = new File([""], preview.name, { type: "image/jpeg" });
        dataTransfer.items.add(file);

        //@ts-ignore
        resetData.photo = dataTransfer.files;
      }

      reset(resetData);
    }
  }, [data, reset]);

  return (
    <section className="px-2 lg:px-0">
      <div className="bg-overlay mx-auto mt-9 w-full rounded-[8px] p-[20px] md:w-[700px] lg:p-[50px]">
        <h1 className="text-[24px] font-bold text-white">Edit Pokemon</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <Input
                t="text"
                placeholder="Name"
                registerField={register("name", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.name?.message?.toString()}
              </p>
            </div>

            <div className="">
              <Input
                t="text"
                placeholder="N° 123"
                registerField={register("degree", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.degree?.message?.toString()}
              </p>
            </div>
            <div className="col-span-2">
              {data?.photo ? (
                <FileUpload
                  id="photo"
                  label="Pokemon Photo"
                  className="col-span-2"
                  registerField={register("photo")}
                  defaultImages={[data!.photo]}
                />
              ) : null}
              <p className="text-sm text-red-700">
                {errors.photo?.message?.toString()}
              </p>
            </div>
            <div className="col-span-2">
              <Input
                t="text"
                placeholder="Type"
                registerField={register("type", {
                  required: "This is required",
                })}
              />

              <p className="text-sm text-red-700">
                {errors.type?.message?.toString()}
              </p>
            </div>

            <div className="col-span-2">
              <Textarea
                placeholder="Description"
                registerField={register("description", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.description?.message?.toString()}
              </p>
            </div>

            <div className="">
              <Input
                t="text"
                placeholder="Height"
                registerField={register("height", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.height?.message?.toString()}
              </p>
            </div>
            <div className="">
              <Input
                t="number"
                placeholder="Weight"
                registerField={register("weight", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.weight?.message?.toString()}
              </p>
            </div>

            <div className="">
              <Input
                t="text"
                placeholder="Gender ratio"
                registerField={register("male_gender_ratio", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.male_gender_ratio?.message?.toString()}
              </p>
            </div>
            <div className="">
              <Input
                t="text"
                placeholder="Gender ratio"
                registerField={register("female_gender_ratio", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.female_gender_ratio?.message?.toString()}
              </p>
            </div>

            <div className="col-span-2">
              <Input
                t="text"
                placeholder="Abilities"
                registerField={register("abilities", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.abilities?.message?.toString()}
              </p>
            </div>

            <div className="col-span-2">
              <Input
                t="text"
                placeholder="Egg Groups"
                registerField={register("egg_groups", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.egg_groups?.message?.toString()}
              </p>
            </div>

            <div className="col-span-2">
              <Input
                t="text"
                placeholder="Evolution description"
                registerField={register("evolution_description", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.evolution_description?.message?.toString()}
              </p>
            </div>

            <div className="col-span-2">
              {data?.evolution_photo ? (
                <FileUpload
                  id="evolution_photo"
                  label="Evolution Photo"
                  className="col-span-2"
                  multiple
                  registerField={register("evolution_photo")}
                  defaultImages={data!.evolution_photo}
                />
              ) : null}
              <p className="text-sm text-red-700">
                {errors.evolution_photo?.message?.toString()}
              </p>
            </div>
          </div>
          <div className="ml-auto mt-10 flex w-fit gap-5">
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/pokedex");
              }}
              className="form-button rounded-[6px] bg-white px-[12px] py-[9px] font-medium text-[#333333]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`form-button rounded-[6px] bg-[#333333] px-[12px] py-[9px] font-medium text-white ${
                !isPending ? "opacity-100" : "opacity-60"
              }`}
            >
              {isPending ? (
                <span className="px-5">
                  <LineSpinner size={15} />
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPokemonPage;
