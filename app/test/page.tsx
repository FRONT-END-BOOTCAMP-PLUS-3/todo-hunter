"use client"; 

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";


export default function test() {
  return (
    <main >
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Button variant="default" textSize="lg" height="80px" width="100px">Custom Size</Button>
            <Button variant="default" textSize="sm" height="30px" width="100px">Small Custom</Button>
            <Button variant="default" textSize="lg" height="50px" width="150px">Large Custom</Button>

            <Button variant="default" textSize="sm" onClick={() => toast("앗! 야생의 소너가(이) 나타났다!")}>Sonner</Button>            
            <Toaster position="top-center"/>
          </div>
    </main>
  );
}
