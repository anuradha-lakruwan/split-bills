import type { Member } from '@/types';

/**
 * Enhanced Avatar Generation System
 * Creates unique, consistent avatars for group members
 */

// Extended color palette for more variety
const AVATAR_COLORS = [
  { bg: 'from-blue-500 to-blue-600', text: 'text-white', name: 'blue' },
  { bg: 'from-green-500 to-green-600', text: 'text-white', name: 'green' },
  { bg: 'from-purple-500 to-purple-600', text: 'text-white', name: 'purple' },
  { bg: 'from-pink-500 to-pink-600', text: 'text-white', name: 'pink' },
  { bg: 'from-indigo-500 to-indigo-600', text: 'text-white', name: 'indigo' },
  { bg: 'from-teal-500 to-teal-600', text: 'text-white', name: 'teal' },
  { bg: 'from-orange-500 to-orange-600', text: 'text-white', name: 'orange' },
  { bg: 'from-red-500 to-red-600', text: 'text-white', name: 'red' },
  { bg: 'from-yellow-500 to-yellow-600', text: 'text-black', name: 'yellow' },
  { bg: 'from-cyan-500 to-cyan-600', text: 'text-white', name: 'cyan' },
  { bg: 'from-emerald-500 to-emerald-600', text: 'text-white', name: 'emerald' },
  { bg: 'from-violet-500 to-violet-600', text: 'text-white', name: 'violet' },
] as const;

export interface AvatarInfo {
  initials: string;
  colorClass: string;
  textClass: string;
  colorName: string;
}

/**
 * Generate consistent avatar info for a member within a group context
 */
export const generateAvatarInfo = (member: Member, allMembers: Member[]): AvatarInfo => {
  // Step 1: Try single initials first
  const singleInitials = member.name.charAt(0).toUpperCase();
  
  // Check for conflicts with single initial
  const singleInitialConflicts = allMembers.filter(m => 
    m.id !== member.id && m.name.charAt(0).toUpperCase() === singleInitials
  );

  let initials: string;
  
  if (singleInitialConflicts.length === 0) {
    // No conflict, use single initial
    initials = singleInitials;
  } else {
    // Conflict exists, use first two letters or full initials
    const words = member.name.trim().split(/\s+/);
    
    if (words.length >= 2) {
      // Use first letter of first two words
      initials = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    } else {
      // Use first two letters of single word
      initials = member.name.slice(0, 2).toUpperCase();
    }
  }

  // Step 2: Assign color based on member's position in sorted member list
  // This ensures consistency even when members are added/removed
  const sortedMembers = [...allMembers].sort((a, b) => a.id.localeCompare(b.id));
  const memberIndex = sortedMembers.findIndex(m => m.id === member.id);
  const colorIndex = memberIndex % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];

  return {
    initials,
    colorClass: color.bg,
    textClass: color.text,
    colorName: color.name,
  };
};

/**
 * Generate a simple hash for consistent color assignment (fallback method)
 */
export const hashStringToColor = (str: string): AvatarInfo => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];
  
  // Simple initials for fallback
  const words = str.trim().split(/\s+/);
  const initials = words.length >= 2 
    ? words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
    : str.slice(0, 2).toUpperCase();

  return {
    initials,
    colorClass: color.bg,
    textClass: color.text,
    colorName: color.name,
  };
};
