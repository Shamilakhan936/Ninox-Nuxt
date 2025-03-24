import axios from 'axios';
import 'dotenv/config';
// Ninox API client
export default class NinoxClient {
  private baseUrl: string;
  private apiKey: string;
  private teamId: string;
  private databaseId: string;

  constructor() {
    this.baseUrl = 'https://api.ninox.com/v1';
    this.apiKey = process.env.NINOX_API_KEY || '';
    this.teamId = process.env.NINOX_TEAM_ID || '';
    this.databaseId = process.env.NINOX_DATABASE_ID || '';
  }

  async getRecords(tableId: string) {
    const url = `${this.baseUrl}/teams/${this.teamId}/databases/${this.databaseId}/tables/${tableId}/records`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching records from Ninox:', error);
      throw error;
    }
  }

  async createRecord(tableId: string, data: any) {
    const url = `${this.baseUrl}/teams/${this.teamId}/databases/${this.databaseId}/tables/${tableId}/records`;
    
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating record in Ninox:', error);
      throw error;
    }
  }

  // Add more methods as needed for your application
}
