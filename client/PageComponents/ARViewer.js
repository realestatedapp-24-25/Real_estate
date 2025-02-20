import React, { useEffect } from "react";
import "aframe";

const ARViewer = ({ modelUrl }) => {
  useEffect(() => {
    // Ensure A-Frame is initialized
    if (typeof window !== "undefined" && window.AFRAME) {
      console.log("A-Frame is ready!");
    }
  }, []);

  return (
    <a-scene embedded arjs="sourceType: webcam;">
      {/* Add a 3D house model */}
      <a-entity
        gltf-model={modelUrl}
        scale="0.5 0.5 0.5"
        position="0 0 -2"
        rotation="0 180 0"
      ></a-entity>

      {/* Add a camera */}
      <a-entity camera></a-entity>
    </a-scene>
  );
};

export default ARViewer;
