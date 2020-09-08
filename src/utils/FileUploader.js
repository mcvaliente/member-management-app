import React from "react";
import { Image } from "semantic-ui-react";
import styles from "../assets/css/FileUploader.module.css";

const srcAttachFileIcon = "/images/attach-file-icon.svg";

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    event.preventDefault();
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };

  return (
    <>
      <button
        id="btnApplicationFile"
        onClick={handleClick}
        className={styles.fileUploaderButton}
        disabled={!props.metaMaskConnected}
        style={{ cursor: props.metaMaskConnected ? "pointer" : "not-allowed" }}
      >
        <Image src={srcAttachFileIcon} spaced="right" />
        <span>Adjuntar</span>
      </button>
      <input
        type="file"
        accept=".pdf"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export default FileUploader;
