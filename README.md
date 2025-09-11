# LactaMed

A mobile application providing medication safety information for breastfeeding mothers.

## Overview

LactaMed helps breastfeeding mothers make informed decisions about medication safety by providing easy access to drug compatibility information. The app scrapes real-time data from reliable medical sources like e-lactancia.org to offer current educational information.

**Important**: This app provides general information only and is not a substitute for professional medical advice.

## Features

- Real-time medication database search
- Detailed drug information with risk levels
- Alternative medication suggestions
- Comprehensive medical disclaimers
- Offline-capable caching for reliable access
- Built-in rate limiting for responsible scraping

## Architecture

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express (integrated)
- **Data Source**: Real-time scraping of e-lactancia.org
- **Language**: TypeScript throughout
- **Deployment**: Single integrated app

## Tech Stack

- React Native + Expo
- Express.js API server
- TypeScript
- Real-time web scraping (no database needed)
- In-memory caching with TTL

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup

1. Clone the repository
```bash
git clone [your-repo-url]
cd lactafarmaapp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm start
```

5. Run on specific platforms
```bash
npm run ios     # iOS simulator
npm run android # Android emulator
```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator

## Building for Production

### Mobile App
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Backend
```bash
# Build TypeScript
npm run build

# Start production server
npm run start:prod
```

The mobile app is distributed through:
- Apple App Store
- Google Play Store

## Legal and Compliance

This is a medical information app with strict compliance requirements:

- **Medical Disclaimers**: Comprehensive disclaimers about not providing medical advice
- **Privacy Policy**: Full privacy policy compliant with GDPR/CCPA
- **Terms of Service**: Clear terms of use for medical information apps
- **Data Handling**: Transparent data handling practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Medical Disclaimer

This application provides general educational information only and is not intended as medical advice, diagnosis, or treatment. Always consult qualified healthcare providers before making medication decisions during breastfeeding.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Email: [your-email]
- Website: [your-website]

## Support

For technical support or bug reports, please open an issue in this repository.
