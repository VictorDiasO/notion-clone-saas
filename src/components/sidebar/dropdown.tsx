'use client';
import { useAppState } from '@/lib/providers/state-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/emoji-picker';

interface DropdownProps {
  title: string;
  id: string;
  listType: 'folder' | 'file';
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  title,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [ isEditing, setIsEditing ] = useState(false);
  
  const router = useRouter();
  const isFolder = listType === 'folder';
  
  const groupIdentifies = clsx('dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
  {
    'group/folder': isFolder,
    'group/file': !isFolder,
  });

  const listStyles = useMemo(() => 
    clsx('relative', {
      'border-none text-md': isFolder,
      'border-none text-[16px] ml-6 py-1': !isFolder,
    })
  , [isFolder]);

  const navigatePage = (accordionId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`);
    }
  }

  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;
    if (listType === 'folder') {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          workspaceId,
          folderId: id,
          folder: { iconId: selectedEmoji }
        }
      })
    }
  }

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className='hover:no-underline p-2 dark:text-muted-foreground text-sm'
        disabled={listType === 'file'}
      >
        <div className={groupIdentifies}>
          <div className='flex gap-4 items-center justify-center overflow-hidden '>
            <div className='relative'>
              <EmojiPicker getValue={onChangeEmoji}>
                {iconId}
              </EmojiPicker>
            </div>
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown