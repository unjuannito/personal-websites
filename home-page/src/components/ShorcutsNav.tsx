import { useEffect, useState } from 'react';
import Shortcut from './Shortcut';
import SortableContainer from './dnd/SortableContainer';
import EditShortcutDialog from './settings/EditShortcutDialog';
import plusIcon from '../assets/plus.svg';
import type { ShortcutData, LayoutConfig } from '../types';

export default function ShorcutsNav() {
  const [shortcuts, setShortcuts] = useState<ShortcutData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | 'new' | null>(null);
  const [showBlur, setShowBlur] = useState(true);
  const [layout, setLayout] = useState<LayoutConfig>({
    pc: { rows: 2, cols: 7 },
    tablet: { rows: 3, cols: 4 },
    mobile: { rows: 4, cols: 2 }
  });
  const [currentLayoutType, setCurrentLayoutType] = useState<'pc' | 'tablet' | 'mobile'>('pc');

  const loadData = () => {
    const storedShortcuts = localStorage.getItem('shortcuts');
    if (storedShortcuts) setShortcuts(JSON.parse(storedShortcuts));

    const storedLayout = localStorage.getItem('layoutConfig');
    if (storedLayout) setLayout(JSON.parse(storedLayout));

    const storedSearch = localStorage.getItem('searchSettings');
    if (storedSearch) {
      const parsed = JSON.parse(storedSearch);
      if (parsed.showBlur !== undefined) setShowBlur(parsed.showBlur);
    }
  };

  useEffect(() => {
    loadData();

    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCurrentLayoutType('pc');
      } else if (width >= 768) {
        setCurrentLayoutType('tablet');
      } else {
        setCurrentLayoutType('mobile');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('storage-update', loadData);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage-update', loadData);
    };
  }, []);

  const handleReorder = (newShortcuts: ShortcutData[]) => {
    setShortcuts(newShortcuts);
    localStorage.setItem('shortcuts', JSON.stringify(newShortcuts));
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleEditShortcut = (index: number | 'new', updatedShortcut: ShortcutData) => {
    let updated: ShortcutData[];
    if (index === 'new') {
      updated = [...shortcuts, updatedShortcut];
    } else {
      updated = [...shortcuts];
      updated[index] = updatedShortcut;
    }
    setShortcuts(updated);
    localStorage.setItem('shortcuts', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage-update'));
    setEditingIndex(null);
  };

  const handleDeleteShortcut = (index: number) => {
    const updated = shortcuts.filter((_, i) => i !== index);
    setShortcuts(updated);
    localStorage.setItem('shortcuts', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage-update'));
  };

  // Generar clases de grid dinámicas
  const gridStyle = {
    '--cols-pc': layout.pc.cols,
    '--rows-pc': layout.pc.rows,
    '--cols-tablet': layout.tablet.cols,
    '--rows-tablet': layout.tablet.rows,
    '--cols-mobile': layout.mobile.cols,
    '--rows-mobile': layout.mobile.rows,
  } as React.CSSProperties;

  const maxItems = layout[currentLayoutType].rows * layout[currentLayoutType].cols;
  const currentItems = shortcuts.slice(0, maxItems);
  const hasSpace = shortcuts.length < maxItems;

  return (
    <nav
      className={`p-6 bg-black/20 rounded-3xl min-h-[250px] transition-all duration-300 ${showBlur ? 'backdrop-blur-sm' : ''}`}
      style={gridStyle}
    >
      <div className="grid grid-cols-[repeat(var(--cols-mobile),minmax(0,1fr))] grid-rows-[repeat(var(--rows-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--cols-tablet),minmax(0,1fr))] md:grid-rows-[repeat(var(--rows-tablet),minmax(0,1fr))] lg:grid-cols-[repeat(var(--cols-pc),minmax(0,1fr))] lg:grid-rows-[repeat(var(--rows-pc),minmax(0,1fr))] gap-4">
        <SortableContainer
          items={currentItems}
          onReorder={handleReorder}
          className="contents"
          renderItem={(shortcut, index, isDragging) => (
            <Shortcut
              name={shortcut.name}
              url={shortcut.url}
              imageURl={shortcut.imageURl}
              isDragging={isDragging}
              onEdit={() => setEditingIndex(index)}
              onDelete={() => handleDeleteShortcut(index)}
            />
          )}
        />

        {hasSpace && (
          <button
            onClick={() => setEditingIndex('new')}
            className="flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 rounded-2xl gap-2 hover:bg-white/10 hover:border-white/20 transition-all group min-h-[120px]"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full group-hover:scale-110 transition-transform">
              <img src={plusIcon} alt="Add new" className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity invert" />
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider group-hover:text-white/80 transition-colors">
              Add Shortcut
            </span>
          </button>
        )}
      </div>

      <EditShortcutDialog
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        shortcut={editingIndex !== null && editingIndex !== 'new' ? shortcuts[editingIndex] : null}
        onSave={(updated) => editingIndex !== null && handleEditShortcut(editingIndex, updated)}
      />
    </nav>
  );
}
