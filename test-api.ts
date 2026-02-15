import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const TOKEN = ''; // Bạn cần token của Super Admin

async function testPaymentsAPI() {
  try {
    console.log('Testing payments API...');
    
    const response = await axios.get(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testPaymentsAPI();
