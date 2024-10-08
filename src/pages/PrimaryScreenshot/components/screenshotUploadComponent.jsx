import React, { useEffect, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { usePalette } from 'react-palette'

const ScreenshotUploadComponent = ({updateImageColorPalette}) => {
    const [imageUrl, setImageUrl] = useState('');

    const { data } = usePalette(imageUrl);

    useEffect(() => {
        console.log('data', data);
        delete data.lightMuted;

        updateImageColorPalette({...data});
    }, [data])

    const onUpload = (event) => {console.log(event);};

    const onRemove = () => {setImageUrl('');};
    
    const uploadHandler = (event) => {
        setImageUrl(event.files[0].objectURL);
    };

    return (
        <FileUpload className="w-30rem" accept="image/*" maxFileSize={1000000} customUpload="true" uploadHandler={uploadHandler} onUpload={onUpload} onRemove={onRemove} auto chooseLabel="Browse" />
    );
};

export default ScreenshotUploadComponent;