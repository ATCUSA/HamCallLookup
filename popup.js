document.addEventListener('DOMContentLoaded', function () {

  const lookupButton = document.getElementById('lookup-button')
  const aboutButton = document.getElementById('about-button')
  const closeButton = document.getElementById('close-button')
  const resultsDiv = document.getElementById('results')
  const callsignInput = document.getElementById('callsign-input')

  function displayResults(data) {
    const operator = data.hamdb.callsign
    let name = `${operator.fname} ${operator.name}`
    const grid = operator.grid
    let status = operator.status.toLowerCase()
    const location = `${operator.addr1}, ${operator.addr2}, ${operator.state} ${operator.zip}, ${operator.country}`
    let level = operator.class.toLowerCase()

    // Convert the class to a more readable format
    if (level === "t") {
      level = "Technician"
    } else if (level === "a") {
      level = "Advanced"
    } else if (level === "g") {
      level = "General"
    } else if (level === "e") {
      level = "Extra"
    } else if (level === "" && operator.fname === "") {
      level = "Club"
    } else {
      level = "Unknown"
    }

    // Convert the status to a more readable format
    if (status === "a") {
      status = "Active"
    } else if (status === "i") {
      status = "Inactive"
    } else {
      status = "Unknown"
    }

    resultsDiv.innerHTML = `
      <p><strong>Call Sign:</strong> ${operator.call} (${level})</p>
      <p><strong>Operator:</strong> ${name}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Grid:</strong> ${grid}</p>
      <p><strong>Status:</strong> ${status}</p>
    `
  }

  function displayError(error) {
    resultsDiv.innerHTML = `<p class="error">${error}</p>`
  }

  function lookupCallsign(callsign) {
    fetch(`https://api.hamdb.org/v1/${callsign}/json/hamCallLookupChromeExtension`)
      .then(response => response.json())
      .then(data => {
        if (data.hamdb.messages.status === "OK") {
          displayResults(data)
        } else {
          displayError("No results found.")
        }
      })
      .catch(error => {
        displayError("An error occurred while looking up the call sign.")
        console.error(error)
      })
  }

  callsignInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
      const callsign = callsignInput.value.trim().toUpperCase()
      if (callsign.length === 0) {
        displayError("Please enter a call sign.")
      } else if (callsign.length >= 3) {
        lookupCallsign(callsign)
      }
    }
  })

  lookupButton.addEventListener('click', () => {
    const callsign = callsignInput.value.trim().toUpperCase()
    if (callsign.length === 0) {
      displayError("Please enter a call sign.")
    } else {
      lookupCallsign(callsign)
    }
  })

  aboutButton.addEventListener('click', () => {
    const aboutPopup = document.getElementById('about-popup')
    aboutPopup.classList.remove('hidden')
  })

  closeButton.addEventListener('click', () => {
    const aboutPopup = document.getElementById('about-popup')
    aboutPopup.classList.add('hidden')
  })

})
