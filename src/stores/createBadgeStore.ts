import type { BoundStateCreator } from "~/hooks/useBoundStore";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface BadgeSlice {
  badges: Badge[];
  addBadge: (badge: Badge) => void;
  hasBadge: (badgeId: string) => boolean;
}

export const createBadgeSlice: BoundStateCreator<BadgeSlice> = (set, get) => ({
  badges: [],
  addBadge: (badge) => {
    if (!get().hasBadge(badge.id)) {
      set({ badges: [...get().badges, badge] });
    }
  },
  hasBadge: (badgeId) => {
    return get().badges.some(badge => badge.id === badgeId);
  }
});