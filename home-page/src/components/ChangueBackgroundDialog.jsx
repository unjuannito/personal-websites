import { useEffect, useState } from "react";
import crossIcon from "../assets/cross.svg";

export default function ChangueBackgroundDialog({ open, closeDialog}) {
    const [backgrounds, setBackgrounds] = useState([]);
    
    useEffect(() => {
        const newBackgrounds = JSON.parse(localStorage.getItem("backgrounds"));
        if (newBackgrounds) {
            setBackgrounds(newBackgrounds);
        }
    }, []);

    useEffect(() => {
        const selectedBackground = JSON.parse(localStorage.getItem("selectedBackground"));
        if (selectedBackground != null) {
            document.body.style.backgroundImage = `url(${backgrounds[selectedBackground]})`;
            const backgroundsElement = document.querySelectorAll(".background");
            backgroundsElement.forEach(element => {
                if (element.children[1].src === backgrounds[selectedBackground]) {
                    element.children[1].className = "selected";
                }
        });
        }    
    }, [backgrounds]);

    const handleUploadBackground = event => {
        event.preventDefault();
        //guardar la iamgen en el local storage en formato base64
        event.preventDefault();
        const file = document.getElementById("file").files[0];
        if (!file) {
            console.log("No file selected");
            return;
        }    
        const reader = new FileReader();
        reader.onloadend = () => {
            //comprobar que la imagen no este en el array de imagenes de localstorage
            let newBackgrounds = JSON.parse(localStorage.getItem("backgrounds"));
            if (!newBackgrounds) newBackgrounds = []; 
            if (newBackgrounds.includes(reader.result)) {
                console.log("Image already exists");
                return;
            }else {
                console.log("Image added");
                newBackgrounds.push(reader.result);
                localStorage.setItem("backgrounds", JSON.stringify(newBackgrounds));
                setBackgrounds(newBackgrounds);
            }
            //delete file in input
            document.getElementById("file").value = "";
        }
        reader.readAsDataURL(file);
    }

    const handleSelectBackground = event => {
        const backgroundImg = event.target;
        backgroundImg.parentElement.parentElement.childNodes.forEach(child => {
            if (child.children[1].className === "selected") {
                child.children[1].className = "";
            }
        });
        backgroundImg.className = "selected";
        const newBackgroundSrc = backgroundImg.src;
        document.body.style.backgroundImage = `url(${newBackgroundSrc})`;
        localStorage.setItem("selectedBackground", JSON.stringify(backgrounds.indexOf(newBackgroundSrc)));
    }

    const handleRemoveBackground = () => {
        document.body.style.backgroundImage = "";
        localStorage.removeItem("selectedBackground");
        const backgroundsElement = document.querySelectorAll(".background");
        backgroundsElement.forEach(element => {
            element.children[1].className = "";
        });
    }

    const handleDeleteBackground = event => {
        const backgroundSrc = event.target.parentElement.children[1].src;
        const newBackgrounds = [...backgrounds].filter(background => background !== backgroundSrc);
        localStorage.setItem("backgrounds", JSON.stringify(newBackgrounds));
        setBackgrounds(newBackgrounds);
        // Edit the selected background
        const selectedBackground = JSON.parse(localStorage.getItem("selectedBackground"));
        if (selectedBackground != null) {
            if (backgroundSrc === backgrounds[selectedBackground]) {
                document.body.style.backgroundImage = "";
                localStorage.removeItem("selectedBackground");
            }else if (backgrounds.indexOf(backgroundSrc) < selectedBackground) {
                localStorage.setItem("selectedBackground", JSON.stringify(selectedBackground - 1));
            }
        }
    }

    return (
        <dialog className="changueBackgroundDialog" open={open}>
            <input type="file" id="file" onChange={handleUploadBackground}/>
            <div className="backgroudsSaved">
                {backgrounds.map((background, index) => (
                    <section key={index} className="background">
                        <img className="cross" src={crossIcon} alt="Eliminar fondo" onClick={handleDeleteBackground}/>
                        <img src={background} alt={`Fondo ${index}`} onClick={handleSelectBackground}/>
                    </section>
                ))}
            </div>
            <button onClick={closeDialog}>Hecho</button>
            <button onClick={handleRemoveBackground}>Quitar fondo actual</button>
        </dialog>
    )
}