# GRII_Automation

GRII_Automation is a Next.js project designed to automate sending reminders through a LINE bot based on data from a Google Sheet table (Table Penjadwalan Pengurus) and to download PDF files for songs (File Lagu) from Google Drive.

## Features

- **Automated Reminders:**
  - Sends reminders via LINE bot based on schedules from the Google Sheet.
- **File Management:**
  - Downloads song PDFs from Google Drive to local storage for quick access.

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- A LINE Messaging API channel
- Access to the Google Sheets and Google Drive APIs

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/GRII_Automation.git
   cd GRII_Automation
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following keys and replace placeholders with your actual values:
     ```
     LINE_CHANNEL_ACCESS_TOKEN=<your_line_channel_access_token>
     LINE_CHANNEL_SECRET=<your_line_channel_secret>
     GOOGLE_SHEET_ID=<your_google_sheet_id>
     GOOGLE_DRIVE_FOLDER_ID=<your_google_drive_folder_id>
     ```

### Running the Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Application Structure

Since this project contains a single page, the main logic is located in:

- `pages/index.tsx`: The entry point for the application. Handles both LINE bot integration and file downloading functionalities.

### API Logic

Any necessary API interactions are managed directly within the `index.tsx` file for simplicity. Utility functions may still be used for tasks like:

- Interfacing with the LINE Messaging API.
- Fetching data from Google Sheets.
- Downloading files from Google Drive.

## Learn More

To learn more about the tools used in this project, take a look at these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [LINE Messaging API Documentation](https://developers.line.biz/en/docs/messaging-api/) - Learn about LINE bot integration.
- [Google Sheets API Documentation](https://developers.google.com/sheets/api) - Learn about automating Google Sheets.
- [Google Drive API Documentation](https://developers.google.com/drive) - Learn about working with Google Drive.

## Deployment

The easiest way to deploy your app is to use [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variables in the Vercel dashboard.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## License

This project is licensed under the MIT License. See the LICENSE file for details.

