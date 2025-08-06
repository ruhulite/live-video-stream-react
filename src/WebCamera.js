import React, {useRef, useState, useCallback, useEffect} from "react";
import Webcam from "react-webcam";
import './WebCamera.css'
import Preview from "./components/Preview";

const videoConstraints = {
    width: 400,
    facingMode: "environment",
}

const WebCamera = () => {
    const camRef = useRef(null);
    const shape = useRef(null);
    const captchaRef = useRef(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [validationTitleIndex, setValidationTitleIndex] = useState(0);
    const [validationMessage, setValidationMessage] = useState(null);

    const validationDataSet = ['triangle', 'circle', 'square'];

    // rectangle box animation
    let x = 0;
    let y = 0;
    let xSpeed = 1;
    let ySpeed = 1;

    function animate() {
        // check boundary area
        if (shape.current) {
            if (x + shape.current.offsetWidth > 400 || x < 0) {
                xSpeed = -xSpeed;
            }
            if (y + shape.current.offsetHeight > 300 || y < 0) {
                ySpeed = -ySpeed;
            }

            // update position
            x += xSpeed;
            y += ySpeed;

            shape.current.style.top = `${y}px`;
            shape.current.style.left = `${x}px`;

            requestAnimationFrame(animate);
        }

    }

    useEffect(() => {
        animate();
    }, [shape]);

    // capture selfie image
    const handleCaptureImage = useCallback(async () => {
        setImgUrl(null);
        setValidationMessage('');
        const imgSrc = camRef.current.getScreenshot();
        setImgUrl(imgSrc);

        setTimeout(() => {
            captchaRef.current.style.top = shape.current.style.top;
            captchaRef.current.style.left = shape.current.style.left;
        }, 1);

        setValidationTitleIndex(Math.floor(Math.random() * validationDataSet.length));
    }, [camRef]);

    return (
        <>
            <div className="web-camera-video">
                <h3>Take Selfie</h3>
                <div className="camera-wrapper">
                    <div ref={shape} className="rectangle-box" />
                    <Webcam
                        ref={camRef}
                        videoConstraints={videoConstraints}
                        screenshotFormat="image/jpeg"
                        audio={false}
                    />
                    <div className="action-button">
                        <button onClick={handleCaptureImage}>Continue</button>
                        <button className="refresh" onClick={() => {
                            setImgUrl(null);
                            setValidationMessage('');
                        }}>Refresh</button>
                    </div>
                </div>
                <Preview
                    imgUrl={imgUrl}
                    captchaRef={captchaRef}
                    validationDataSet={validationDataSet}
                    validationTitleIndex={validationTitleIndex}
                    validationMessage={validationMessage}
                    setValidationMessage={setValidationMessage}
                />
            </div>
        </>
    )
}

export default WebCamera;