import logging
from typing import Dict, Any
from text_model import TextGenerationModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BrandStrategyPlanner:
    def __init__(self, text_model: TextGenerationModel):
        self.text_model = text_model
    
    def generate_brand_strategy(self, startup_idea: str, use_groq: bool = True) -> Dict[str, Any]:
        """
        Generate a complete brand strategy for a startup idea.
        
        Args:
            startup_idea: Description of the startup idea
            use_groq: Whether to use Groq API for faster inference
            
        Returns:
            Dictionary containing brand strategy results
        """
        try:
            logger.info("Brand strategy generation started")
            
            # Create structured prompt for brand strategy generation
            prompt = self._create_brand_strategy_prompt(startup_idea)
            
            # Generate strategy using text model
            strategy = self.text_model.generate_text(prompt, use_groq, max_length=1000)
            
            # Parse and structure the response
            structured_strategy = self._parse_strategy_response(strategy)
            
            logger.info("Brand strategy generation completed")
            
            return {
                "success": True,
                "strategy": structured_strategy,
                "raw_response": strategy
            }
            
        except Exception as e:
            logger.error(f"Error in brand strategy generation: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "strategy": None
            }
    
    def _create_brand_strategy_prompt(self, startup_idea: str) -> str:
        """
        Create a structured prompt for brand strategy generation.
        """
        return f"""You are an expert startup branding strategist. Create a complete branding strategy for the following startup idea.

Startup idea:
{startup_idea}

Return the answer in the following sections:

Brand name ideas:
[Provide 3-5 creative and memorable brand name suggestions with brief explanations]

Tagline:
[Create a compelling tagline that captures the essence of the brand]

Brand story:
[Write a concise and engaging brand story that explains the brand's purpose and mission]

Target audience:
[Describe the primary target demographic and psychographic profile]

Brand personality:
[List 3-5 key personality traits that define the brand]

Positioning strategy:
[Provide a clear positioning statement and strategic approach]

Ensure the output is concise, professional, and clearly structured. Focus on practical and actionable branding insights."""
    
    def _parse_strategy_response(self, strategy: str) -> Dict[str, str]:
        """
        Parse the strategy response into structured format.
        """
        sections = {
            "brand_name_ideas": "",
            "tagline": "",
            "brand_story": "",
            "target_audience": "",
            "brand_personality": "",
            "positioning_strategy": ""
        }
        
        # Split by lines and process
        lines = strategy.split('\n')
        current_section = None
        section_content = []
        
        for line in lines:
            line = line.strip()
            
            # Check for section headers
            if line.lower().startswith('brand name ideas') or line.lower().startswith('brand name'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "brand_name_ideas"
                section_content = [line]
            elif line.lower().startswith('tagline'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "tagline"
                section_content = [line]
            elif line.lower().startswith('brand story'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "brand_story"
                section_content = [line]
            elif line.lower().startswith('target audience'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "target_audience"
                section_content = [line]
            elif line.lower().startswith('brand personality'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "brand_personality"
                section_content = [line]
            elif line.lower().startswith('positioning strategy') or line.lower().startswith('positioning'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "positioning_strategy"
                section_content = [line]
            elif current_section and line:
                section_content.append(line)
        
        # Don't forget the last section
        if current_section:
            sections[current_section] = '\n'.join(section_content).strip()
        
        # If parsing failed, return the raw strategy in the first section
        if not any(sections.values()):
            sections["brand_name_ideas"] = strategy
        
        return sections
    
    def format_strategy_for_chat(self, strategy_result: Dict[str, Any]) -> str:
        """
        Format the strategy result for display in chat interface.
        """
        if not strategy_result.get("success"):
            return f"I apologize, but I couldn't complete the brand strategy generation: {strategy_result.get('error', 'Unknown error')}"
        
        strategy = strategy_result.get("strategy", {})
        
        formatted_response = "## Complete Brand Strategy\n\n"
        
        if strategy.get("brand_name_ideas"):
            formatted_response += f"**Brand Name Ideas:**\n{strategy['brand_name_ideas']}\n\n"
        
        if strategy.get("tagline"):
            formatted_response += f"**Tagline:**\n{strategy['tagline']}\n\n"
        
        if strategy.get("brand_story"):
            formatted_response += f"**Brand Story:**\n{strategy['brand_story']}\n\n"
        
        if strategy.get("target_audience"):
            formatted_response += f"**Target Audience:**\n{strategy['target_audience']}\n\n"
        
        if strategy.get("brand_personality"):
            formatted_response += f"**Brand Personality:**\n{strategy['brand_personality']}\n\n"
        
        if strategy.get("positioning_strategy"):
            formatted_response += f"**Positioning Strategy:**\n{strategy['positioning_strategy']}\n\n"
        
        return formatted_response
