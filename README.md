# Pookie Gift Campaign

A Next.js-based interactive gift campaign website for Mr. Ananda election candidate Hamja Hami. Users can claim virtual gifts through an engaging animated interface with Firebase backend for persistent data storage.

## Features

- Interactive gift claiming system with probability-based rewards
- Firebase backend for persistent data storage
- Admin panel for gift and winner management
- Real-time gift inventory tracking
- Winner history with deletion capability
- Animated UI elements using Framer Motion
- Responsive design for all devices
- Bengali language support with Hind Siliguri font
- Decorative animated bow ties
- Lottie animation integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Backend**: Firebase (Firestore)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Fonts**: Google Fonts (Geist, Hind Siliguri)
- **Animations**: Lottie React

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Mahmud-Araf/Pookie-Hamja.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Firestore Database
   - Add your Firebase config to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── gifts/
│   │   └── winners/
│   ├── hamja/
│   │   └── pookie/
│   │       └── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Landing.tsx
│   └── GiftModal.tsx
├── data/
│   └── gifts.json
├── lib/
│   ├── firebase.ts
│   └── font.ts
└── public/
    ├── gifts/
    ├── pookie.json
    └── hamza.jpg
```

## Gift System

The gift system uses a probability-based algorithm to distribute gifts fairly. Each gift has:
- Defined probability
- Total count limit
- Current count tracking
- Associated image
- Persistent storage in Firebase

## Admin Panel

Access the admin panel at `/hamja/pookie/admin` to:
- View current gift inventory
- Reset all gifts to initial state
- View winner history
- Delete individual winners
- Monitor gift claim statistics

## Customization

1. Edit `data/gifts.json` to modify available gifts and their probabilities
2. Update images in `public/gifts/` directory
3. Modify animations and styling in respective components
4. Configure Firebase rules for production

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

[Creative Commons Attribution-NonCommercial 4.0](LICENSE)

This project is licensed under CC BY-NC 4.0 which means you can freely use and adapt this work for non-commercial purposes, as long as you provide attribution.
