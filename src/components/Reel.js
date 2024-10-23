import React from "react";

// Use forwardRef to pass down the ref to the DOM element
const Reel = React.forwardRef(({ id }, ref) => {
    return <div id={id} className="reel" ref={ref}></div>;
});

export default Reel;
