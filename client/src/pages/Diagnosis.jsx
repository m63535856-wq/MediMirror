import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';
import { FileText, Download, Activity, Home as HomeIcon } from 'lucide-react';
import Disclaimer from '../components/Disclaimer';

const Diagnosis = () => {
  const navigate = useNavigate();
  const { diagnosisData, selectedBodyParts, resetAll, startNewAssessment } = useMedical();

  useEffect(() => {
    if (!diagnosisData) navigate('/');
  }, [diagnosisData, navigate]);

  if (!diagnosisData) return null;

  const getSeverityColor = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'mild': return 'from-green-500 to-emerald-400';
      case 'moderate': return 'from-amber-500 to-orange-400';
      case 'severe': return 'from-orange-500 to-red-500';
      case 'critical': return 'from-red-600 to-rose-700';
      default: return 'from-mm-500 to-accent-500';
    }
  };

  const getSeverityBadge = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'mild': return 'badge-success';
      case 'moderate': return 'badge-warning';
      case 'severe': return 'badge-error';
      case 'critical': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const handleExportReport = () => {
    const reportData = {
      date: new Date().toLocaleString(),
      affectedAreas: selectedBodyParts.map(p => p.name),
      diagnosis: diagnosisData,
    };

    let reportText = `MEDIMIRROR REPORT\nGenerated: ${reportData.date}\n\nAffected Areas:\n${reportData.affectedAreas.join(', ')}\n\nPrimary Diagnosis:\n${diagnosisData.primaryDiagnosis}\nConfidence: ${diagnosisData.confidence}\n\nRecommendations:\n${(diagnosisData.recommendations || []).join('\n')}\n\nDisclaimer: Not a substitute for professional care.\n`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medimirror-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleNewAssessment = () => {
    startNewAssessment();
    navigate('/body-map');
  };

  return (
    <div className="min-h-screen">
      {/* REMOVED: <Header /> - Should be rendered globally in App.jsx */}
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="badge badge-info">Assessment Complete</span>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mt-4">Diagnostic Results</h1>
            <p className="text-muted mt-2">Based on your consultation and reported symptoms.</p>
          </div>

          <div className={`glass-card p-4 mb-6 bg-[linear-gradient(90deg,rgba(6,182,212,0.06),transparent)]`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/6 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted uppercase">Severity</p>
                  <p className="text-2xl font-bold text-white">{diagnosisData.severity}</p>
                </div>
              </div>

              <div className="badge badge-info">{diagnosisData.confidence}% confidence</div>
            </div>
          </div>

          <div className="glass-card p-4 mb-4">
            <div className="flex items-start gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center"><FileText className="w-5 h-5"/></div>
              <div>
                <h2 className="text-xl font-bold text-white">Primary Diagnosis</h2>
                <p className="text-2xl font-bold gradient-text mt-1">{diagnosisData.primaryDiagnosis}</p>
              </div>
            </div>
          </div>

          {diagnosisData.differentialDiagnoses?.length > 0 && (
            <div className="glass-card p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">Alternative Possibilities</h3>
              <div className="space-y-3">
                {diagnosisData.differentialDiagnoses.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/2 rounded border border-[var(--mm-border)]">
                    <div>{d.condition}</div>
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-2 bg-white/6 rounded overflow-hidden">
                        <div className="h-full bg-[linear-gradient(90deg,#06b6d4,#3b82f6)] rounded" style={{ width: `${d.probability}%` }} />
                      </div>
                      <div className="text-accent-500 font-medium">{d.probability}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6">
            <button onClick={handleExportReport} className="btn-secondary"><Download className="w-4 h-4 mr-2"/> Export Report</button>
            <button onClick={handleNewAssessment} className="btn-primary"><HomeIcon className="w-4 h-4 mr-2"/> New Assessment</button>
          </div>

          <Disclaimer className="mt-8" />
        </div>
      </main>
    </div>
  );
};

export default Diagnosis;