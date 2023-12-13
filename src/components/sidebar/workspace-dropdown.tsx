'use client';
import { useAppState } from '@/lib/providers/state-provider';
import { workspace } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import SelectedWorkspace from './selected-workspace';

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  collaboratingWorkspaces: workspace[] | [];
  defaultValue: workspace | undefined;
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue
}) => {
  const { dispatch, state } = useAppState();
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({ type: 'SET_WORKSPACES', payload: {
        workspaces: [
          ...privateWorkspaces,
          ...collaboratingWorkspaces,
          ...sharedWorkspaces
        ].map(workspace => ({ ...workspace, folders: [] }))
      }
    })
    }
  }, [
    privateWorkspaces,
    collaboratingWorkspaces,
    sharedWorkspaces
  ]);

  const handleSelect = (option: workspace) => {
    setSelectedOption(option);
    setIsOpen(false);
  }

  return (
    <div
      className='relative inline-block text-left'
    >
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          { selectedOption
            ? <SelectedWorkspace
                workspace={selectedOption}
              />
            : 'Select a workspace'
          }
        </span>
      </div>
      <div>
        {isOpen && (
          <div className='origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group overflow-scroll border-[1px] border-muted'>
            <div className='!p-2'>
              { !!privateWorkspaces.length && (
                <>
                  <p className='text-muted-foreground'>
                    Private
                  </p>
                  <hr></hr>
                  {privateWorkspaces.map((workspace) => (
                    <SelectedWorkspace
                      key={workspace.id}
                      workspace={workspace}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              ) }
              { !!sharedWorkspaces.length && (
                <>
                  <p className='text-muted-foreground'>
                    Private
                  </p>
                  <hr></hr>
                  {sharedWorkspaces.map((workspace) => (
                    <SelectedWorkspace
                      key={workspace.id}
                      workspace={workspace}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              ) }
              { !!collaboratingWorkspaces.length && (
                <>
                  <p className='text-muted-foreground'>
                    Private
                  </p>
                  <hr></hr>
                  {collaboratingWorkspaces.map((workspace) => (
                    <SelectedWorkspace
                      key={workspace.id}
                      workspace={workspace}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              ) }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkspaceDropdown