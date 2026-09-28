import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CopywriterForm from './components/CopywriterForm';
import TranscriberForm from './components/TranscriberForm';
import ThemeBank from './components/ThemeBank';
import ScriptwriterForm from './components/ScriptwriterForm';
import ImageGeneratorForm from './components/ImageGeneratorForm';
import Login from './components/Login';
import { supabase } from './supabase';

function App() {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const [activeTab, setActiveTab] = useState('pesquisador');
  
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [transcriberOutput, setTranscriberOutput] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [scriptOutput, setScriptOutput] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const [sharedInput, setSharedInput] = useState('');

  const handleCopyToInput = (text) => {
    setSharedInput(text);
    setActiveTab('roteirista');
  };

  const handleSubmitContent = async (formData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://n8n.srv1077266.hstgr.cloud/webhook/roteirizador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: formData.inputContent,
          tipo: formData.tipo,
          genero: formData.genero,
          formato: formData.formato,
          tom_de_voz: formData.tom,
          call_to_action: formData.cta,
          instrucoes_adicionais: formData.descricao
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao acionar o webhook');
      }

      const resultData = await response.text();
      
      let parsedOutput = resultData;
      try {
        const parsed = JSON.parse(resultData);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
          parsedOutput = parsed[0].output;
        } else if (parsed && parsed.output) {
          parsedOutput = parsed.output;
        }
      } catch (e) {
        console.warn("Retorno não é um JSON válido, usando texto bruto", e);
      }
      
      if (typeof parsedOutput === 'string') {
        parsedOutput = parsedOutput.replace(/\\n/g, '\n');
      }

      setOutput(parsedOutput);
    } catch (error) {
      console.error("Error generating content:", error);
      setOutput("Ocorreu um erro ao gerar o conteúdo. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitTranscription = async (formData) => {
    setIsTranscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = `[Transcrição Iniciada]\n\nFonte: ${formData.videoSource || formData.title}\n\n"Olá! Bem-vindos a mais um vídeo. Hoje vamos falar sobre como utilizar a inteligência artificial para automatizar tarefas repetitivas e gerar mais conteúdo com qualidade e agilidade. Fiquem ligados e não esqueçam de curtir o vídeo..."\n\n[Fim da Transcrição]`;
      setTranscriberOutput(mockResult);
    } catch (error) {
      console.error("Error transcribing:", error);
      setTranscriberOutput("Ocorreu um erro na transcrição. Tente novamente.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmitScript = async (formData) => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch('https://n8n.srv1077266.hstgr.cloud/webhook/escrever', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formato_de_texto: formData.formatoTexto,
          tema: formData.theme
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao acionar o webhook');
      }

      const resultData = await response.text();
      
      let parsedOutput = resultData;
      try {
        const parsed = JSON.parse(resultData);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
          parsedOutput = parsed[0].output;
        } else if (parsed && parsed.output) {
          parsedOutput = parsed.output;
        }
      } catch (e) {
        console.warn("Retorno não é um JSON válido, usando texto bruto", e);
      }
      
      if (typeof parsedOutput === 'string') {
        parsedOutput = parsedOutput.replace(/\\n/g, '\n');
      }

      setScriptOutput(parsedOutput);
    } catch (error) {
      console.error("Error generating script:", error);
      setScriptOutput("Ocorreu um erro ao gerar o roteiro. Tente novamente.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {activeTab === 'roteirista' && (
            <CopywriterForm 
              onSubmit={handleSubmitContent} 
              isGenerating={isGenerating} 
              output={output}
              setOutput={setOutput}
              sharedInput={sharedInput}
            />
          )}
          {activeTab === 'transcritor' && (
            <TranscriberForm 
              onSubmit={handleSubmitTranscription} 
              isGenerating={isTranscribing} 
              output={transcriberOutput}
              setOutput={setTranscriberOutput}
              onCopyToInput={handleCopyToInput}
            />
          )}
          {activeTab === 'pesquisador' && (
            <ThemeBank />
          )}
          {activeTab === 'redator' && (
            <ScriptwriterForm 
              onSubmit={handleSubmitScript} 
              isGenerating={isGeneratingScript} 
              output={scriptOutput}
              setOutput={setScriptOutput}
              onCopyToInput={handleCopyToInput}
            />
          )}
          {activeTab === 'imagens' && (
            <ImageGeneratorForm />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
