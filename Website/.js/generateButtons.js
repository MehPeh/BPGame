async function loadConfiguration() {
        try {
                const response = await fetch('../../Bachelor_Project/Assets/Scripts/configuration.json');
                const config = await response.json();
                return config;
        } catch (error) {
                console.error('Error loading configuration:', error);
                throw error;
        }
}

function createButtons(pollOptionAmount) {
        const buttonsContainer = document.getElementById('buttonsContainer');
        const buttonHeight = 100 / pollOptionAmount; 

        for (let i = 1; i <= pollOptionAmount; i++) {
                const button = document.createElement('button');
                button.id = `keyOption${i}`;
                button.style.height = `${buttonHeight}%`;

                if (i === 1) {
                        button.textContent = 'APG';
                } else if (i === 2) {
                        button.textContent = 'Currently no poll';
                }

                buttonsContainer.appendChild(button);
        }
}

async function initialize() {
        try {
                const config = await loadConfiguration();
                createButtons(config.poll_option_amount);
        } catch (error) {
                console.error('Error during initialization:', error);
        }
}

initialize();
