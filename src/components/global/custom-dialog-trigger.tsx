import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CustomDialogTriggerProps {
  header?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  footer?: string;
  className?: string;
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  header,
  content,
  children,
  description,
  footer,
  className
}) => {
  return (
    <div>CustomDialogTrigger</div>
  )
}

export default CustomDialogTrigger