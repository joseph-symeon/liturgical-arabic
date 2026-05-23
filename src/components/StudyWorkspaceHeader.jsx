import React from 'react';

export default function StudyWorkspaceHeader({
  title,
  subtitle,
  actions = null,
  className = ''
}) {
  return (
    <div className={['lp-workspace-header', className].filter(Boolean).join(' ')}>
      <div className="lp-workspace-heading">
        <div className="lp-workspace-title">{title}</div>
        {subtitle && <div className="lp-workspace-subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="lp-workspace-actions">{actions}</div>}
    </div>
  );
}
