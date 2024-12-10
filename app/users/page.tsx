"use client";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { useState } from "react";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || "");

const schema = {
  description: "Lista de clientes de mi restaurante",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      clientName: {
        type: SchemaType.STRING,
        description: "Nombre y apellido del cliente",
        nullable: false,
      },
      clientVisits: {
        type: SchemaType.INTEGER,
        description: "Numero de visitas que ha hecho el cliente",
        nullable: false,
      },
      clientFavorite: {
        type: SchemaType.STRING,
        description: "Platillo favorito del cliente",
        nullable: false,
      },
    },
    required: ["clientName"],
  },
};

interface client {
  clientName: string;
  clientVisits: number;
  clientFavorite: string;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export default function Users() {
  const [prompt, setPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const geminiCall = async () => {
    setLoading(true);
    const result = await model.generateContent(prompt);
    setAiResponse(JSON.parse(result.response.text()));
    setLoading(false);
  };

  return (
    <section>
      <input
        id="chat"
        onChange={(event) => setPrompt(event.target.value)}
      ></input>
      <p className="border-double border-4 border-sky-500">Prompt: {prompt}</p>
      <button
        className="bg-cyan-800 rounded px-5 py-2"
        onClick={() => geminiCall()}
      >
        Preguntar a la IA
      </button>
      <div className="flex">
        {loading
          ? "Esperando respuesta..."
          : aiResponse.map((item, index) => (
              <div key={index} className="bg-white m-5 p-5 text-black">
                <h2 className="bold text-lg">{item.clientName}</h2>
                <p>Número de visitas: {item.clientVisits}</p>
                <p>Platillo favorito: {item.clientFavorite}</p>
                {item.clientVisits > 5 ? <p>VIP</p> : <p></p>}
              </div>
            ))}
      </div>
    </section>
  );
}
