import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';
import { bodyParts, getBodyPartById } from '../utils/bodyParts';
import { ZoomIn, ZoomOut, Maximize2, X, ArrowRight, AlertCircle } from 'lucide-react';
// REMOVED: import Header from '../components/Header'; - Header is now in App.jsx
import BodySvg from '../components/BodySvg';

const BodyMap = () => {
  const navigate = useNavigate();
  const { selectedBodyParts, addBodyPart, removeBodyPart } = useMedical();
  const [scale, setScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handlePartClick = (partId) => {
    const part = getBodyPartById(partId);
    if (!part) return;
    const isSelected = selectedBodyParts.some(p => p.id === partId);
    if (isSelected) removeBodyPart(partId);
    else addBodyPart(part);
  };

  const handleZoomIn = () => setScale(s => Math.min(3, s + 0.2));
  const handleZoomOut = () => setScale(s => Math.max(0.6, s - 0.2));
  const handleReset = () => { setScale(1); setPanPosition({ x:0,y:0 }); };

  const handleContinue = () => {
    if (selectedBodyParts.length === 0) {
      alert('Please select at least one body part before continuing');
      return;
    }
    navigate('/consultation');
  };

  // mouse drag
  useEffect(() => {
    const onUp = () => setIsDragging(false);
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, []);

  const onMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    setPanPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  // touch: pinch and pan (basic)
  const [touchStart, setTouchStart] = useState(null);
  const [touchDist, setTouchDist] = useState(null);

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDist(d);
    } else if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX - panPosition.x, y: e.touches[0].clientY - panPosition.y });
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && touchDist) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = d - touchDist;
      setScale(s => Math.min(3, Math.max(0.6, s + delta * 0.01)));
      setTouchDist(d);
    } else if (e.touches.length === 1 && touchStart && scale > 1) {
      setPanPosition({ x: e.touches[0].clientX - touchStart.x, y: e.touches[0].clientY - touchStart.y });
    }
  };
  const onTouchEnd = () => { setTouchStart(null); setTouchDist(null); };

  return (
    // REMOVED: duplicate Header component and pt-24 padding
    <div className="min-h-screen">
      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold gradient-text">Select Affected Areas</h1>
            <p className="text-gray-600 dark:text-gray-400">Tap/click body parts to add them. Use zoom/pan for precision.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card h-[640px] relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button onClick={handleZoomIn} className="btn-secondary p-3 icon-backdrop"><ZoomIn className="w-4 h-4"/></button>
                  <button onClick={handleZoomOut} className="btn-secondary p-3 icon-backdrop"><ZoomOut className="w-4 h-4"/></button>
                  <button onClick={handleReset} className="btn-secondary p-3 icon-backdrop"><Maximize2 className="w-4 h-4"/></button>
                </div>

                <div
                  ref={containerRef}
                  className={`w-full h-full flex items-center justify-center ${isDragging ? 'cursor-grabbing' : scale>1 ? 'cursor-grab' : 'cursor-default'}`}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <BodySvg
                    selectedParts={selectedBodyParts}
                    onPartClick={handlePartClick}
                    scale={scale}
                    panX={panPosition.x}
                    panY={panPosition.y}
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-card p-3 glass-card-strong">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <AlertCircle className="w-4 h-4 text-accent-500" />
                      <div><strong className="text-gray-900 dark:text-white">Tip:</strong> pinch to zoom (mobile) or use controls. Drag to pan when zoomed.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="glass-card h-[640px] p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-3 gradient-text">Selected Areas ({selectedBodyParts.length})</h3>

                <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3">
                  {selectedBodyParts.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 h-full">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-accent-500" />
                        <p>No body parts selected</p>
                        <p className="text-sm mt-1">Tap the diagram to add selection</p>
                      </div>
                    </div>
                  ) : selectedBodyParts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 dark:bg-white/5 rounded-mm border border-white/10 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{background: p.color}} />
                        <span className="text-gray-900 dark:text-white">{p.name}</span>
                      </div>
                      <button onClick={() => removeBodyPart(p.id)} className="p-1 hover:bg-red-500/10 rounded">
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={handleContinue} disabled={selectedBodyParts.length === 0} className={`mt-4 btn-primary ${selectedBodyParts.length===0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Continue to Consultation <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BodyMap;