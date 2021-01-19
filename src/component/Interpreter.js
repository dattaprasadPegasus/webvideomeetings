import React from 'react'
import './Component.css'
function Interpreter(props){
    return(
        <div className="Interpreter-Div-Container">
            <span className="title-interpreter">Languages</span>

            <ul className="list-text">
                <li>Original Audio</li>
                <li>Arabic</li>
                <li>Cantonese</li>
                <li>French</li>
                <li>Korean</li>
                <li>Portuguese</li>
                <li>Spanish</li>
                <li>Russian</li>
            </ul>
                <div className="divider-white"></div>
            <span className="title-interpreter">Sign Languages</span>
            <ul className="list-text">
                <li>American Sign</li>
                <li>Spanish Sign</li>
                <li>French Sign</li>
            </ul>
        </div>
    )
}

export default Interpreter