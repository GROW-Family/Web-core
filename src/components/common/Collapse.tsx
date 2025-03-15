import React from "react";
import clsx from "clsx";

type TProps = {
  children: React.ReactNode;
  open: boolean;
};

const Collapse: React.FC<TProps> = ({ children, open }) => {
  return (
    <div className={clsx("grid overflow-hidden transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
};

export default Collapse;
