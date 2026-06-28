"use client";

import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { PetitionBuilderContainer } from "../../../components/petition-builder/PetitionBuilderContainer";

export default function CreatePetitionPage() {
  return (
    <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex flex-col font-body-lg antialiased transition-colors duration-300 bg-dot-pattern">
      <Navbar />
      
      <PetitionBuilderContainer />
      
      <Footer />
    </div>
  );
}
