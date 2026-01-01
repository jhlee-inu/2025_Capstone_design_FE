import { create } from "zustand";

const initialState = {
  nickname: "",
  nicknameChecked: false,
  nicknameAvailable: null,
  birth: "",
  gender: "",
  mbti: "",
  photoFile: null,
  skipPhoto: false,
  companion: "",
  sasangResult: "",
  personaKey: "",
};

const useSignupStore = create((set) => ({
    ...initialState,

    // 한 번에 여러 필드 업데이트
    patch: (partial) => set((s) => ({ ...s, ...partial })),

    // 개별 필드 업데이트
    setNickname: (nickname) => set({ nickname }),
    setNicknameChecked: (nicknameChecked) => set({ nicknameChecked }),
    setNicknameAvailable: (nicknameAvailable) => set({ nicknameAvailable }),
    setBirth: (birth) => set({ birth }),
    setGender: (gender) => set({ gender }),
    setMbti: (mbti) => set({ mbti }),
    setPhotoFile: (photoFile) => set({ photoFile }),
    setSkipPhoto: (skipPhoto) => set({ skipPhoto }),
    setCompanion: (companion) => set({ companion }),
    setSasangResult: (sasangResult) => set({ sasangResult }),
    setPersonaKey: (personaKey) => set({ personaKey }),

    resetForm: () => set({ ...initialState }),
  }));

export default useSignupStore;
