const axios = require('axios');

class ExotelAdapter {
  constructor(apiKey, apiToken, sid) {
    this.apiKey = apiKey;
    this.apiToken = apiToken;
    this.sid = sid;
    this.baseUrl = 'https://api.exotel.com/v1/Accounts';
  }

  /**
   * Make outbound call
   */
  async makeOutboundCall(fromNumber, toNumber, callbackUrl) {
    try {
      const url = `${this.baseUrl}/${this.sid}/Calls/connect.json`;
      
      const response = await axios.post(url, {
        From: fromNumber,
        To: toNumber,
        CallbackUrl: callbackUrl,
        TimeLimit: 3600 // 1 hour
      }, {
        auth: {
          username: this.apiKey,
          password: this.apiToken
        }
      });
      
      return {
        success: true,
        callId: response.data.Call?.Sid,
        status: response.data.Call?.Status,
        data: response.data
      };
    } catch (error) {
      console.error('Exotel outbound call error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get call details
   */
  async getCallDetails(callId) {
    try {
      const url = `${this.baseUrl}/${this.sid}/Calls/${callId}.json`;
      
      const response = await axios.get(url, {
        auth: {
          username: this.apiKey,
          password: this.apiToken
        }
      });
      
      return {
        success: true,
        data: response.data.Call
      };
    } catch (error) {
      console.error('Exotel call details error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Transfer call to another number
   */
  async transferCall(callId, transferToNumber) {
    try {
      const url = `${this.baseUrl}/${this.sid}/Calls/${callId}/Transfer.json`;
      
      const response = await axios.post(url, {
        TransferTo: transferToNumber,
        CallerId: this.sid
      }, {
        auth: {
          username: this.apiKey,
          password: this.apiToken
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Exotel transfer error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Disconnect call
   */
  async disconnectCall(callId) {
    try {
      const url = `${this.baseUrl}/${this.sid}/Calls/${callId}/Disconnect.json`;
      
      const response = await axios.post(url, {}, {
        auth: {
          username: this.apiKey,
          password: this.apiToken
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Exotel disconnect error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send SMS
   */
  async sendSMS(toNumber, message) {
    try {
      const url = `${this.baseUrl}/${this.sid}/Sms/send.json`;
      
      const response = await axios.post(url, {
        From: 'Bolti',
        To: toNumber,
        Body: message
      }, {
        auth: {
          username: this.apiKey,
          password: this.apiToken
        }
      });
      
      return {
        success: true,
        messageId: response.data.SMSMessage?.Sid,
        data: response.data
      };
    } catch (error) {
      console.error('Exotel SMS error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = ExotelAdapter;
