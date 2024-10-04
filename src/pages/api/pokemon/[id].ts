import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
import formidable from "formidable";

interface Record {
  [key: string]: string | number;
}

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

    form.parse(req, async (err, fields) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Failed to process form" });
      }
      try {
        const processedFields: Record = {};

        for (const key in fields) {
          const fieldValue = fields[key]?.[0];

          if (fieldValue) {
            if (Array.isArray(fields[key])) {
              if (!isNaN(Number(fieldValue)) && key !== "degree") {
                processedFields[key] = parseFloat(fieldValue);
              } else if (key === "abilities" || key === "egg_groups") {
                processedFields[key] = JSON.parse(fieldValue);
              } else {
                processedFields[key] = fieldValue;
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
