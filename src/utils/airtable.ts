
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: "patL4bZK0WAfLG9gS.7e663429435beb6c5f19877f562cfa248a5a6299b864b77b39c727c1c6a715f0",
}).base("app1Aa3hvMA5Ey2ME");

export interface VideoRecord {
  raw?: boolean;
  audio?: boolean;
  script?: string;
  title?: string;
  description?: string;
  category_id?: string;
  final?: boolean;
  status?: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  created_at: string;
}

export const createVideoRecord = async (data: VideoRecord): Promise<string> => {
  try {
    const record = await base("Pendientes").create([
      {
        fields: {
          raw: data.raw || false,
          audio: data.audio || false,
          script: data.script || "",
          title: data.title || "",
          description: data.description || "",
          category_id: data.category_id || "",
          final: data.final || false,
          status: data.status || "PENDING"
        }
      }
    ]);
    
    return record[0].id;
  } catch (error) {
    console.error("Error creating record:", error);
    throw new Error("Failed to create video record");
  }
};

export const updateVideoRecord = async (recordId: string, data: Partial<VideoRecord>): Promise<void> => {
  try {
    await base("Pendientes").update([
      {
        id: recordId,
        fields: data
      }
    ]);
  } catch (error) {
    console.error("Error updating record:", error);
    throw new Error("Failed to update video record");
  }
};

export const getVideoRecord = async (recordId: string): Promise<VideoRecord & { id: string }> => {
  try {
    const record = await base("Pendientes").find(recordId);
    return {
      id: record.id,
      ...record.fields
    } as VideoRecord & { id: string };
  } catch (error) {
    console.error("Error fetching record:", error);
    throw new Error("Failed to fetch video record");
  }
};

export const validateUser = async (email: string, password: string): Promise<UserRecord | null> => {
  try {
    const records = await base("Usuarios")
      .select({
        filterByFormula: `AND({email} = '${email}', {password} = '${password}', {active} = TRUE())`
      })
      .firstPage();

    if (records.length > 0) {
      const record = records[0];
      return {
        id: record.id,
        email: record.fields.email as string,
        name: record.fields.name as string,
        role: record.fields.role as string,
        active: record.fields.active as boolean,
        created_at: record.fields.created_at as string,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error validating user:", error);
    throw new Error("Failed to validate user");
  }
};
