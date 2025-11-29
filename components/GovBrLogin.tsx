import React, { useState, useRef, useEffect } from 'react';
import { LoginStep } from '../types';
import { X, Eye, EyeOff, Camera, AlertCircle, CheckCircle } from 'lucide-react';

interface GovBrLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GovBrLogin: React.FC<GovBrLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<LoginStep>(LoginStep.CPF);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  if (!isOpen) return null;

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
    // Reset state after a delay
    setTimeout(() => {
        setStep(LoginStep.CPF);
        setCpf('');
        setPassword('');
        setScanProgress(0);
        setCameraError(false);
    }, 500);
  };

  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Simulate scanning process
      simulateScan();
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError(true);
    }
  };

  const simulateScan = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
            stopCamera();
            setStep(LoginStep.SUCCESS);
            triggerSuccessFlow();
        }, 500);
      }
    }, 60); // Approx 3 seconds
  };

  const triggerSuccessFlow = () => {
    setTimeout(() => {
        onSuccess();
        setTimeout(() => {
           handleClose();
        }, 1500);
      }, 1000);
  };

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length < 3) return; 
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(LoginStep.PASSWORD);
    }, 800);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Move to Facial Instructions instead of direct success
      setStep(LoginStep.FACIAL_INSTRUCTIONS);
    }, 1000);
  };

  const handleStartScan = () => {
      setStep(LoginStep.FACIAL_SCAN);
      setTimeout(startCamera, 100); // Slight delay to allow DOM to render video element
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-sans backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative min-h-[500px] flex flex-col">
        {/* Header Gov.br */}
        <div className="flex justify-between items-center p-4">
           <div className="w-24">
             <span className="text-3xl font-black italic text-[#1351B4]">gov<span className="text-[#F9D00F]">.</span>br</span>
           </div>
           {step !== LoginStep.SUCCESS && (
             <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
               <X size={24} />
             </button>
           )}
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-4 flex flex-col">
          {step === LoginStep.CPF && (
            <div className="animate-fade-in">
              <h2 className="text-[#1351B4] font-bold text-xl mb-4">Identifique-se no gov.br</h2>
              
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-4">
                  Digite seu CPF para criar ou acessar sua conta gov.br
                </p>
                <form onSubmit={handleCpfSubmit}>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="Digite seu CPF"
                    className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] outline-none transition-all"
                    maxLength={14}
                    autoFocus
                  />
                  
                  <div className="mt-6 flex flex-col gap-4">
                    <button 
                      type="submit"
                      disabled={cpf.length < 14 || isLoading}
                      className={`w-full rounded-full py-3 font-semibold text-white transition-colors ${
                        cpf.length < 14 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1351B4] hover:bg-blue-800'
                      }`}
                    >
                      {isLoading ? 'Verificando...' : 'Continuar'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 border-t pt-6">
                 <h3 className="font-semibold text-gray-800 mb-4">Outras opções de identificação:</h3>
                 <button className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 mb-3 text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs">B</span>
                    Seu banco
                 </button>
                 <button className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">C</span>
                    Seu certificado digital
                 </button>
              </div>
            </div>
          )}

          {step === LoginStep.PASSWORD && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                    {cpf.slice(0, 3)}
                 </div>
                 <span className="text-gray-700 font-medium">{cpf}</span>
              </div>

              <h2 className="text-[#1351B4] font-bold text-xl mb-4">Digite sua senha</h2>

              <form onSubmit={handlePasswordSubmit}>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full border border-gray-300 rounded p-3 pr-10 focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="mt-6">
                  <button 
                    type="submit"
                    disabled={!password || isLoading}
                    className={`w-full rounded-full py-3 font-semibold text-white transition-colors ${
                      !password ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1351B4] hover:bg-blue-800'
                    }`}
                  >
                    {isLoading ? 'Autenticando...' : 'Entrar'}
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                    <button type="button" className="text-[#1351B4] text-sm font-semibold hover:underline">
                        Esqueci minha senha
                    </button>
                </div>
              </form>
            </div>
          )}

          {step === LoginStep.FACIAL_INSTRUCTIONS && (
             <div className="animate-fade-in flex flex-col h-full">
                <h2 className="text-[#1351B4] font-bold text-xl mb-4 text-center">Reconhecimento Facial</h2>
                
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-[#1351B4]">
                    <Camera size={48} />
                  </div>
                  
                  <div className="space-y-3 text-center text-gray-600 text-sm">
                    <p>Para sua segurança, precisamos validar sua identidade.</p>
                    <ul className="text-left bg-gray-50 p-4 rounded-lg space-y-2">
                       <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Esteja em um ambiente iluminado</li>
                       <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Não use óculos ou chapéu</li>
                       <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Segure o celular na altura dos olhos</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    onClick={handleStartScan}
                    className="w-full rounded-full py-3 font-semibold text-white bg-[#1351B4] hover:bg-blue-800 transition-colors"
                  >
                    Começar Reconhecimento
                  </button>
                </div>
             </div>
          )}

          {step === LoginStep.FACIAL_SCAN && (
            <div className="animate-fade-in flex flex-col h-full absolute inset-0 bg-white">
                {/* Header specifically for camera view */}
                 <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/50 to-transparent">
                   <span className="font-bold">Reconhecimento Facial</span>
                   <button onClick={handleClose}><X size={24} /></button>
                 </div>

                 {cameraError ? (
                   <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
                      <h3 className="text-gray-800 font-bold mb-2">Erro na Câmera</h3>
                      <p className="text-gray-600 text-sm mb-6">Não foi possível acessar a câmera. Verifique as permissões do seu navegador.</p>
                      <button 
                        onClick={handleClose}
                        className="w-full rounded-full py-3 font-semibold text-white bg-gray-500 hover:bg-gray-600"
                      >
                        Fechar
                      </button>
                   </div>
                 ) : (
                   <div className="relative flex-1 bg-black flex flex-col items-center justify-center overflow-hidden">
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* Overlay mask */}
                      <div className="absolute inset-0 border-[50px] border-white/90 z-10" 
                           style={{ 
                             clipPath: "path('M 0 0 h 100% v 100% h -100% Z M 50% 20% c 15% 0 35% 10% 35% 30% v 15% c 0 20% -20% 30% -35% 30% c -15% 0 -35% -10% -35% -30% v -15% c 0 -20% 20% -30% 35% -30% Z')"
                             // This is a rough SVG path approximation for an oval cutout, using border as the 'fill'
                           }}
                      ></div>
                      
                      {/* Visual Guide Ring */}
                      <div className="relative z-10 w-64 h-80 rounded-[50%] border-4 border-white/30 flex items-center justify-center overflow-hidden">
                        {/* Scanning Line */}
                        <div className="absolute w-full h-2 bg-[#1351B4] shadow-[0_0_15px_#1351B4] animate-[scan_2s_ease-in-out_infinite] opacity-80 top-0"></div>
                      </div>

                      <div className="absolute bottom-10 z-20 w-full px-8">
                         <p className="text-white text-center font-medium mb-4 shadow-black drop-shadow-md">
                           {scanProgress < 100 ? "Centralize seu rosto..." : "Rosto identificado!"}
                         </p>
                         <div className="w-full bg-gray-300 rounded-full h-2">
                           <div 
                              className="bg-[#1351B4] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${scanProgress}%` }}
                           ></div>
                         </div>
                      </div>
                   </div>
                 )}
            </div>
          )}

          {step === LoginStep.SUCCESS && (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <h2 className="text-[#1351B4] font-bold text-xl mb-2">Sucesso!</h2>
              <p className="text-gray-600 text-center">
                Identidade confirmada e apoio registrado.
              </p>
              <p className="text-gray-400 text-xs mt-8">Redirecionando...</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {step !== LoginStep.FACIAL_SCAN && (
          <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
             <p className="text-xs text-gray-500">Este é um serviço simulado para fins de demonstração.</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default GovBrLogin;