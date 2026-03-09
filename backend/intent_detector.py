import re
from typing import Dict, List, Optional
from enum import Enum

class IntentType(Enum):
    BRAND_NAME = "brand_name"
    TAGLINE = "tagline"
    MARKETING_CAPTION = "marketing_caption"
    PRODUCT_DESCRIPTION = "product_description"
    LOGO_GENERATION = "logo_generation"
    BRAND_IMAGE = "brand_image"
    BRAND_ADVICE = "brand_advice"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    MARKET_POSITIONING = "market_positioning"
    BRAND_CONSISTENCY = "brand_consistency"
    BRAND_STRATEGY = "brand_strategy"
    GENERAL_CHAT = "general_chat"

class IntentDetector:
    def __init__(self):
        # Define keyword patterns for each intent
        self.intent_patterns = {
            IntentType.BRAND_NAME: [
                r"brand name", r"name.*brand", r"create.*name", r"generate.*name",
                r"company name", r"business name", r"startup name", r"need.*name"
            ],
            IntentType.TAGLINE: [
                r"tagline", r"slogan", r"catchphrase", r"create.*tagline",
                r"generate.*tagline", r"brand.*tagline"
            ],
            IntentType.MARKETING_CAPTION: [
                r"marketing.*caption", r"caption", r"social media.*caption",
                r"instagram.*caption", r"facebook.*caption", r"ad.*caption",
                r"marketing.*text", r"advertising.*text"
            ],
            IntentType.PRODUCT_DESCRIPTION: [
                r"product.*description", r"describe.*product", r"product.*details",
                r"item.*description", r"service.*description"
            ],
            IntentType.LOGO_GENERATION: [
                r"logo", r"create.*logo", r"design.*logo", r"generate.*logo",
                r"make.*logo", r"brand.*logo", r"company.*logo"
            ],
            IntentType.BRAND_IMAGE: [
                r"brand.*image", r"brand.*visual", r"brand.*graphic",
                r"create.*image", r"generate.*image", r"design.*visual"
            ],
            IntentType.BRAND_ADVICE: [
                r"advice", r"suggest", r"recommend", r"help.*brand",
                r"branding.*tips", r"branding.*advice", r"how.*brand"
            ],
            IntentType.SENTIMENT_ANALYSIS: [
                r"analyze.*sentiment", r"tone.*analysis", r"brand.*tone",
                r"sentiment", r"mood", r"feeling", r"vibe"
            ],
            IntentType.MARKET_POSITIONING: [
                r"analyze.*market.*positioning", r"market.*analysis", r"competitor.*analysis",
                r"market.*positioning", r"position.*brand", r"brand.*positioning",
                r"market.*research", r"competitive.*analysis", r"target.*market"
            ],
            IntentType.BRAND_CONSISTENCY: [
                r"check.*brand.*consistency", r"analyze.*brand.*consistency", r"evaluate.*branding",
                r"brand.*consistency", r"consistency.*check", r"branding.*evaluation",
                r"is.*my.*branding.*consistent", r"brand.*identity.*check"
            ],
            IntentType.BRAND_STRATEGY: [
                r"build.*brand.*strategy", r"create.*branding.*plan", r"help.*me.*build.*brand",
                r"generate.*brand.*strategy", r"brand.*strategy", r"branding.*plan",
                r"startup.*branding", r"brand.*advisor", r"complete.*branding"
            ]
        }
    
    def detect_intent(self, message: str) -> IntentType:
        """
        Detect the primary intent from a user message.
        Returns the most likely IntentType.
        """
        message_lower = message.lower()
        
        # Check for brand consistency first (more specific)
        for pattern in self.intent_patterns[IntentType.BRAND_CONSISTENCY]:
            if re.search(pattern, message_lower):
                return IntentType.BRAND_CONSISTENCY
        
        # Check for brand strategy next (more specific)
        for pattern in self.intent_patterns[IntentType.BRAND_STRATEGY]:
            if re.search(pattern, message_lower):
                return IntentType.BRAND_STRATEGY
        
        # Check for market positioning next (more specific)
        for pattern in self.intent_patterns[IntentType.MARKET_POSITIONING]:
            if re.search(pattern, message_lower):
                return IntentType.MARKET_POSITIONING
        
        # Check each intent type
        for intent_type, patterns in self.intent_patterns.items():
            if intent_type in [IntentType.BRAND_CONSISTENCY, IntentType.BRAND_STRATEGY, IntentType.MARKET_POSITIONING]:
                continue  # Already checked above
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    return intent_type
        
        # Default to general chat if no specific intent detected
        return IntentType.GENERAL_CHAT
    
    def get_intent_confidence(self, message: str) -> Dict[IntentType, float]:
        """
        Get confidence scores for all intents.
        Returns a dictionary mapping intents to confidence scores.
        """
        message_lower = message.lower()
        scores = {}
        
        for intent_type, patterns in self.intent_patterns.items():
            matches = 0
            total_patterns = len(patterns)
            
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    matches += 1
            
            # Simple confidence calculation based on pattern matches
            scores[intent_type] = matches / total_patterns if total_patterns > 0 else 0.0
        
        # Add a small score for general chat as fallback
        if max(scores.values()) == 0.0:
            scores[IntentType.GENERAL_CHAT] = 0.1
        
        return scores
    
    def is_image_generation_request(self, message: str) -> bool:
        """
        Quick check if the request requires image generation.
        """
        intent = self.detect_intent(message)
        return intent in [IntentType.LOGO_GENERATION, IntentType.BRAND_IMAGE]
    
    def is_text_generation_request(self, message: str) -> bool:
        """
        Quick check if the request requires text generation.
        """
        intent = self.detect_intent(message)
        return intent in [
            IntentType.BRAND_NAME, IntentType.TAGLINE, IntentType.MARKETING_CAPTION,
            IntentType.PRODUCT_DESCRIPTION, IntentType.BRAND_ADVICE,
            IntentType.SENTIMENT_ANALYSIS, IntentType.MARKET_POSITIONING, 
            IntentType.BRAND_CONSISTENCY, IntentType.BRAND_STRATEGY, IntentType.GENERAL_CHAT
        ]
