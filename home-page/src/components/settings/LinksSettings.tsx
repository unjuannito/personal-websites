import { useState } from 'react';
import type { ShortcutData } from '../../types';
import SortableContainer from '../dnd/SortableContainer';
import EditShortcutDialog from './EditShortcutDialog';
import plusIcon from '../../assets/plus.svg';

interface LinksSettingsProps {
  shortcuts: ShortcutData[];
  onDeleteShortcut: (index: number) => void;
  onReorderShortcuts: (newShortcuts: ShortcutData[]) => void;
  onEditShortcut: (index: number, updatedShortcut: ShortcutData) => void;
  onAddShortcut: (newShortcut: ShortcutData) => void;
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
}

export default function LinksSettings({
  shortcuts,
  onDeleteShortcut,
  onReorderShortcuts,
  onEditShortcut,
  onAddShortcut,
  dialogRef
}: LinksSettingsProps) {
  const [editingIndex, setEditingIndex] = useState<number | 'new' | null>(null);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleAddNewClick = () => {
    setEditingIndex('new');
  };

  const handleSaveEdit = (updatedShortcut: ShortcutData) => {
    if (editingIndex === 'new') {
      onAddShortcut(updatedShortcut);
    } else if (editingIndex !== null) {
      onEditShortcut(editingIndex, updatedShortcut);
    }
    setEditingIndex(null);
  };

  return (
    <main className="p-4 md:p-8 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 p-1">Current Shortcuts (Drag to reorder)</h3>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
          <SortableContainer
            items={shortcuts}
            onReorder={onReorderShortcuts}
            className="contents"
            portalContainer={dialogRef?.current}
            renderItem={(s, i, isDragging) => (
              <section className={`flex items-center bg-white/5 p-3 rounded-xl gap-2 h-full ${isDragging ? 'opacity-50' : ''}`}>
                <div className="flex flex-col items-center gap-3 p-2 flex-1 min-w-0">
                  <div className="w-24 h-24 mb-2 flex items-center justify-center bg-white/5 rounded-lg transition-colors pointer-events-none">
                    <img
                      src={s.imageURl.trim().replace(/^`|`$/g, '')}
                      alt={s.name}
                      className="w-16 h-16 rounded-xl object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=' + s.url + '&sz=128';
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white/80 text-center truncate w-full pointer-events-none">
                    {s.name}
                  </span>
                </div>
                <menu className='flex flex-col gap-2'>
                  <button
                    onClick={() => handleEditClick(i)}
                    className="text-blue-400 hover:text-blue-300 p-2 text-xs font-medium bg-white/5 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteShortcut(i)}
                    className="text-red-400 hover:text-red-300 p-2 text-xs font-medium bg-white/5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </menu>
              </section>
            )}
          />

          {/* Botón para añadir nuevo */}
          <button
            onClick={handleAddNewClick}
            className="flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 p-3 rounded-xl gap-2 h-full hover:bg-white/10 hover:border-white/20 transition-all group min-h-[180px]"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-full group-hover:scale-110 transition-transform">
              <img src={plusIcon} alt="Add new" className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm font-semibold text-white/40 group-hover:text-white/80 transition-colors">
              Add New Shortcut
            </span>
          </button>
        </div>
      </div>

      <EditShortcutDialog
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        shortcut={editingIndex !== null && editingIndex !== 'new' ? shortcuts[editingIndex] : null}
        onSave={handleSaveEdit}
      />
    </main>
  );
}
