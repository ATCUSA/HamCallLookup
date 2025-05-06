# Ham Call Lookup

Ham Call Lookup is a modern Chrome extension for amateur radio operators that allows you to quickly look up information about a ham radio call sign while browsing the web. With a simple search, you can retrieve the operator's details, visualize their location on an interactive map, get directions, and more.

## Features

- **Instant Callsign Lookup**: Quickly search for any amateur radio callsign using the HamDB.org API
- **Detailed Operator Info**: View complete operator information including name, address, license class, and expiration
- **Interactive Mapping**: Visualize the operator's location with expandable maps
- **Copy to Clipboard**: One-click copying of callsign, name, grid, coordinates, and more
- **Google Maps Integration**: Get driving directions to an operator's location
- **QRZ.com Integration**: Cross-reference with QRZ.com profiles
- **Search History**: Keep track of your recent lookups
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Modern UI**: Clean, responsive interface with intuitive controls

## Installation

### From Source

1. Clone or download the repository to your local machine
2. Run `npm install` to install dependencies (if needed)
3. Open Google Chrome and navigate to `chrome://extensions/`
4. Enable "Developer Mode" using the toggle in the top-right corner
5. Click "Load unpacked" and select the `ham-call-lookup` directory

### Required Resources

The extension uses Leaflet.js for mapping. You'll need to:

1. Download Leaflet.js and CSS from [unpkg.com/leaflet@1.9.4/dist/](https://unpkg.com/leaflet@1.9.4/dist/)
2. Place them in the `lib` directory
3. Create a `lib/images` directory containing the Leaflet marker images

## Usage

1. Click the Ham Call Lookup icon in your browser toolbar to open the extension
2. Enter a callsign in the search box and click "Lookup"
3. View the operator's information, including:
   - Callsign and license class
   - Operator name
   - Location and grid square
   - Exact coordinates
   - License expiration date
   - License status
4. Use the interactive map to visualize the location
5. Click the expand button to view a larger map
6. Access additional features:
   - Copy any piece of information with the clipboard buttons
   - Get directions via Google Maps
   - Look up the operator on QRZ.com
   - Toggle between light and dark themes

## Project Structure

The extension uses a modular architecture for better maintainability:

```
ham-call-lookup/
├── js/
│   ├── popup.js          # Main entry point
│   ├── ui-controller.js  # UI updates and event handlers
│   ├── api-service.js    # API calls and data processing
│   ├── map-handler.js    # Map creation and interaction
│   ├── storage-manager.js # Local storage operations
│   ├── theme-manager.js  # Theme switching
│   ├── utils.js          # Utility functions
│   └── background.js     # Service worker
├── lib/                  # External libraries
│   ├── leaflet.js        # Leaflet library
│   ├── leaflet.css       # Leaflet CSS
│   └── images/           # Leaflet marker images
├── popup.html            # Main HTML file
├── popup.css             # Styles
└── manifest.json         # Extension manifest
```

## Permissions

The extension requires the following permissions:

- `storage`: To save search history and theme preferences
- `tabs`: To open links in new tabs
- `host_permissions`: For accessing HamDB.org and QRZ.com

## API Usage

This extension uses the HamDB.org API. Please be respectful of their service and follow their usage guidelines.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

The full text of the license is available in the [LICENSE.md](LICENSE.md) file in this repository.

## Credits and Acknowledgments

- [HamDB.org](https://hamdb.org) for providing the API
- [QRZ.com](https://www.qrz.com) for additional callsign information
- [Leaflet.js](https://leafletjs.com) for mapping capabilities
- [OpenStreetMap](https://www.openstreetmap.org) and [CartoDB](https://carto.com) for map tiles

## Contributing

Contributions are welcome! If you'd like to improve the extension:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Please maintain the modular architecture when adding new features.

## Version History

- **2.0.0**: Major update with modular architecture, expandable maps, Google Maps integration, and copy to clipboard functionality
- **1.0.1**: Initial public release

## Future Enhancements

- Propagation predictions based on location
- Azimuth and elevation based on location
- Settings to allow for customizing the extension
- User defined call sign