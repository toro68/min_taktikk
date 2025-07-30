// Quick debug script to test element placement logic
const { JSDOM } = require('jsdom');

// Mock React environment
const dom = new JSDOM('<!DOCTYPE html><html><body><svg id="svg" viewBox="0 0 680 525"><rect x="0" y="0" width="680" height="525" fill="green"/></svg></body></html>');
global.window = dom.window;
global.document = dom.window.document;

// Test coordinate transformation function
function getSVGCoordinates(clientX, clientY, svgElement) {
  if (!svgElement || typeof clientX !== 'number' || typeof clientY !== 'number') {
    console.log('❌ Invalid input:', { clientX, clientY, hasElement: !!svgElement });
    return { x: 0, y: 0 };
  }

  if (!isFinite(clientX) || !isFinite(clientY)) {
    console.log('❌ Non-finite coordinates:', { clientX, clientY });
    return { x: 0, y: 0 };
  }

  const rect = {
    left: 0,
    top: 0, 
    width: 800,
    height: 600
  };
  
  console.log('📐 Client coordinates:', { clientX, clientY });
  console.log('📐 SVG rect:', rect);
  
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  
  console.log('📐 Relative coordinates:', { relativeX, relativeY });

  // Get viewBox - default to offensive pitch (680x525)
  const viewBoxWidth = 680;
  const viewBoxHeight = 525;
  
  const scaleX = viewBoxWidth / rect.width;
  const scaleY = viewBoxHeight / rect.height;
  
  console.log('📐 Scale factors:', { scaleX, scaleY });
  
  const transformedX = relativeX * scaleX;
  const transformedY = relativeY * scaleY;
  
  const result = {
    x: isFinite(transformedX) ? transformedX : 0,
    y: isFinite(transformedY) ? transformedY : 0
  };
  
  console.log('📐 Final SVG coordinates:', result);
  return result;
};

// Test some coordinate transformations
console.log('\n=== Testing coordinate transformations ===');

const svgElement = document.getElementById('svg');
console.log('\n🧪 Test 1: Click at center of screen (400, 300)');
getSVGCoordinates(400, 300, svgElement);

console.log('\n🧪 Test 2: Click at top-left (100, 100)');  
getSVGCoordinates(100, 100, svgElement);

console.log('\n🧪 Test 3: Click at bottom-right (700, 500)');
getSVGCoordinates(700, 500, svgElement);

// Test frame structure
console.log('\n=== Testing frame and element creation ===');

// Mock frame structure similar to what the app uses
const mockFrames = [{ elements: [], duration: 3 }];
const currentFrame = 0;

function simulateElementCreation(tool, coords, frames, frameIndex) {
  console.log(`\n🧪 Creating ${tool} element at:`, coords);
  
  if (!frames[frameIndex]) {
    console.log('❌ Frame does not exist at index:', frameIndex);
    return false;
  }
  
  const baseElement = {
    id: `${tool}-${Date.now()}`,
    x: coords.x,
    y: coords.y,
    type: tool
  };
  
  let newElement;
  switch (tool) {
    case 'player':
      newElement = {
        ...baseElement,
        number: '1'
      };
      break;
    case 'ball':
      newElement = baseElement;
      break;
    default:
      console.log('❌ Unknown tool:', tool);
      return false;
  }
  
  console.log('✅ Created element:', newElement);
  frames[frameIndex].elements.push(newElement);
  console.log('✅ Updated frame elements count:', frames[frameIndex].elements.length);
  
  return true;
}

// Test element creation
const testCoords = getSVGCoordinates(400, 300, svgElement);
simulateElementCreation('player', testCoords, mockFrames, 0);
simulateElementCreation('ball', { x: 200, y: 150 }, mockFrames, 0);

console.log('\n📊 Final frame state:', mockFrames[0]);