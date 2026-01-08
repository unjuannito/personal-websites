import { WELCOME_IMAGE_ALT, WELCOME_SUBTITLE, WELCOME_TITLE } from "../utils/Constants";
import userIcon from "/src/assets/user-icon.jpg"
import "/src/styles/WelcomeHeader.css"

export default function WelcomeHeader() {

    return (
        <header>
            <img src={userIcon} alt={WELCOME_IMAGE_ALT} />
            <h1>{WELCOME_TITLE}</h1>
            <h2>{WELCOME_SUBTITLE}</h2>
        </header>
    )
}