"use client"; 

import { Button } from "@/components/ui/button";


export default function test() {
  return (
    <main >
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Button variant="default" textSize="lg" height="80px" width="100px">Custom Size</Button>
            <Button variant="default" textSize="sm" height="30px" width="100px">Small Custom</Button>
            <Button variant="default" textSize="lg" height="50px" width="150px">Large Custom</Button>
          </div>
    </main>
  );
}
