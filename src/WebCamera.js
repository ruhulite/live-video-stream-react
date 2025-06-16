import React, {useRef, useState, useCallback, useEffect} from "react";
import Webcam from "react-webcam";
import './WebCamera.css'

const videoConstraints = {
    width: 400,
    facingMode: "environment",
}

const WebCamera = () => {
    const camRef = useRef(null);
    const shape = useRef(null);
    const captchaRef = useRef(null);
    const [imgUrl, setImgUrl] = useState(null);

    // rectangle box animation
    let x = 0;
    let y = 0;
    let xSpeed = 1;
    let ySpeed = 1;

    function animate() {
        // Boundary check
        if (shape.current) {
            if (x + shape.current.offsetWidth > 400 || x < 0) {
                xSpeed = -xSpeed;
            }
            if (y + shape.current.offsetHeight > 300 || y < 0) {
                ySpeed = -ySpeed;
            }

            // Update position
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

    const captureImage = useCallback(async () => {
        const imgSrc = camRef.current.getScreenshot();
        setImgUrl(imgSrc);

        setTimeout(() => {
            captchaRef.current.style.top = shape.current.style.top;
            captchaRef.current.style.left = shape.current.style.left;
        }, 1)
    }, [camRef]);

    return (
        <>
            <div className="web-camera-video">
                <div className="camera-wrapper">
                    <div ref={shape} className="rectangle-box" />
                    <Webcam
                        ref={camRef}
                        videoConstraints={videoConstraints}
                        screenshotFormat="image/jpeg"
                        audio={false}
                    />
                    <div className="action-button">
                        <button onClick={captureImage}>Capture Image</button>
                        <button className="refresh" onClick={() => setImgUrl(null)}>Refresh</button>
                    </div>
                </div>
                <div className="preview-image">
                    {imgUrl && (
                        <>
                            <img src={imgUrl} alt="Captured Screnshot" />
                            <div ref={captchaRef} className="captcha-rectangle">Captcha</div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default WebCamera;