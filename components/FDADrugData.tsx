"use client";

import { useEffect, useState } from "react";
import { getDrugLabel, getAdverseEventSummary, cleanFDAText, type DrugLabel, type AdverseEventSummary } from "../lib/openFDA";

interface FDADrugDataProps {
  drugName: string;
  onDataLoaded?: (data: { label: DrugLabel | null; events: AdverseEventSummary[] }) => void;
}

export default function FDADrugData({ drugName, onDataLoaded }: FDADrugDataProps) {
  useEffect(() => {
    async function fetchFDAData() {
      try {
        const [label, events] = await Promise.all([
          getDrugLabel(drugName),
          getAdverseEventSummary(drugName)
        ]);

        if (onDataLoaded) {
          onDataLoaded({ label, events });
        }
      } catch (err) {
        console.error('Error fetching FDA data:', err);
        if (onDataLoaded) {
          onDataLoaded({ label: null, events: [] });
        }
      }
    }

    fetchFDAData();
  }, [drugName, onDataLoaded]);

  return null; // This component doesn't render anything
}
