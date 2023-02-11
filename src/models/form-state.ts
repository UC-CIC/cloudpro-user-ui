export interface FormState { 
    state_status: string;
    state_hash: string;
    pro_pack: string;
    states: {
      [key:string]: {
        entry_response: any;
        nxt: string;
        entry_state: string;
        prev: string;
      }
    }
  }