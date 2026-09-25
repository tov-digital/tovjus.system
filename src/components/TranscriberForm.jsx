import React, { useState, useRef } from 'react';
import { Send, Loader2, X, UploadCloud, Link as LinkIcon, FileVideo, Camera, PlaySquare } from 'lucide-react';
import OutputEditor from './OutputEditor';

const TranscriberForm = ({ onSubmit, isGenerating, output, setOutput, onCopyToInput }) => {
  const [activeModalField, setActiveModalField] = useState(null);
  const [file, setFile] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [platform, setPlatform] = useState('');
  const [submittedTitle, setSubmittedTitle] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setVideoLink(''); // clear link if file selected
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleLinkChange = (e) => {
    setVideoLink(e.target.value);
    if (e.target.value) {
      setFile(null); // clear file if link entered
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !videoLink.trim()) return;
    
    // Determine title
    let title = 'Transcrição';
    if (file) {
      title = file.name;
    } else if (videoLink) {
      title = videoLink;
    }
    setSubmittedTitle(title);
    
    onSubmit({ file, videoLink, title, platform });
  };

  const openModal = (field, e) => {
    if (e) e.preventDefault();
    setActiveModalField(field);
  };

  const closeModal = (e) => {
    if (e) e.preventDefault();
    setActiveModalField(null);
  };

  const outputTitle = submittedTitle ? `Transcrição: ${submittedTitle}` : 'Output de Transcrição';

  return (
    <>
      <form onSubmit={handleSubmit} className="main-layout-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Transcrição de Vídeo</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Faça o upload do seu arquivo ou cole um link abaixo.</p>
            </div>

            {/* Upload Box */}
            <div 
              onClick={handleBoxClick}
              style={{ 
                border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '2rem 1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: file ? 'hsl(160.118 84.08% 98%)' : 'var(--surface-color)',
                transition: 'all 0.2s',
                borderColor: file ? 'var(--primary-color)' : 'var(--border-color)'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = file ? 'var(--primary-color)' : 'var(--border-color)'}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="video/*,audio/*" 
                style={{ display: 'none' }} 
              />
              
              {file ? (
                <>
                  <FileVideo size={40} color="var(--primary-color)" style={{ marginBottom: '0.5rem' }} />
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)', textAlign: 'center', wordBreak: 'break-all', fontSize: '0.95rem' }}>{file.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </>
              ) : (
                <>
                  <UploadCloud size={40} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Clique para fazer upload</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>MP4, MOV, AVI, MP3</span>
                </>
              )}
            </div>

            {/* Divisor */}
            <div style={{ display: 'flex', alignItems: 'center', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <span style={{ margin: '0 1rem' }}>OU USAR LINK DO VÍDEO</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>

            {/* Link Input */}
            <div className="form-group">
              <div style={{ display: 'flex', position: 'relative', marginBottom: '1rem' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  <LinkIcon size={16} />
                </div>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Cole a URL do vídeo aqui..."
                  value={videoLink}
                  onChange={handleLinkChange}
                  style={{ paddingLeft: '2.5rem', paddingRight: '1rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>

              {/* Platform Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div 
                  onClick={() => setPlatform('instagram')}
                  style={{
                    border: `1px solid ${platform === 'instagram' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: platform === 'instagram' ? 'hsl(160.118 84.08% 98%)' : 'var(--surface-color)',
                    fontWeight: platform === 'instagram' ? 600 : 400,
                    color: platform === 'instagram' ? 'var(--primary-color)' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    opacity: videoLink ? 1 : 0.6
                  }}
                >
                  <Camera size={18} />
                  Instagram
                </div>
                <div 
                  onClick={() => setPlatform('youtube')}
                  style={{
                    border: `1px solid ${platform === 'youtube' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: platform === 'youtube' ? 'hsl(160.118 84.08% 98%)' : 'var(--surface-color)',
                    fontWeight: platform === 'youtube' ? 600 : 400,
                    color: platform === 'youtube' ? 'var(--primary-color)' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    opacity: videoLink ? 1 : 0.6
                  }}
                >
                  <PlaySquare size={18} />
                  YouTube
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '0.5rem' }}>
              <button type="submit" className="btn-primary btn-submit-action" disabled={isGenerating || (!file && (!videoLink.trim() || !platform))}>
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Transcrevendo...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Transcrever Vídeo
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        <OutputEditor content={output} setContent={setOutput} onExpand={(e) => openModal('output', e)} title={outputTitle} onCopyToInput={onCopyToInput} />
      </form>

      {activeModalField && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>{outputTitle}</span>
              <button className="btn-icon" onClick={closeModal} type="button">
                <X size={16} />
              </button>
            </div>
            <textarea
              className="modal-textarea"
              name={activeModalField}
              placeholder="Edite a transcrição aqui..."
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TranscriberForm;
