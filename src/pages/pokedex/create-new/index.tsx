import React from "react";
import { useForm } from "react-hook-form";
import FileUpload from "~/components/file-upload";
import Input from "~/components/input";
import Textarea from "~/components/textarea";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LineSpinner from "~/components/loaders/line";
import { toast } from "sonner";

const CreateNewPokemonPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = (data: any) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "photo" || key === "evolution_photo") {
        const files = data[key] as FileList;

        Array.from(files).forEach((file: File) => {
          formData.append(`${key}[]`, file);
        });
      } else if (key === "egg_groups" || key === "abilities") {
        let list = data[key].split(", ").map((l: string) => l.trim());
        formData.append(key, list);
      } else {
        formData.append(key, data[key]);
      }
    });
    mutate(formData);
  };

  const createPokemon = async (formData: FormData) => {
    try {
      const response = await fetch("/api/pokemon", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      return response;
    } catch (error) {
      console.error("Error creating Pokemon:", error);
      throw error;
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => {
      return createPokemon(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
      toast("Pokemon created");
      router.push("/pokedex");
      reset();
    },
  });


  return (
    <section className="px-2 lg:px-0">

      <div className="bg-overlay mx-auto mt-9 md:w-[700px] w-full  rounded-[8px] lg:p-[50px] p-[20px] ">
        <h1 className="text-[24px] font-bold text-white">New Pokemon</h1>
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
              <FileUpload
                id="photo"
                label="Pokemon Photo"
                className="col-span-2"
                registerField={register("photo", {
                  required: "This is required",
                })}
              />
              <p className="text-sm text-red-700">
                {errors.degree?.message?.toString()}
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
                t="number"
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
                t="number"
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
              <FileUpload
                id="evolution_photo"
                label="Evolution Photo"
                className="col-span-2"
                multiple
                registerField={register("evolution_photo", {
                  required: "This is required",
                })}
              />
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

export default CreateNewPokemonPage;
