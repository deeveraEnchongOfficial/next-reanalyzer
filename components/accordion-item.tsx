import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionItemComponentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  classNameTitle?: string;
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  className,
  title,
  children,
  classNameTitle,
}) => {
  return (
    <AccordionItem className={className} value="item-1">
      <AccordionTrigger className={classNameTitle}>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
};

export default AccordionItemComponent;
