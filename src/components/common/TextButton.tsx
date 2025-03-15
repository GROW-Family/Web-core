import React from "react";
import clsx from "clsx";

import { getColor } from "@utils/StyleUtils";
import { openRoute, pushRoute, replaceRoute } from "@/utils/RouterUtils";

import Tooltip from "./Tooltip";

import { TextButtonProps } from "@/models/ComponentModels";

const TextButton: React.FC<TextButtonProps> = ({
  text,
  color,
  tooltip,
  disabled,
  className,
  style,
  href,
  target = "new",
  onClick,
  noUnderline,
}) => {
  if (!text) return null;

  const handleClick = (event: React.MouseEvent) => {
    if (!disabled) {
      if (href) {
        switch (target) {
          case "replace":
            replaceRoute(href, { event: event.nativeEvent }); 
            break;
          case "push":
            pushRoute(href, { event: event.nativeEvent });
            break;
          default:
            openRoute(href, target);
            break;
        }
      } else {
        onClick?.(event);
      }
    }
  };
  

  const isLinkBtn = href && !disabled;
  const btnClassName = clsx(
    "cursor-pointer whitespace-nowrap",
    { "opacity-50 cursor-not-allowed": disabled },
    className
  );

  const txtProps = {
    style: { ...(color && { color: getColor(color) }), ...style },
    className: clsx("transition-opacity hover:opacity-80", !isLinkBtn && btnClassName),
    ...(href ? {} : { onClick: handleClick }),
  };

  let btnNode = <span {...txtProps}>{text}</span>;

  if (isLinkBtn) {
    btnNode = (
      <a
        href={href}
        className={btnClassName}
        {...(target === "new" && { target: "_blank" })}
        {...(noUnderline && { style: { textDecoration: "none" } })}
        onClick={handleClick}
      >
        {btnNode}
      </a>
    );
  }

  return tooltip ? <Tooltip {...tooltip}>{btnNode}</Tooltip> : btnNode;
};

export default TextButton;
