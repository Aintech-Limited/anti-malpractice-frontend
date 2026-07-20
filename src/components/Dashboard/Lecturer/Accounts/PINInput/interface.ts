export interface IPINInputProps {
  value: string[];
  onChange: (index: number, value: string) => void;
  label: string;
  showToggle?: boolean;
}
