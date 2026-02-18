"use client";

import { useEffect, useState } from "react";
import { getDrugLabel, getAdverseEventSummary, cleanFDAText, getFirstAvailable, type DrugLabel, type AdverseEventSummary } from "../lib/openFDA";

interface FDADrugInfoProps {
  drugName: string;
}

export default function FDADrugInfo({ drugName }: FDADrugInfoProps) {
  const [drugLabel, setDrugLabel] = useState<DrugLabel | null>(null);
  const [adverseEvents, setAdverseEvents] = useState<AdverseEventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFDAData() {
      setLoading(true);
      setError(false);

      try {
        const [label, events] = await Promise.all([
          getDrugLabel(drugName),
          getAdverseEventSummary(drugName)
        ]);

        setDrugLabel(label);
        setAdverseEvents(events);
      } catch (err) {
        console.error('Error fetching FDA data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFDAData();
  }, [drugName]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', color: '#666' }}>Loading FDA data...</div>
      </div>
    );
  }

  if (error || (!drugLabel && adverseEvents.length === 0)) {
    return (
      <div style={{ padding: '20px', background: '#f7fafc', borderRadius: '8px', marginTop: '20px' }}>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          FDA data not available for this medication at this time.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#1a202c' }}>
        FDA Drug Information
      </h2>

      {/* Drug Label Information */}
      {drugLabel && (
        <div style={{ marginBottom: '32px' }}>
          {/* Purpose */}
          {drugLabel.purpose && drugLabel.purpose.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '20px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Purpose
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#4a5568' }}>
                {cleanFDAText(drugLabel.purpose)}
              </p>
            </div>
          )}

          {/* Indications and Usage */}
          {drugLabel.indications_and_usage && drugLabel.indications_and_usage.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '20px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Indications and Usage
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#4a5568' }}>
                {cleanFDAText(drugLabel.indications_and_usage)}
              </p>
            </div>
          )}

          {/* Warnings */}
          {drugLabel.warnings && drugLabel.warnings.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '20px', background: '#fff5f5', borderRadius: '8px', borderLeft: '4px solid #f56565' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#c53030' }}>
                ⚠️ Warnings
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#4a5568' }}>
                {cleanFDAText(drugLabel.warnings)}
              </p>
            </div>
          )}

          {/* Dosage and Administration */}
          {drugLabel.dosage_and_administration && drugLabel.dosage_and_administration.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '20px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #4299e1' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Dosage and Administration
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#4a5568' }}>
                {cleanFDAText(drugLabel.dosage_and_administration)}
              </p>
            </div>
          )}

          {/* Active Ingredients */}
          {drugLabel.active_ingredient && drugLabel.active_ingredient.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '20px', background: '#f7fafc', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Active Ingredients
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#4a5568' }}>
                {cleanFDAText(drugLabel.active_ingredient)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Adverse Events */}
      {adverseEvents.length > 0 && (
        <div style={{ marginTop: '32px', padding: '24px', background: '#fffaf0', borderRadius: '8px', border: '1px solid #fbd38d' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>
            📊 Reported Adverse Events
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
            Based on FDA adverse event reports. These are reported side effects and do not necessarily indicate causation. Always consult your healthcare provider.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {adverseEvents.slice(0, 12).map((event, index) => (
              <div 
                key={index}
                style={{
                  padding: '12px 16px',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '14px', color: '#2d3748', textTransform: 'capitalize' }}>
                  {event.term.toLowerCase()}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#667eea',
                  background: '#edf2f7',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {event.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FDA Disclaimer */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#edf2f7', borderRadius: '6px', fontSize: '13px', color: '#4a5568', lineHeight: '1.6' }}>
        <strong>Source:</strong> U.S. Food and Drug Administration (FDA) OpenFDA API. This information is for educational purposes only and should not replace professional medical advice.
      </div>
    </div>
  );
}
