import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import InvestigationView from './components/InvestigationView';
import ContextGraph from './components/ContextGraph';
import ImpactAnalysis from './components/ImpactAnalysis';
import PatchView from './components/PatchView';
import TestSimulator from './components/TestSimulator';
import TraceabilityView from './components/TraceabilityView';
import VehicleTopology from './components/VehicleTopology';
import TimelineView from './components/TimelineView';
import AIAssistant from './components/AIAssistant';
import ReportModal from './components/ReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header 
          currentProject="Vehicle Connectivity Stack v4.2"
          onOpenReport={() => setShowReportModal(true)}
          onEnterDemo={() => setActiveTab('investigation')}
        />

        <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
          {activeTab === 'landing' && (
            <LandingPage 
              onExplore={() => setActiveTab('graph')}
              onInvestigate={() => setActiveTab('investigation')}
            />
          )}

          {activeTab === 'overview' && (
            <Dashboard 
              onInvestigate={() => setActiveTab('investigation')}
              onExploreGraph={() => setActiveTab('graph')}
            />
          )}

          {activeTab === 'investigation' && (
            <InvestigationView 
              onGoToPatch={() => setActiveTab('patch')}
              onGoToGraph={() => setActiveTab('graph')}
            />
          )}

          {activeTab === 'graph' && <ContextGraph />}

          {activeTab === 'impact' && (
            <ImpactAnalysis 
              onGoToPatch={() => setActiveTab('patch')}
            />
          )}

          {activeTab === 'patch' && (
            <PatchView 
              onApproveForValidation={() => setActiveTab('tests')}
            />
          )}

          {activeTab === 'tests' && (
            <TestSimulator 
              onGoToTraceability={() => setActiveTab('traceability')}
            />
          )}

          {activeTab === 'traceability' && <TraceabilityView />}
          {activeTab === 'vehicle' && <VehicleTopology />}
          {activeTab === 'timeline' && <TimelineView />}
          {activeTab === 'assistant' && <AIAssistant />}
        </main>
      </div>

      {/* Executive Report Modal */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
