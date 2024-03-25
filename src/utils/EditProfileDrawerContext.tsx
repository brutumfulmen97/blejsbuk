import { RefObject, createContext, useContext } from "react";

type EditProfileDrawerContext = {
  isOpen: boolean;
  setIsOpen: (editRef: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
};

const EditProfileDrawerContext = createContext<EditProfileDrawerContext>({
  isOpen: false,
  setIsOpen: () => {},
  message: "",
  setMessage: () => {},
});

export default EditProfileDrawerContext;

export const useEditProfileDrawerContext = () => {
  const { isOpen, setIsOpen, message, setMessage } = useContext(
    EditProfileDrawerContext
  );

  if (isOpen === undefined) {
    throw new Error(
      "Edit Drawer context must be used within a EditProfileDrawerContext provider"
    );
  }

  return { isOpen, setIsOpen, message, setMessage };
};
