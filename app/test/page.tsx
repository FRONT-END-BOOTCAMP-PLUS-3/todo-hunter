"use client"; 

import { Button } from "@/components/ui/button";


export default function test() {
  return (
    <main >
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Button variant="default" textSize="sm" height="30px" width="100px">Small Custom</Button>
            <Button variant="default" textSize="lg" height="50px" width="150px">Large Custom</Button>

            <Button variant="red" textSize="sm" height="20px" width="50px">#A72F35</Button>
            <Button variant="blue" textSize="default" height="30px" width="70px">#2049BD</Button>
            <Button variant="green" textSize="lg" height="40px" width="100px">#3E8B75</Button>
            <Button variant="yellow" textSize="lg" height="50px" width="150px">#D5B946</Button>
          </div>
    </main>
  );
}
