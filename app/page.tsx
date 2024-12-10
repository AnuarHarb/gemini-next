"use client";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { useState } from "react";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || "");
const schema = {
  description: "Lista de recetas",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      recipeName: {
        type: SchemaType.STRING,
        description: "Nombre de la receta",
        nullable: false,
      },
      description: {
        type: SchemaType.STRING,
        description: "descripción de la receta",
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
  description: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<receta[]>([]);
  console.log(response);

  const geminiCall = async (prompt: string) => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    setResponse(JSON.parse(text));
  };

  return (
    <section>
      <h1>hola mundo de la IA</h1>
      <input
        type="text"
        onChange={(event) => setPrompt(event.target.value)}
      ></input>
      <p>Prompt: {prompt}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => geminiCall(prompt)}
      >
        Preguntar
      </button>
      <p>Respuesta:</p>
      <div>
        <ul className="flex flex-wrap">
          {response.length &&
            response.map((item, index) => (
              <div
                key={index}
                className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4"
              >
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-black">
                    {item.recipeName}
                  </div>
                  <p className="text-gray-700 text-base">{item.description}</p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #photography
                  </span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #travel
                  </span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #winter
                  </span>
                </div>
              </div>
            ))}
        </ul>
      </div>
    </section>
  );
}
