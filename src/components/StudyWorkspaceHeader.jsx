import React from 'react';

export default function StudyWorkspaceHeader({
  title = null,
  subtitle,
  actions = null,
  className = ''
}) {
  const hasHeading = Boolean(title || subtitle);
  return (
    <div className={['lp-workspace-header', className].filter(Boolean).join(' ')}>
      {hasHeading && (
        <div className="lp-workspace-heading">
          {title && <div className="lp-workspace-title">{title}</div>}
          {subtitle && <div className="lp-workspace-subtitle">{subtitle}</div>}
        </div>
      )}
      {actions && <div className="lp-workspace-actions">{actions}</div>}
    </div>
  );
}
