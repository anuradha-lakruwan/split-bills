import { useApp } from '@/context/AppContext';
import type { Member } from '@/types';

/**
 * Hook to provide avatar context for consistent avatar generation
 */
export const useAvatarContext = () => {
  const { state } = useApp();
  
  return {
    allMembers: state.currentGroup?.members || [],
    getMemberById: (id: string): Member | undefined => 
      state.currentGroup?.members.find(m => m.id === id),
  };
};

/**
 * Hook for getting enhanced avatar props with group context
 */
export const useEnhancedAvatar = (name: string, memberId?: string) => {
  const { allMembers, getMemberById } = useAvatarContext();
  
  const member = memberId ? getMemberById(memberId) : 
    allMembers.find(m => m.name === name);
  
  return {
    name,
    member,
    allMembers,
  };
};
