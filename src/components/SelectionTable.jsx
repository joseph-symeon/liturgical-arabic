import React, { useEffect, useRef } from 'react';
import './selection-table.css';

function SelectionCheckbox({ checked, indeterminate = false, disabled = false, label, name, type = 'checkbox', onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className="selection-checkbox" title={label}>
      <input
        ref={inputRef}
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onClick={type === 'radio' ? onChange : undefined}
        onChange={type === 'radio' ? () => {} : onChange}
      />
      <span aria-hidden="true" />
    </label>
  );
}

export default function SelectionTable({
  ariaLabel,
  columns,
  rows,
  selectedRowIds,
  allSelected: allSelectedOverride,
  someSelected: someSelectedOverride,
  selectionMode = 'multiple',
  onToggleRow,
  onToggleAll,
  getRowId = row => row.id,
  isRowDisabled = () => false,
  getRowClassName = () => '',
  selectAllLabel = 'Select all rows',
  mobileLayout = null,
  mobileSelectAllLabel = selectAllLabel,
  className = ''
}) {
  const selectedIds = selectedRowIds instanceof Set
    ? selectedRowIds
    : new Set(selectedRowIds || []);
  const enabledRows = rows.filter((row, index) => !isRowDisabled(row, index));
  const selectedEnabledCount = enabledRows.reduce((count, row) => (
    count + (selectedIds.has(getRowId(row)) ? 1 : 0)
  ), 0);
  const allSelected = allSelectedOverride ?? (
    enabledRows.length > 0 && selectedEnabledCount === enabledRows.length
  );
  const someSelected = someSelectedOverride ?? (selectedEnabledCount > 0 && !allSelected);
  const isSingleSelect = selectionMode === 'single';

  return (
    <div className={[
      'selection-table-frame',
      mobileLayout ? `selection-table-mobile-${mobileLayout}` : '',
      className
    ].filter(Boolean).join(' ')}>
      <table className="selection-table" aria-label={ariaLabel}>
        <colgroup>
          <col className="selection-table-checkbox-column" />
          {columns.map(column => (
            <col key={column.key} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="selection-table-checkbox-cell">
              {!isSingleSelect && (
                <SelectionCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={enabledRows.length === 0}
                  label={selectAllLabel}
                  onChange={onToggleAll}
                />
              )}
              {!isSingleSelect && (
                <span className="selection-table-mobile-select-all-label">
                  {mobileSelectAllLabel}
                </span>
              )}
            </th>
            {columns.map(column => (
              <th key={column.key} scope="col" className={column.className || ''}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const rowId = getRowId(row);
            const selected = selectedIds.has(rowId);
            const disabled = isRowDisabled(row, rowIndex);
            return (
              <tr
                key={rowId}
                className={[
                  selected ? 'is-selected' : '',
                  disabled ? 'is-disabled' : '',
                  getRowClassName(row, rowIndex)
                ].filter(Boolean).join(' ')}
                onClick={event => {
                  if (disabled || event.target.closest('label, button, a, input')) return;
                  onToggleRow?.(row, rowIndex);
                }}
              >
                <td className="selection-table-checkbox-cell">
                  <SelectionCheckbox
                    checked={selected}
                    disabled={disabled}
                    label={`${isSingleSelect ? 'Open' : selected ? 'Deselect' : 'Select'} ${row.selectionLabel || rowId}`}
                    name={isSingleSelect ? `${ariaLabel}-selection` : undefined}
                    type={isSingleSelect ? 'radio' : 'checkbox'}
                    onChange={() => onToggleRow?.(row, rowIndex)}
                  />
                </td>
                {columns.map(column => (
                  <td key={column.key} className={column.className || ''}>
                    {column.render ? column.render(row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
