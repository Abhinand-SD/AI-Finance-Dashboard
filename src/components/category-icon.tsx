import type { ExpenseCategory } from "@/lib/types";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Lightbulb,
  Ticket,
  HeartPulse,
  Plane,
  MoreHorizontal,
  type LucideProps,
} from "lucide-react";
import type { FC } from "react";

type CategoryIconProps = {
  category: ExpenseCategory;
} & LucideProps;

const iconMap: Record<ExpenseCategory, React.ElementType> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Shopping: ShoppingBag,
  Utilities: Lightbulb,
  Entertainment: Ticket,
  Health: HeartPulse,
  Travel: Plane,
  Other: MoreHorizontal,
};

export const CategoryIcon: FC<CategoryIconProps> = ({ category, ...props }) => {
  const Icon = iconMap[category] || MoreHorizontal;
  return <Icon {...props} />;
};
