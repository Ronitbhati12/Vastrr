import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useContent } from '../context/ContentContext';
import { Pencil, Check, X } from 'lucide-react';

/**
 * EditableText — renders text normally for visitors.
 * When admin is logged in AND edit mode is ON, shows an inline edit overlay on click.
 * 
 * Props:
 *   contentKey — the key in ContentContext (e.g. "heroTitle1")
 *   as — the HTML element to render (default: "span")
 *   className — passthrough className
 *   children — fallback if no content found
 */
const EditableText = ({ contentKey, as: Tag = 'span', className = '', children, isProduct = false, productId = null, productField = null, ...rest }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const { content, updateContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const inputRef = useRef(null);

  let value = '';
  if (isProduct && productId !== null && productField) {
    const product = content.products?.find(p => p.id === productId);
    value = product ? product[productField] : children ?? '';
  } else {
    value = content[contentKey] ?? children ?? '';
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = (e) => {
    if (!isAdmin || !isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setTempValue(value);
    setIsEditing(true);
  };

  const save = () => {
    if (isProduct && productId !== null && productField) {
      const updatedProducts = content.products.map(p => 
        p.id === productId ? { ...p, [productField]: tempValue } : p
      );
      updateContent('products', updatedProducts);
    } else {
      updateContent(contentKey, tempValue);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  // Not admin or not edit mode — just render normally
  if (!isAdmin || !isEditMode) {
    return <Tag className={className} {...rest}>{value}</Tag>;
  }

  // Admin in edit mode — show editable wrapper
  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1 relative" style={{ zIndex: 9999 }}>
        <input
          ref={inputRef}
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white border-2 border-[#9B4819] rounded-lg px-3 py-1.5 text-sm font-medium text-[#1A1A1A] outline-none shadow-lg min-w-[120px]"
          style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
        />
        <button
          onClick={save}
          className="w-7 h-7 flex items-center justify-center bg-[#9B4819] text-white rounded-lg hover:bg-[#7a3a13] transition-colors shadow-md"
        >
          <Check size={14} />
        </button>
        <button
          onClick={cancel}
          className="w-7 h-7 flex items-center justify-center bg-[#E5E5E5] text-[#555] rounded-lg hover:bg-[#CCC] transition-colors shadow-md"
        >
          <X size={14} />
        </button>
      </span>
    );
  }

  // Admin edit mode — show with edit indicator
  return (
    <Tag
      className={`${className} relative cursor-pointer group/edit`}
      onClick={startEditing}
      title="Click to edit"
      {...rest}
    >
      {value}
      <span className="absolute -top-1 -right-1 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="flex items-center justify-center w-5 h-5 bg-[#9B4819] text-white rounded-full shadow-lg">
          <Pencil size={10} />
        </span>
      </span>
      <span className="absolute inset-0 border-2 border-dashed border-[#9B4819]/0 group-hover/edit:border-[#9B4819]/40 rounded-lg transition-all duration-200 pointer-events-none" />
    </Tag>
  );
};

export default EditableText;
