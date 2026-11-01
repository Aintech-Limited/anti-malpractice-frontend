import { TSidebarsEnumValue } from "@/src/lib/enums";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface INavGroup {
  name: TSidebarsEnumValue;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  path?: string;
  children: {
    name: string;
    path: string;
  }[];
}
