
  function setBodyBackgroundColorFromQueryString() {
    // Get the current URL's search parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if the "bgcolor" parameter exists
    const colorValue = urlParams.get('bgcolor');

    // If a color value is found
    if (colorValue) {
      // Check if the value is a valid length for a hex code (e.g., 'FFFFFF')
      if (colorValue.length === 6 || colorValue.length === 3) {
        const hexColor = `#${colorValue.toUpperCase()}`;
        // Set the body's background color
        document.body.style.backgroundColor = hexColor;
      }
    }
  }

  // Call the function when the page loads
  setBodyBackgroundColorFromQueryString();
