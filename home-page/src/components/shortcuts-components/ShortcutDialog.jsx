import { useEffect, useState } from "react";
import isValidURL from '../../utils/isValidURL';// se usa asi isValidURL(url) devuelve false si no lo es devuelve la url bien formataeeada si sí lo es

export default function ShortcutDialog({
  open,
  onClose,
  addShortcut,
  closeDialog,
  deleteShortcut,
  shortcut,
  modifyShortcut
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  // Sincronizar el estado cuando se abre el diálogo o cambia el shortcut
  useEffect(() => {
    if (open) {
      if (shortcut) {
        setName(shortcut.name);
        setUrl(shortcut.url);
      } else {
        setName("");
        setUrl("");
      }
    }
  }, [open, shortcut]);

  const handleDone = () => {
    if (name == "") {
      alert("Tienes que introducir un nombre")
    } else if (url == "" || !isValidURL(url)) {
      alert("Tienes que introducir una url valida")
    } else {
      if (shortcut) {
        modifyShortcut({ ...shortcut, name, url });
      } else {
        addShortcut(name, url);
      }
      closeDialog();
    }
  };

  const handleDeleteShortcut = () => {
    deleteShortcut(shortcut.index);
    closeDialog();
  };

  return (
    <dialog className="shortcutDialog" open={open}>
      <h3 className="span3">Acceso directo</h3>
      <label>
        Nombre
        <input
          type="text"
          placeholder="Google"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        URL
        <input
          type="text"
          placeholder="https://www.google.com/"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      {
        isValidURL(url) ? <img src={`https://www.google.com/s2/favicons?domain=${isValidURL(url)}/&sz=128`} alt="Imagen del acceso directo" /> : <></>

      }
      <button onClick={closeDialog} className={shortcut ? "span2" : "span3"}>Cancelar</button>
      {shortcut ? 
        <button onClick={handleDeleteShortcut} className="span2">Eliminar</button>
        : 
        <></>
      }
      <button onClick={handleDone} className={shortcut ? "span2" : "span3"}>Hecho</button>
    </dialog>
  );
}