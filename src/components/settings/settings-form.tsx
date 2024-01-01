'use client';
import React, { useRef, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useAppState } from '@/lib/providers/state-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Briefcase } from 'lucide-react';
import { Separator } from '@radix-ui/react-select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { updateWorkspace } from '@/lib/supabase/queries';
import { v4 } from 'uuid';

const SettingsForm = () => {
  const { toast } = useToast();
  const  { user } = useSupabaseUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const { state, workspaceId, dispatch } = useAppState();
  const [ permissions, setPermissions ] = useState('Private');
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace>();

  const titleTimeRef = useRef<ReturnType<typeof setTimeout>>();

  const [ uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;

    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: {
        workspace: {
          title: e.target.value
        },
        workspaceId
      },
    });

    if (titleTimeRef.current) clearTimeout(titleTimeRef.current);
    titleTimeRef.current = setTimeout(async () => {
      await updateWorkspace({ title: e.target.value }, workspaceId);
    }, 500);
  }

  const onChangeWorkspaceLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;
    
    const file = e.target.files?.[0];

    if (!file) return;
    const uuid = v4();
    setUploadingLogo(true);

    const { data, error } = await supabase.storage
      .from('workspace-logo')
      .upload(`workspaceLogo.${uuid}`, file, {
        cacheControl: '3600',
        upsert: true,
      })
    ;

    if (!error) {
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          workspace: {
            logo: data.path
          },
          workspaceId
        },
      });
      await updateWorkspace({ logo: data.path }, workspaceId);
      setUploadingLogo(false);
    }
  }

  return (
    <div className='flex gap-4 flex-col'>
      <p className='flex items-center gap-2 mt-6'>
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />
      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='workspaceName'
          className='text-sm text-muted-foreground'
        >
          Name
        </Label>
        <Input
          name='workspaceName'
          value={workspaceDetails ? workspaceDetails.title : ''}
          placeholder='Workspace Name'
          onChange={workspaceNameChange}
        />
        <Label
          htmlFor='workspaceLogo'
          className='text-sm text-muted-foreground'
        >
          Workspace Logo
        </Label>
        <Input
          name='workspaceLogo'
          type='file'
          accept='image/*'
          placeholder='Workspace Logo'
          onChange={onChangeWorkspaceLogo}
          disabled={uploadingLogo}
        />
      </div>
    </div>
  )
}

export default SettingsForm