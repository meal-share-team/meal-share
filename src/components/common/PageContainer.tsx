import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

function PageContainer({
  title,
  description,
  children,
}: PageContainerProps) {
  return (
    <section className="page-container">
      <h1 className="page-container__title">{title}</h1>
      <p className="page-container__description">{description}</p>
      {children}
    </section>
  );
}

export default PageContainer;