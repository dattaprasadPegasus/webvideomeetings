import React from 'react'

function Button(props){
    return(
        <Button variant="contained" color="primary" onClick={props.onClick} style={{ margin: "20px" }}>
            {props.title}
            </Button>
    )
}