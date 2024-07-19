import React from 'react'

const Loader = () => {
  return (
    <div style={{width: "100vw", height:"100vh", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h2>Loading...</h2>
    </div>
  )
}

export default Loader