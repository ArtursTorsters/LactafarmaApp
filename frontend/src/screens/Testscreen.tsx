// In any component
import { apiService } from '../services/api/Api';

const testApi = async () => {
  try {
    const result = await apiService.searchDrugs('paracetamol');
    console.log('API Result:', result);
    // Should show the detailed paracetamol info!
  } catch (error) {
    console.error('API Error:', error);
  }
};

testApi()
