import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const pokemon = await prisma.pokemon.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!pokemon) {
        return res.status(404).json({ message: "Pokémon not found" });
      }

      return res.status(200).json(pokemon);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      if (!id || typeof id !== "string") {
        return res
          .status(400)
          .json({ message: "Invalid or missing Pokémon ID" });
      }

      const deletedPokemon = await prisma.pokemon.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        message: "Pokémon deleted successfully",
        deletedPokemon,
      });
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const form = formidable({
      multiples: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Failed to process form" });
      }
      try {
        const processedFields: { [key: string]: string | number } = {};

        for (const key in fields) {
          if (fields[key]) {
            if (Array.isArray(fields[key]) && fields[key][0]) {
              console.log("processedFields[key]", key);
              if (!isNaN(Number(fields[key][0])) && key !== "degree") {
                processedFields[key] = parseFloat(fields[key][0]);
              } else {
                if (key == "abilities" || key == "egg_groups") {
                  processedFields[key] = JSON.parse(fields[key][0]);
                } else {
                  processedFields[key] = fields[key][0];
                }
              }
            }
          }
        }

        const updatedPokemon = await prisma.pokemon.update({
          where: { id: Number(id) },
          data: {
            ...processedFields,
          },
        });

        res.status(200).json(updatedPokemon);
      } catch (error) {
        console.error("Failed to update Pokémon:", error);
        res.status(500).json({ error: "Failed to update Pokémon" });
      }
    });
  }
}
