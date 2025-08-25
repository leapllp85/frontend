import React from "react";
import { Badge } from "@chakra-ui/react";
interface ActionListingItemProps {
  title: string;
  status: string;
  action: string;
  actionUrl: string;
  createdAt: string;
  updatedAt: string;
}

const ActionListingItem: React.FC<ActionListingItemProps> = ({ 
  title, 
  status, 
  action, 
  actionUrl, 
  createdAt, 
  updatedAt 
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "!bg-green-100 !text-green-700";
      case "pending":
        return "!bg-yellow-100 !text-yellow-800";
      case "in progress":
        return "!bg-blue-100 !text-blue-700";
      default:
        return "!bg-gray-200 !text-gray-700";
    }
  };

  const isCompleted = status?.toLowerCase() === "completed";

  return (
    <div className="!w-full !p-4 !border !border-gray-200 !rounded-md !bg-white !shadow-sm !hover:shadow-md !transition-all !duration-200">
      <div className="flex flex-col gap-3">
        {/* Header: title + status */}
        <div className="flex justify-between items-start gap-2">
          <p className="text-gray-800 !font-semibold !text-sm !flex-1">{title}</p>
          {!isCompleted && (
            <Badge
              className={`!text-xs !font-medium !rounded-md !px-2 !py-1 ${getStatusColor(status)}`}
            >
              {status}
            </Badge>
          )}
        </div>

        {/* Dates */}
        <div className="!text-xs !text-gray-600 !space-y-1">
          {createdAt && <p className="!text-xs !text-gray-600">Created: {createdAt}</p>}
          {updatedAt && <p className="!text-xs !text-gray-600">Updated: {updatedAt}</p>}
        </div>

        {/* Action button */}
        {actionUrl && (
          <div>
            {isCompleted ? (
              <button
                disabled
                className="!text-green-700 !border !border-green-300 !px-3 !py-1 !text-sm !rounded !hover:cursor-not-allowed"
              >
                ✓ Completed
              </button>
            ) : (
              <a href={actionUrl} target="_blank" rel="noopener noreferrer">
                <button className="!bg-blue-600 !hover:bg-blue-700 !text-white !px-3 !py-1 !text-sm !rounded !transition-all !duration-200 !shadow !hover:-translate-y-0.5 !cursor-pointer !hover:scale-105 !active:scale-95 !disabled:opacity-50">
                  Complete Now →
                </button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionListingItem;
