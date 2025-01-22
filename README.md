# Pookie Gift Campaign

A Next.js-based interactive gift campaign website for Mr. Ananda election candidate Hamja Hami. Users can claim virtual gifts through an engaging animated interface.

## Features

- Interactive gift claiming system with probability-based rewards
- One-time gift claim per user with local storage persistence
- Animated UI elements using Framer Motion
- Responsive design for all devices
- Bengali language support with Hind Siliguri font
- Decorative animated bow ties
- Lottie animation integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
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

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Landing.tsx
│   └── GiftModal.tsx
├── data/
│   └── gifts.json
├── public/
│   ├── gifts/
│   ├── pookie.json
│   └── hamza.jpg
└── lib/
    └── font.ts
```

## Gift System

The gift system uses a probability-based algorithm to distribute gifts fairly. Each gift has:
- Defined probability
- Total count limit
- Current count tracking
- Associated image

## Customization

1. Edit `data/gifts.json` to modify available gifts and their probabilities
2. Update images in `public/gifts/` directory
3. Modify animations and styling in respective components

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

[Creative Commons Attribution-NonCommercial 4.0](LICENSE)

This project is licensed under CC BY-NC 4.0 which means you can freely use and adapt this work for non-commercial purposes, as long as you provide attribution.
