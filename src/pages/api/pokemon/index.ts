import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "POST") {
    const form = formidable({
      multiples: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ message: "Error parsing form data" });
      }

      const {
        name,
        degree,
        type,
        description,
        height,
        weight,
        male_gender_ratio,
        female_gender_ratio,
        abilities,
        egg_groups,
        evolution_description,
      } = fields;

      const photo = files["photo[]"] ? files["photo[]"] : [];
      const evolution_photo = files["evolution_photo[]"] || [];

      const missingFields: string[] = [];
      if (!name) missingFields.push("name");
      if (!degree) missingFields.push("degree");
      if (!type) missingFields.push("type");
      if (!photo) missingFields.push("photo");
      if (!description) missingFields.push("description");
      if (!height) missingFields.push("height");
      if (!weight) missingFields.push("weight");
      if (!male_gender_ratio) missingFields.push("male_gender_ratio");
      if (!female_gender_ratio) missingFields.push("female_gender_ratio");
      if (!abilities || abilities.length === 0) missingFields.push("abilities");
      if (!egg_groups || egg_groups.length === 0)
        missingFields.push("egg_groups");
      if (!evolution_description) missingFields.push("evolution_description");
      if (evolution_photo.length === 0) missingFields.push("evolution_photo");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required fields",
          missingFields,
        });
      }

      const evolutionFileUrls: string[] = [];
      const photoUrl: string[] = [];
      const uploadPromises: any[] = [];

      uploadImage(photo, photoUrl, uploadPromises);
      uploadImage(evolution_photo, evolutionFileUrls, uploadPromises);

      await Promise.all(uploadPromises);

      const newPokemon = await prisma.pokemon.create({
        data: {
          name: String(name),
          degree: String(degree),
          type: String(type),
          photo: String(photoUrl),
          description: String(description),
          height: String(height),
          weight: parseFloat(String(weight)),
          male_gender_ratio: parseFloat(String(male_gender_ratio)),
          female_gender_ratio: parseFloat(String(female_gender_ratio)),
          abilities: abilities as string[],
          egg_groups: egg_groups as string[],
          evolution_description: String(evolution_description),
          evolution_photo: evolutionFileUrls,
        },
      });

      return res.status(201).json({
        message: "New Pokémon created successfully.",
        pokemon: newPokemon,
      });
    });
  } else if (req.method === "GET") {
    try {
      const query = req.query.search as string | undefined;
      const filter = req.query.filter as string | undefined;

      console.log("filter", filter);

      const whereClause: Prisma.PokemonWhereInput = {
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { type: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(filter && { type: { equals: filter, mode: "insensitive" } }),
      };

      const pokemons = await prisma.pokemon.findMany({
        where: whereClause,
      });

      res.status(200).json({
        message: "Pokémon retrieved successfully.",
        pokemons,
      });
    } catch (error) {
      console.error("Error retrieving Pokémon:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;

function uploadImage(
  files: formidable.File[],
  list: string[],
  uploadPromises: any[],
) {
  for (const file of files) {
    const fileStream = fs.createReadStream(file.filepath);

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: file.originalFilename!,
      Body: fileStream,
      ACL: "public-read" as const,
    };

    const uploadPromise = s3
      .send(new PutObjectCommand(uploadParams))
      .then((data) => {
        console.log("Darta", data);
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${file.originalFilename}`;
        list.push(fileUrl);
      });

    uploadPromises.push(uploadPromise);
  }
}
