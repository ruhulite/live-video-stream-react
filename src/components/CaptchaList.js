const CaptchaList = ({randomDataObject, selectedCaptchaData}) => {
    // click captcha box
    const handleClick = (val) => {
        val.e.target.parentNode.classList.add('active');
        selectedCaptchaData.push(val.item);
    }

    return (<>
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
    </>
    );
};

export default CaptchaList;