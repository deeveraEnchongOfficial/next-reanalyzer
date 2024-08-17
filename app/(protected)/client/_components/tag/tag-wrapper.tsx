import React from "react";
import TagItem from "./tag-item";

interface TagItem {
  id: string | number;
  content: string;
}

interface TagWrapperProps {
  tagList: TagItem[];
}

const TagWrapper: React.FC<TagWrapperProps> = ({ tagList }) => {
  return (
    <div className="flex flex-wrap gap-2 my-2">
      {tagList.map((item) => (
        <TagItem content={item.content} key={item.id} />
      ))}
    </div>
  );
};

export default TagWrapper;
