import { Navigation } from "@/components/Navigation";
import { MotionSystem } from "@/animations/MotionSystem";
import { Hero } from "@/sections/Hero";
import { SelectedWork } from "@/sections/SelectedWork";
import { About } from "@/sections/About";
import { Stack } from "@/sections/Stack";
import { BehindCode } from "@/sections/BehindCode";
import { Experience } from "@/sections/Experience";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return <><Navigation /><main><Hero /><SelectedWork /><About /><Stack /><BehindCode /><Experience /><Contact /></main><MotionSystem /></>;
}
