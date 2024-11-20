import React, { useState } from "react";

function DrawerComponent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={toggleDrawer}>
        Show Drawer
      </button>

      {isDrawerOpen && (
        <div className="drawer drawer-start flex flex-col max-w-[90%] w-[300px]">
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="text-base font-semibold text-gray-900">
              Drawer Title
            </h3>
            <button
              className="btn btn-xs btn-icon btn-light"
              onClick={toggleDrawer}
            >
              <i className="ki-outline ki-cross"></i>
            </button>
          </div>
          <div className="p-5">Drawer content.</div>
        </div>
      )}
    </div>
  );
}

export default DrawerComponent;
