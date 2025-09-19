import React, { useState } from 'react';
import { FileText, Download, Mail, Calendar } from 'lucide-react';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { calculateDailyRecords, formatTime, formatDate, formatDuration } from '../utils/timeCalculations';
import { Report } from '../types';

export function Reports() {
  const { entries } = useTimeEntries();
  const [selectedPeriod, setSelectedPeriod] = useState<number>(10);
  const [showReport, setShowReport] = useState(false);

  const generateReport = (): Report => {
    const records = calculateDailyRecords(entries, selectedPeriod);
    const totalHours = records.reduce((sum, record) => sum + record.duration_hours, 0);
    const totalDays = records.filter(record => record.duration_hours > 0).length;

    return {
      period: `${selectedPeriod} derniers jours`,
      total_days: totalDays,
      total_hours: totalHours,
      records
    };
  };

  const exportReport = () => {
    const report = generateReport();
    const csvContent = generateCSV(report);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-garde-${selectedPeriod}j-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (report: Report): string => {
    const headers = ['Date', 'Enfant', 'Arrivée', 'Départ', 'Durée (heures)'];
    const rows = report.records.map(record => [
      formatDate(record.date),
      record.child_name,
      record.arrival_time ? formatTime(record.arrival_time) : '--',
      record.departure_time ? formatTime(record.departure_time) : '--',
      formatDuration(record.duration_hours)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const sendByEmail = () => {
    const report = generateReport();
    const emailBody = `
Rapport d'heures de garde - ${report.period}

Résumé:
- Nombre de jours avec garde: ${report.total_days}
- Total des heures: ${formatDuration(report.total_hours)}

Détail par jour:
${report.records
  .filter(r => r.duration_hours > 0)
  .map(record => 
    `${formatDate(record.date)} - ${record.child_name}: ${
      record.arrival_time ? formatTime(record.arrival_time) : '--'
    } à ${
      record.departure_time ? formatTime(record.departure_time) : '--'
    } (${formatDuration(record.duration_hours)})`
  )
  .join('\n')}
    `.trim();

    const mailtoUrl = `mailto:?subject=Rapport d'heures de garde - ${report.period}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  const report = showReport ? generateReport() : null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Rapports</h3>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Période de rapport
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[10, 20, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPeriod === days
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              <div className="text-sm font-medium">{days} jours</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowReport(!showReport)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {showReport ? 'Masquer le rapport' : 'Générer le rapport'}
        </button>
        
        <button
          onClick={exportReport}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        
        <button
          onClick={sendByEmail}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
      </div>

      {showReport && report && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Rapport - {report.period}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Jours avec garde:</span>
                <span className="ml-2 font-semibold">{report.total_days}</span>
              </div>
              <div>
                <span className="text-gray-600">Total des heures:</span>
                <span className="ml-2 font-semibold">{formatDuration(report.total_hours)}</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enfant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrivée</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Départ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.records.filter(r => r.duration_hours > 0).map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {record.child_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.arrival_time ? formatTime(record.arrival_time) : '--'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.departure_time ? formatTime(record.departure_time) : '--'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                      {formatDuration(record.duration_hours)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.records.filter(r => r.duration_hours > 0).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune donnée de garde pour cette période</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}