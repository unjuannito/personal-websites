import React, { useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';

interface ShortcutProps {
  name: string;
  url: string;
  imageURl: string;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function Shortcut({
  name,
  url,
  imageURl,
  isDragging,
  onEdit,
  onDelete
}: ShortcutProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const handleCloseAll = () => setContextMenu(null);
    window.addEventListener('close-all-menus', handleCloseAll);
    return () => window.removeEventListener('close-all-menus', handleCloseAll);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isDragging) return;
    e.preventDefault();
    // Notificar a otros menús que se cierren
    window.dispatchEvent(new Event('close-all-menus'));
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const menuItems = [
    { label: 'Abrir', onClick: () => window.location.href = url },
    { label: 'Abrir en nueva pestaña', onClick: () => window.open(url, '_blank') },
    { label: 'Copiar dirección de enlace', onClick: handleCopyLink },
    { label: 'Separator', onClick: () => { }, isSeparator: true },
    { label: 'Editar Shortcut', onClick: () => onEdit?.() },
    { label: 'Eliminar Shortcut', onClick: () => onDelete?.(), className: 'text-red-400 hover:bg-red-500/10' },
  ];

  return (
    <>
      <a
        href={url}
        rel="noopener noreferrer"
        draggable="false"
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
          }
        }}
        onContextMenu={handleContextMenu}
        className={`flex flex-col items-center justify-center p-[var(--shortcut-padding)] rounded-2xl hover:bg-white/15 transition-all duration-200 group
                    ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
      >
        <div
          className="p-[var(--shortcut-icon-padding)] flex items-center justify-center bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors duration-200 pointer-events-none"
        >
          <img
            src={imageURl.trim().replace(/^`|`$/g, '')}
            alt={name}
            className="rounded-xl object-contain transition-all duration-200 w-[var(--shortcut-icon-size)] h-[var(--shortcut-icon-size)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=' + url + '&sz=128';
            }}
          />
        </div>
        <span className="text-[10px] md:text-xs lg:text-sm text-white/80 text-center truncate w-full group-hover:text-white pointer-events-none h-[var(--shortcut-text-height)] flex items-center justify-center">
          {name}
        </span>
      </a>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={menuItems}
        />
      )}
    </>
  );
}
