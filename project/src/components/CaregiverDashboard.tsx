// src/components/CaregiverDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Heart,
  Thermometer,
  Activity,
  Pill,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Footprints,
  Eye,
  Smile,
  Meh,
  Frown,
  Gauge,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Helper function to get status color
const getStatusColor = (isNormal: boolean) =>
  isNormal ? 'text-green-600' : 'text-red-600';

// Helper function to get status background for icons
const getIconBg = (isNormal: boolean) =>
  isNormal ? 'bg-green-100' : 'bg-red-100';

// Helper function to get card border color based on status
const getCardBorder = (isNormal: boolean) =>
  isNormal ? 'border-green-200' : 'border-red-200';

interface PatientData {
  vitals: {
    heartRate: { value: number; unit: string; normal: boolean };
    bloodPressure: { value: string; unit: string; normal: boolean };
    temperature: { value: number; unit: string; normal: boolean };
  };
  mood: {
    emoji: string;
    text: string;
    color: string;
  };
  medication: {
    taken: boolean;
    statusText: string;
  };
  fallDetection: {
    detected: boolean;
    timestamp: string | null;
  };
  foodIntake: {
    details: string;
  };
  walkingActivity: {
    steps: number;
    duration: string;
  };
  suspiciousActivity: {
    flagged: boolean;
    details: string;
  };
}

const generatePatientData = (date: Date): PatientData => {
  const dayOfMonth = date.getDate();
  const isEvenDay = dayOfMonth % 2 === 0;

  return {
    vitals: {
      heartRate: { value: isEvenDay ? 72 : 85, unit: 'BPM', normal: isEvenDay },
      bloodPressure: { value: isEvenDay ? '120/80' : '140/90', unit: 'mmHg', normal: isEvenDay },
      temperature: { value: isEvenDay ? 36.8 : 37.5, unit: '°C', normal: isEvenDay },
    },
    mood: {
      emoji: isEvenDay ? '😄' : '😐',
      text: isEvenDay ? 'Happy' : 'Neutral',
      color: isEvenDay ? 'text-green-600' : 'text-gray-600',
    },
    medication: {
      taken: isEvenDay,
      statusText: isEvenDay ? 'Taken' : 'Missed',
    },
    fallDetection: {
      detected: !isEvenDay,
      timestamp: !isEvenDay ? '2025-07-03T10:30:00Z' : null,
    },
    foodIntake: {
      details: isEvenDay ? 'Enjoyed her breakfast and lunch today.' : 'Had a light appetite, but ate her favorite soup.',
    },
    walkingActivity: {
      steps: isEvenDay ? 5200 : 3100,
      duration: isEvenDay ? '60 minutes' : '30 minutes',
    },
    suspiciousActivity: {
      flagged: !isEvenDay,
      details: !isEvenDay ? 'Unusual movement detected near the window.' : 'No unusual activity detected.',
    },
  };
};

export const CaregiverDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [patientData, setPatientData] = useState<PatientData>(generatePatientData(selectedDate));

  useEffect(() => {
    setPatientData(generatePatientData(selectedDate));
  }, [selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const displayDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="flex-1 ml-70 p-6 bg-eldercare-background" role="main" aria-label="Caregiver Dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary mb-2">
            Caregiver Dashboard
          </h1>
          <p className="text-lg font-opensans text-eldercare-text">
            Real-time insights for comprehensive care
          </p>
        </header>

        {/* Date Selection */}
        <section className="mb-8 flex items-center justify-center space-x-4">
          <button
            onClick={handlePreviousDay}
            className="p-2 bg-white border border-eldercare-primary/20 rounded-lg hover:bg-eldercare-primary/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
            aria-label="Previous day"
          >
            <ChevronLeft size={20} className="text-eldercare-primary" />
          </button>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={handleDateChange}
              className="px-4 py-2 text-base font-opensans border-2 border-eldercare-primary/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
              aria-label="Select date"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Calendar size={20} className="text-eldercare-text-light" />
            </span>
          </div>
          <button
            onClick={handleNextDay}
            className="p-2 bg-white border border-eldercare-primary/20 rounded-lg hover:bg-eldercare-primary/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
            aria-label="Next day"
          >
            <ChevronRight size={20} className="text-eldercare-primary" />
          </button>
          <p className="text-xl font-nunito font-bold text-eldercare-secondary">
            {displayDate}
          </p>
        </section>

        {/* Vitals Section */}
        <section className="mb-8" aria-labelledby="vitals-heading">
          <h2 id="vitals-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Vitals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Heart Rate */}
            <div className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${getCardBorder(patientData.vitals.heartRate.normal)}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getIconBg(patientData.vitals.heartRate.normal)}`}>
                  <Heart size={28} className={getStatusColor(patientData.vitals.heartRate.normal)} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-nunito font-bold text-eldercare-secondary">Heart Rate</h3>
              </div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.vitals.heartRate.value} <span className="text-lg font-normal text-eldercare-text-light">{patientData.vitals.heartRate.unit}</span>
              </p>
              <p className={`text-sm font-opensans ${getStatusColor(patientData.vitals.heartRate.normal)}`}>
                {patientData.vitals.heartRate.normal ? 'Normal' : 'Abnormal'}
              </p>
            </div>

            {/* Blood Pressure */}
            <div className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${getCardBorder(patientData.vitals.bloodPressure.normal)}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getIconBg(patientData.vitals.bloodPressure.normal)}`}>
                  <Gauge size={28} className={getStatusColor(patientData.vitals.bloodPressure.normal)} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-nunito font-bold text-eldercare-secondary">Blood Pressure</h3>
              </div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.vitals.bloodPressure.value} <span className="text-lg font-normal text-eldercare-text-light">{patientData.vitals.bloodPressure.unit}</span>
              </p>
              <p className={`text-sm font-opensans ${getStatusColor(patientData.vitals.bloodPressure.normal)}`}>
                {patientData.vitals.bloodPressure.normal ? 'Normal' : 'Abnormal'}
              </p>
            </div>

            {/* Temperature */}
            <div className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${getCardBorder(patientData.vitals.temperature.normal)}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getIconBg(patientData.vitals.temperature.normal)}`}>
                  <Thermometer size={28} className={getStatusColor(patientData.vitals.temperature.normal)} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-nunito font-bold text-eldercare-secondary">Temperature</h3>
              </div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.vitals.temperature.value} <span className="text-lg font-normal text-eldercare-text-light">{patientData.vitals.temperature.unit}</span>
              </p>
              <p className={`text-sm font-opensans ${getStatusColor(patientData.vitals.temperature.normal)}`}>
                {patientData.vitals.temperature.normal ? 'Normal' : 'Abnormal'}
              </p>
            </div>
          </div>
        </section>

        {/* Mood Section */}
        <section className="mb-8" aria-labelledby="mood-heading">
          <h2 id="mood-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Mood
          </h2>
          <div className="bg-white rounded-xl shadow-md border-2 border-eldercare-primary/10 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <div className="p-3 rounded-lg bg-eldercare-primary/10">
              {patientData.mood.emoji === '😄' ? <Smile size={28} className="text-eldercare-primary" aria-hidden="true" /> : patientData.mood.emoji === '😐' ? <Meh size={28} className="text-eldercare-primary" aria-hidden="true" /> : <Frown size={28} className="text-eldercare-primary" aria-hidden="true" />}
            </div>
            <div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.mood.emoji} {patientData.mood.text}
              </p>
              <p className="text-sm font-opensans text-eldercare-text-light">
                Detected mood today
              </p>
            </div>
          </div>
        </section>

        {/* Medication Section */}
        <section className="mb-8" aria-labelledby="medication-heading">
          <h2 id="medication-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Medication
          </h2>
          <div className={`bg-white rounded-xl shadow-md border-2 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${patientData.medication.taken ? 'border-green-200' : 'border-red-200'}`}>
            <div className={`p-3 rounded-lg ${patientData.medication.taken ? 'bg-green-100' : 'bg-red-100'}`}>
              <Pill size={28} className={`${patientData.medication.taken ? 'text-green-600' : 'text-red-600'}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.medication.taken ? '✅ Taken' : '❌ Missed'}
              </p>
              <p className="text-sm font-opensans text-eldercare-text-light">
                All pills for today
              </p>
            </div>
          </div>
        </section>

        {/* Fall Detection Section */}
        <section className="mb-8" aria-labelledby="fall-detection-heading">
          <h2 id="fall-detection-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Fall Detection
          </h2>
          <div className={`bg-white rounded-xl shadow-md border-2 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${patientData.fallDetection.detected ? 'border-red-200' : 'border-green-200'}`}>
            <div className={`p-3 rounded-lg ${patientData.fallDetection.detected ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertTriangle size={28} className={`${patientData.fallDetection.detected ? 'text-red-600' : 'text-green-600'}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.fallDetection.detected ? 'Fall Detected!' : 'No Fall Detected'}
              </p>
              {patientData.fallDetection.detected && (
                <p className="text-sm font-opensans text-eldercare-text-light">
                  Timestamp: {patientData.fallDetection.timestamp}
                </p>
              )}
              {!patientData.fallDetection.detected && (
                <p className="text-sm font-opensans text-eldercare-text-light">
                  No falls recorded today
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Food Intake Section */}
        <section className="mb-8" aria-labelledby="food-intake-heading">
          <h2 id="food-intake-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Food Intake
          </h2>
          <div className={`bg-white rounded-xl shadow-md border-2 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${patientData.foodIntake.details.includes('Enjoyed') ? 'border-green-200' : 'border-yellow-200'}`}>
            <div className={`p-3 rounded-lg ${patientData.foodIntake.details.includes('Enjoyed') ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Utensils size={28} className={`${patientData.foodIntake.details.includes('Enjoyed') ? 'text-green-600' : 'text-yellow-600'}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                Meal Status
              </p>
              <p className="text-sm font-opensans text-eldercare-text-light">
                {patientData.foodIntake.details}
              </p>
            </div>
          </div>
        </section>

        {/* Walking Activity Section */}
        <section className="mb-8" aria-labelledby="walking-activity-heading">
          <h2 id="walking-activity-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Walking Activity
          </h2>
          <div className="bg-white rounded-xl shadow-md border-2 border-eldercare-primary/10 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <div className="p-3 rounded-lg bg-eldercare-primary/10">
              <Footprints size={28} className="text-eldercare-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.walkingActivity.steps} Steps
              </p>
              <p className="text-sm font-opensans text-eldercare-text-light">
                {patientData.walkingActivity.duration} of activity today
              </p>
            </div>
          </div>
        </section>

        {/* Suspicious Activity Section */}
        <section className="mb-8" aria-labelledby="suspicious-activity-heading">
          <h2 id="suspicious-activity-heading" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6">
            Suspicious Activity
          </h2>
          <div className={`bg-white rounded-xl shadow-md border-2 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${patientData.suspiciousActivity.flagged ? 'border-red-200' : 'border-green-200'}`}>
            <div className={`p-3 rounded-lg ${patientData.suspiciousActivity.flagged ? 'bg-red-100' : 'bg-green-100'}`}>
              <Eye size={28} className={`${patientData.suspiciousActivity.flagged ? 'text-red-600' : 'text-green-600'}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-opensans font-bold text-eldercare-secondary">
                {patientData.suspiciousActivity.flagged ? 'Flagged!' : 'All Clear'}
              </p>
              <p className="text-sm font-opensans text-eldercare-text-light">
                {patientData.suspiciousActivity.details}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
