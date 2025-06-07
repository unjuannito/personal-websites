import { use, useEffect, useState } from "react"
import Shortcut from "./Shortcut";
import ShortcutDialog from "./ShortcutDialog";
import "./Shortcuts.css";
import isValidURL from '../../utils/isValidURL';// se usa asi isValidURL(url) devuelve false si no lo es devuelve la url bien formataeeada si sí lo es

export default function ShortcutsManager() {
    const [shortcuts, setShortcuts] = useState([]); //array of shortcuts
    const [dialog, setDialog] = useState({ open: false, index: false });
    const [draggedIndex, setDraggedIndex] = useState(null);

    //useEffect to get the shortcuts from the local storage
    useEffect(() => {
        const shortcuts = JSON.parse(localStorage.getItem("shortcuts"));
        if (shortcuts) {
            setShortcuts(shortcuts);
        }
    }, []);

    const addShortcut = (name, url) => {
        const newShortcuts = [...shortcuts, { name, url: isValidURL(url), imageURl: `https://www.google.com/s2/favicons?domain=${isValidURL(url)}/&sz=128` }];
        setShortcuts(newShortcuts);
        localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
    }

    const modifyShortcut = (shortcut) => {
        const newShortcuts = [...shortcuts];
        newShortcuts[shortcut.index] = { name: shortcut.name, url: isValidURL(shortcut.url), imageURl: `https://www.google.com/s2/favicons?domain=${isValidURL(shortcut.url)}/&sz=128` }
        setShortcuts(newShortcuts);
        localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));

    }

    const deleteShortcut = (index) => {
        const newShortcuts = [...shortcuts];
        newShortcuts.splice(index, 1);
        setShortcuts(newShortcuts);
        localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
    }

    const openDialog = (index) => {
        setDialog({ open: true, index: index });
    }

    const closeDialog = () => {
        setDialog({ open: false, index: false });
    }

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = "move";
        setDraggedIndex(index);
    };

    const handleDragOver = (e, overIndex) => {
        e.preventDefault();

        if (draggedIndex === null || overIndex === draggedIndex) return;

        // Reordenar elementos
        const newShortcuts = [...shortcuts];
        const itemToMove = newShortcuts.splice(draggedIndex, 1)[0];
        newShortcuts.splice(overIndex, 0, itemToMove);

        setShortcuts(newShortcuts);
        setDraggedIndex(overIndex);
    };

    const handleDragEnd = () => {
        localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
        setDraggedIndex(null);
    };

    return (
        <div className="shortcutsManager">
            {shortcuts.map((shortcut, index) => (
                <Shortcut
                    key={index}
                    index={index}
                    name={shortcut.name}
                    url={shortcut.url}
                    imageURl={shortcut.imageURl}
                    deleteShortcut={deleteShortcut}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    isDragging={index === draggedIndex}
                    openDialog={openDialog}
                />
            ))}
            {
                shortcuts.length < 14 && <Shortcut url="#new" openDialog={openDialog} index={shortcuts.length} />
            }
            <ShortcutDialog open={dialog.open} addShortcut={addShortcut} closeDialog={closeDialog} deleteShortcut={deleteShortcut} modifyShortcut={modifyShortcut} shortcut={dialog.index !== false ? { index: dialog.index, ...shortcuts[dialog.index] } : false} />

        </div>
    )
}
