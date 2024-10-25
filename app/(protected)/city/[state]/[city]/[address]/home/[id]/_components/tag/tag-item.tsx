import React from "react";

interface TagItemProps {
  content: string;
}

const TagItem: React.FC<TagItemProps> = ({ content }) => {
  return (
    <span className="bg-gray-200 px-3 md:px-4 py-1 rounded-full text-xs md:text-sm">
      {content}
    </span>
  );
};

export default TagItem;
