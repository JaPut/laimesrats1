const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const blocks = document.querySelectorAll('.block');
const restartBtn = document.getElementById('restartBtn');

let angle = 0;
let names = ["Name1", "Name2", "Name3", "Name4", "Name5", "Name6", "Name7", "Name8"];
let iconChars = ['\uf0e0', '\uf03e', '\uf057', '\uf2bd', '\uf256', '\uf2dc', '\uf186', '\uf118'];
let colors = ["#f44336", "#e91e63", "#fbff05", "#ffd23c", "#3965c4", "#2196f3", "#50fca6", "#4caf50"];
let currentBlock = null;

document.getElementById('sendBtn').addEventListener('click', function() {
  // Retrieve input values
  let inputs = document.querySelectorAll('.inputs-container input');
  let filledValues = Array.from(inputs)
    .map(input => input.value.trim()) // Get trimmed values
    .filter(value => value !== '');   // Filter out empty values

  // Now call drawWheel with the filled values
  drawWheel(filledValues);
});

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px "Font Awesome 5 Free"'; // Make sure the font name matches the one you have loaded
    ctx.textAlign = 'center'; // Center the icons
    ctx.textBaseline = 'middle'; // Align the middle of the icon to the coordinates
  
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.arc(200, 200, 200, angle + (Math.PI / 4 * i), angle + (Math.PI / 4 * (i + 1)));
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.closePath();
  
      // Draw icons
      let textAngle = angle + (Math.PI / 4 * (i + 0.5));
      let iconX = 200 + (150 * Math.cos(textAngle));
      let iconY = 200 + (150 * Math.sin(textAngle));
      ctx.fillStyle = 'black'; // Color of the icons
      ctx.fillText(iconChars[i], iconX, iconY);
    }
  }
  

function spinWheel() {
    let initialSpeed = 0.15; // Fast initial speed
    let stopTime = Math.random() * (7 - 4) + 4; // Random stop time between 4 and 7 seconds
    let deceleration = initialSpeed / (stopTime * 60); // Deceleration to stop the wheel in the random stop time at 60 frames per second
    let speed = initialSpeed;
    let spin = setInterval(() => {
        angle += speed;
        drawWheel();
        if (speed <= 0) {
          clearInterval(spin);
          highlightBlock(); // This function will set the currentBlock to the stopped block
  
          // Get the color of the currentBlock
          let currentColor = currentBlock.style.backgroundColor;
  
          // Check if there is a block with text (non-empty) and a matching color
          let nonEmptyBlocksWithMatchingColor = Array.from(blocks).filter(block => {
              let blockText = block.dataset.name.trim();
              let blockColor = block.style.backgroundColor;
              return blockText && blockColor === currentColor;
          });
  
          if (nonEmptyBlocksWithMatchingColor.length > 0) {
            // A non-empty block with matching color was found, so trigger fireworks
            triggerFireworks();
        } else {
            // No non-empty block with matching color found, so spin again after a short delay
            setTimeout(spinWheel, 5); // 2 second delay before spinning again
        }
    } else {
        speed = Math.max(speed - deceleration, 0); // Ensure speed doesn't become negative
        }
    }, 1000 / 60); // 60 frames per second
}
function triggerFireworks() {
  // Select the .updiv element
  const updiv = document.querySelector('.updiv');
  // Select the inputs container
  const inputsContainer = document.querySelector('.inputs-container');

  if (!updiv || !inputsContainer) {
      console.error('The required elements were not found.');
      return;
  }

  // Select the .firework elements within .updiv
  const fireworks = updiv.querySelectorAll('.firework');

  // Make the .firework elements visible and change the background of .updiv to black
  updiv.style.backgroundColor = 'black'; // Set the background color to black
  fireworks.forEach(fw => {
      fw.style.visibility = 'visible';
  });
  
  // Hide the inputs container
  inputsContainer.style.visibility = 'hidden';

  // Set a timeout to hide the fireworks, show the inputs container, and reset the background color of .updiv after 5 seconds
  setTimeout(() => {
      fireworks.forEach(fw => {
          fw.style.visibility = 'hidden';
      });
      updiv.style.backgroundColor = ''; // Reset the background color
      // Show the inputs container
      inputsContainer.style.visibility = 'visible';
  }, 5000); // 5 seconds
}

function highlightBlock() {
  let index = Math.floor((8 - (angle % (Math.PI * 2)) / (Math.PI / 4)) % 8);
  currentBlock = blocks[index];

  // Hide all blocks
  blocks.forEach(block => block.style.display = 'none');

  // Show and center the current block within the .blocks container
  const blocksContainer = document.querySelector('.column.left .blocks');
  currentBlock.style.display = 'block';
  currentBlock.style.position = 'absolute';
  currentBlock.style.top = '50%';
  currentBlock.style.left = '50%';
  currentBlock.style.transform = 'translate(-50%, -50%)';
  currentBlock.style.zIndex = '1000';

  // Set the current block to blink
  currentBlock.style.animation = 'blinkingEffect 1s infinite';

  // Adjust the size of the .blocks container if necessary
  blocksContainer.style.position = 'relative';
  blocksContainer.style.height = '100%'; // Make sure the container is full height
  blocksContainer.style.display = 'flex';
  blocksContainer.style.justifyContent = 'center';
  blocksContainer.style.alignItems = 'center';
}

function resetBlockPositions() {
  // Reset the .blocks container styles
  const blocksContainer = document.querySelector('.column.left .blocks');
  blocksContainer.style.position = 'static';
  blocksContainer.style.height = 'auto';
  blocksContainer.style.display = 'block';

  // Show and reset all blocks
  blocks.forEach(block => {
      block.style.display = 'block';
      block.style.position = 'static';
      block.style.top = 'auto';
      block.style.left = 'auto';
      block.style.transform = 'none';
      block.style.zIndex = 'auto';
      block.style.animation = 'none'; // Stop blinking
  });

  currentBlock = null; // Clear the current block reference
}

startBtn.addEventListener('click', () => {
    spinWheel();
});

function stopHighlightingBlocks() {
  blocks.forEach(block => {
      block.style.animation = 'none'; // This assumes the highlight is done via CSS animation
  });
  currentBlock = null; // Reset the current block
}

function restartGame() {
    // Reset angle
    angle = 0;

    // Stop any potential blinking
    if (currentBlock) {
        currentBlock.style.animation = 'none';
    }

    // Clear the canvas and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel();
}

document.getElementById('restartBtn').addEventListener('click', function() {
  stopHighlightingBlocks(); // This function should clear any highlight effects
  resetBlockPositions();
  restartGame(); // Call this function to reset the game state
});

// Initial draw
drawWheel();

document.addEventListener('DOMContentLoaded', function () {
    // Function to update the button names
    function updateButtonNames() {
        // Get all block elements
        const blocks = document.querySelectorAll('.block');
        // Get all golden buttons
        const buttons = document.querySelectorAll('.golden-button');

        // Loop through all blocks and buttons to set the names
        blocks.forEach((block, index) => {
            if (buttons[index]) { // Check if the button exists
                buttons[index].textContent = block.textContent || `Button ${index + 1}`;
            }
        });
    }

    // Observe changes in the text content of the blocks
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                updateButtonNames(); // Update the button names if there's a change in the text content
            }
        });
    });

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, characterData: true, subtree: true };

    // Get all block elements and observe each for changes
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block) => {
        observer.observe(block, config);
    });

    // Call the function to set the initial button names
    updateButtonNames();
});


const defaultValues = {
    "Name1": "IZVĒLE_1",
    "Name2": "IZVĒLE_2",
    "Name3": "IZVĒLE_3",
    "Name4": "IZVĒLE_4",
    "Name5": "IZVĒLE_5",
    "Name6": "IZVĒLE_6",
    "Name7": "IZVĒLE_7",
    "Name8": "IZVĒLE_8"
  };

function updateBlocks() {
    // Iterate over each input field
    for (let i = 1; i <= 8; i++) {
      // Select the input field and the corresponding block
      const input = document.getElementById(`Name${i}Input`);
      const block = document.querySelector(`.block[data-name="Name${i}"]`);
      
      // Update the block's data-name attribute with the input's value
      if (block && input) {
        block.dataset.name = input.value;
        block.textContent = input.value; // Update text inside the div as well if needed
      }
    }
  }

  function resetBlocks() {
    for (let i = 1; i <= 8; i++) {
      const input = document.getElementById(`Name${i}Input`);
      const block = document.getElementById(`block${i}`); // Use ID for direct access
      
      if (input) {
        input.value = ''; // Clear the input field
      }
      
      if (block) {
        block.dataset.name = `Name${i}`;
        block.textContent = defaultValues[`Name${i}`];
      } else {
        console.log(`Block ${i} not found`); // For debugging
      }
    }
  }
  // Event listener for the send button
  document.getElementById('sendBtn').addEventListener('click', updateBlocks);
  
  // Event listener for the refresh button
  document.getElementById('refreshBtn').addEventListener('click', function() {
    console.log('Refresh button clicked'); // For debugging: Check if event is triggered
    resetBlocks();
    stopHighlightingBlocks(); // This function should clear any highlight effects
    resetBlockPositions();
    restartGame(); // Call this function to reset the game state
  });

