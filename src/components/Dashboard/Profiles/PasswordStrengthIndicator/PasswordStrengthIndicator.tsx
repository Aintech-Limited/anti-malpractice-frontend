import {
  getPasswordStrength,
  getStrengthText,
  getStrengthColor,
} from "../utils/passwordValidation";

export const PasswordStrengthIndicator = ({
  password,
}: {
  password: string;
}) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const strengthText = getStrengthText(strength);
  const strengthColor = getStrengthColor(strength - 1);

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${
              i < strength ? strengthColor : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs mt-1 ${strength > 0 ? "text-gray-600" : "text-gray-400"}`}
      >
        {strength > 0 ? strengthText : "Enter a password"}
      </p>
    </div>
  );
};
