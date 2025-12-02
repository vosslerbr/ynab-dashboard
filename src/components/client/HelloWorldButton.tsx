"use client";

import { Button } from "@/components/ui/button";

export default function HelloWorldButton() {
  const buttonClick = () => {
    console.log("Hello YNABer!");
  };

  return (
    <>
      <Button type="button" onClick={buttonClick}>
        Hello World
      </Button>
    </>
  );
}
