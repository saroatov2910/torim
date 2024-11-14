import React from "react";

export interface IModalContext {
  open: (content: React.ReactNode) => void;
  close: () => void;
  content: React.ReactNode;
}

const ModalContext = React.createContext<IModalContext | null>(null);

export function ModalContextProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<React.ReactNode>(null);

  const open = (content: React.ReactNode) => {
    setContent(content);
  };

  const close = () => {
    setContent(null);
  };

  return <ModalContext.Provider value={{ open, close, content }}>{children}</ModalContext.Provider>;
}

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalContextProvider");
  }
  return context;
};
