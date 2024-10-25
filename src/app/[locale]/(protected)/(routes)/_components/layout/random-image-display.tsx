"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface RandomImageDisplayProps {
  initialImage?: string;
}

function RandomImageDisplay({ initialImage }: RandomImageDisplayProps) {
  const [randomImage, setRandomImage] = useState(initialImage);

  useEffect(() => {
    if (!initialImage) {
      setRandomImage(generateRandomImagePath());
    }
  }, [initialImage]);

  const generateRandomImagePath = () => {
    const randomImageNumber = Math.floor(Math.random() * 6) + 1;
    return `/backgrounds/CyberneticLandscape${randomImageNumber}.png`;
  };

  return randomImage ? (
    <Image
      src={randomImage}
      alt="Background Image"
      className="opacity-70"
      fill
      style={{ zIndex: -1, objectFit: "cover", width: "100%", height: "100%" }}
    />
  ) : null;
}

export default RandomImageDisplay;
