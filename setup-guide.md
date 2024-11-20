# Baby's Day Out - Setup Guide

## Prerequisites
- Google Maps API key with Maps JavaScript API and Photorealistic 3D Maps enabled
- Python 3.x installed
- Modern web browser (Chrome recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ganesaprabu/babys-day-out.git
cd babys-day-out
```

2. Configure Google Maps API:
- Navigate to `js/config/config.js`
- Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
```javascript
GOOGLE_MAPS: {
    API_KEY: 'your-api-key-here',
    MAP_ID: '4b45afa36e217db6'
}
```

## Running the Application

1. Start the local server:
```bash
python3 -m http.server 8080
```

2. Access the application:
- Open browser and navigate to `http://localhost:8080`

## Troubleshooting

### Map Loading Issues
- Verify API key is correctly set
- Ensure Maps JavaScript API is enabled
- Ensure Photorealistic 3D Maps is enabled
- Check browser console for specific errors

### Feature Issues
- Clear browser cache
- Verify all files are properly loaded (check Network tab)
- Check browser console for JavaScript errors

## Support
For issues or questions, please create an issue on the GitHub repository.
