"use client";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { useState } from "react";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || "");

const schema = {
  description: "Lista de recetas con sus ingredientes",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      recipeName: {
        type: SchemaType.STRING,
        description: "Nombre artístico de la receta",
        nullable: false,
      },
      principalIngredient: {
        type: SchemaType.STRING,
        description: "Ingrediente principal de la receta",
        nullable: false,
      },
    },
    required: ["recipeName"],
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

interface receta {
  recipeName: string;
  principalIngredient: string;
}

export default function Recetas() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<receta[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const geminiCall = async () => {
    setLoader(true);
    const result = await model.generateContent(prompt);
    setResponse(JSON.parse(result.response.text()));
    setLoader(false);
  };

  return (
    <section>
      <h2>Escribe lo que quieras pedir:</h2>
      <input
        type="text"
        onChange={(event) => setPrompt(event.target.value)}
      ></input>
      <p>Prompt: {prompt}</p>
      <button
        className="bg-sky-400 rounded px-5 py-2"
        onClick={() => geminiCall()}
      >
        Enviar
      </button>
      <div className="flex">
        {loader
          ? "Esperando respuesta..."
          : response.map((item, index) => (
              <div key={index} className="bg-white p-5 m-5 text-black">
                <h3>{item.recipeName}</h3>
                <p>{item.principalIngredient}</p>
              </div>
            ))}
      </div>
    </section>
  );
}
