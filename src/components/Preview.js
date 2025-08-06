import CaptchaList from "./CaptchaList";

const Preview = ({imgUrl, captchaRef, validationTitleIndex, validationDataSet, validationMessage, setValidationMessage}) => {

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
        <div className="preview-image">
            {imgUrl && (
                <>
                    <h3>Select {validationDataSet[validationTitleIndex]}</h3>
                    <p className={validationMessage === 'Validation success.' ? 'success' : ''}>{validationMessage}</p>
                    <div className="preview-image-wrap">
                        <img src={imgUrl} alt="Captured Screnshot" />
                        <ul ref={captchaRef} className="captcha-rectangle">
                            <CaptchaList
                                randomDataObject={randomDataObject}
                                selectedCaptchaData={selectedCaptchaData}
                            />
                        </ul>
                    </div>
                    <div className='action-button'>
                        <button onClick={handleValidation}>Validate</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Preview;