
# AI Brand Agent

An intelligent AI-powered branding assistant that automatically detects user intent and routes requests to the appropriate AI models. The system helps users build brand identity through natural conversation.

## Features

- **Automatic Intent Detection**: The system intelligently detects what the user wants (brand names, logos, taglines, etc.) without manual selection
- **Text Generation**: Uses HuggingFace's Mistral-7B-Instruct model for generating brand names, taglines, marketing content, and advice
- **Image Generation**: Local Stable Diffusion with CUDA acceleration for logo and brand image generation
- **Fast Alternative**: Groq API integration for faster text generation (optional)
- **Modern Chat Interface**: Clean, responsive web interface with real-time typing indicators
- **GPU Acceleration**: Optimized for NVIDIA RTX 3050 and other CUDA-enabled GPUs

## Architecture

```
ai_brand_agent/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── agent_router.py      # Intent-based routing system
│   ├── intent_detector.py   # AI intent detection
│   ├── text_model.py        # HuggingFace & Groq integration
│   └── image_model.py       # Stable Diffusion integration
├── frontend/
│   ├── index.html          # Chat interface
│   ├── style.css           # Modern styling
│   └── chat.js             # Interactive chat functionality
├── static/                 # Generated images storage
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Prerequisites

- Python 3.8 or higher
- NVIDIA GPU with CUDA support (RTX 3050 or recommended)
- HuggingFace API token
- (Optional) Groq API key for faster text generation

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
cd ai_brand_agent
```

### 2. Create Virtual Environment

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API tokens:

```env
# Required: HuggingFace API Token
HUGGINGFACE_API_TOKEN=hf_your_actual_token_here

# Optional: Groq API Key for faster text generation
GROQ_API_KEY=gsk_your_actual_key_here
```

**Getting API Tokens:**

- **HuggingFace Token**: Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- **Groq API Key**: Visit [https://console.groq.com/keys](https://console.groq.com/keys)

### 5. Start the Backend Server

```bash
cd backend
python main.py
```

The server will start at `http://localhost:8000`

### 6. Open the Frontend

Open `frontend/index.html` in your web browser, or serve it with a simple web server:

```bash
# Using Python's built-in server (from frontend directory)
cd ../frontend
python -m http.server 3000
```

Then visit `http://localhost:3000`

## Usage

### Starting a Conversation

1. Open the chat interface in your browser
2. Type your branding request in natural language
3. The system will automatically detect your intent and respond appropriately

### Example Interactions

**Brand Name Generation:**
```
User: I need a brand name for an AI fitness startup
System: [Generates multiple creative brand names with explanations]
```

**Logo Generation:**
```
User: Create a logo for FitPulse
System: [Automatically switches to image generation and creates a logo]
```

**Marketing Content:**
```
User: Write a marketing caption for my new product
System: [Generates engaging marketing captions with hashtags]
```

**Branding Advice:**
```
User: What branding advice would you give for a tech startup?
System: [Provides expert branding guidance and recommendations]
```

### Quick Actions

Use the quick action buttons for common requests:
- **Brand Name**: Generate brand names
- **Logo**: Create logos
- **Tagline**: Generate taglines
- **Marketing**: Write marketing content

### Performance Options

- **Standard Mode**: Uses HuggingFace API (free tier available)
- **Fast Mode**: Enable "Use faster AI (Groq)" checkbox for significantly faster text generation

## Model Capabilities

### Text Generation (HuggingFace Mistral-7B-Instruct)
- Brand name generation
- Tagline and slogan creation
- Marketing captions and social media content
- Product descriptions
- Branding advice and consultation
- Sentiment and tone analysis

### Image Generation (Stable Diffusion)
- Logo design
- Brand visual identity
- Marketing imagery
- Custom brand graphics

## GPU Optimization

The system is optimized for NVIDIA RTX 3050:
- Memory-efficient attention slicing
- XFormers acceleration (when available)
- FP16 precision for reduced memory usage
- Optimized inference steps for faster generation

## Troubleshooting

### Common Issues

**Backend not responding:**
- Ensure the backend server is running on `http://localhost:8000`
- Check if all dependencies are installed correctly
- Verify your API tokens are correct

**Image generation errors:**
- Ensure CUDA is properly installed and recognized
- Check GPU memory availability
- Try reducing image size or inference steps

**Text generation errors:**
- Verify HuggingFace API token is valid
- Check if you've exceeded API rate limits
- Try enabling Groq for faster processing

### Performance Tips

1. **For faster text generation**: Get a Groq API key and enable the fast mode
2. **For quicker image generation**: The system is optimized for RTX 3050, but performance varies with GPU memory
3. **Memory issues**: Restart the server if you encounter memory errors after extended use

## API Endpoints

### Chat Endpoint
```
POST /chat
{
    "message": "User message",
    "use_groq": false
}
```

### Model Status
```
GET /models/status
```

### Health Check
```
GET /health
```

## Development

### Adding New Intents

To add new capabilities, update `intent_detector.py`:

1. Add new `IntentType` enum value
2. Define keyword patterns in `intent_patterns`
3. Create handler method in `agent_router.py`
4. Add prompt template in `text_model.py` if needed

### Customizing Models

- **Text Model**: Change `HUGGINGFACE_MODEL` in `.env`
- **Image Model**: Modify `model_id` in `image_model.py`
- **Groq Model**: Update `GROQ_MODEL` in `.env`

## License

This project is for educational and demonstration purposes. Please ensure compliance with the terms of service of all AI providers used.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Verify your API tokens and GPU setup
3. Ensure all dependencies are properly installed

---

**Note**: The system requires active internet connectivity for HuggingFace API calls. Image generation works locally but requires CUDA-compatible GPU.


