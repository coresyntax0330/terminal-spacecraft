import React, { useState } from "react";
import Image from "next/image";
import styles from "@/assets/css/layout/footerSection.module.css";

const FooterMobileButton = ({
  defaultImg,
  hoverImg,
  pressImg,
  alt,
  className,
  style,
  onClick,
}) => {
  const [state, setState] = useState("default");

  const handlePointerEnter = () => setState("hover");
  const handlePointerLeave = () => setState("default");
  const handlePointerDown = () => setState("pressed");
  const handlePointerUp = () => setState("default");

  const getImage = () => {
    switch (state) {
      case "hover":
        return hoverImg || defaultImg;
      case "pressed":
        return pressImg || defaultImg;
      default:
        return defaultImg;
    }
  };

  return (
    <div
      className={styles.buttonItem}
      style={style}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Image
        src={getImage()}
        alt={alt}
        className={className}
        priority
        quality={100}
      />
    </div>
  );
};

export default FooterMobileButton;
