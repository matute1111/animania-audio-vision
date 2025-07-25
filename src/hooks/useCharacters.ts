import { useState, useEffect } from 'react';
import Airtable from 'airtable';

interface Character {
  id: string;
  name: string;
}

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = new Airtable({
          apiKey: "patL4bZK0WAfLG9gS.7e663429435beb6c5f19877f562cfa248a5a6299b864b77b39c727c1c6a715f0",
        }).base("app1Aa3hvMA5Ey2ME");

        const allCharacters: Character[] = [];

        await base("Characters")
          .select()
          .eachPage(
            function page(records, fetchNextPage) {
              records.forEach(function (record) {
                allCharacters.push({
                  id: record.id,
                  name: record.fields.Name as string,
                });
              });
              fetchNextPage();
            },
            function done(err) {
              if (err) {
                console.error("Error listing characters:", err);
                setError("Failed to fetch characters from Airtable");
                return;
              }
              setCharacters(allCharacters);
              setLoading(false);
            }
          );
      } catch (err) {
        setError("Failed to connect to Airtable");
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return { characters, loading, error };
};