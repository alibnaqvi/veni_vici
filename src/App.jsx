import './App.css'
import React from "react";

function App() {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [bannedAttributes, setBannedAttributes] = React.useState([]);

    const handleClick = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const cat = await response.json();

            if (cat.length > 0) {
                setData(cat[0]);
            }

            else {
                setError(new Error('No cat found'));
            }
        }

        catch (error) {
            setError(error);
        }

        finally {
            setLoading(false);
        }
    };

    function handleHide(attribute, value) {
        setBannedAttributes(prev => [...prev, { attribute, value }]);
    };

    function isBanned(attribute, value) {
        return bannedAttributes.some(ban => ban.attribute === attribute && ban.value === value);
    };

    const isWidthBanned = () => isBanned('height', data.height);
    const isHeightBanned = () => isBanned('width', data.width);
    const isImgBanned = () => isBanned('url', data.url);

    return (
        <div className="root">
            <div className="whole-page">
                <h1> Trippin' on Cats </h1>
                <h3> Discover cats from your wildest dreams! </h3>
                <p>😺😸😹😻😼😽🙀😿😾</p>
                <br/>
                <div className="discover-container">
                    <div className="listing-container">
                        {loading ? (<p>Loading...</p>) : (data && (
                            <div>
                                {!isWidthBanned() && !isHeightBanned() && !isImgBanned() && (
                                    <p>
                                    <button onClick={() => handleHide('width', data.width)} className="attribute-buttons">Width: {data.width}</button>
                                </p>)}

                                {!isHeightBanned() && !isWidthBanned() && !isImgBanned() && (
                                    <p>
                                    <button onClick={() => handleHide('height', data.height)} className="attribute-buttons">Height: {data.height}</button>
                                </p>)}

                                {!isImgBanned() && !isWidthBanned() && !isHeightBanned() && (
                                    <p>
                                    <button onClick={() => handleHide('image', data.url)} className="attribute-buttons"><img src={data.url}
                                                                                     alt="An image of a cat."/></button>
                                </p>)}
                            </div>
                        ))} {error && <p>Error: {error.message}</p>}
                    </div>

                    <button className="discover-btn" onClick={handleClick}>🔀 Discover!</button>
                </div>
            </div>

            <div className="sideNav">
                <h2>Ban List</h2>
                <h4>Banned attributes:</h4>
                <ul>
                    {bannedAttributes.length === 0 ? (
                        <li>No attributes banned yet</li>
                    ) : (bannedAttributes.map((ban, index) => (
                            <li key={index}>
                                {ban.attribute}: {ban.value}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}

export default App
