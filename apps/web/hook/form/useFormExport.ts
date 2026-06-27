import { useState } from 'react';
import { trpc } from '@/trpc/client';
import { Parser } from 'json2csv';
import type { ExportField, TimePeriod } from '@/components/analytics/form/ExportSection';

interface UseFormExportProps {
  formSlug: string;
  fields: ExportField[];
}

export function useFormExport({ formSlug, fields }: UseFormExportProps) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(fields.map((f) => f.fieldId)),
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const utils = trpc.useUtils();

  const toggleField = (id: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedFields.size === 0) return;
    setIsExporting(true);

    try {
      let allResponses: any[] = [];
      let apiFields: any[] = [];
      let page = 1;
      const limit = 100;
      let totalFetched = 0;
      let totalResponsesCount = 0;

      do {
        const result = await utils.form.getFormResponses.fetch({ formSlug, page, limit });
        if (!result) throw new Error('No data returned from getFormResponses');
        
        if (page === 1) {
          apiFields = result.fields;
          totalResponsesCount = result.total;
        }
        
        allResponses.push(...result.responses);
        totalFetched += result.responses.length;
        
        // Safety break if the backend returns no responses on a page unexpectedly
        if (result.responses.length === 0) break;
        
        page++;
      } while (totalFetched < totalResponsesCount);
      
      let filteredResponses = allResponses;
      if (timePeriod !== 'all') {
        let start = new Date(0);
        let end = new Date();

        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        } else if (timePeriod === '7d') {
          start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (timePeriod === '14d') {
          start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
        } else if (timePeriod === '30d') {
          start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        
        filteredResponses = filteredResponses.filter(r => {
          const d = new Date(r.submittedAt);
          return d >= start && d <= end;
        });
      }

      const exportFields = apiFields.filter(f => selectedFields.has(f.fieldId));
      
      const data = filteredResponses.map(response => {
        const row: Record<string, any> = {
          Respondent: response.respondentIdentity,
          'Submitted At': new Date(response.submittedAt).toLocaleString(),
        };
        exportFields.forEach(f => {
          const answer = response.answers.find((a: any) => a.fieldId === f.fieldId);
          let val = answer ? answer.value : '';
          if (Array.isArray(val)) {
            val = val.join(', ');
          }
          row[f.label] = val;
        });
        return row;
      });

      const fieldsForCsv = ['Respondent', 'Submitted At', ...exportFields.map(f => f.label)];
      
      let csv = '';
      if (data.length > 0) {
        const parser = new Parser({ fields: fieldsForCsv });
        csv = parser.parse(data);
      } else {
        csv = fieldsForCsv.join(',') + '\n';
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vibecheck-analytics-${formSlug}-${timePeriod}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    selectedFields,
    setSelectedFields,
    timePeriod,
    setTimePeriod,
    isExporting,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    toggleField,
    handleExport,
  };
}
