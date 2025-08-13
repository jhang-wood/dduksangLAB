// Mock realtime module for server-side rendering compatibility
export class RealtimeClient {
  channel() {
    return new RealtimeChannel();
  }
  
  disconnect() {}
  connect() {}
}

export class RealtimeChannel {
  on() { 
    return this; 
  }
  
  subscribe() { 
    return this; 
  }
  
  unsubscribe() { 
    return this; 
  }
}

export function createClient() {
  return new RealtimeClient();
}

export default {
  RealtimeClient,
  RealtimeChannel,
  createClient,
};