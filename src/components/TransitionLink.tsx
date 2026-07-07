"use client";

import React from "react";
import { useTransition } from "./TransitionProvider";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    direction?: "left" | "right";
}

export function TransitionLink({ href, children, className, onClick, direction = "right", ...props }: TransitionLinkProps) {
    const { navigate } = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onClick) onClick(e);
        navigate(href, direction);
    };

    return (
        <a href={href} className={className} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}
