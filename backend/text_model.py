import os
import requests
import json
from typing import Dict, Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TextGenerationModel:
    def __init__(self):
        self.huggingface_token = os.getenv("HUGGINGFACE_API_TOKEN")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.huggingface_model = "google/flan-t5-base"  # Reliable current model
        self.alternative_models = [
            "google/flan-t5-base",
            "microsoft/DialoGPT-medium",
            "facebook/blenderbot-400M-distill"
        ]
        self.groq_model = "llama-3.1-8b-instant"  # Current working Groq model
        
        # API endpoints
        self.huggingface_url = f"https://api-inference.huggingface.co/models/{self.huggingface_model}"
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        
        self.groq_available = bool(self.groq_api_key)
    
    def is_configured(self) -> bool:
        """Check if HuggingFace API token is configured"""
        return bool(self.huggingface_token)
    
    def generate_with_huggingface(self, prompt: str, max_length: int = 500) -> str:
        """Generate text using HuggingFace Inference API with fallback models"""
        if not self.huggingface_token:
            raise ValueError("HuggingFace API token not configured")
        
        headers = {
            "Authorization": f"Bearer {self.huggingface_token}",
            "Content-Type": "application/json"
        }
        
        # Try primary model first, then fallback models
        models_to_try = [self.huggingface_model] + self.alternative_models
        
        for i, model in enumerate(models_to_try):
            try:
                print(f"Trying model {i+1}/{len(models_to_try)}: {model}")
                url = f"https://api-inference.huggingface.co/models/{model}"
                
                payload = {
                    "inputs": prompt,
                    "parameters": {
                        "max_new_tokens": max_length,
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "do_sample": True,
                        "return_full_text": False
                    }
                }
                
                response = requests.post(url, headers=headers, json=payload, timeout=10)
                
                if response.status_code == 410:
                    print(f"Model {model} is deprecated (410), trying next...")
                    continue
                
                response.raise_for_status()
                
                result = response.json()
                print(f"Success with model {model}")
                
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "").strip()
                elif isinstance(result, dict) and "generated_text" in result:
                    return result["generated_text"].strip()
                elif isinstance(result, dict) and "error" in result:
                    print(f"Model {model} returned error: {result['error']}")
                    continue  # Try next model
                else:
                    print(f"Unexpected response from {model}: {result}")
                    continue  # Try next model
                    
            except requests.exceptions.RequestException as e:
                print(f"Error with model {model}: {str(e)}")
                continue  # Try next model
            except Exception as e:
                print(f"Unexpected error with model {model}: {str(e)}")
                continue  # Try next model
        
        return "I apologize, but I couldn't connect to any available text generation models. Please try using the Groq option for faster responses or check your HuggingFace API token."
    
    def generate_with_groq(self, prompt: str, max_length: int = 500) -> str:
        """Generate text using Groq API for faster inference"""
        if not self.groq_api_key:
            raise ValueError("Groq API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.groq_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert branding and marketing assistant. Help users create compelling brand names, taglines, marketing content, and provide valuable branding advice. Be creative, professional, and helpful."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_length,
            "temperature": 0.7,
            "top_p": 0.9
        }
        
        try:
            response = requests.post(self.groq_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            print(f"Groq API response: {result}")
            
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            elif "error" in result:
                return f"Groq API error: {result['error']['message']}"
            else:
                return "I apologize, but I couldn't generate a response from Groq. Please try again."
                
        except requests.exceptions.RequestException as e:
            print(f"Groq API request error: {str(e)}")
            return f"Error connecting to Groq API: {str(e)}"
        except Exception as e:
            print(f"Groq API unexpected error: {str(e)}")
            return f"Error generating text: {str(e)}"
    
    def generate_text(self, prompt: str, use_groq: bool = False, max_length: int = 500) -> str:
        """
        Generate text using either HuggingFace or Groq API
        Defaults to Groq if available due to HuggingFace API issues
        """
        if use_groq and self.groq_available:
            return self.generate_with_groq(prompt, max_length)
        elif self.groq_available:
            # Default to Groq since HuggingFace is having issues
            print("Using Groq as default due to HuggingFace API issues")
            return self.generate_with_groq(prompt, max_length)
        else:
            return self.generate_with_huggingface(prompt, max_length)
    
    def create_brand_name_prompt(self, user_message: str) -> str:
        """Create a specialized prompt for brand name generation"""
        return f"""
You are a professional brand naming expert. Based on the following request, generate 5-7 creative and memorable brand names.

User Request: {user_message}

Guidelines:
- Names should be unique and memorable
- Easy to pronounce and spell
- Relevant to the industry/product
- Consider modern naming trends
- Avoid generic or overused names
- Include a brief explanation for each name

Format your response as a numbered list with explanations.
"""
    
    def create_tagline_prompt(self, user_message: str) -> str:
        """Create a specialized prompt for tagline generation"""
        return f"""
You are a professional copywriter specializing in brand taglines. Based on the following request, generate 5 compelling taglines.

User Request: {user_message}

Guidelines:
- Taglines should be short and memorable (under 10 words)
- Capture the essence of the brand
- Be inspiring or action-oriented
- Easy to remember and repeat
- Avoid clichés when possible

Format your response as a numbered list.
"""
    
    def create_marketing_caption_prompt(self, user_message: str) -> str:
        """Create a specialized prompt for marketing caption generation"""
        return f"""
You are a social media marketing expert. Based on the following request, create engaging marketing captions.

User Request: {user_message}

Guidelines:
- Write captions suitable for social media platforms
- Include relevant hashtags when appropriate
- Be engaging and conversational
- Include a call-to-action when suitable
- Keep captions concise but impactful

Provide 3-5 caption options with hashtags.
"""
    
    def create_product_description_prompt(self, user_message: str) -> str:
        """Create a specialized prompt for product description generation"""
        return f"""
You are a professional product description writer. Based on the following request, create compelling product descriptions.

User Request: {user_message}

Guidelines:
- Highlight key features and benefits
- Use persuasive and descriptive language
- Address the target audience
- Include emotional appeal
- Structure for easy readability

Provide a comprehensive product description.
"""
    
    def create_brand_advice_prompt(self, user_message: str) -> str:
        """Create a specialized prompt for branding advice"""
        return f"""
You are an experienced branding consultant. Based on the following request, provide expert branding advice.

User Request: {user_message}

Guidelines:
- Provide actionable and practical advice
- Consider current market trends
- Address specific challenges mentioned
- Include examples when helpful
- Be encouraging and supportive

Provide detailed, helpful branding guidance.
"""
    
    def create_sentiment_analysis_prompt(self, user_message: str) -> str:
        """Create a specialized prompt for brand sentiment analysis"""
        return f"""
You are a brand sentiment analysis expert. Analyze the tone and sentiment of the following brand-related content.

User Request: {user_message}

Provide analysis on:
- Overall sentiment (positive, negative, neutral)
- Emotional tone and feeling
- Brand voice characteristics
- Target audience appeal
- Suggestions for improvement if needed

Give a comprehensive sentiment analysis.
"""
