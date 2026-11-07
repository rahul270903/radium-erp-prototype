import type { ReactNode } from 'react';

type Props = { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode };

export function SectionHeading({ eyebrow, title, subtitle, action }: Props) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}
