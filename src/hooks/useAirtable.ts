import { useState, useEffect } from 'react';
import Airtable from 'airtable';

interface PendingUpload {
  id: string;
  raw?: string;
  audio?: string;
  script?: string;
  title?: string;
  description?: string;
  category_id?: string;
  final?: string;
  status?: string;
}

export const useAirtable = () => {
  const [records, setRecords] = useState<PendingUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = new Airtable({
          apiKey: "patL4bZK0WAfLG9gS.7e663429435beb6c5f19877f562cfa248a5a6299b864b77b39c727c1c6a715f0",
        }).base("app1Aa3hvMA5Ey2ME");

        const allRecords: PendingUpload[] = [];

        await base("Pendientes")
          .select()
          .eachPage(
            function page(records, fetchNextPage) {
              records.forEach(function (record) {
                allRecords.push({
                  id: record.id,
                  ...record.fields,
                } as PendingUpload);
              });
              fetchNextPage();
            },
            function done(err) {
              if (err) {
                console.error("Error listing records:", err);
                setError("Failed to fetch records from Airtable");
                return;
              }
              setRecords(allRecords);
              setLoading(false);
            }
          );
      } catch (err) {
        setError("Failed to connect to Airtable");
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return { records, loading, error };
};