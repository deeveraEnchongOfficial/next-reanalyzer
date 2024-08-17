import React from "react";

interface HeaderProps {
  header: string;
  className?: string;
  as?: "h1" | "h2";
}

const Header: React.FC<HeaderProps> = ({ header, className, as = "h2" }) => {
  return as === "h1" ? (
    <h1 className={`text-2xl font-bold ${className}`}>{header}</h1>
  ) : (
    <h2 className={`text-xl font-bold ${className}`}>{header}</h2>
  );
};

export default Header;
