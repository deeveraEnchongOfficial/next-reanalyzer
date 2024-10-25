import React from "react";

const loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center text-white bg-black/30 z-[99]">
      <p className="text-sm">loading..</p>
    </div>
  );
};

export default loading;
