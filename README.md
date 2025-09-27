# 🚖 Cromwell Cars Web Dispatcher

A modern web interface for booking taxis through AI-powered voice conversations. This is the web version of the Cromwell Cars AI Dispatcher system.

## ✨ Features

- 🎙️ **Voice AI Booking** - Talk naturally to book your taxi
- 📍 **Address Validation** - Real-time UK address verification
- 💰 **Live Pricing** - Get instant quotes for your journey
- 🚗 **Vehicle Options** - Choose from Standard, Estate, MPV, or Luxury vehicles
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔄 **Real-time Updates** - Live booking status and driver location

## 🎯 How It Works

1. **Click to Start** - Begin a voice conversation with Alex, our AI dispatcher
2. **Speak Naturally** - Tell Alex where you want to go, just like calling a taxi company
3. **Get Pricing** - Receive instant quotes for different vehicle types
4. **Book Your Ride** - Confirm your booking and get a job number
5. **Track Status** - Check your booking status and driver location

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Access to the Cromwell Cars backend system

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cromwell-cars-web-dispatcher.git
cd cromwell-cars-web-dispatcher

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Configuration

This web interface connects to the same backend system as the phone service. Make sure the backend server is running:

1. **Start the backend server** (in the main Cromwell Cars project)
2. **Update configuration** - The web interface automatically uses the same configuration as the phone system
3. **Access the interface** at `http://localhost:3000`

## 🛠️ Development

### Project Structure

```
├── app/
│   ├── components/          # React components
│   ├── lib/                # Utilities and types
│   ├── demo-config.ts      # AI agent configuration
│   └── page.tsx            # Main page
├── public/                 # Static assets
└── start-web.sh           # Development start script
```

### Key Components

- **VoiceInterface** - Handles voice conversations with the AI
- **OrderDetails** - Displays booking information and status
- **AddressValidation** - Real-time address verification
- **PricingDisplay** - Shows vehicle options and pricing

### Configuration

The web interface uses the same AI agent configuration as the phone system, located in:
```
../../../twilio-incoming-advanced-js/ultravox-config.js
```

This ensures consistent behavior between phone and web bookings.

## 🎙️ Voice Commands

Talk to Alex naturally! Here are some example conversations:

**Booking a Taxi:**
- "I need a taxi from London Bridge to Heathrow Airport"
- "Can you book me a car for tomorrow at 3 PM?"
- "I'm at 10 Downing Street and need to go to King's Cross"

**Checking Bookings:**
- "What's the status of job number 12345?"
- "Where is my driver?"
- "I need to cancel my booking"

## 🔧 API Integration

The web interface connects to:

- **Address Validation API** - UK postcode and address verification
- **Pricing API** - Real-time fare calculations
- **Booking API** - Create, update, and manage taxi bookings
- **Driver Location API** - Live driver tracking

## 📱 Supported Browsers

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

*Note: Microphone access required for voice functionality*

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t cromwell-cars-web .

# Run container
docker run -p 3000:3000 cromwell-cars-web
```

## 🔒 Environment Variables

Create a `.env.local` file:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=your-backend-url
NEXT_PUBLIC_ULTRAVOX_API_KEY=your-ultravox-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@cromwellcars.com
- 📞 Phone: +44 (0) 20 1234 5678
- 🌐 Website: [cromwellcars.com](https://cromwellcars.com)

## 🙏 Acknowledgments

- Built with [Ultravox](https://ultravox.ai) for voice AI capabilities
- Powered by [Next.js](https://nextjs.org) and [TypeScript](https://typescriptlang.org)
- UI components from [Tailwind CSS](https://tailwindcss.com)

---

**Cromwell Cars** - Professional taxi services in London with AI-powered booking 🚖✨