import React from "react";
import { Accordion } from "@/components/ui/accordion";

interface AccordionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionWrapper: React.FC<AccordionWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <Accordion className={className} type="single" collapsible>
      {children}
    </Accordion>
  );
};

export default AccordionWrapper;
