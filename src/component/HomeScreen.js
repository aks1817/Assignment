import React from "react";
import Chips from "./Chips";

const HomeScreen = () => {
  return (
    <div>
      <Chips placeholder="Type to search" max={10} />
    </div>
  );
};

export default HomeScreen;
