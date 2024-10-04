"use client";
import { useEffect } from "react";

interface LineSpinnerProps {
  size?: number;
  color?: string;
}

const LineSpinner: React.FC<LineSpinnerProps> = ({
  size = 25,
  color = "white",
}) => {
  useEffect(() => {
    async function getLoader() {
      const { lineSpinner } = await import("ldrs");
      lineSpinner.register();
    }
    getLoader();
  }, []);

  return (
    <l-line-spinner
      size={size.toString()}
      stroke="1"
      speed="0.9"
      color={color}
    ></l-line-spinner>
  );
};

export default LineSpinner;
