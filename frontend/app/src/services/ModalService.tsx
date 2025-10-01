"use client";

import { Fragment, createContext, useContext, useMemo, useState } from "react";
import { Modal } from "../comps/Modal/Modal";

type ModalContextValue = {
  visible: boolean;
  setVisible: (nextVisible: boolean) => void;
  content: React.ReactNode;
  setContent: (nextContent: React.ReactNode) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(<Fragment />);

  const value = useMemo<ModalContextValue>(() => ({ visible, setVisible, content, setContent }), [visible, content]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (ctx === null) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
}

export function ModalRoot() {
  const { visible, setVisible, content } = useModal();
  if (!visible) return null;
  return (
    <Modal onClose={() => setVisible(false)}>
      {content}
    </Modal>
  );
}