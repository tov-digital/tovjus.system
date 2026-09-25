import React, { useRef } from 'react';
import { Copy, Check, FileText, Maximize2 } from 'lucide-react';

const OutputEditor = ({ content, setContent, children, onExpand, title = "Output", onCopyToInput }) => {
  const [copied, setCopied] = React.useState(false);
  const contentRef = useRef(null);

  const handleCopy = () => {
    if (!content) return;
    
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };



  return (
    <div className="panel output-editor">
      <div className="output-header">
        <h2 className="form-label" style={{ margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {onCopyToInput && (
            <button 
              type="button"
              className="btn-outline-primary" 
              onClick={() => onCopyToInput(content)}
              disabled={!content}
              style={{ padding: '0.35rem 0.75rem', height: '32px', fontSize: '0.85rem' }}
            >
              Copy to input
            </button>
          )}
          <button 
            type="button"
            className="btn-icon" 
            onClick={handleCopy}
            title="Copiar para área de transferência"
            disabled={!content}
          >
            {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {content ? (
        <div className="textarea-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <textarea 
            className="output-content" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            ref={contentRef}
            style={{ resize: 'none' }}
          />
          <button className="btn-expand" onClick={onExpand} title="Expandir área de texto" type="button">
            <Maximize2 size={16} />
          </button>
        </div>
      ) : (
        <div className="output-content empty-state">
          <FileText size={48} opacity={0.2} />
          <p>O conteúdo gerado aparecerá aqui.</p>
          <p style={{ fontSize: '0.875rem' }}>Preencha o formulário e clique em "Gerar Conteúdo".</p>
        </div>
      )}
      
      {children && (
        <div style={{ marginTop: '1rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default OutputEditor;
