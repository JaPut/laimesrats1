const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const blocks = document.querySelectorAll('.block');
const restartBtn = document.getElementById('restartBtn');

let angle = 0;
let names = ["Name1", "Name2", "Name3", "Name4", "Name5", "Name6", "Name7", "Name8"];
let iconChars = ['\uf0e0', '\uf03e', '\uf057', '\uf2bd', '\uf256', '\uf2dc', '\uf186', '\uf0cf'];
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
    let deceleration = initialSpeed / (5 * 60); // 5 seconds, at 60 frames per second
    let speed = initialSpeed;
    let spin = setInterval(() => {
        angle += speed;
        drawWheel();
        speed -= deceleration;
        if (speed <= 0) {
            clearInterval(spin);
            highlightBlock();
            triggerFireworks(); // Call the function to trigger fireworks
        }
    }, 1000 / 60);
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
    if (currentBlock) {
        currentBlock.style.animation = 'none';
    }
    currentBlock = blocks[index];
    currentBlock.style.animation = 'blink 0.5s infinite';
}

startBtn.addEventListener('click', () => {
    spinWheel();
});

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

restartBtn.addEventListener('click', restartGame);

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
  });

