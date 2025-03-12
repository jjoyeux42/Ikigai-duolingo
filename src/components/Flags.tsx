import React from "react";

type Language = {
  name: string;
  flag: string;
};

export const Flag = ({ 
  language, 
  width = 45 
}: { 
  language: Language; 
  width?: number;
}) => {
  // Utilisez un emoji ou une icône en attendant un vrai drapeau
  return (
    <div 
      className="flex items-center justify-center bg-white rounded-md" 
      style={{ width: `${width}px`, height: `${width}px` }}
    >
      <span className="text-2xl">{language.flag || "🧠"}</span>
    </div>
  );
};