import React from "react";
import { getGreeting } from "../utils/greetings";

export default function Home() {
  const greeting = getGreeting("Mouli");

  return (
    <div>
      <h1>{greeting}</h1>
      {/* ...rest of your home page */}
    </div>
  );
}