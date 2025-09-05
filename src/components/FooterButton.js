import React, { useState } from "react";
import Image from "next/image";
import styles from "@/assets/css/layout/footerSection.module.css";

const FooterButton = ({
  defaultImg,
  hoverImg,
  pressImg,
  alt,
  className,
  style,
  onClick,
}) => {
  const [state, setState] = useState("default");

  const handleMouseEnter = () => setState("hover");
  const handleMouseLeave = () => setState("default");
  const handleMouseDown = () => setState("pressed");
  const handleMouseUp = () => setState("hover"); // back to hover after click

  const getImage = () => {
    switch (state) {
      case "hover":
        return hoverImg;
      case "pressed":
        return pressImg;
      default:
        return defaultImg;
    }
  };

  return (
    <div
      className={styles.buttonItem}
      style={style}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Image src={getImage()} alt={alt} className={className} priority />
    </div>
  );
};

export default FooterButton;
