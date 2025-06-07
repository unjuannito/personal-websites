import plusIcon from "../../assets/plus.svg";
import threeDots from "../../assets/ellipsis-vertical.svg";

export default function Shortcut({
    name,
    url,
    imageURl,
    deleteShortcut,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
    openDialog,
    index
}) {

    const handleEditShorcut = event => {
        event.preventDefault();
        openDialog(index);
    }

    const addShorcut = event => {
        event.preventDefault();
        openDialog(false);
    }

    return (
        url == "#new" ?
            <a className={`shortcut ${index == 0 ? "" : "hidden"}`} onClick={addShorcut}>
                <img src={plusIcon} alt={`Icono para añadir acceso directo`} />
                <h3>Acceso directo</h3>
            </a>
            :
            <a
                href={url}
                className={`shortcut ${isDragging ? "dragging" : ""}`}
                draggable
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <img className="editShortcut" width="5px" src={threeDots} alt="Editar acceso directo" onClick={handleEditShorcut} />
                <img src={imageURl} alt={`Icono de ${name}`} />
                <h3>{name}</h3>
            </a>
    );
}