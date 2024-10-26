
# GSMMS - General Services Monitoring and Management System

GSMMS is a React Native application designed to streamline the management and monitoring of general services. This application enables users to request, track, and manage various services efficiently, with features tailored for utility workers, faculty members, and administrators.

## Features

- **Service Request Management**: Allows users to request services and track the status of each request.
- **Task Assignment**: Utility workers can view, start, and complete assigned tasks, including proof uploads.
- **Preventive Maintenance**: Schedule and manage preventive maintenance tasks with user assignments.
- **Inventory Management**: Manage and track inventory equipment with detailed information and maintenance schedules.

## Technologies Used

- **Frontend**: React Native, NativeWind for styling
- **Backend**: Laravel (using REST API)
- **Database**: MySQL
- **Location Services**: Google Maps integration for location-based features (if applicable)

## Prerequisites

Ensure you have the following installed on your development machine:

- Node.js
- Expo CLI
- Android Studio or Xcode (for device simulators)
- Yarn (recommended) or npm
- [Expo Go](https://expo.dev/client) (for testing on physical devices)

## Installation

Follow these steps to set up and run GSMMS:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/gsmms.git
   cd gsmms
   ```

2. **Install Dependencies**

   Using Yarn:

   ```bash
   yarn install
   ```

   Or, if using npm:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create an `.env` file in the root directory and configure the following:

   ```plaintext
   API_BASE_URL=<your_backend_api_url>
   ```

4. **Run the Application**

   To start the development server and run the app on an emulator or connected device:

   ```bash
   expo start
   ```

5. **Build APK for Android (optional)**

   If you'd like to create an APK for testing or distribution, follow these steps:

   - Run the build command:

     ```bash
     eas build -p android --profile preview
     ```

   - Download the APK file from Expo's dashboard once the build is complete.

## Testing

You can test the application on an Android/iOS emulator or a physical device using the Expo Go app.

## Contributing

If you'd like to contribute to GSMMS, please fork the repository and create a new branch with your feature or bug fix. Submit a pull request for review when ready.

## License

This project is open-source and available under the MIT License.
