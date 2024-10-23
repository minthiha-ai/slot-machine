import React, { useState, useEffect, useRef, useCallback } from "react";
import Reel from "./Reel";

const SlotMachine = () => {
    const [indexes, setIndexes] = useState([0, 0, 0, 0, 0]);
    const numIcons = 9;
    const iconHeight = 79;
    const timePerIcon = 100;

    // Using refs to store each reel DOM element
    const reelRefs = useRef([]);

    // Function to handle spinning a reel
    const roll = useCallback((reel, offset = 0) => {
        const delta = (offset + 2) * numIcons + Math.round(Math.random() * numIcons);
        const style = getComputedStyle(reel);
        const backgroundPositionY = parseFloat(style["backgroundPositionY"]) || 0;
        const targetBackgroundPositionY = backgroundPositionY + delta * iconHeight;
        const normalTargetBackgroundPositionY = targetBackgroundPositionY % (numIcons * iconHeight);

        return new Promise((resolve) => {
            reel.style.transition = `background-position-y ${8 + delta * timePerIcon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

            setTimeout(() => {
                reel.style.transition = "none";
                reel.style.backgroundPositionY = `${normalTargetBackgroundPositionY}px`;
                resolve(delta % numIcons);
            }, 8 + delta * timePerIcon);
        });
    }, [numIcons, iconHeight, timePerIcon]);

    // Function to roll all reels
    const rollAll = useCallback(() => {
        const reelsList = reelRefs.current; // Access all the reels using refs

        Promise.all(reelsList.map((reel, i) => roll(reel, i))).then((deltas) => {
            const updatedIndexes = deltas.map((delta, i) => (indexes[i] + delta) % numIcons);
            setIndexes(updatedIndexes);

            // Check win conditions
            if (updatedIndexes[0] === updatedIndexes[1] || updatedIndexes[1] === updatedIndexes[2]) {
                const winClass = updatedIndexes[0] === updatedIndexes[2] ? "win2" : "win1";
                document.querySelector(".slots").classList.add(winClass);
                setTimeout(() => document.querySelector(".slots").classList.remove(winClass), 2000);
            }

            setTimeout(rollAll, 3000); // Repeat rolling every 3 seconds
        });
    }, [indexes, roll, numIcons]);

    // Start rolling when the component mounts
    useEffect(() => {
        rollAll();
    }, [rollAll]);

    return (
        <div className="slots">
            {[...Array(5)].map((_, i) => (
                <Reel
                    key={i}
                    id={`reel-${i}`}
                    ref={(el) => (reelRefs.current[i] = el)} // Storing the DOM element in the refs
                />
            ))}
        </div>
    );
};

export default SlotMachine;
