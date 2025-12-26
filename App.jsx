import React, { useState } from 'react';
import { Plus, Trash2, Save, Database, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  
  const [entries, setEntries] = useState([{
    id: Date.now(),
    age: '',
    gender: '',
    doctorName: '',
    disease: '',
    startTime: '',
    endTime: ''
  }]);

  const connectDatabase = () => {
    if (supabaseUrl && supabaseKey) {
      setIsConnected(true);
      setShowSetup(false);
      alert('✅ Database connected successfully!');
    } else {
      alert('⚠️ Please enter both URL and API Key');
    }
  };

  const addNewEntry = () => {
    setEntries([...entries, {
      id: Date.now(),
      age: '',
      gender: '',
      doctorName: '',
      disease: '',
      startTime: '',
      endTime: ''
    }]);
  };

  const removeEntry = (id) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (id, field, value) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const captureTime = (id, field) => {
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    updateEntry(id, field, formattedTime);
  };

  const saveToDatabase = async () => {
    if (!isConnected) {
      alert('⚠️ Please connect to database first!');
      return;
    }

    const validEntries = entries.filter(entry => 
      entry.age && entry.gender && entry.doctorName && entry.disease
    );

    if (validEntries.length === 0) {
      alert('⚠️ Please fill in all required fields (Age, Gender, Doctor Name, Disease)');
      return;
    }

    try {
      let successCount = 0;

      for (const entry of validEntries) {
        const recordData = {
          age: parseInt(entry.age),
          gender: entry.gender,
          doctor_name: entry.doctorName,
          disease: entry.disease,
          start_time: entry.startTime || null,
          end_time: entry.endTime || null
        };

        const response = await fetch(`${supabaseUrl}/rest/v1/medical_records`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(recordData)
        });

        if (response.ok) {
          successCount++;
        } else {
          const error = await response.text();
          throw new Error(error || 'Failed to save record');
        }
      }

      alert(`✅ Successfully saved ${successCount} record(s) to database!`);
      
      setEntries([{
        id: Date.now(),
        age: '',
        gender: '',
        doctorName: '',
        disease: '',
        startTime: '',
        endTime: ''
      }]);
      
    } catch (error) {
      alert('❌ Error saving to database: ' + error.message);
      console.error('Save error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">Medical Data Entry</h1>
          <p className="text-gray-600">Enter patient information and save to database</p>
        </div>
        
        {showSetup && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-indigo-300">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-indigo-600" size={28} />
              <h2 className="text-2xl font-semibold text-gray-800">Database Setup</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="https://xxxxxxxxxxxxx.supabase.co"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supabase API Key (anon/public)
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>
              
              <button
                onClick={connectDatabase}
                className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md text-lg"
              >
                Connect to Database
              </button>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-2">📋 Quick Setup Guide:</p>
                    <ol className="list-decimal list-inside space-y-1.5 ml-2">
                      <li>Go to <span className="font-mono bg-white px-1 rounded">supabase.com</span> and sign up (free)</li>
                      <li>Click "New Project" and create your project</li>
                      <li>Go to <strong>Table Editor</strong> → <strong>Create Table</strong></li>
                      <li>Name it <span className="font-mono bg-white px-1 rounded">medical_records</span></li>
                      <li>Add columns: <span className="font-mono bg-white px-1 rounded">age</span> (int8), <span className="font-mono bg-white px-1 rounded">gender</span> (text), <span className="font-mono bg-white px-1 rounded">doctor_name</span> (text), <span className="font-mono bg-white px-1 rounded">disease</span> (text), <span className="font-mono bg-white px-1 rounded">start_time</span> (text), <span className="font-mono bg-white px-1 rounded">end_time</span> (text)</li>
                      <li>Go to <strong>Settings</strong> → <strong>API</strong> to get your URL and anon key</li>
                      <li>Paste them above and connect!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-6 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-800 font-semibold text-lg">Connected to Database</span>
            </div>
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              {showSetup ? 'Hide' : 'Show'} Setup
            </button>
          </div>
        )}

        <div className="space-y-5 mb-6">
          {entries.map((entry, index) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-indigo-300 transition">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">Patient Entry #{index + 1}</h2>
                {entries.length > 1 && (
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Remove this entry"
                  >
                    <Trash2 size={22} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={entry.age}
                    onChange={(e) => updateEntry(entry.id, 'age', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter patient age"
                    min="0"
                    max="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={entry.gender}
                    onChange={(e) => updateEntry(entry.id, 'gender', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Doctor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.doctorName}
                    onChange={(e) => updateEntry(entry.id, 'doctorName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter doctor's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Disease <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.disease}
                    onChange={(e) => updateEntry(entry.id, 'disease', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter disease/condition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={entry.startTime}
                      readOnly
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      placeholder="Click Start button"
                    />
                    <button
                      onClick={() => captureTime(entry.id, 'startTime')}
                      className="px-5 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition shadow-md"
                    >
                      Start
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={entry.endTime}
                      readOnly
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      placeholder="Click End button"
                    />
                    <button
                      onClick={() => captureTime(entry.id, 'endTime')}
                      className="px-5 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition shadow-md"
                    >
                      End
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addNewEntry}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition shadow-lg text-lg"
          >
            <Plus size={24} />
            Add Another Patient
          </button>

          <button
            onClick={saveToDatabase}
            disabled={!isConnected}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-lg transition shadow-lg text-lg ${
              isConnected 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={24} />
            Save to Database
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  );
}