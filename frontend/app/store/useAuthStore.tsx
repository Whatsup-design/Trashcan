import {create} from 'zustand';

type user = {
  id:number;
  student_id: string;
  role: string;
}

type AuthState = {
  user: user | null;
  token: string | null;

  setAuth: (user: user, token: string) => void;
  loadAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (user: user, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({user, token});


  },
  loadAuth: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
      set({user, token});
    }

  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    set({user: null, token: null});
  },
}));