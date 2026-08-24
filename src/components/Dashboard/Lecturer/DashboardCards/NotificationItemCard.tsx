import { TNotificationTypeEnum } from "@/src/lib/enums";

const NotificationItemCard = ({
  title,
  time,
  date,
  border = true,
  type,
  message,
}: {
  title: string;
  time: string;
  date: string;
  border?: boolean;
  type: TNotificationTypeEnum;
  message: string;
}) => (
  <div
    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${border ? "border-b border-gray-100" : ""}`}
  >
    <div className="flex justify-between mb-1">
      <h4 className="font-bold text-gray-800 text-sm">{type}</h4>
      <span className="text-gray-400 text-xs">{time}</span>
    </div>
    <p className="text-xs text-gray-600 font-medium">
      Title: {title}, Date: {date}
    </p>
    <p className="text-[10px] text-gray-400 mt-1">{message}</p>
  </div>
);

export default NotificationItemCard;
