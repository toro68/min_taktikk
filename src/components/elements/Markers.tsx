import React from 'react';

const Markers: React.FC = () => {
  return (
    <defs>
      {/* Standard pil */}
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
      </marker>
      
      {/* Rød pil */}
      <marker
        id="redArrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff0000" />
      </marker>
      
      {/* Blå pil */}
      <marker
        id="blueArrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#0000ff" />
      </marker>
      
      {/* Grønn pil */}
      <marker
        id="greenArrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#00aa00" />
      </marker>
      
      {/* Oransje pil */}
      <marker
        id="orangeArrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff9900" />
      </marker>
      
      {/* Lilla pil */}
      <marker
        id="purpleArrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#9900ff" />
      </marker>
      
      {/* Endlinje */}
      <marker
        id="endline"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <line x1="0" y1="0" x2="0" y2="10" stroke="black" strokeWidth="2" />
      </marker>
      
      {/* Pluss */}
      <marker
        id="plus"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 5 0 L 5 10 M 0 5 L 10 5" stroke="black" strokeWidth="2" fill="none" />
      </marker>
      
      {/* X-markør */}
      <marker
        id="xmark"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 10 M 0 10 L 10 0" stroke="black" strokeWidth="2" fill="none" />
      </marker>

      {/* Forhåndsvisningsmarkører for LineStyleSelector */}
      <marker
        id="previewArrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
      </marker>

      <marker
        id="previewArrow2"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
      </marker>

      <marker
        id="previewRedArrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />
      </marker>

      <marker
        id="previewBlueArrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="blue" />
      </marker>

      <marker
        id="previewGreenArrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="green" />
      </marker>

      <marker
        id="previewOrangeArrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="orange" />
      </marker>

      <marker
        id="previewPurpleArrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="purple" />
      </marker>

      <marker
        id="previewEndline"
        viewBox="0 0 10 10"
        refX="0"
        refY="4"
        markerWidth="4"
        markerHeight="8"
        orient="auto"
      >
        <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1" />
      </marker>

      <marker
        id="previewPlus"
        viewBox="0 0 10 10"
        refX="4"
        refY="4"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1" />
      </marker>

      <marker
        id="previewXmark"
        viewBox="0 0 10 10"
        refX="4"
        refY="4"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1" />
      </marker>
    </defs>
  );
};

export default Markers; 