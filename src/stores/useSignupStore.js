import { create } from "zustand";

const initialState = {
  nickname: "",
  nicknameChecked: false,
  nicknameAvailable: null,
  birth: "",
  mbti: "",
  photoFile: null,
  skipPhoto: false,
  companion: "",
  sasangResult: "",
  personaKey: "",
};

const useSignupStore = create((set) => ({
  ...initialState,
  setNickname: (nickname) => set({ nickname }),
  setNicknameChecked: (nicknameChecked) => set({ nicknameChecked }),
  setNicknameAvailable: (nicknameAvailable) => set({ nicknameAvailable }),
  setBirth: (birth) => set({ birth }),
  setMbti: (mbti) => set({ mbti }),
  setPhotoFile: (photoFile) => set({ photoFile }),
  setSkipPhoto: (skipPhoto) => set({ skipPhoto }),
  setCompanion: (companion) => set({ companion }),
  setSasangResult: (sasangResult) => set({ sasangResult }),
  setPersonaKey: (personaKey) => set({ personaKey }),
  resetForm: () => set(initialState),
}));

export default useSignupStore;
