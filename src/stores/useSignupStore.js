import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const useSignupStore = create(
  persist(
    (set) => ({
      ...initialState,

      // 한 번에 여러 필드 업데이트
      patch: (partial) => set((s) => ({ ...s, ...partial })),

      // 개별 필드 업데이트
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
    }),
    { name: "signup-store" } // persist key
  )
);

export default useSignupStore;
