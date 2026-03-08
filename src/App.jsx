import { useState } from 'react'
import InputScreen from './components/InputScreen'
import ProcessingScreen from './components/ProcessingScreen'
import Report from './components/Report'

function App() {
  const [screen, setScreen] = useState('input')
  const [propertyData, setPropertyData] = useState(null)
  const [reportData, setReportData] = useState(null)

  const handleInputSubmit = ({ address, images }) => {
    setPropertyData({ address, images })
    setScreen('processing')
  }

  const handleProcessingComplete = ({ sections, unassigned }) => {
    setReportData({ sections, unassigned })
    setScreen('report')
  }

  const handleBackToInput = () => {
    setScreen('input')
    setPropertyData(null)
    setReportData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'input' && (
        <InputScreen onSubmit={handleInputSubmit} />
      )}
      {screen === 'processing' && propertyData && (
        <ProcessingScreen
          images={propertyData.images}
          address={propertyData.address}
          onComplete={handleProcessingComplete}
        />
      )}
      {screen === 'report' && reportData && (
        <Report
          address={propertyData.address}
          initialSections={reportData.sections}
          initialUnassigned={reportData.unassigned}
          onBack={handleBackToInput}
        />
      )}
    </div>
  )
}

export default App
