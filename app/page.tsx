"use client";

import characterStore from "@/utils/stores/characterStore";
import { useEffect } from "react";

export default function Home() {
  const { progress, fetchCharacterData } = characterStore();

  useEffect(() => {
    fetchCharacterData();
  }, [progress]);

  return (
    <div>
      Hello world
      <p>{progress}</p>
    </div>
  );
}
