import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDrag, useDrop } from 'react-dnd';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';

const style = {
  border: '2px dashed #9b876b',
  borderRadius: '1em',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const previewStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: '20px',
  minHeight: '158px',
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 150,
  height: 150,
  padding: 4,
  boxSizing: 'border-box',
  position: 'relative',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const deleteButton = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: 'rgba(0,0,0,0.5)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  width: '20px',
  height: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const notificationBubbleStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '15px',
  zIndex: 10,
  width: 'auto',
  maxWidth: '300px',
  textAlign: 'left',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  maxWidth: '500px',
  width: '90%',
};

const checkmarkCircleStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 20px auto',
};

const checkmarkIconStyle = {
  fontSize: '3em',
  color: 'white',
  fontWeight: 'bold',
};

const modalTextStyle = {
  fontSize: '1.5em',
  color: '#333',
  marginTop: '20px',
};

const modalLinkStyle = {
  color: 'var(--color-sl-orange)',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

const progressSnackbarStyle = {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  padding: '5px',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
  textAlign: 'center',
  position: 'relative',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
};

const progressSnackbarFillStyle = {
  height: '100%',
  backgroundColor: 'var(--color-sl-title)',
  borderRadius: '5px',
  transition: 'width 0.3s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const progressTextStyle = {
  position: 'absolute',
  width: '100%',
  left: 0,
  color: '#fff',
  fontWeight: 'bold',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
};

const DraggableImage = ({ image, index, moveImage, removeImage }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'image',
    hover(item, monitor) {
      if (!ref.current) { return; }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) { return; }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return; }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) { return; }
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: () => ({ id: image.path, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ ...thumb, opacity: isDragging ? 0 : 1 }} data-handler-id={drop}>
      <div style={thumbInner}>
        {image.isHeic ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', color: '#666', fontSize: '0.8em', textAlign: 'center' }}>
            HEIC File<br/>(Preview N/A)
          </div>
        ) : (
          <img src={image.preview} style={img} alt={`preview-${image.path}`} />
        )}
      </div>
      <button style={deleteButton} onClick={(e) => { e.stopPropagation(); removeImage(index); }}>X</button>
    </div>
  );
};

const SuccessModal = ({ zine, onClose }) => {
  if (!zine) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={checkmarkCircleStyle}>
          <div style={checkmarkIconStyle}>✓</div>
        </div>
        <p style={modalTextStyle}>
          Zine Upload Successful! View your zine: {zine.title}
        </p>
      </div>
    </div>
  );
};

export const ImageUpload = ({ title, author, tags, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newZine, setNewZine] = useState(null);
  const [serverProcessing, setServerProcessing] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setShowNotification(true);
    }
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: (file.type === 'image/heic' || file.type === 'image/heif') ? null : URL.createObjectURL(file),
      isHeic: (file.type === 'image/heic' || file.type === 'image/heif'),
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [], 'image/png': [], 'image/bmp': [], 'image/heic': [], 'image/heif': [], 'image/jpg': [],
    },
    disabled: uploadStatus === 'uploading',
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    setFiles((prevFiles) =>
      update(prevFiles, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevFiles[dragIndex]],
        ],
      }),
    );
  }, []);

  const handleUpload = () => {
    if (files.length === 0) {
      alert('Please select images to upload.');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setServerProcessing(false);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('title', title);
    formData.append('author', author);
    formData.append('tags', tags);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete < 85 ? percentComplete : 85);
        if (percentComplete >= 85) {
          setServerProcessing(true);
        }
      }
    });

    xhr.addEventListener('load', () => {
      setServerProcessing(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        setNewZine(response);
        setShowSuccessModal(true);
        setUploadProgress(100);
        setUploadStatus('success');
        setFiles([]);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        setTimeout(() => setUploadStatus('idle'), 500);
      } else {
        setUploadStatus('error');
        alert('Upload failed. The server responded with an error.');
        setUploadProgress(0);
        setTimeout(() => setUploadStatus('idle'), 500);
      }
    });

    xhr.addEventListener('error', () => {
      setServerProcessing(false);
      setUploadStatus('error');
      alert('Upload failed. Please check your network connection.');
      setUploadProgress(0);
      setTimeout(() => setUploadStatus('idle'), 500);
    });

    xhr.open('POST', 'http://localhost:3001/api/zines/upload');
    xhr.send(formData);
  };

  const isUploading = uploadStatus === 'uploading';

  return (
    <>
      <SuccessModal zine={newZine} onClose={() => setShowSuccessModal(false)} />
      <div {...getRootProps({ style: { ...style, cursor: isUploading ? 'not-allowed' : 'pointer' } })}>
        {showNotification && (
          <div style={notificationBubbleStyle}>
            You can reorder the images by dragging them in between if needed.
          </div>
        )}
        <input {...getInputProps()} />
        
        <p>Drag and drop some images here, or click to select images</p>
        <aside style={previewStyle}>
          {files.map((file, i) => (
            <DraggableImage key={file.path} index={i} image={file} moveImage={moveImage} removeImage={removeFile} />
          ))}
        </aside>

        <div style={{ height: '45px', marginTop: '15px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {isUploading && (
            <div style={progressSnackbarStyle}>
              <div style={{ ...progressSnackbarFillStyle, width: `${uploadProgress}%` }}></div>
              <span style={progressTextStyle}>
                {serverProcessing ? 'Processing...' : `${uploadProgress}%`}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isUploading}
          style={{
            backgroundColor: isUploading ? '#ccc' : (isHovered ? 'var(--color-sl-orange)' : 'var(--color-sl-orange)'),
            filter: isHovered && !isUploading ? 'brightness(1.1)' : 'brightness(1)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            transform: isHovered && !isUploading ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isUploading ? `Uploading...` : 'Upload Zine Pages'}
        </button>
      </div>
    </>
  );
};

export default ImageUpload;
