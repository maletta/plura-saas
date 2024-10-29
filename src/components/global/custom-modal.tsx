"use client";
import { useModal } from "@/providers/modal-provider";
import React, { PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface ICustomModalProps extends PropsWithChildren {
  title: string;
  subheading: string;
  defaultOpen?: boolean;
};

const CustomModal: React.FC<ICustomModalProps> = ({
  defaultOpen,
  subheading,
  title,
  children
}) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog
      open={isOpen || defaultOpen}
      onOpenChange={setClose}
    >
      <DialogContent className="overflow-scroll md:max-h-[700px] md:h-fit h-screen bg-card">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal;