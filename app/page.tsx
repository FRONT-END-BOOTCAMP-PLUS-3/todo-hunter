"use client";

import useProgressStore from "@/utils/stores/useProgressStore";
import { useEffect } from "react";

export default function Home() {
  const { progress, fetchUserData } = useProgressStore();

  useEffect(() => {
    fetchUserData();
  }, [progress]);

  return (
    <div>
      Hello world
      <p>{progress}</p>
    </div>
  );
}
