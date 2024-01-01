import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { cookies } from 'next/headers';
import { getCollaboratingWorkspaces, getFolders, getPrivateWorkspaces, getSharedWorkspaces, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import WorkspaceDropdown from './workspace-dropdown';
import PlanUsage from './plan-usage';
import NativeNavigation from './native-navigation';
import { ScrollArea } from '../ui/scroll-area';
import FoldersDropdownList from './folders-dropdown-list';
import UserCard from './user-card';

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });
 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const {
    data: subscriptionStatus,
    error: subscriptionError
  } = await getUserSubscriptionStatus(user.id);

  const {
    data: workspaceFoldersData,
    error: foldersError
  } = await getFolders(params.workspaceId);

  if (subscriptionError || foldersError) redirect('/dashboard');

  const [
    privateWorkspaces,
    collaboratingWorkspaces,
    sharedWorkspaces
  ] = await Promise.all([
    getPrivateWorkspaces(user.id),
    getCollaboratingWorkspaces(user.id),
    getSharedWorkspaces(user.id)
  ]);

  return (
    <aside
      className={twMerge('hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between', className)}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces
          ].find((workspace) => workspace.id === params.workspaceId)}
        />
        <PlanUsage
          foldersLength={workspaceFoldersData?.length ?? 0}
          subscription={subscriptionStatus}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea
          className='overflow-auto relative h-[450px] '
        >
          <div
            className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40"
          />
          <FoldersDropdownList
            workspaceFolders={workspaceFoldersData ?? []}
            workspaceId={params.workspaceId}
          />
        </ScrollArea>
      </div>
      <UserCard subscription={subscriptionStatus} />
    </aside>
  )
}

export default Sidebar