import { Github, Gmail, Linkedin } from "./Icon";
import style from '../Styling/ContactPanel.module.css';

 const ContactPanel =()=>{
    const moveToGitHub=()=>{
        window.location.href='https://github.com/anushka30aug';
    } 
    const moveToLinkedIn=()=>{
        window.location.href='https://www.linkedin.com/in/anushka-shukla-00a367280';
    }
    const sendEmail = () => {
        window.open('mailto:anushkashukla3003@gmail.com')
    }
    return(
        <div className={style.contact_panel} >
            <h3>Contact Us</h3>
            <div className={style.contact_list}>
            <li onClick={moveToLinkedIn}><Linkedin/></li>
            <li onClick={moveToGitHub}><Github/></li>
            <li onClick={sendEmail}><Gmail/></li>
            </div>
            <h4>Created by Anushka Shukla</h4>
            <p>(This website is developed solely to showcase my skills in MERN stack and is not ready for professional use.)</p>
        </div>

    )
}

export default ContactPanel;