import type { ReactNode } from "react";
import React from "react";
import { Link } from "react-router-dom";

type RoleCardProps = {
  title: string;
  description: string;
  to: string;
  buttonText: string;
  icon?: ReactNode;
};

function RoleCard({
  title,
  description,
  to,
  buttonText,
  icon,
}: RoleCardProps) {
  return (
    <article className="role-card">
      <div className="role-card__icon">{icon}</div>
      <h2 className="role-card__title">{title}</h2>
      <p className="role-card__description">{description}</p>
      <Link to={to} className="role-card__button">
        {buttonText}
      </Link>
    </article>
  );
}

export default RoleCard;