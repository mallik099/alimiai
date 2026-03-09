from typing import Dict, Any, Optional
import logging
from intent_detector import IntentDetector, IntentType
from text_model import TextGenerationModel
from image_model import ImageGenerationModel
from market_positioning import MarketPositioningAnalyzer
from brand_consistency import BrandConsistencyChecker
from brand_strategy_planner import BrandStrategyPlanner

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BrandAgentRouter:
    def __init__(self, intent_detector: IntentDetector, text_model: TextGenerationModel, image_model: ImageGenerationModel):
        self.intent_detector = intent_detector
        self.text_model = text_model
        self.image_model = image_model
        self.market_positioning_analyzer = MarketPositioningAnalyzer(text_model)
        self.brand_consistency_checker = BrandConsistencyChecker(text_model)
        self.brand_strategy_planner = BrandStrategyPlanner(text_model)
    
    async def process_request(self, message: str, use_groq: bool = False) -> Dict[str, Any]:
        """
        Process a user request by detecting intent and routing to the appropriate model
        """
        try:
            # Detect the user's intent
            intent = self.intent_detector.detect_intent(message)
            logger.info(f"Detected intent: {intent.value}")
            
            # Route to the appropriate handler
            if intent == IntentType.LOGO_GENERATION:
                return await self._handle_logo_generation(message)
            elif intent == IntentType.BRAND_IMAGE:
                return await self._handle_brand_image_generation(message)
            elif intent == IntentType.BRAND_NAME:
                return await self._handle_brand_name_generation(message, use_groq)
            elif intent == IntentType.TAGLINE:
                return await self._handle_tagline_generation(message, use_groq)
            elif intent == IntentType.MARKETING_CAPTION:
                return await self._handle_marketing_caption_generation(message, use_groq)
            elif intent == IntentType.PRODUCT_DESCRIPTION:
                return await self._handle_product_description_generation(message, use_groq)
            elif intent == IntentType.BRAND_ADVICE:
                return await self._handle_brand_advice(message, use_groq)
            elif intent == IntentType.SENTIMENT_ANALYSIS:
                return await self._handle_sentiment_analysis(message, use_groq)
            elif intent == IntentType.MARKET_POSITIONING:
                return await self._handle_market_positioning_analysis(message, use_groq)
            elif intent == IntentType.BRAND_CONSISTENCY:
                return await self._handle_brand_consistency_check(message, use_groq)
            elif intent == IntentType.BRAND_STRATEGY:
                return await self._handle_brand_strategy_planning(message, use_groq)
            else:
                # General chat fallback
                return await self._handle_general_chat(message, use_groq)
                
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return {
                "type": "text",
                "content": f"I apologize, but I encountered an error while processing your request: {str(e)}"
            }
    
    async def _handle_logo_generation(self, message: str) -> Dict[str, Any]:
        """Handle logo generation requests"""
        try:
            # Extract brand name and style from message
            brand_name = self._extract_brand_name(message)
            style = self._extract_style_preference(message)
            
            # Generate logo
            result = self.image_model.generate_logo(
                prompt=message,
                brand_name=brand_name,
                style=style
            )
            
            if result["success"]:
                return {
                    "type": "image",
                    "content": f"I've generated a logo{' for ' + brand_name if brand_name else ''}! Here's your design:",
                    "image_url": result["image_url"]
                }
            else:
                return {
                    "type": "text",
                    "content": f"I apologize, but I couldn't generate the logo. Error: {result['error']}"
                }
                
        except Exception as e:
            logger.error(f"Error in logo generation: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating your logo. Please try again."
            }
    
    async def _handle_brand_image_generation(self, message: str) -> Dict[str, Any]:
        """Handle brand image generation requests"""
        try:
            # Extract brand name and style from message
            brand_name = self._extract_brand_name(message)
            style = self._extract_style_preference(message)
            
            # Generate brand image
            result = self.image_model.generate_brand_image(
                prompt=message,
                brand_name=brand_name,
                style=style
            )
            
            if result["success"]:
                return {
                    "type": "image",
                    "content": f"I've created a brand image{' for ' + brand_name if brand_name else ''}! Here's your design:",
                    "image_url": result["image_url"]
                }
            else:
                return {
                    "type": "text",
                    "content": f"I apologize, but I couldn't generate the brand image. Error: {result['error']}"
                }
                
        except Exception as e:
            logger.error(f"Error in brand image generation: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating your brand image. Please try again."
            }
    
    async def _handle_brand_name_generation(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle brand name generation requests"""
        try:
            prompt = self.text_model.create_brand_name_prompt(message)
            response = self.text_model.generate_text(prompt, use_groq)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in brand name generation: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating brand names. Please try again."
            }
    
    async def _handle_tagline_generation(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle tagline generation requests"""
        try:
            prompt = self.text_model.create_tagline_prompt(message)
            response = self.text_model.generate_text(prompt, use_groq)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in tagline generation: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating taglines. Please try again."
            }
    
    async def _handle_marketing_caption_generation(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle marketing caption generation requests"""
        try:
            prompt = self.text_model.create_marketing_caption_prompt(message)
            response = self.text_model.generate_text(prompt, use_groq)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in marketing caption generation: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating marketing captions. Please try again."
            }
    
    async def _handle_product_description_generation(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle product description generation requests"""
        try:
            prompt = self.text_model.create_product_description_prompt(message)
            response = self.text_model.generate_text(prompt, use_groq)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in product description generation: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating product descriptions. Please try again."
            }
    
    async def _handle_brand_advice(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle brand advice requests"""
        try:
            prompt = self.text_model.create_brand_advice_prompt(message)
            response = self.text_model.generate_text(prompt, use_groq)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in brand advice: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while providing brand advice. Please try again."
            }
    
    async def _handle_sentiment_analysis(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle sentiment analysis requests"""
        try:
            prompt = self.text_model.create_sentiment_analysis_prompt(message)
            response = self.text_model.generate_text(prompt, use_groq)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while analyzing sentiment. Please try again."
            }
    
    async def _handle_market_positioning_analysis(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle market positioning analysis requests"""
        try:
            # Analyze market positioning using the dedicated analyzer
            analysis_result = self.market_positioning_analyzer.analyze_market_positioning(message, use_groq)
            
            # Format the response for chat
            formatted_response = self.market_positioning_analyzer.format_analysis_for_chat(analysis_result)
            
            return {
                "type": "text",
                "content": formatted_response
            }
            
        except Exception as e:
            logger.error(f"Error in market positioning analysis: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while analyzing market positioning. Please try again."
            }
    
    async def _handle_brand_consistency_check(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle brand consistency check requests"""
        try:
            # Extract brand elements from the message
            brand_elements = self.brand_consistency_checker.extract_brand_elements(message)
            
            # Check if we have all required elements
            if not brand_elements["brand_name"] and not brand_elements["tagline"] and not brand_elements["description"]:
                return {
                    "type": "text",
                    "content": "To check brand consistency, please provide your brand name, tagline, and description. For example:\n\nBrand name: FitPulse\nTagline: Train smarter every day\nDescription: AI powered fitness coaching platform for busy professionals"
                }
            
            # If some elements are missing, ask for them
            missing_elements = []
            if not brand_elements["brand_name"]:
                missing_elements.append("brand name")
            if not brand_elements["tagline"]:
                missing_elements.append("tagline")
            if not brand_elements["description"]:
                missing_elements.append("description")
            
            if missing_elements:
                return {
                    "type": "text",
                    "content": f"I need the following elements to check brand consistency: {', '.join(missing_elements)}. Please provide them in this format:\n\nBrand name: [your brand name]\nTagline: [your tagline]\nDescription: [your description]"
                }
            
            # Perform brand consistency analysis
            analysis_result = self.brand_consistency_checker.check_brand_consistency(
                brand_elements["brand_name"],
                brand_elements["tagline"],
                brand_elements["description"],
                use_groq
            )
            
            # Format the response for chat
            formatted_response = self.brand_consistency_checker.format_consistency_for_chat(analysis_result)
            
            return {
                "type": "text",
                "content": formatted_response
            }
            
        except Exception as e:
            logger.error(f"Error in brand consistency check: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while checking brand consistency. Please try again."
            }
    
    async def _handle_brand_strategy_planning(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle brand strategy planning requests"""
        try:
            # Generate brand strategy using the dedicated planner
            strategy_result = self.brand_strategy_planner.generate_brand_strategy(message, use_groq)
            
            # Format the response for chat
            formatted_response = self.brand_strategy_planner.format_strategy_for_chat(strategy_result)
            
            return {
                "type": "text",
                "content": formatted_response
            }
            
        except Exception as e:
            logger.error(f"Error in brand strategy planning: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error while generating your brand strategy. Please try again."
            }
    
    async def _handle_general_chat(self, message: str, use_groq: bool) -> Dict[str, Any]:
        """Handle general chat requests"""
        try:
            # Create a general chat prompt
            prompt = f"""
You are an AI branding assistant. The user sent you this message: "{message}"

Please respond helpfully and professionally. If they seem to be asking about branding-related topics, provide relevant guidance. If they need help with something else, politely redirect them to branding and marketing assistance.

Keep your response concise and helpful.
"""
            
            response = self.text_model.generate_text(prompt, use_groq, max_length=300)
            
            return {
                "type": "text",
                "content": response
            }
            
        except Exception as e:
            logger.error(f"Error in general chat: {str(e)}")
            return {
                "type": "text",
                "content": "I apologize, but I encountered an error. I'm here to help with branding tasks like creating brand names, logos, taglines, and marketing content. How can I assist you with your branding needs?"
            }
    
    def _extract_brand_name(self, message: str) -> str:
        """Extract brand name from user message"""
        # Simple extraction - look for patterns like "for BrandName" or "BrandName logo"
        import re
        
        # Look for "for X" pattern
        for_match = re.search(r'for\s+([A-Za-z0-9\s]+?)(?:\s+(?:logo|brand|image|design))?$', message.lower())
        if for_match:
            return for_match.group(1).strip().title()
        
        # Look for brand name followed by "logo"
        logo_match = re.search(r'([A-Za-z0-9\s]+?)\s+logo', message.lower())
        if logo_match:
            return logo_match.group(1).strip().title()
        
        return ""
    
    def _extract_style_preference(self, message: str) -> str:
        """Extract style preference from user message"""
        message_lower = message.lower()
        
        styles = {
            "modern": ["modern", "contemporary", "sleek", "current"],
            "classic": ["classic", "traditional", "timeless", "elegant"],
            "minimalist": ["minimalist", "simple", "clean", "minimal"],
            "bold": ["bold", "strong", "impactful", "dramatic"],
            "playful": ["playful", "fun", "creative", "colorful"],
            "professional": ["professional", "corporate", "business", "formal"],
            "luxury": ["luxury", "premium", "high-end", "sophisticated"]
        }
        
        for style, keywords in styles.items():
            if any(keyword in message_lower for keyword in keywords):
                return style
        
        return "modern"  # Default style
