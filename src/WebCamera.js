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
    const [validationTitleIndex, setValidationTitleIndex] = useState(0);
    const [validationMessage, setValidationMessage] = useState(null);

    const validationDataSet = ['triangle', 'circle', 'square'];
    const captchaData = [
        '',
        'triangle',
        'circle',
        'square',
        '',
        'triangle',
        'circle',
        'square',
        '',
        'triangle',
        'circle',
        'square',
        '',
        'triangle',
        'circle',
        'square',
        '',
        'triangle',
        'circle',
        'square',
        '',
        'triangle',
        'circle',
        'square',
        ''
    ];

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
    const captureImage = useCallback(async () => {
        setImgUrl(null);
        setValidationMessage(null);
        const imgSrc = camRef.current.getScreenshot();
        setImgUrl(imgSrc);

        setTimeout(() => {
            captchaRef.current.style.top = shape.current.style.top;
            captchaRef.current.style.left = shape.current.style.left;
        }, 1);

        setValidationTitleIndex(Math.floor(Math.random() * validationDataSet.length));
    }, [camRef]);

    // making random captcha data
    function makeArrayShuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // swap array data
        }
        return arr;
    }

    const randomDataObject = makeArrayShuffle([...captchaData]);

    let selectedCaptchaData = [];

    // click captcha box
    const handleClick = (val) => {
        val.e.target.parentNode.classList.add('active');
        selectedCaptchaData.push(val.item);
    }

    // handle validation & set validation message
    const handleValidation = () => {
        if (selectedCaptchaData.length < 1) {
            setValidationMessage(`Please select ${validationDataSet[validationTitleIndex]}`);
        } else {
            let wrongData = undefined;
            for (let i = 0; i < selectedCaptchaData.length; i++) {
                if (selectedCaptchaData[i] !== validationDataSet[validationTitleIndex]) {
                    wrongData = true;
                }
            }
            if (wrongData) {
                setValidationMessage('Not match! Please try again.')
                selectedCaptchaData = [];
                captchaRef.current.querySelectorAll('li').forEach((element) => element.classList.remove('active'));
            } else {
                if (selectedCaptchaData.length >= 3) {
                    setValidationMessage('Validation success.')
                    selectedCaptchaData = [];
                    captchaRef.current.querySelectorAll('li').forEach((element) => element.classList.remove('active'));
                } else {
                    setValidationMessage(`Please select at least 3 ${validationDataSet[validationTitleIndex]}`);
                    selectedCaptchaData = [];
                    captchaRef.current.querySelectorAll('li').forEach((element) => element.classList.remove('active'));
                }
            }
        }
    }

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
                        <button onClick={captureImage}>Continue</button>
                        <button className="refresh" onClick={() => {
                            setImgUrl(null);
                            setValidationMessage(null);
                        }}>Refresh</button>
                    </div>
                </div>
                <div className="preview-image">
                    {imgUrl && (
                        <>
                            <h3>Select {validationDataSet[validationTitleIndex]}</h3>
                            <p className={validationMessage === 'Validation success.' ? 'success' : ''}>{validationMessage}</p>
                            <div className="preview-image-wrap">
                                <img src={imgUrl} alt="Captured Screnshot" />
                                <ul ref={captchaRef} className="captcha-rectangle">
                                    { randomDataObject.map((item, index) =>
                                        (<li
                                            key={index}
                                            onClick={(e) => handleClick({item, e})}
                                        >
                                            <span className="checked">&#10004;</span>
                                            { item === 'circle' ? (
                                                <span className="circle" />
                                            ) : item === 'square' ? (
                                                <span className="square" />
                                            ) : item === 'triangle' ? (
                                                <span className="triangle" />
                                            ) : (
                                                <span className="blank" />
                                            ) }
                                        </li>)) }
                                </ul>
                            </div>
                            <div className='action-button'>
                                <button onClick={() => handleValidation() }>Validate</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default WebCamera;